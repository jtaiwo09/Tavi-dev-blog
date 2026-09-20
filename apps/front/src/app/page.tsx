import Hero from "@/components/hero";
import Posts from "@/components/post";
import { fetchPosts } from "@/lib/actions/postActions";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software, Design, Technology & Ideas",
  description:
    "Tavi / Dev explores software development, design, technology, and the ideas behind the things we create.",
  alternates: {
    canonical: "/",
  },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;

  const { totalPosts, posts } = await fetchPosts({
    page: page ? +page : undefined,
  });

  return (
    <main className="min-h-screen bg-background">
      <Hero />

      <Posts
        posts={posts}
        currentPage={page ? +page : 1}
        totalPages={Math.ceil(totalPosts / DEFAULT_PAGE_SIZE)}
      />
    </main>
  );
}
