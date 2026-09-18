import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { MAIL_PROVIDER } from './interfaces/mail-provider.interface';
import { SmtpMailProvider } from './providers/smtp.provider';
import { ResendMailProvider } from './providers/resend.provider';

@Module({
  providers: [
    MailService,
    {
      provide: MAIL_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const driver = configService.get<string>('app.mailDriver', 'resend');

        switch (driver.toLowerCase()) {
          case 'smtp':
            return new SmtpMailProvider(configService);
          case 'resend':
          default:
            return new ResendMailProvider(configService);
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailService],
})
export class MailModule {}
