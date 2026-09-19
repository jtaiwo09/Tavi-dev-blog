"use server";

import { print } from "graphql";
import { authFetchGraphQL, fetchGraphQL } from "@/lib/fetchGraphQL";
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
  UPDATE_POST_MUTATION,
} from "@/lib/gqlQueries";
import { transformTakeSkip } from "@/lib/helpers";
import { Post } from "@/lib/types/modelTypes";
import { PostFormState } from "@/lib/types/formState";
import { PostFormSchema } from "@/lib/zodSchemas/schema";
import { uploadThumbnail } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PostFilters } from "@/lib/types/post";

export const fetchPosts = async ({
  page,
  pageSize,
  filters,
}: {
  page?: number;
  pageSize?: number;
  filters?: PostFilters;
}) => {
  const { skip, take } = transformTakeSkip({ page, pageSize });
  const data = await fetchGraphQL(print(GET_POSTS), {
    skip,
    take,
    filters: filters ?? null,
  });

  return { posts: data.posts.posts as Post[], totalPosts: data.posts.total };
};

export const fetchPostById = async (id: number) => {
  const data = await fetchGraphQL(print(GET_POST_BY_ID), { id });

  return data.getPostById as Post;
};

export async function fetchUserPosts({
  page,
  pageSize,
}: {
  page?: number;
  pageSize: number;
}) {
  const { take, skip } = transformTakeSkip({ page, pageSize });
  const data = await authFetchGraphQL(print(GET_USER_POSTS), {
    take,
    skip,
  });

  return {
    posts: data.getUserPosts.posts as Post[],
    stats: data.getUserPosts.stats,
  };
}

function getRawFormData(formData: FormData) {
  const entries = Object.fromEntries(formData.entries());

  const thumbnail = entries.thumbnail;

  if (thumbnail instanceof File && thumbnail.size === 0) {
    delete entries.thumbnail;
  }

  return entries;
}

function hasFile(value: unknown): value is File {
  return value instanceof File && value.size > 0 && value.name.length > 0;
}

export async function saveNewPost(
  state: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const rawData = getRawFormData(formData);

  const validatedFields = PostFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: rawData,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    postId: _postId,
    thumbnail,
    previousThumbnailUrl: _previousThumbnailUrl,
    ...postInput
  } = validatedFields.data;

  try {
    let thumbnailUrl = "";

    if (hasFile(thumbnail)) {
      thumbnailUrl = await uploadThumbnail(thumbnail);
    }

    await authFetchGraphQL(print(CREATE_POST_MUTATION), {
      input: {
        ...postInput,

        thumbnail: thumbnailUrl,
      },
    });

    revalidatePath("/user/posts");
  } catch (error) {
    console.error("Failed to create post:", error);

    return {
      message: "Something went wrong while saving your post. Please try again.",

      data: rawData,
    };
  }

  redirect("/user/posts");
}

export async function updatePost(
  state: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const rawData = getRawFormData(formData);

  const validatedFields = PostFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: rawData,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    postId,
    thumbnail,
    previousThumbnailUrl: _previousThumbnailUrl,
    ...inputs
  } = validatedFields.data;

  if (postId === undefined) {
    return {
      data: rawData,

      errors: {
        postId: ["The post could not be identified."],
      },

      message: "We couldn't identify the post you're trying to update.",
    };
  }

  try {
    let thumbnailUrl: string | undefined;

    if (hasFile(thumbnail)) {
      thumbnailUrl = await uploadThumbnail(thumbnail);
    }

    const input = {
      postId,

      ...inputs,

      ...(thumbnailUrl
        ? {
            thumbnail: thumbnailUrl,
          }
        : {}),
    };

    const data = await authFetchGraphQL(print(UPDATE_POST_MUTATION), {
      input,
    });

    if (!data) {
      return {
        message: "We couldn't update your post. Please try again.",

        data: rawData,
      };
    }

    revalidatePath("/user/posts");
  } catch (error) {
    console.error("Failed to update post:", error);

    return {
      message:
        "Something went wrong while updating your post. Please try again.",

      data: rawData,
    };
  }

  redirect("/user/posts");
}

export async function deletePost(postId: number) {
  const data = await authFetchGraphQL(print(DELETE_POST_MUTATION), {
    postId,
  });

  return data.deletePost;
}
