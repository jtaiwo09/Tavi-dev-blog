import { fetchPostById } from "@/lib/actions/postActions";
import Image from "next/image";
import SanitizedContent from "./_components/SanitizedContent";
import Comments from "./_components/comments";
import Like from "./_components/like";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/actions/users";

type Props = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  let post;

  try {
    post = await fetchPostById(+id);
  } catch {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,

    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },

    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `${siteConfig.url}/blog/${post.slug}/${id}`,
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,

      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : undefined,
      authors: [post.author.name],
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              alt: post.title,
            },
          ]
        : undefined,
    },
  };
}

const PostPage = async ({ params }: Props) => {
  const { slug, id } = await params;

  let post;
  try {
    post = await fetchPostById(+id);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const user = await getCurrentUser();

  const formattedDate = formatDate(post.createdAt, { month: "long" });

  return (
    <section className="min-h-screen bg-background">
      {/* Article header */}
      <header className="border-b border-border">
        <div className="content-container">
          <div className="mx-auto max-w-6xl py-12">
            {/* Eyebrow */}
            <div className="mb-7 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-brand" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Article
              </span>
            </div>

            {/* Title */}
            <h1 className="text-balance max-w-6xl font-serif text-2xl font-medium md:leading-[0.98] md:tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[4.5rem]">
              {post.title}
            </h1>

            {/* Author */}
            <div className="mt-10 flex items-center gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={post.author.avatar ?? undefined}
                  alt={post.author.name}
                  className="object-cover"
                />

                <AvatarFallback className="bg-brand-subtle text-xs font-bold text-brand">
                  {post.author.name?.charAt(0)?.toUpperCase() ?? "T"}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  {post.author.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Published {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero image */}
      {post.thumbnail && (
        <section className="content-container py-8 sm:py-10 lg:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="relative aspect-16/8 overflow-hidden bg-surface-subtle">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </div>
        </section>
      )}

      {/* Article */}
      <section className="content-container md:py-16">
        <div className="mx-auto max-w-5xl">
          <article className="reading-container">
            <SanitizedContent content={post.content} />
          </article>

          {/* Engagement */}
          <div className="mt-14 border-y border-border py-5 sm:mt-20">
            <Like postId={post.id} user={user} />
          </div>

          {/* Discussion */}
          <section className="mt-16 sm:mt-20">
            <div className="mb-9 border-b border-border pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Discussion
              </p>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-serif text-4xl font-medium leading-none tracking-[-0.035em] text-foreground">
                  Comments
                </h2>

                <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-right">
                  Share your thoughts, questions, or ideas about this article.
                </p>
              </div>
            </div>

            <Comments user={user} postId={post.id} slug={slug} />
          </section>
        </div>
      </section>
    </section>
  );
};

export default PostPage;
