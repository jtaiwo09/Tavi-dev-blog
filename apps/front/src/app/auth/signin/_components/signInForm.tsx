"use client";

import { useActionState, useEffect } from "react";

import { signIn } from "@/lib/actions/auth";

import {
  FormButton,
  FormField,
  FormInput,
  FormPasswordInput,
} from "@repo/ui/components/shared/form";
import { toast } from "@repo/ui/components/ui/sonner";

const SignInForm = () => {
  const [state, action, pending] = useActionState(signIn, undefined);

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-2">
      <FormField
        id="email"
        label="Email address"
        error={state?.errors?.email}
        required
      >
        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue={state?.data?.email}
          autoComplete="email"
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={state?.errors?.password}
        required
      >
        <FormPasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
        />
      </FormField>

      <FormButton type="submit" className="mt-2" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </FormButton>
    </form>
  );
};

export default SignInForm;
