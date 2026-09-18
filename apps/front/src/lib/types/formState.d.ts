import type { PostStatus } from "./post";

export type AuthFormState =
  | {
      data?: {
        name?: string;
        email?: string;
        password?: string;
      };
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type SignUpFormState =
  | {
      data: {
        name?: string;
        email?: string;
        password?: string;
      };
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type CreateCommentFormState =
  | {
      data?: {
        content?: string;
        postId?: number;
      };
      errors?: {
        content?: string[];
      };
      message?: string;
      ok?: boolean;
      open?: boolean;
    }
  | undefined;

export type PostFormState =
  | {
      data?: {
        postId?: number;
        title?: string;
        excerpt?: string;
        content?: string;
        categoryId?: string;
        thumbnail?: File | null;
        tags?: string;
        status?: PostStatus;
        previousThumbnailUrl?: string;
      };

      errors?: {
        postId?: string[];
        title?: string[];
        excerpt?: string[];
        content?: string[];
        categoryId?: string[];
        thumbnail?: string[];
        tags?: string[];
        status?: string[];
      };

      message?: string;
      ok?: boolean;
    }
  | undefined;

export type ForgotPasswordFormState =
  | {
      data?: {
        email?: string;
      };
      errors?: {
        email?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type ResetPasswordFormState =
  | {
      data?: {
        token?: string;
      };
      errors?: {
        token?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type ResendVerificationEmailFormState =
  | {
      data?: {
        email?: string;
      };
      errors?: {
        email?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type UserFormState =
  | {
      data?: {
        name?: string;
        bio?: string;
        avatar?: string;
      };
      errors?: {
        name?: string[];
        bio?: string[];
        avatar?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type ChangePasswordFormState =
  | {
      data?: {
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
      };
      errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
