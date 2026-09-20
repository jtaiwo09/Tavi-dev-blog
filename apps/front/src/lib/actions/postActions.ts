"use server";

import { print } from "graphql";
import { authFetchGraphQL, fetchGraphQL } from "@/lib/fetchGraphQL";
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POST_BY_SLUG,
  GET_POSTS,
  GET_POSTS_FOR_SITEMAP,
  GET_USER_POSTS,
  UPDATE_POST_MUTATION,
} from "@/lib/gqlQueries";
import { transformTakeSkip } from "@/lib/helpers";
import { Post } from "@/lib/types/modelTypes";
import { PostFormState } from "@/lib/types/formState";
import { PostFormSchema } from "@/lib/zodSchemas/schema";
import { uploadThumbnail } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import type { PostFilters } from "@/lib/types/post";
import { getErrorMessage } from "../utils";

export const fetchPosts = async ({
  page = 1,
  pageSize,
  filters,
}: {
  page?: number;
  pageSize?: number;
  filters?: PostFilters;
}) => {
  const { skip, take } = transformTakeSkip({
    page,
    pageSize,
  });

  const normalizedFilters =
    filters &&
    Object.fromEntries(
      Object.entries(filters).filter(([, value]) =>
        typeof value === "string"
          ? value.trim().length > 0
          : value !== undefined,
      ),
    );

  const data = await fetchGraphQL(print(GET_POSTS), {
    skip,
    take,
    filters:
      normalizedFilters && Object.keys(normalizedFilters).length > 0
        ? normalizedFilters
        : null,
  });

  return {
    posts: data.posts.posts as Post[],
    totalPosts: data.posts.total,
  };
};

export const fetchPostById = async (id: number) => {
  const data = await fetchGraphQL(print(GET_POST_BY_ID), { id });

  return data.getPostById as Post;
};

export const fetchPostBySlug = async (slug: string) => {
  const data = await fetchGraphQL(print(GET_POST_BY_SLUG), {
    slug,
  });

  return data.getPostBySlug as Post;
};

export async function fetchUserPosts({
  page,
  pageSize,
}: {
  page?: number;
  pageSize: number;
}) {
  const { take, skip } = transformTakeSkip({
    page,
    pageSize,
  });

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
      success: false,
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

    const data = await authFetchGraphQL(print(CREATE_POST_MUTATION), {
      input: {
        ...postInput,
        thumbnail: thumbnailUrl,
      },
    });

    revalidatePath("/user/posts");
    revalidatePath("/blog");

    return {
      message: data.createPost.message,
      success: true,
    };
  } catch (error) {
    console.error("Failed to create post:", error);

    return {
      message: getErrorMessage(
        error,
        "Something went wrong while saving your post. Please try again.",
      ),
      data: rawData,
      success: false,
    };
  }
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

    revalidatePath("/user/posts");
    revalidatePath("/blog");

    return {
      message: data.updatePost.message,
      success: true,
    };
  } catch (error) {
    console.error("Failed to update post:", error);

    return {
      message: getErrorMessage(
        error,
        "Something went wrong while updating your post. Please try again.",
      ),
      data: rawData,
    };
  }
}

export async function deletePost(postId: number) {
  const data = await authFetchGraphQL(print(DELETE_POST_MUTATION), {
    postId,
  });

  revalidatePath("/user/posts");
  revalidatePath("/blog");

  return data.deletePost;
}

const SITEMAP_BATCH_SIZE = 1000;

export async function fetchPostsForSitemap({
  skip = 0,
}: {
  skip?: number;
} = {}): Promise<{
  total: number;
  posts: Post[];
}> {
  const data = await fetchGraphQL(print(GET_POSTS_FOR_SITEMAP), {
    skip,
    take: SITEMAP_BATCH_SIZE,
  });

  return {
    posts: data.posts.posts,
    total: data.posts.total,
  };
}
