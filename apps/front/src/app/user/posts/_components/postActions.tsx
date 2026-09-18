import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import Link from "next/link";

type Props = {
  postId: number;
};

const PostActions = ({ postId }: Props) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/user/posts/${postId}/update`}
              aria-label="Edit post"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand-subtle hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PencilIcon className="size-4" />
            </Link>
          </TooltipTrigger>

          <TooltipContent>
            <p>Edit post</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/user/posts/${postId}/delete`}
              aria-label="Delete post"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <TrashIcon className="size-4" />
            </Link>
          </TooltipTrigger>

          <TooltipContent>
            <p>Delete post</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default PostActions;
