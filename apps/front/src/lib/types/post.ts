export const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export type PostFilters = {
  search?: string;
  categorySlug?: string;
  tag?: string;
};

export type SearchParams = {
  page?: string;
  search?: string;
  category?: string;
  tag?: string;
};
