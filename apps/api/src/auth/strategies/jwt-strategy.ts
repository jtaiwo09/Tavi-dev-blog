import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (request: Request) => JwtStrategy.extractToken(request),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('jwt.accessSecret'),
    });
  }

  async validate(payload, done) {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      return done(new UnauthorizedException('Invalidate token'), false);
    }
    done(null, user);
  }

  private static extractToken(request: Request): string | null {
    const cookieToken = request.cookies?.access_token;

    if (cookieToken) {
      return cookieToken;
    }

    const authHeader = request.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
