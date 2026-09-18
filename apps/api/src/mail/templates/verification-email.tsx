import {
  EmailLayout,
  EmailHeading,
  EmailText,
  EmailButton,
  EmailDivider,
  EmailFooter,
} from './components';

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerificationEmail({
  name,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <EmailHeading>Welcome, {name}!</EmailHeading>

      <EmailText>Hi {name},</EmailText>

      <EmailText>
        Thanks for creating an account with us. Please verify your email address
        by clicking the button below.
      </EmailText>

      <EmailButton href={verificationUrl}>Verify Email</EmailButton>

      <EmailText>This verification link will expire in 24 hours.</EmailText>

      <EmailText muted>
        If you didn't create this account, you can safely ignore this email.
      </EmailText>

      <EmailDivider />

      <EmailFooter />
    </EmailLayout>
  );
}
