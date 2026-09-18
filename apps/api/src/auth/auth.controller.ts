import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    const userData = await this.authService.login(req.user);

    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${userData.user.id}&name=${userData.user.name}&avatar=${userData.user.avatar}&accessToken=${userData.accessToken}`,
    );
  }

  @Get('verify-token')
  verify() {
    return 'ok';
  }
}
