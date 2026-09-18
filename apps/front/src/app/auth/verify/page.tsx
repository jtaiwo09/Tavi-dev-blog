import Link from "next/link";
import { ArrowRight, CheckCircle2, MailWarning } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { verifyEmail } from "@/lib/actions/auth";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const { token } = await searchParams;

  const result = await verifyEmail(token ?? "");

  return (
    <div className="w-full max-w-md">
      <div className="border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <div
            className={
              result.success
                ? "mb-6 flex size-10 items-center justify-center rounded-full bg-brand-subtle text-brand"
                : "mb-6 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            }
          >
            {result.success ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <MailWarning className="size-4" />
            )}
          </div>

          <p
            className={
              result.success
                ? "mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand"
                : "mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-destructive"
            }
          >
            {result.success ? "Email verified" : "Verification failed"}
          </p>

          {/* <h1 className="font-serif text-3xl font-medium tracking-[-0.035em] text-foreground sm:text-4xl">
            {result.success ? "You're all set." : "That link didn't work."}
          </h1> */}

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {result.success
              ? "Your email address has been verified successfully. Your account is ready to use."
              : result.message}
          </p>
        </div>

        {result.success ? (
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/signin">
              Continue to sign in
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/verify/resend">
              Request a new verification email
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-1 font-semibold text-brand transition-colors hover:text-link-hover"
          >
            Sign in
            <ArrowRight className="size-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
