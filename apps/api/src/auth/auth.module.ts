import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.getOrThrow('jwt.accessSecret'),
          signOptions: { expiresIn: config.getOrThrow('jwt.accessExpiresIn') },
        };
      },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    GoogleStrategy,
  ],
})
export class AuthModule {}
