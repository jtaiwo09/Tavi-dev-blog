import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

const NoPost = () => {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-subtle text-brand">
          <PencilSquareIcon className="size-5" />
        </div>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          Your journal
        </p>

        <h1 className="mt-3 font-serif text-4xl font-medium leading-none tracking-[-0.04em] text-foreground sm:text-5xl">
          Nothing written yet.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          Your published articles and saved drafts will appear here. Start with
          an idea and turn it into something worth reading.
        </p>

        <Button asChild className="mt-7 h-10 rounded-lg px-5 shadow-none">
          <Link href="/user/create-post">
            <PencilSquareIcon className="size-4" />
            Write your first post
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default NoPost;
