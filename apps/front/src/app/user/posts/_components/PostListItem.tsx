import { Post } from "@/lib/types/modelTypes";
import { POST_STATUS } from "@/lib/types/post";
import { ChatBubbleLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import PostActions from "./postActions";
import { createExcerpt, formatDate } from "@/lib/utils";
import PostListLayout from "@/components/blog/post-list-layout";

type Props = {
  post: Post;
};

const PostListItem = ({ post }: Props) => {
  const isPublished = post.status === POST_STATUS.PUBLISHED;

  const date = post.publishedAt ?? post.updatedAt;
  const formattedDate = formatDate(date);

  const excerpt = post.excerpt?.trim() || createExcerpt(post.content);

  const href = `/blog/${post.slug}/${post.id}`;

  return (
    <PostListLayout
      href={href}
      title={post.title}
      thumbnail={post.thumbnail}
      showReadAction={isPublished}
      thumbnailFooter={
        <div className="flex justify-end">
          <PostActions postId={post.id} status={post.status} />
        </div>
      }
    >
      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em]">
        <span
          className={
            isPublished
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }
        >
          {isPublished ? "Published" : "Draft"}
        </span>

        {post.category && (
          <>
            <span aria-hidden="true" className="text-border">
              /
            </span>

            <span className="text-muted-foreground">{post.category.name}</span>
          </>
        )}

        <span aria-hidden="true" className="text-border">
          /
        </span>

        <time
          dateTime={new Date(date).toISOString()}
          className="normal-case tracking-normal text-muted-foreground"
        >
          {formattedDate}
        </time>
      </div>

      {/* Title */}
      <Link href={href} className="block">
        <h3 className="mt-3 max-w-3xl text-balance font-serif text-2xl font-medium leading-tight  tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-brand sm:text-3xl">
          {post.title}
        </h3>
      </Link>

      {/* Excerpt */}
      {excerpt && (
        <p className="mt-3 max-w-2xl line-clamp-2 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {excerpt}
        </p>
      )}

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{post.readingTimeMinutes} min read</span>

          <span aria-hidden="true" className="size-1 rounded-full bg-border" />

          <span>{post.wordCount.toLocaleString()} words</span>

          <span aria-hidden="true" className="size-1 rounded-full bg-border" />

          <span className="inline-flex items-center gap-1.5">
            <HeartIcon className="size-3.5" />
            {post._count.likes}
          </span>

          <span aria-hidden="true" className="size-1 rounded-full bg-border" />

          <span className="inline-flex items-center gap-1.5">
            <ChatBubbleLeftIcon className="size-3.5" />
            {post._count.comments}
          </span>
        </div>
      </div>
    </PostListLayout>
  );
};

export default PostListItem;
