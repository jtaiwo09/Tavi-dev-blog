"use client";

import { useActionState, useEffect, useState } from "react";

import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { toast } from "@repo/ui/components/ui/sonner";
import { FormField, FormTextarea } from "@repo/ui/components/shared/form";

import { saveComment } from "@/lib/actions/commentActions";
import { cn } from "@repo/ui/lib/utils";

type Props = {
  postId: number;
  slug: string;
  className?: string;
};

const AddComment = ({ postId, slug, className }: Props) => {
  const [state, action, isPending] = useActionState(saveComment, undefined);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state) return;

    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }

    if (state.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="h-10 px-5">
          Leave a comment
        </Button>
      </DialogTrigger>

      <DialogContent className={cn("gap-0 overflow-hidden p-0", "sm:max-w-lg")}>
        <div className="border-b border-border/60 px-6 py-5 sm:px-7">
          <DialogTitle className="font-serif text-2xl tracking-tight sm:text-[1.7rem]">
            Join the conversation
          </DialogTitle>

          <DialogDescription className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
            Share a thoughtful response, ask a question, or add something useful
            to the discussion.
          </DialogDescription>
        </div>

        <form
          action={action}
          className={cn("space-y-6 px-6 py-6 sm:px-7 sm:py-7", className)}
        >
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="slug" value={slug} />

          <FormField
            id="comment"
            label="Your comment"
            error={state?.errors?.content}
            required
            description="Keep it constructive and relevant to the article."
          >
            <FormTextarea
              id="comment"
              name="content"
              placeholder="What are your thoughts?"
              error={!!state?.errors?.content}
              required
              disabled={isPending}
              autoFocus
              className="min-h-36 resize-y"
            />
          </FormField>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="h-10 px-5"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="h-10 px-5" disabled={isPending}>
              {isPending ? "Submitting…" : "Submit comment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComment;
