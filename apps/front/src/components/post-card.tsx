import { Post } from "@/lib/types/modelTypes";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";
import { createExcerpt, formatDate } from "@/lib/utils";
import PostListLayout from "./blog/post-list-layout";

type Props = Partial<Post>;

const PostCard = ({
  id,
  title,
  slug,
  thumbnail,
  content,
  excerpt: postExcerpt,
  publishedAt,
  author,
  category,
  readingTimeMinutes,
  wordCount,
}: Props) => {
  const href = `/blog/${slug}/${id}`;

  const formattedDate = publishedAt ? formatDate(publishedAt) : "";

  const excerpt = postExcerpt?.trim() || createExcerpt(content);

  return (
    <PostListLayout
      href={href}
      title={title ?? "Blog post"}
      thumbnail={thumbnail}
    >
      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em]">
        {category?.name && (
          <>
            <span className="text-brand">{category.name}</span>

            <span aria-hidden="true" className="text-border">
              /
            </span>
          </>
        )}

        {formattedDate && (
          <time
            dateTime={new Date(publishedAt!).toISOString()}
            className="normal-case tracking-normal text-muted-foreground"
          >
            {formattedDate}
          </time>
        )}
      </div>

      {/* Title */}
      <Link href={href} className="block">
        <h3 className="mt-3 max-w-3xl text-balance font-serif text-2xl font-medium leading-[1.08] tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-brand sm:text-3xl">
          {title}
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
        {/* Author */}
        <div className="flex min-w-0 items-center gap-2.5">
          {author?.avatar ? (
            <div className="relative size-7 shrink-0 overflow-hidden rounded-full">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-[10px] font-semibold text-brand">
              {author?.name?.charAt(0)?.toUpperCase() ?? "T"}
            </div>
          )}

          <span className="truncate text-xs font-medium text-foreground">
            {author?.name ?? "Tavi"}
          </span>
        </div>

        {/* Divider */}
        <span aria-hidden="true" className="size-1 rounded-full bg-border" />

        {/* Reading time */}
        {readingTimeMinutes != null && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="size-3.5" />
            {readingTimeMinutes} min read
          </span>
        )}

        {/* Word count */}
        {wordCount != null && (
          <>
            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-border"
            />

            <span className="text-xs text-muted-foreground">
              {wordCount.toLocaleString()} words
            </span>
          </>
        )}
      </div>
    </PostListLayout>
  );
};

export default PostCard;
