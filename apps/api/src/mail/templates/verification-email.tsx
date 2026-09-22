import {
  EmailLayout,
  EmailText,
  EmailButton,
  EmailDivider,
  EmailFooter,
} from './components';

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email to get started on Tavi / Dev">
      {/* <EmailHeading>Welcome to Tavi / Dev!</EmailHeading> */}

      <EmailText>Hi {name},</EmailText>

      <EmailText>
        We’re excited to have you here! Please confirm your email address below
        to activate your account, publish articles, and join the conversation.
      </EmailText>

      <EmailButton href={verificationUrl}>Verify Email Address</EmailButton>

      <EmailText>
        This link is valid for 24 hours. For security reasons, unverified links
        expire automatically.
      </EmailText>

      <EmailText muted>
        If you didn't create an account with Tavi / Dev, you can safely ignore
        this email.
      </EmailText>

      <EmailDivider />

      <EmailFooter />
    </EmailLayout>
  );
}

VerificationEmail.PreviewProps = {
  name: 'Taiwo',
  verificationUrl: 'http://localhost:3000/auth/verify?token=mock-token',
} as VerificationEmailProps;

export default VerificationEmail;
