import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  IMailProvider,
  SendEmailOptions,
} from '../interfaces/mail-provider.interface';

@Injectable()
export class SmtpMailProvider implements IMailProvider {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('nodemailer.host'),
      port: this.configService.getOrThrow<number>('nodemailer.port'),
      auth: {
        user: this.configService.getOrThrow<string>('nodemailer.user'),
        pass: this.configService.getOrThrow<string>('nodemailer.pass'),
      },
    });
  }

  async sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
    try {
      const from = this.configService.getOrThrow<string>('MAIL_FROM');

      await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}
