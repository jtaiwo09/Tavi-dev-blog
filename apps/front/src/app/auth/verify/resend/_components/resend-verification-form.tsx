"use client";

import { useActionState } from "react";

import { resendVerificationEmail } from "@/lib/actions/auth";

import {
  FormButton,
  FormField,
  FormInput,
} from "@repo/ui/components/shared/form";

const ResendVerificationForm = () => {
  const [state, action] = useActionState(resendVerificationEmail, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-success/20 bg-success-subtle p-5">
        <p className="text-sm font-medium text-success">Check your email</p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state?.message && (
        <div
          role="alert"
          className="rounded-lg border border-error/20 bg-error-subtle px-4 py-3 text-sm text-error"
        >
          {state.message}
        </div>
      )}

      <FormField
        id="email"
        label="Email address"
        error={state?.errors?.email}
        required
        description="We'll send a new verification link to this address."
      >
        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state?.data?.email}
        />
      </FormField>

      <FormButton type="submit" className="w-full">
        Send verification email
      </FormButton>
    </form>
  );
};

export default ResendVerificationForm;
