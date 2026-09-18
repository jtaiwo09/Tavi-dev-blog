import { fetchUserPosts } from "@/lib/actions/postActions";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import NoPost from "./_components/NoPost";
import PostList from "./_components/PostList";

type Props = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const UserPostPage = async ({ searchParams }: Props) => {
  const { page } = await searchParams;

  const currentPage = page ? Number(page) || 1 : 1;

  const { posts, stats } = await fetchUserPosts({
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="content-container py-12">
        {!posts?.length ? (
          <NoPost />
        ) : (
          <PostList
            posts={posts}
            currentPage={currentPage}
            totalPages={Math.ceil(stats.total / DEFAULT_PAGE_SIZE)}
            stats={stats}
          />
        )}
      </div>
    </main>
  );
};

export default UserPostPage;
