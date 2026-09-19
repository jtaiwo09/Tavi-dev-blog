import { z } from "zod";
import { POST_STATUS } from "@/lib/types/post";
import { ALLOWED_IMAGE_TYPES, MAX_THUMBNAIL_SIZE } from "@/lib/constants";

export const PostFormSchema = z.object({
  postId: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;

      const parsed = Number(value);

      return Number.isNaN(parsed) ? undefined : parsed;
    }),

  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be 100 characters or less"),

  excerpt: z
    .string()
    .trim()
    .max(300, "Excerpt must be 300 characters or less")
    .optional()
    .transform((value) => value || undefined),

  content: z.string().trim().min(20, "Content must be at least 20 characters"),

  categoryId: z
    .string()
    .min(1, "Please select a category")
    .transform(Number)
    .refine(
      (value) => Number.isInteger(value) && value > 0,
      "Please select a valid category",
    ),

  tags: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) return [];

      return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }),

  thumbnail: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_THUMBNAIL_SIZE,
      "Thumbnail must be 5 MB or smaller",
    )
    .refine(
      (file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type),
      "Thumbnail must be a JPEG, PNG, or WebP image",
    ),

  status: z
    .enum([POST_STATUS.DRAFT, POST_STATUS.PUBLISHED])
    .default(POST_STATUS.DRAFT),

  previousThumbnailUrl: z.string().optional(),
});

export const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export const CommentFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters long"),

  postId: z
    .string()
    .trim()
    .min(1, "Post ID is required")
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value > 0, {
      message: "Invalid post",
    }),
});

export const SignUpFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .min(1, "Name is required"),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const ForgotPasswordFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),
});

export const ResetPasswordFormSchema = z
  .object({
    token: z.string().min(1, "Invalid or missing reset token"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const ResendVerificationEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be 100 characters or less"),

  bio: z
    .string()
    .trim()
    .max(500, "Bio must be 500 characters or less")
    .optional(),

  avatar: z
    .custom<File>((val) => val instanceof File, "Avatar must be a valid file")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Avatar must be 5MB or smaller",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Avatar must be a JPG, PNG, or WebP image",
    )
    .optional()
    .or(z.literal(undefined)),
});

export const ChangePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
