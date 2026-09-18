import type { ConfigService } from '@nestjs/config';
import {
  IMailProvider,
  type SendEmailOptions,
} from '../interfaces/mail-provider.interface';
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendMailProvider implements IMailProvider {
  private readonly logger = new Logger(ResendMailProvider.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('resend.apiKey');

    this.resend = new Resend(apiKey);
  }

  async sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
    const from = this.configService.getOrThrow<string>('resend.from');

    const { data, error } = await this.resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Failed to send email: ${error.message}`);

      return false;
    }

    this.logger.log(`Email sent: id=${data?.id} subject="${subject}"`);

    return true;
  }
}
