"use client";

import { useActionState } from "react";

import { saveNewPost } from "@/lib/actions/postActions";

import UpsertPostForm from "./upsertPostForm";

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

type Props = {
  categories: Category[];
};

const CreatePostContainer = ({ categories }: Props) => {
  const [state, action] = useActionState(saveNewPost, undefined);

  return (
    <UpsertPostForm state={state} formAction={action} categories={categories} />
  );
};

export default CreatePostContainer;
