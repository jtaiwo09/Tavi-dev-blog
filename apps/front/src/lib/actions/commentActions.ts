"use server";

import { print } from "graphql";
import { authFetchGraphQL, fetchGraphQL } from "@/lib/fetchGraphQL";
import { CREATE_COMMENT_MUTATION, GET_POST_COMMENTS } from "@/lib/gqlQueries";
import { CreateCommentFormState } from "@/lib/types/formState";
import { CommentEntity } from "@/lib/types/modelTypes";
import { CommentFormSchema } from "@/lib/zodSchemas/schema";
import { getErrorMessage } from "../utils";
import { revalidatePath } from "next/cache";

export async function getPostComments({
  postId,
  skip,
  take,
}: {
  postId: number;
  skip: number;
  take: number;
}) {
  const data = await fetchGraphQL(print(GET_POST_COMMENTS), {
    postId,
    take,
    skip,
  });

  return {
    comments: data.getPostComments as CommentEntity[],
    count: data.postCommentCount as number,
  };
}

export async function saveComment(
  state: CreateCommentFormState,
  formData: FormData,
): Promise<CreateCommentFormState> {
  const validatedFields = CommentFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success)
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };

  const { postId, slug, ...rest } = validatedFields.data;

  try {
    const data = await authFetchGraphQL(print(CREATE_COMMENT_MUTATION), {
      input: {
        postId,
        ...rest,
      },
    });

    revalidatePath(`/blog/${slug}/${postId}`);

    if (data)
      return {
        message: data.createComment.message,
        success: true,
        open: false,
      };
  } catch (error) {
    return {
      message: getErrorMessage(
        error,
        "We couldn't verify your email. Please try again.",
      ),
      success: false,
      open: true,
      data: Object.fromEntries(formData.entries()),
    };
  }
}
