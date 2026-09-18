export const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export type PostFilters = {
  categoryId?: number;
  tag?: string;
  search?: string;
};
