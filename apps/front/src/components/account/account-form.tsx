"use client";

import { useEffect } from "react";
import { useActionState } from "react";

import {
  FormField,
  FormInput,
  FormTextarea,
} from "@repo/ui/components/shared/form";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/sonner";

import type { User } from "@/lib/types/modelTypes";
import { updateProfile } from "@/lib/actions/users";
import type { UserFormState } from "@/lib/types/formState";

import AvatarUpload from "./avatar-upload";

type Props = {
  user: User;
};

const initialState: UserFormState = {
  data: {},
};

const AccountForm = ({ user }: Props) => {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  useEffect(() => {
    if (!state) return;

    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      // encType="multipart/form-data"
      className="mx-auto w-full max-w-6xl"
    >
      <section className="border-y border-border">
        <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-16">
          {/* Section introduction */}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Profile
            </p>

            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              About you
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Keep your public profile current. This information can appear
              alongside the articles you write.
            </p>
          </div>

          {/* Profile fields */}

          <div className="space-y-8">
            <FormField
              id="avatar"
              label="Profile photo"
              description="Use a JPG, PNG, or WebP image up to 5MB."
            >
              <AvatarUpload
                currentAvatar={user.avatar}
                userName={user.name}
                error={state?.errors?.avatar}
              />
            </FormField>

            <FormField
              id="name"
              label="Name"
              error={state?.errors?.name}
              required
            >
              <FormInput
                id="name"
                name="name"
                defaultValue={state?.data?.name ?? user.name}
                placeholder="Your name"
                autoComplete="name"
              />
            </FormField>

            <FormField
              id="email"
              label="Email"
              description="Your email address is used for signing in and account notifications."
            >
              <FormInput
                id="email"
                type="email"
                value={user.email}
                disabled
                readOnly
                className="bg-surface-subtle text-muted-foreground"
              />
            </FormField>

            <FormField
              id="bio"
              label="Bio"
              error={state?.errors?.bio}
              description="A short description that can appear alongside your articles."
            >
              <FormTextarea
                id="bio"
                name="bio"
                defaultValue={state?.data?.bio ?? user.bio ?? ""}
                placeholder="Tell readers a little about yourself..."
                maxLength={500}
                className="min-h-32 resize-y"
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Profile changes
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Your updated profile will be visible immediately.
            </p>
          </div>

          <Button size="lg" type="submit" disabled={pending} className="px-7">
            {pending ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </section>
    </form>
  );
};

export default AccountForm;
