"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { deletePost } from "@/lib/actions/postActions";

type Props = {
  postId: number;
  onCancel?: () => void;
  mode?: "page" | "modal";
};

const DeletePostContent = ({ postId, onCancel, mode = "page" }: Props) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-5 flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <Trash2 className="size-4" aria-hidden="true" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive">
          Delete
        </p>

        <h1 className="mt-2 font-serif text-3xl font-medium leading-tight tracking-[-0.035em] text-foreground">
          Delete this post?
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          This will permanently remove the post, along with its comments, likes,
          and other associated data.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full shadow-none sm:w-auto"
          >
            Cancel
          </Button>
        )}

        <form
          action={async () => {
            "use server";
            await deletePost(postId);
          }}
        >
          <Button
            type="submit"
            variant="destructive"
            className="w-full shadow-none sm:w-auto"
          >
            <Trash2 className="mr-2 size-4" />
            Delete post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DeletePostContent;
