import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { useSidebar } from "./navigation/sidebar-context";

const SignInPanel = () => {
  const { closeSidebar } = useSidebar();
  return (
    <div className="flex items-center gap-1">
      <Button size="default" variant="ghost" asChild>
        <Link
          href="/auth/signin"
          className="
          text-sm font-medium
        "
          onClick={closeSidebar}
        >
          Sign in
        </Link>
      </Button>
      <Button size="default">
        <Link
          href="/auth/signup"
          className="
          text-sm font-semibold
        "
          onClick={closeSidebar}
        >
          Get started
        </Link>
      </Button>
    </div>
  );
};

export default SignInPanel;
