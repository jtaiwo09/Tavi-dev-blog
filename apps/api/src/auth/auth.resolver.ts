import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign-in-input';
import { AuthResponse } from './dto/auth-response.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SignUpInput } from './dto/sign-up-input';
import { MessageResponse } from './dto/message-response.dto';
import { ForgotPasswordInput } from './dto/forgot-password-input';
import { ResetPasswordInput } from './dto/reset-password-input';

@Resolver()
@Public()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => MessageResponse)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => MessageResponse)
  verifyEmail(@Args('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Mutation(() => MessageResponse)
  forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ) {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => MessageResponse)
  resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return this.authService.resetPassword(resetPasswordInput);
  }

  @Mutation(() => MessageResponse)
  resendVerificationEmail(@Args('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }
}
