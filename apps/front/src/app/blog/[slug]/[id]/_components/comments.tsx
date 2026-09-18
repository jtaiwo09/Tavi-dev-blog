"use client";

import { getPostComments } from "@/lib/actions/commentActions";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { SessionUser } from "@/lib/session";
import Pagination from "@/components/pagination";

import CommentCard from "./commentCard";
import CommentCardSkeleton from "./commentCardSkeleton";
import AddComment from "./addComment";
import { Button } from "@repo/ui/components/ui/button";

type Props = {
  postId: number;
  user?: SessionUser;
};

const Comments = ({ postId, user }: Props) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["GET_POST_COMMENTS", postId, page],
    queryFn: () =>
      getPostComments({
        postId,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        take: DEFAULT_PAGE_SIZE,
      }),
  });

  const totalPages = Math.ceil((data?.count ?? 0) / DEFAULT_PAGE_SIZE);

  return (
    <div>
      {/* Composer */}
      {user ? (
        <div className="border-b border-border pb-8">
          <AddComment user={user} postId={postId} refetch={refetch} />
        </div>
      ) : (
        <div className="border-b border-border pb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Join the discussion
              </p>

              <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
                Sign in or create an account to share your thoughts on this
                article.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button asChild size="sm">
                <Link href="/auth/signin">Sign in</Link>
              </Button>

              <Button asChild size="sm" variant="secondary">
                <Link href="/auth/signup">Create account</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <CommentCardSkeleton key={index} />
          ))
        ) : data?.comments?.length ? (
          data.comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="border-b border-border py-14 text-center">
            <p className="font-serif text-2xl text-foreground">
              No comments yet.
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Be the first to start the conversation.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border pt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="p-0"
          />
        </div>
      )}
    </div>
  );
};

export default Comments;
