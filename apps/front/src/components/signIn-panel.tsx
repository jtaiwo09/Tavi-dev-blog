import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

const SignInPanel = () => {
  return (
    <div className="flex items-center gap-1">
      <Button size="default" variant="ghost" asChild>
        <Link
          href="/auth/signin"
          className="
          text-sm font-medium
        "
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
        >
          Get started
        </Link>
      </Button>
    </div>
  );
};

export default SignInPanel;
