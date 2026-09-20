import { Post } from "@/lib/types/modelTypes";
import Link from "next/link";
import Pagination from "@/components/pagination";
import PostListItem from "./PostListItem";
import { FileText, Plus } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

type Props = {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  stats: {
    total: number;
    published: number;
    drafts: number;
  };
};

const PostList = ({ posts, currentPage, totalPages, stats }: Props) => {
  return (
    <div className="w-full">
      {/* Page introduction */}
      <header className="border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-7 bg-brand" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                Your journal
              </span>
            </div>

            <h1 className="font-serif text-4xl font-medium leading-none tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              Your posts
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Create, refine, and publish the ideas you want to share with
              readers.
            </p>
          </div>

          <Button asChild className="h-10 w-fit px-4 shadow-none">
            <Link href="/user/create-post">
              <Plus className="size-4" />
              New post
            </Link>
          </Button>
        </div>

        {/* Editorial stats */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/70 pt-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{stats.total}</span>

            <span className="text-muted-foreground">
              {stats.total === 1 ? "post" : "posts"}
            </span>
          </div>

          <span aria-hidden="true" className="size-1 rounded-full bg-border" />

          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.published}
            </span>

            <span className="text-muted-foreground">published</span>
          </div>

          <span aria-hidden="true" className="size-1 rounded-full bg-border" />

          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {stats.drafts}
            </span>

            <span className="text-muted-foreground">
              {stats.drafts === 1 ? "draft" : "drafts"}
            </span>
          </div>
        </div>
      </header>

      {/* Posts */}
      <section aria-labelledby="posts-heading" className="mt-10 sm:mt-12">
        <header className="mb-2 flex items-end justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-subtle text-brand">
              <FileText className="size-4" />
            </div>

            <div>
              <h2
                id="posts-heading"
                className="text-sm font-semibold text-foreground"
              >
                All posts
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Your published work and drafts
              </p>
            </div>
          </div>

          {totalPages > 0 && (
            <p className="hidden text-xs text-muted-foreground sm:block">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </p>
          )}
        </header>

        <div>
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      </section>

      {totalPages > 1 && (
        <nav
          aria-label="Posts pagination"
          className="mt-10 border-t border-border pt-8"
        >
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </nav>
      )}
    </div>
  );
};

export default PostList;
