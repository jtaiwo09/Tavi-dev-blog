import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { sanitizeUser } from 'src/utils';
import { UserStatus } from 'src/generated/prisma/enums';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const user = await this.prisma.user.findFirst({
      where: { email: createUserInput.email },
    });
    if (user) throw new BadRequestException('Email is already taken');

    if (!createUserInput.password)
      throw new BadRequestException('Password is required');

    const hashPassword = await hash(createUserInput.password);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserInput,
        password: hashPassword,
      },
    });

    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return sanitizeUser(user);
  }

  async updateProfile(userId: number, input: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.avatar !== undefined && { avatar: input.avatar }),
      },
    });
  }

  // Soft Delete
  async deactivateAccount(userId: number) {
    const d = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.DEACTIVATED,
      },
    });

    console.log(899, d);

    return true;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException(
        'Password changes are not available for this account.',
      );
    }

    const currentPasswordValid = await verify(user.password, currentPassword);

    if (!currentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'Your new password must be different from your current password.',
      );
    }

    const hashedPassword = await hash(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Password changed successfully.',
    };
  }
}
