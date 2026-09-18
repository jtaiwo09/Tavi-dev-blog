// mail/interfaces/mail-provider.interface.ts
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface IMailProvider {
  sendEmail(options: SendEmailOptions): Promise<boolean>;
}

export const MAIL_PROVIDER = 'MAIL_PROVIDER';
