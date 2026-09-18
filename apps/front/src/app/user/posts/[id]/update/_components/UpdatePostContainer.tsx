"use client";

import { useActionState } from "react";

import { updatePost } from "@/lib/actions/postActions";
import { Post } from "@/lib/types/modelTypes";

import UpsertPostForm from "@/app/user/create-post/_components/upsertPostForm";

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

type Props = {
  post: Post;
  categories: Category[];
};

const UpdatePostContainer = ({ post, categories }: Props) => {
  const [state, action] = useActionState(updatePost, {
    data: {
      postId: post.id,
      title: post.title,
      content: post.content,
      status: post.status,
      tags: post.tags?.map((tag) => tag.name).join(","),
      previousThumbnailUrl: post.thumbnail ?? undefined,
      categoryId: post.category?.id?.toString() ?? "",
      excerpt: post.excerpt ?? "",
    },
  });

  return (
    <UpsertPostForm state={state} formAction={action} categories={categories} />
  );
};

export default UpdatePostContainer;
