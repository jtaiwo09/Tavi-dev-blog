import AccountForm from "@/components/account/account-form";
import AccountSecurity from "@/components/account/account-security";
import DangerZone from "@/components/account/danger-zone";
import { getCurrentUser } from "@/lib/actions/users";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <main className="content-container">
      {/* Intro */}
      <header className="border-b border-border py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          Account
        </p>

        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
          Your space.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Manage your profile, security, and account preferences.
        </p>
      </header>

      {/* Profile */}
      <AccountForm user={user} />

      {/* Security */}
      <AccountSecurity />

      {/* Account information */}
      <section className="border-b border-border">
        <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Account
            </p>

            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Account details
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Your account status and verification information.
            </p>
          </div>

          <div className="divide-y divide-border/60">
            <div className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Email verification
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {user.isEmailVerified
                    ? "Your email address has been verified."
                    : "Your email address still needs to be verified."}
                </p>
              </div>

              <span
                className={
                  user.isEmailVerified
                    ? "text-[11px] font-semibold uppercase tracking-[0.14em] text-brand"
                    : "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                }
              >
                {user.isEmailVerified ? "Verified" : "Unverified"}
              </span>
            </div>

            <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Account status
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your account is currently{" "}
                  {user.status?.toLowerCase() ?? "unknown"}.
                </p>
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <DangerZone />
    </main>
  );
}
