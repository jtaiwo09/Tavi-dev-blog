"use client";

import { useTransition } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import { togglePostStatus } from "@/lib/actions/postActions";
import { POST_STATUS, type PostStatus } from "@/lib/types/post";

type Props = {
  postId: number;
  status: PostStatus;
};

const PostActions = ({ postId, status }: Props) => {
  const [isPending, startTransition] = useTransition();

  const isPublished = status === POST_STATUS.PUBLISHED;

  const handleToggleStatus = () => {
    startTransition(async () => {
      await togglePostStatus(postId);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          className="size-8 text-muted-foreground shadow-none hover:text-foreground"
          aria-label="Post actions"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MoreHorizontal className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/user/posts/${postId}/update`}>
            <Pencil className="mr-2 size-4" />
            Edit post
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem disabled={isPending} onSelect={handleToggleStatus}>
          {isPublished ? (
            <>
              <EyeOff className="mr-2 size-4" />
              Unpublish post
            </>
          ) : (
            <>
              <Eye className="mr-2 size-4" />
              Publish post
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="text-destructive focus:text-destructive"
        >
          <Link href={`/user/posts/${postId}/delete`}>
            <Trash2 className="mr-2 size-4" />
            Delete post
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostActions;
