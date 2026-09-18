import type { User } from "@/lib/types/modelTypes";

type Props = {
  user: User;
};

const AccountDetails = ({ user }: Props) => {
  return (
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

            <StatusLabel verified={user.isEmailVerified}>
              {user.isEmailVerified ? "Verified" : "Unverified"}
            </StatusLabel>
          </div>

          <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Account status
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your account is currently {user.status?.toLowerCase()}.
              </p>
            </div>

            <StatusLabel>{user.status}</StatusLabel>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatusLabel = ({
  children,
  verified = true,
}: {
  children: React.ReactNode;
  verified?: boolean;
}) => (
  <span
    className={
      verified
        ? "text-[11px] font-semibold uppercase tracking-[0.14em] text-brand"
        : "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
    }
  >
    {children}
  </span>
);

export default AccountDetails;
