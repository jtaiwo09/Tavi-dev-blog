import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import ResendVerificationForm from "./_components/resend-verification-form";

const ResendVerificationPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-brand-subtle text-brand">
            <MailCheck className="size-4" />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Email verification
          </p>

          {/* <h1 className="font-serif text-3xl font-medium tracking-[-0.035em] text-foreground sm:text-4xl">
            Verify your email.
          </h1> */}

          <p className="text-sm leading-6 text-muted-foreground">
            Enter the email address associated with your account and we'll send
            you a new verification link.
          </p>
        </div>

        <ResendVerificationForm />

        <div className="mt-6 border-t border-border pt-5">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
