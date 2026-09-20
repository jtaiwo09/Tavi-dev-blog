"use client";

import { useActionState } from "react";

import { updatePost } from "@/lib/actions/postActions";
import { Post, type Category, type Tag } from "@/lib/types/modelTypes";

import UpsertPostForm from "@/app/user/create-post/_components/upsertPostForm";

type Props = {
  post: Post;
  categories: Category[];
  tags: Tag[];
};

const UpdatePostContainer = ({ post, categories, tags }: Props) => {
  const [state, action] = useActionState(updatePost, {
    data: {
      postId: post.id,
      title: post.title,
      content: post.content,
      status: post.status,
      tags: post.tags.map((tag) => tag.id),
      previousThumbnailUrl: post.thumbnail ?? undefined,
      categoryId: post.category?.id?.toString() ?? "",
      excerpt: post.excerpt ?? "",
    },
  });

  return (
    <UpsertPostForm
      state={state}
      formAction={action}
      categories={categories}
      tags={tags}
    />
  );
};

export default UpdatePostContainer;
