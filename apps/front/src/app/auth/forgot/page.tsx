import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import ForgotPasswordForm from "./_components/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="border border-border bg-card p-6 shadow-sm sm:p-8">
        <header className="mb-6">
          <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-brand-subtle text-brand">
            <KeyRound className="size-4" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Account recovery
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>
        </header>

        <ForgotPasswordForm />

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

export default ForgotPasswordPage;
