import { Post } from "@/lib/types/modelTypes";
import Pagination from "./pagination";
import PostCard from "./post-card";

type Props = {
  posts: Post[];
  currentPage: number;
  totalPages: number;
};

const Posts = ({ posts, currentPage, totalPages }: Props) => {
  return (
    <section
      id="latest-posts"
      className="content-container scroll-mt-20 py-16 sm:py-20 lg:py-28"
    >
      {/* Section heading */}
      <header className="mb-2 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            The journal
          </p>

          <h2 className="font-serif text-4xl font-medium leading-none tracking-[-0.035em] text-foreground sm:text-5xl">
            Latest stories
          </h2>
        </div>

        {totalPages > 0 && (
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </header>

      {posts.length > 0 ? (
        <>
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              className="mt-10 border-t border-border pt-8"
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </>
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
