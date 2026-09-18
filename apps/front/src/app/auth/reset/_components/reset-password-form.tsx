"use client";

import { useActionState } from "react";

import {
  FormButton,
  FormField,
  FormPasswordInput,
} from "@repo/ui/components/shared/form";

import { resetPassword } from "@/lib/actions/auth";

type Props = {
  token?: string;
};

const ResetPasswordForm = ({ token }: Props) => {
  const [state, action] = useActionState(resetPassword, undefined);

  if (!token) {
    return (
      <div
        role="alert"
        className="border border-error/20 bg-error-subtle px-4 py-3 text-sm leading-6 text-error"
      >
        This password reset link is invalid or incomplete. Please request a new
        password reset link.
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="space-y-4">
        <div className="border border-success/20 bg-success-subtle px-4 py-3">
          <p className="text-sm font-medium text-success">
            Password reset successfully.
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            You can now sign in with your new password.
          </p>
        </div>

        <a
          href="/auth/signin"
          className="inline-flex h-10 w-full items-center justify-center bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Continue to sign in
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {state?.message && (
        <div
          role="alert"
          className="border border-error/20 bg-error-subtle px-4 py-3 text-sm leading-6 text-error"
        >
          {state.message}
        </div>
      )}

      <FormField
        id="password"
        label="New password"
        error={state?.errors?.password}
        required
        description="Use at least 8 characters with a letter, number, and special character."
      >
        <FormPasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Enter a new password"
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm password"
        error={state?.errors?.confirmPassword}
        required
      >
        <FormPasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Enter your password again"
        />
      </FormField>

      <FormButton type="submit" className="w-full">
        Reset password
      </FormButton>
    </form>
  );
};

export default ResetPasswordForm;
