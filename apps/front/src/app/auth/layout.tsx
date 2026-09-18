import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-128 max-w-3xl -translate-x-1/2 rounded-full bg-brand/8 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.28)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      <div className="relative flex items-center justify-center px-4 py-12 sm:px-6">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
