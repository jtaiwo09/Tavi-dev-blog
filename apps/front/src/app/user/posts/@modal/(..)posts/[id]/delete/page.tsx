// app/user/posts/@modal/[id]/(.)delete/page.tsx

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { deletePost } from "@/lib/actions/postActions";
import { AlertTriangle, Trash2 } from "lucide-react";
import { use, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const InterceptorDeletePostPage = (props: Props) => {
  const params = use(props.params);
  const postId = Number(params.id);

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (open: boolean) => {
    if (open || isPending) return; // ignore closes while deleting
    setIsOpen(false);
    router.back();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await deletePost(postId);
      handleOpenChange(false);
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md rounded-xl border-border bg-background p-0 shadow-xl">
        <div className="p-6 sm:p-7">
          <AlertDialogHeader>
            {/* Label */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="size-4" aria-hidden="true" />
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive">
                Delete post
              </span>
            </div>

            {/* Heading */}
            <AlertDialogTitle className="font-serif text-3xl font-medium leading-tight tracking-[-0.035em] text-foreground">
              Delete this post?
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-3 text-sm leading-6 text-muted-foreground">
              This action cannot be undone. The post and its associated data
              will be permanently removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Actions */}
          <AlertDialogFooter className="mt-6 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                className="w-full shadow-none sm:w-auto"
                disabled={isPending}
              >
                Cancel
              </Button>
            </AlertDialogCancel>

            <AlertDialogAction asChild variant="destructive">
              <Button
                variant="destructive"
                className="w-full shadow-none sm:w-auto"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="mr-2 size-4" aria-hidden="true" />
                {isPending ? "Deleting..." : "Delete post"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InterceptorDeletePostPage;
