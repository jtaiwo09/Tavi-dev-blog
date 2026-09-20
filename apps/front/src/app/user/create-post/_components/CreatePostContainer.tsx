"use client";

import { useActionState } from "react";
import { saveNewPost } from "@/lib/actions/postActions";
import UpsertPostForm from "./upsertPostForm";
import type { Category, Tag } from "@/lib/types/modelTypes";

type Props = {
  categories: Category[];
  tags: Tag[];
};

const CreatePostContainer = ({ categories, tags }: Props) => {
  const [state, action] = useActionState(saveNewPost, undefined);

  return (
    <UpsertPostForm
      state={state}
      formAction={action}
      categories={categories}
      tags={tags}
    />
  );
};

export default CreatePostContainer;
