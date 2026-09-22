import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { createHash, randomBytes } from 'crypto';

import { SignInInput } from './dto/sign-in-input';
import { SignUpInput } from './dto/sign-up-input';
import type { AccessTokenPayload } from 'src/common/interfaces/jwt-payload';
import { CreateUserInput } from 'src/user/dto/create-user.input';

import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User, UserStatus } from 'src/generated/prisma/client';
import { sanitizeUser } from 'src/utils';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordInput } from './dto/reset-password-input';
import { ForgotPasswordInput } from './dto/forgot-password-input';

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 1 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signIn(dto: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user?.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await verify(user.password, dto.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    this.assertAccountCanAuthenticate(user);

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Please verify your email before signing in.',
      );
    }

    return this.createAuthResponse(user);
  }

  async signUp(dto: SignUpInput) {
    if (!dto.password) {
      throw new BadRequestException('Password required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser?.isEmailVerified) {
      throw new ConflictException('An account with this email already exists');
    }

    if (existingUser && this.isVerificationTokenValid(existingUser)) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await hash(dto.password);
    const { token, tokenHash, expiresAt } = this.generateTokenPayload();

    const userData = {
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      isEmailVerified: false,
      status: UserStatus.ACTIVE,
      verificationToken: tokenHash,
      verificationTokenExpiresAt: expiresAt,
    };

    const user = existingUser
      ? await this.prisma.user.update({
          where: { id: existingUser.id },
          data: userData,
        })
      : await this.prisma.user.create({
          data: userData,
        });

    await this.mailService.sendVerificationEmail({
      email: user.email,
      name: user.name ?? 'there',
      token,
    });

    return this.registrationResponse();
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashVerificationToken(token);

    const user = await this.prisma.user.findUnique({
      where: { verificationToken: tokenHash },
    });

    if (!user || !this.isVerificationTokenValid(user)) {
      throw new BadRequestException('Invalid or expired verification token.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(
        'This account is not available for verification.',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    return { message: 'Email verified successfully.' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.isEmailVerified || user.status !== UserStatus.ACTIVE) {
      return {
        message:
          'If the account requires verification, a new verification email has been sent.',
      };
    }

    await this.createAndSendVerificationToken(user);

    return {
      message:
        'If the account requires verification, a new verification email has been sent.',
    };
  }

  async forgotPassword(dto: ForgotPasswordInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return {
        message:
          'If an account exists for that email, we sent instructions to reset your password.',
      };
    }

    const { token, tokenHash, expiresAt } =
      this.generatePasswordResetTokenPayload();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: tokenHash,
        passwordResetTokenExpiresAt: expiresAt,
      },
    });

    await this.mailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name ?? 'there',
      token,
    });

    return {
      message:
        'If an account exists for that email, we sent instructions to reset your password.',
    };
  }

  async resetPassword(dto: ResetPasswordInput) {
    const tokenHash = this.hashVerificationToken(dto.token);

    const user = await this.prisma.user.findUnique({
      where: {
        passwordResetToken: tokenHash,
      },
    });

    if (
      !user ||
      !user.passwordResetTokenExpiresAt ||
      user.passwordResetTokenExpiresAt <= new Date()
    ) {
      throw new BadRequestException(
        'This password reset link is invalid or has expired.',
      );
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(
        'This account is not available for password reset.',
      );
    }

    const hashedPassword = await hash(dto.password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    return {
      message: 'Your password has been reset successfully.',
    };
  }

  async login(userData: AccessTokenPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: userData.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid authentication');
    }

    this.assertAccountCanAuthenticate(user);

    return this.createAuthResponse(user);
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return {
      sub: user.id,
      email: user.email,
    };
  }

  async validateGoogleUser(googleUser: CreateUserInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (existingUser) {
      this.assertAccountCanAuthenticate(existingUser);

      return {
        sub: existingUser.id,
        email: existingUser.email,
      };
    }

    const user = await this.prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        isEmailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });

    return {
      sub: user.id,
      email: user.email,
    };
  }

  private async createAndSendVerificationToken(user: User): Promise<void> {
    const { token, tokenHash, expiresAt } = this.generateTokenPayload();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: tokenHash,
        verificationTokenExpiresAt: expiresAt,
      },
    });

    await this.mailService.sendVerificationEmail({
      email: user.email,
      name: user.name ?? 'there',
      token,
    });
  }

  private isVerificationTokenValid(user: User | null): boolean {
    if (
      !user ||
      user.isEmailVerified ||
      !user.verificationToken ||
      !user.verificationTokenExpiresAt
    ) {
      return false;
    }

    return user.verificationTokenExpiresAt > new Date();
  }

  private assertAccountCanAuthenticate(user: User): void {
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Your account has been suspended.');
    }

    if (user.status === UserStatus.DEACTIVATED) {
      throw new ForbiddenException('Your account has been deactivated.');
    }
  }

  private generateTokenPayload() {
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashVerificationToken(token);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);

    return {
      token,
      tokenHash,
      expiresAt,
    };
  }

  private generatePasswordResetTokenPayload() {
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashVerificationToken(token);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    return {
      token,
      tokenHash,
      expiresAt,
    };
  }

  private hashVerificationToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async createAuthResponse(user: User) {
    const accessToken = await this.issueAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      message: 'Signed in successfully!',
    };
  }

  private registrationResponse() {
    return {
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  }

  private issueAccessToken(payload: AccessTokenPayload) {
    const expiresIn = this.config.getOrThrow<string>(
      'jwt.accessExpiresIn',
    ) as JwtSignOptions['expiresIn'];

    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.accessSecret'),
      expiresIn,
    });
  }
}
