"use server";
import { print } from "graphql";
import { authFetchGraphQL, GraphQLError } from "@/lib/fetchGraphQL";
import {
  CHANGE_PASSWORD_MUTATION,
  DEACTIVATE_ACCOUNT_MUTATION,
  GET_USER,
  UPDATE_PROFILE_MUTATION,
} from "@/lib/gqlQueries";
import type {
  ChangePasswordFormState,
  UserFormState,
} from "@/lib/types/formState";
import {
  ChangePasswordFormSchema,
  UpdateProfileSchema,
} from "@/lib/zodSchemas/schema";
import { uploadAvatar } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { deleteSession } from "@/lib/session";
import { getErrorMessage } from "../utils";

export async function getCurrentUser() {
  const data = await authFetchGraphQL(print(GET_USER));
  return data.user;
}

export async function updateProfile(
  state: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const avatarFile = formData.get("avatar") as File | null;

  // Extract raw form inputs without stringifying File objects
  const rawData = {
    name: formData.get("name"),
    bio: formData.get("bio"),
    avatar: avatarFile && avatarFile.size > 0 ? avatarFile : undefined,
  };

  const validatedFields = UpdateProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: {
        name: String(rawData.name ?? ""),
        bio: String(rawData.bio ?? ""),
        avatar: "",
      },
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    let avatarUrl: string | undefined = undefined;

    // Stream image to Cloudinary if a new image file was submitted
    if (validatedFields.data.avatar instanceof File) {
      avatarUrl = await uploadAvatar(validatedFields.data.avatar);
    }

    const data = await authFetchGraphQL(print(UPDATE_PROFILE_MUTATION), {
      input: {
        name: validatedFields.data.name,
        bio: validatedFields.data.bio,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    revalidatePath("/user/account");

    return {
      data: {
        name: data.updateProfile.name,
        bio: data.updateProfile.bio ?? "",
        avatar: data.updateProfile.avatar ?? "",
      },
      message: data.updateProfile.message,
      success: true,
    };
  } catch (error) {
    return {
      data: {
        name: validatedFields.data.name,
        bio: validatedFields.data.bio ?? "",
        avatar: "",
      },
      success: false,
      message: getErrorMessage(
        error,
        "We couldn't update your profile. Please try again.",
      ),
    };
  }
}

export async function changePassword(
  state: ChangePasswordFormState,
  formData: FormData,
): Promise<ChangePasswordFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = ChangePasswordFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await authFetchGraphQL(print(CHANGE_PASSWORD_MUTATION), {
      input: {
        currentPassword: validatedFields.data.currentPassword,
        newPassword: validatedFields.data.newPassword,
      },
    });

    return {
      message: data.changePassword.message,
      success: true,
    };
  } catch (error) {
    return {
      message:
        error instanceof GraphQLError
          ? error.message
          : "We couldn't change your password. Please try again.",
    };
  }
}

export async function deactivateAccount() {
  try {
    const data = await authFetchGraphQL(print(DEACTIVATE_ACCOUNT_MUTATION));

    if (!data) {
      return {
        success: false,
        message: "Unable to deactivate your account.",
      };
    }

    await deleteSession();

    return {
      success: true,
      message: "Your account has been successfully deactivated.",
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
}
