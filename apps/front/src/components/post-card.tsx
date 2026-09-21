import { Post } from "@/lib/types/modelTypes";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
}: Props) => {
  const href = `/blog/${slug}/${id}`;

  const formattedDate = formatDate(publishedAt);

  const plainTextContent =
    content
      ?.replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li)>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim() ?? "";

  const generatedExcerpt =
    plainTextContent.length > 150
      ? `${plainTextContent.slice(0, 150).trim()}…`
      : plainTextContent;

  const excerpt = postExcerpt?.trim() || generatedExcerpt;

  return (
    <article className="group border-t border-border">
      <Link
        href={href}
        className="grid gap-6 py-8 sm:gap-8 md:grid-cols-[minmax(0,1fr)_15rem] md:items-center lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12 lg:py-10"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {category?.name && (
              <>
                <span className="text-brand">{category?.name}</span>

                <span aria-hidden="true" className="text-border">
                  /
                </span>
              </>
            )}

            {formattedDate && <span>{formattedDate}</span>}
          </div>

          <h3 className="mt-3 max-w-3xl text-balance font-serif text-xl font-medium sm:leading-[1.08] md:tracking-[-0.02em] text-foreground transition-colors duration-200 group-hover:text-brand sm:text-3xl lg:text-[2.15rem]">
            {title}
          </h3>

          {excerpt && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {excerpt}
            </p>
          )}

          <div className="mt-5 flex items-center gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              {author?.avatar ? (
                <div className="relative size-7 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="28px"
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

            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-border"
            />

            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {readingTimeMinutes} min read
            </span>

            <span className="ml-auto hidden items-center gap-1 text-xs font-medium text-foreground sm:inline-flex">
              Read
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>

        <div className="relative order-first aspect-video overflow-hidden bg-surface-subtle md:order-last md:aspect-[4/3]">
          <Image
            src={thumbnail || "/no-image.jpeg"}
            alt={title ?? "Blog post"}
            fill
            className="object-cover transition-transform duration-700 ease-standard group-hover:scale-[1.035]"
            sizes="(max-width: 768px) 100vw, 288px"
          />

          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.04]" />
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
