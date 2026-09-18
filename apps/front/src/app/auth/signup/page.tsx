import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

import SignUpForm from "./_components/signUpForm";
import { BACKEND_URL } from "@/lib/constants";
import { GoogleIcon } from "@/components/google-icon";

import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";

const SignUpPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="border border-border bg-card px-6 py-6 shadow-sm sm:px-7">
        {/* Header */}
        <header className="mb-6">
          <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-brand-subtle text-brand">
            <UserPlus className="size-4" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Create your account
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create your account and start sharing what you know with other
            developers.
          </p>
        </header>

        {/* Registration */}
        <SignUpForm />

        {/* Social registration */}
        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />

          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Or continue with
          </span>

          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          className="w-full bg-background font-medium shadow-none transition-colors hover:bg-muted"
          asChild
        >
          <a href={`${BACKEND_URL}/auth/google/login`}>
            <GoogleIcon />
            Continue with Google
          </a>
        </Button>
      </div>

      {/* Auth navigation */}
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

export default SignUpPage;
