"use client";

import { getPostLikeData, likePost, unLikePost } from "@/lib/actions/like";
import { SessionUser } from "@/lib/session";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";

type Props = {
  postId: number;
  user?: SessionUser;
};

const Like = ({ postId, user }: Props) => {
  const { data, refetch: refetchPostLikeData } = useQuery({
    queryKey: ["GET_POST_LIKE_DATA", postId],
    queryFn: () => getPostLikeData(postId),
  });

  const likeMutation = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => refetchPostLikeData(),
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unLikePost(postId),
    onSuccess: () => refetchPostLikeData(),
  });

  const isLiked = data?.userLikedPost ?? false;
  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/auth/signin"
          className={[
            "group inline-flex items-center gap-2 rounded-full border px-4 py-2",
            "text-sm font-medium transition-all duration-200",
            "border-border bg-surface-raised text-muted-foreground",
            "hover:border-rose-500/30 hover:bg-rose-500/5",
            "hover:text-rose-600 dark:hover:text-rose-400",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2",
          ].join(" ")}
        >
          <HeartIcon className="size-4.5 transition-transform group-hover:scale-110" />

          <span>Like</span>

          <span className="text-muted-foreground/70">
            {data?.likeCount ?? 0}
          </span>
        </Link>

        <p className="text-xs text-muted-foreground">
          Sign in to like this article.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        isLiked ? unlikeMutation.mutate() : likeMutation.mutate()
      }
      disabled={isPending}
      aria-label={isLiked ? "Unlike this post" : "Like this post"}
      aria-pressed={isLiked}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-4 py-2",
        "text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60",
        isLiked
          ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
          : "border-border bg-surface-raised text-muted-foreground hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400",
      )}
    >
      {isLiked ? (
        <SolidHeartIcon className="size-4.5 transition-transform group-hover:scale-110" />
      ) : (
        <HeartIcon className="size-4.5 transition-transform group-hover:scale-110" />
      )}

      <span className="group-hover:text-rose-600">{data?.likeCount ?? 0}</span>
    </button>
  );
};

export default Like;
