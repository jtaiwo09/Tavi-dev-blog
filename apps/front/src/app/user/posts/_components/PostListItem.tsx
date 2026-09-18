import { Post } from "@/lib/types/modelTypes";
import { POST_STATUS } from "@/lib/types/post";
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import PostActions from "./postActions";
import { formatDate } from "@/lib/utils";

type Props = {
  post: Post;
};

const PostListItem = ({ post }: Props) => {
  const isPublished = post.status === POST_STATUS.PUBLISHED;

  const date = post?.publishedAt ?? post.updatedAt;

  const formattedDate = formatDate(date);

  const excerpt =
    post.excerpt ||
    post.content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const href = `/blog/${post.slug}/${post.id}`;

  return (
    <article className="group border-b border-border">
      <div className="grid gap-6 py-8 sm:gap-8 sm:py-9 md:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12 lg:py-10">
        {/* Content */}
        <div className="min-w-0">
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

                <span className="text-muted-foreground">
                  {post.category.name}
                </span>
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
            <h3 className="mt-3 max-w-3xl text-balance font-serif text-2xl font-medium leading-[1.08] tracking-[-0.025em] text-foreground transition-colors duration-200 group-hover:text-brand sm:text-3xl">
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

              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-border"
              />

              <span>{post.wordCount.toLocaleString()} words</span>

              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-border"
              />

              <span className="inline-flex items-center gap-1.5">
                <HeartIcon className="size-3.5" />
                {post._count.likes}
              </span>

              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-border"
              />

              <span className="inline-flex items-center gap-1.5">
                <ChatBubbleLeftIcon className="size-3.5" />
                {post._count.comments}
              </span>
            </div>

            {isPublished && (
              <Link
                href={href}
                className="hidden items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-brand sm:inline-flex"
              >
                Read
                <ArrowUpRightIcon className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Thumbnail + actions */}
        <div className="order-first flex flex-col gap-3 sm:order-last">
          <Link
            href={href}
            aria-label={`Read ${post.title}`}
            className="group/image relative block aspect-[16/9] overflow-hidden bg-surface-subtle md:aspect-[4/3]"
          >
            <Image
              src={post.thumbnail || "/no-image.png"}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover transition-transform duration-700 ease-standard group-hover/image:scale-[1.035]"
            />

            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover/image:bg-black/[0.04]" />

            {isPublished && (
              <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full bg-background/95 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover/image:opacity-100">
                <ArrowUpRightIcon className="size-4" />
              </span>
            )}
          </Link>

          <div className="flex justify-end">
            <PostActions postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostListItem;
