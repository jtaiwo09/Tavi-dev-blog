import Link from "next/link";
import SignInForm from "./_components/signInForm";
import { BACKEND_URL } from "@/lib/constants";
import { Button } from "@repo/ui/components/ui/button";
import { GoogleIcon } from "@/components/google-icon";
import { ArrowRight, LogIn } from "lucide-react";
import { Separator } from "@repo/ui/components/ui/separator";

const SignInPage = () => {
  return (
    <div className="w-full max-w-md">
      <div className="border border-border bg-card px-6 py-6 shadow-sm sm:px-7">
        {/* Header */}
        <header className="mb-6">
          <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-brand-subtle text-brand">
            <LogIn className="size-4" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Welcome back
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to your account.
          </p>
        </header>

        {/* Credentials */}
        <SignInForm />

        {/* Social login */}
        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />

          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Or continue with
          </span>

          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          className="h-11 w-full bg-background font-medium shadow-none transition-colors hover:bg-muted"
          asChild
        >
          <a href={`${BACKEND_URL}/auth/google/login`}>
            <GoogleIcon />
            Continue with Google
          </a>
        </Button>

        {/* Password recovery */}
        <div className="mt-5 text-center">
          <p className="text-xs text-muted-foreground">
            Forgot your password?{" "}
            <Link
              href="/auth/forgot"
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
            >
              Reset it
            </Link>
          </p>
        </div>
      </div>

      {/* Registration */}
      <div className="mt-5 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1 font-semibold text-brand transition-colors hover:text-link-hover"
          >
            Sign up
            <ArrowRight className="size-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
