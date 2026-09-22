import { getPostComments } from "@/lib/actions/commentActions";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import Link from "next/link";

import Pagination from "@/components/pagination";
import CommentCard from "./commentCard";
import AddComment from "./addComment";
import { Button } from "@repo/ui/components/ui/button";
import type { User } from "@/lib/types/modelTypes";

type Props = {
  postId: number;
  slug: string;
  user?: User | null;
  page?: number;
};

const Comments = async ({ postId, slug, user, page = 1 }: Props) => {
  const data = await getPostComments({
    postId,
    skip: (page - 1) * DEFAULT_PAGE_SIZE,
    take: DEFAULT_PAGE_SIZE,
  });

  const totalPages = Math.ceil(data.count / DEFAULT_PAGE_SIZE);

  return (
    <div>
      {user ? (
        <div className="border-b border-border pb-8">
          <AddComment slug={slug} user={user} postId={postId} />
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

      <div>
        {data.comments.length ? (
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
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default Comments;
