"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import PasswordForm from "@/components/account/password-form";

const AccountSecurity = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-b border-border">
      <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-14">
        {/* Section introduction */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            Security
          </p>

          <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Password
          </h2>

          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Keep your account secure by updating your password when needed.
          </p>
        </div>

        {/* Password settings */}
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="group flex w-full items-center justify-between border-b border-border/60 py-4 text-left">
            <div>
              <p className="text-sm font-medium text-foreground">
                {open ? "Password settings" : "Change password"}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {open
                  ? "Enter your current password and choose a new one."
                  : "Update your password securely."}
              </p>
            </div>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-8">
            <PasswordForm onSuccess={() => setOpen(false)} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};

export default AccountSecurity;
