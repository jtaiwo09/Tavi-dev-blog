import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { getCategories } from "@/lib/actions/category";

import BlogFilters from "@/components/blog/blog-filters";
import BlogPagination from "@/components/blog/blog-pagination";
import { getTags } from "@/lib/actions/tags";
import { fetchPosts } from "@/lib/actions/postActions";
import PostCard from "@/components/post-card";

type SearchParams = {
  page?: string;
  search?: string;
  category?: string;
  tag?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const parsePage = (value?: string) => {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
};

const BlogPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const requestedPage = parsePage(params.page);

  const search = params.search?.trim() || "";
  const categorySlug = params.category?.trim() || "";
  const tag = params.tag?.trim() || "";

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  const { posts, totalPosts } = await fetchPosts({
    page: requestedPage,
    pageSize: DEFAULT_PAGE_SIZE,
    filters: {
      search: search || undefined,
      categorySlug: categorySlug || undefined,
      tag: tag || undefined,
    },
  });

  const totalPages = Math.ceil(totalPosts / DEFAULT_PAGE_SIZE);

  const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  return (
    <main>
      <section className="w-full content-container px-5 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Journal
          </p>

          <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
            Stories, ideas &amp; insights.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Explore our latest articles, practical ideas, and perspectives from
            the community.
          </p>
        </header>

        {/* Filters */}
        <div className="mt-10">
          <BlogFilters
            categories={categories}
            tags={tags}
            search={search}
            categorySlug={categorySlug}
            tag={tag}
          />
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="border-b border-border py-20 text-center sm:py-28">
            <div className="mx-auto max-w-md">
              <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] text-foreground">
                No articles found
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Try adjusting your search or choosing a different category or
                tag.
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-10 sm:pt-12">
            <BlogPagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </section>
    </main>
  );
};

export default BlogPage;
