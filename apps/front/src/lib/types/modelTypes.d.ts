import { POST_STATUS, type PostStatus } from "./post";
import type { UserStatus } from "./user";

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;

  status: PostStatus;
  publishedAt: Date | null;

  wordCount: number;
  readingTimeMinutes: number;

  authorId: number;
  author: User;

  categoryId: number;
  category: Category;

  tags: Tag[];

  createdAt: Date;
  updatedAt: Date;

  _count: {
    likes: number;
    comments: number;
  };
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  status: UserStatus;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: number;
  name: string;
};

export type CommentEntity = {
  id: number;
  content: string;
  post: Post;
  author: User;
  createdAt: Date;
  updatedAt: Date;
};
