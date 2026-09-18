import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  FileText,
  Trash2,
} from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";

import { deletePost, fetchPostById } from "@/lib/actions/postActions";
import { formatDate } from "@/lib/utils";
import { POST_STATUS } from "@/lib/types/post";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const DeletePostPage = async (props: Props) => {
  const params = await props.params;
  const post = await fetchPostById(+params.id);

  const formAction = async () => {
    "use server";

    await deletePost(+params.id);
    redirect("/user/posts");
  };

  const STATUS_CONFIG = {
    [POST_STATUS.PUBLISHED]: {
      label: "Published",
      variant: "secondary" as const,
    },
    [POST_STATUS.DRAFT]: {
      label: "Draft",
      variant: "outline" as const,
    },
  };

  const currentStatus = post?.status
    ? STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG]
    : STATUS_CONFIG[POST_STATUS.DRAFT];

  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-lg rounded-xl border-border bg-background shadow-xl">
        <CardHeader className="p-6 sm:p-7">
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
          <CardTitle className="font-serif text-3xl font-medium leading-tight tracking-[-0.035em] text-foreground">
            Delete this post?
          </CardTitle>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This action cannot be undone. The post and its associated data will
            be permanently removed from your account.
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6 sm:px-7">
          {/* Post information */}
          <div className="border-y border-border py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                <FileText className="size-3.5" />
                Post #{params.id}
              </span>

              <Badge
                variant={currentStatus.variant}
                className="h-5 rounded-full px-2 text-[10px] font-semibold uppercase tracking-[0.08em]"
              >
                {currentStatus.label}
              </Badge>
            </div>

            <p className="mt-3 line-clamp-2 text-base font-medium leading-6 text-foreground">
              {post?.title || "Untitled Post"}
            </p>

            {post?.createdAt && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />

                <span>
                  Created{" "}
                  {formatDate(post.createdAt, {
                    month: "long",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="mt-6 flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Comments, likes, and other data associated with this post will
              also be removed.
            </p>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="border-t border-border p-6 sm:px-7">
          <form
            action={formAction}
            className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end"
          >
            <Button
              variant="outline"
              asChild
              className="w-full shadow-none sm:w-auto"
            >
              <Link
                href="/user/posts"
                className="inline-flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="size-4" />
                Cancel
              </Link>
            </Button>

            <Button
              variant="destructive"
              className="w-full shadow-none sm:w-auto"
            >
              <Trash2 className="mr-2 size-4" />
              Confirm Delete
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
};

export default DeletePostPage;
