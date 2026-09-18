"use client";

import { useEffect } from "react";
import { useActionState } from "react";

import { FormField, FormPasswordInput } from "@repo/ui/components/shared/form";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/sonner";

import { changePassword } from "@/lib/actions/users";
import type { ChangePasswordFormState } from "@/lib/types/formState";

type Props = {
  onSuccess?: () => void;
};

const initialState: ChangePasswordFormState = {
  data: {},
};

const PasswordForm = ({ onSuccess }: Props) => {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState,
  );

  useEffect(() => {
    if (state?.message) {
      toast(state.message);
    }

    if (state?.success) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-8">
      <FormField
        id="currentPassword"
        label="Current password"
        error={state?.errors?.currentPassword}
        required
      >
        <FormPasswordInput
          id="currentPassword"
          name="currentPassword"
          placeholder="Enter your current password"
          autoComplete="current-password"
        />
      </FormField>

      <FormField
        id="newPassword"
        label="New password"
        error={state?.errors?.newPassword}
        description="Use at least 8 characters with a letter, number, and special character."
        required
      >
        <FormPasswordInput
          id="newPassword"
          name="newPassword"
          placeholder="Enter a new password"
          autoComplete="new-password"
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
          placeholder="Confirm your new password"
          autoComplete="new-password"
        />
      </FormField>

      <div className="flex justify-end border-t border-border/60 pt-6">
        <Button type="submit" disabled={pending} className="h-11 px-7">
          {pending ? "Updating..." : "Change password"}
        </Button>
      </div>
    </form>
  );
};

export default PasswordForm;
