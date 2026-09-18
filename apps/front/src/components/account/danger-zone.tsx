"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { deactivateAccount } from "@/lib/actions/users";
import { Button } from "@repo/ui/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { toast } from "@repo/ui/components/ui/sonner";
import { useRouter } from "next/navigation";

const DangerZone = () => {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDeactivate() {
    setPending(true);

    try {
      const result = await deactivateAccount();

      if (result?.success) {
        toast.success(result.message);
        router.push("/auth/signin");
        router.refresh();
      } else if (result?.message) {
        toast.error(result.message);
      }
    } catch {
      toast.error("Unable to deactivate your account. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="border-b border-border">
      <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-14">
        {/* Section information */}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Danger zone
          </p>

          <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Deactivate account
          </h2>

          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Temporarily disable your account and prevent access until it is
            restored.
          </p>
        </div>

        {/* Action */}

        <div className="flex md:items-start justify-between gap-6 border-t border-border/60 pt-6 flex-col md:flex-row">
          <div className="flex gap-4">
            <div className="hidden size-9 shrink-0 items-center justify-center border border-border sm:flex">
              <AlertTriangle className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                Deactivate your account
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                Your profile and published content will remain associated with
                your account, but you will no longer be able to sign in.
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="lg"
                variant="destructive"
                className="px-7"
                disabled={pending}
              >
                Deactivate
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>

                <AlertDialogDescription>
                  You will no longer be able to sign in. Your profile and
                  published content will remain associated with your account.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeactivate}
                  disabled={pending}
                  variant="destructive"
                >
                  {pending ? "Deactivating..." : "Deactivate account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
};

export default DangerZone;
