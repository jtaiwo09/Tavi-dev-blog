import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

import { fetchPostsForSitemap } from "@/lib/actions/postActions";

const SITEMAP_BATCH_SIZE = 1000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  let skip = 0;
  let total = 0;

  do {
    const result = await fetchPostsForSitemap({
      skip,
    });

    total = result.total;

    urls.push(
      ...result.posts.map((post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: post.updatedAt ?? post.createdAt,
      })),
    );

    skip += SITEMAP_BATCH_SIZE;
  } while (skip < total);

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...urls,
  ];
}
