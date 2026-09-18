import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';

import {
  MAIL_PROVIDER,
  type IMailProvider,
} from './interfaces/mail-provider.interface';

import { VerificationEmail } from './templates/verification-email';
import React from 'react';
import { PasswordResetEmail } from './templates/password-reset-email';

interface SendVerificationEmailOptions {
  email: string;
  name: string;
  token: string;
}

interface SendPasswordResetEmailOptions {
  email: string;
  name: string;
  token: string;
}

@Injectable()
export class MailService {
  private readonly baseUrl: string;

  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProvider,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.getOrThrow<string>('APP_BASE_URL');
  }

  async sendVerificationEmail({
    email,
    name,
    token,
  }: SendVerificationEmailOptions): Promise<boolean> {
    const verificationUrl =
      `${this.baseUrl}/auth/verify?token=` + encodeURIComponent(token);

    const html = await render(
      React.createElement(VerificationEmail, {
        name,
        verificationUrl,
      }),
    );

    return this.mailProvider.sendEmail({
      to: email,
      subject: 'Verify your email address',
      html,
    });
  }

  async sendPasswordResetEmail({
    email,
    name,
    token,
  }: SendPasswordResetEmailOptions): Promise<boolean> {
    const resetUrl =
      `${this.baseUrl}/auth/reset?token=` + encodeURIComponent(token);

    const html = await render(
      React.createElement(PasswordResetEmail, {
        name,
        resetUrl,
      }),
    );

    return this.mailProvider.sendEmail({
      to: email,
      subject: 'Reset your password',
      html,
    });
  }
}
