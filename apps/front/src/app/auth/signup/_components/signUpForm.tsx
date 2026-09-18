"use client";

import { useActionState, useEffect } from "react";

import { signUp } from "@/lib/actions/auth";

import {
  FormButton,
  FormField,
  FormInput,
  FormPasswordInput,
} from "@repo/ui/components/shared/form";
import { toast } from "@repo/ui/components/ui/sonner";

const SignUpForm = () => {
  const [state, action, pending] = useActionState(signUp, undefined);

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-2">
      <FormField
        id="name"
        label="Full name"
        error={state?.errors?.name}
        required
      >
        <FormInput
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          defaultValue={state?.data?.name}
          autoComplete="name"
        />
      </FormField>

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
          autoComplete="new-password"
        />
      </FormField>

      <FormButton type="submit" className="mt-2" disabled={pending}>
        {pending ? "Creating account..." : "Sign Up"}
      </FormButton>
    </form>
  );
};

export default SignUpForm;
