import { DEFAULT_PAGE_SIZE } from "./constants";
import type { PostFilters, SearchParams } from "@/lib/types/post";
import type { Category, Tag } from "./types/modelTypes";

export function transformTakeSkip({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
}) {
  const safePage = page ?? 1;
  const safePageSize = pageSize ?? DEFAULT_PAGE_SIZE;

  return {
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
  };
}

export function calculatePageNumbers({
  pageNeighbors,
  totalPages,
  currentPage,
}: {
  pageNeighbors: number;
  totalPages: number;
  currentPage: number;
}) {
  const totalNumbers = pageNeighbors * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - pageNeighbors);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors);

    let pages: (number | string)[] = Array.from(
      {
        length: endPage - startPage + 1,
      },
      (_, i) => startPage + i,
    );
    if (startPage > 2) pages = ["...", ...pages];
    if (endPage < totalPages - 1) pages = [...pages, "..."];
    return [1, ...pages, totalPages];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

export function parsePage(value?: string) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

export function buildPostFilters({
  searchParams,
  categories,
}: {
  searchParams: SearchParams;
  categories: Category[];
}): PostFilters {
  const search = searchParams.search?.trim();
  const tag = searchParams.tag?.trim();
  const categorySlug = searchParams.category?.trim();

  const category = categorySlug
    ? categories.find((item) => item.slug === categorySlug)
    : undefined;

  return {
    ...(search ? { search } : {}),
    ...(tag ? { tag } : {}),
    ...(category ? { categoryId: category.id } : {}),
  };
}

export function getActiveCategory(categories: Category[], slug?: string) {
  if (!slug) {
    return undefined;
  }

  return categories.find((category) => category.slug === slug);
}

export function getActiveTag(tags: Tag[], slug?: string) {
  if (!slug) {
    return undefined;
  }

  return tags.find((tag) => tag.slug === slug);
}
