import { Post } from "@/lib/types/modelTypes";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import PostCard from "./post-card";

type Props = {
  posts: Post[];
};

const Posts = ({ posts }: Props) => {
  return (
    <section
      id="latest-posts"
      className="content-container scroll-mt-20 py-16 lg:py-20"
    >
      {/* Section heading */}
      <header className="mb-2 flex flex-col border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            The journal
          </p>

          <h2 className="font-serif text-4xl font-medium leading-none tracking-[-0.035em] text-foreground sm:text-5xl">
            Latest stories
          </h2>
        </div>

        <Link
          href="/blog"
          className="mt-5 inline-flex w-fit items-center gap-2 border-b border-foreground/30 pb-1 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand sm:mt-0"
        >
          View all stories
          <ArrowUpRightIcon className="size-4" />
        </Link>
      </header>

      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <div className="border-y border-border py-20 text-center">
          <p className="font-serif text-2xl text-foreground">
            Nothing published yet.
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Check back soon for new articles and stories.
          </p>
        </div>
      )}
    </section>
  );
};

export default Posts;
