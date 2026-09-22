import {
  EmailButton,
  EmailDivider,
  EmailFooter,
  EmailHeading,
  EmailLayout,
  EmailText,
} from './components';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your Tavi Dev password">
      <EmailHeading>Reset your password</EmailHeading>

      <EmailText>Hi {name},</EmailText>

      <EmailText>
        We received a request to reset the password for your Tavi Dev account.
        Click the button below to choose a new password.
      </EmailText>

      <EmailButton href={resetUrl}>Reset Password</EmailButton>

      <EmailText>
        This password reset link will expire in 24 hours. If you did not request
        a password reset, no action is required.
      </EmailText>

      <EmailText muted>
        For your security, never share this link with anyone. If you believe
        someone else requested this reset, you can safely ignore this email.
      </EmailText>

      <EmailDivider />

      <EmailFooter />
    </EmailLayout>
  );
}

PasswordResetEmail.PreviewProps = {
  name: 'Taiwo',
  resetUrl: 'http://localhost:3000/auth/verify?token=mock-token',
} as PasswordResetEmailProps;

export default PasswordResetEmail;
