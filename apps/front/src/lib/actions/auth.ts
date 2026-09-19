"use server";

import {
  type AuthFormState,
  type ForgotPasswordFormState,
  type ResetPasswordFormState,
} from "@/lib/types/formState";
import {
  ForgotPasswordFormSchema,
  ResendVerificationEmailSchema,
  ResetPasswordFormSchema,
  SignUpFormSchema,
} from "@/lib/zodSchemas/schema";
import { fetchGraphQL, GraphQLError } from "@/lib/fetchGraphQL";
import { print } from "graphql";
import {
  FORGOT_PASSWORD_MUTATION,
  RESEND_VERIFICATION_EMAIL_MUTATION,
  RESET_PASSWORD_MUTATION,
  SIGN_IN_MUTATION,
  SIGN_UP_MUTATION,
  VERIFY_EMAIL_MUTATION,
} from "@/lib/gqlQueries";
import { LoginFormSchema } from "@/lib/zodSchemas/schema";
import { revalidatePath } from "next/cache";
import { createSession } from "@/lib/session";
import { getErrorMessage } from "../utils";

export async function signUp(
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = SignUpFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: {
        name: String(rawData.name ?? ""),
        email: String(rawData.email ?? ""),
      },
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const data = await fetchGraphQL(print(SIGN_UP_MUTATION), {
      input: validatedFields.data,
    });

    return {
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
      },
      message: data.signUp.message,
      success: true,
    };
  } catch (error) {
    console.error("Sign up failed:", error);

    return {
      data: {
        name: String(rawData.name ?? ""),
        email: String(rawData.email ?? ""),
      },
      message: getErrorMessage(
        error,
        "We couldn't create your account. Please try again.",
      ),
      success: false,
    };
  }
}

export async function signIn(
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = LoginFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: {
        email: String(rawData.email ?? ""),
      },
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const data = await fetchGraphQL(print(SIGN_IN_MUTATION), {
      input: validatedFields.data,
    });

    const { user, accessToken, message } = data.signIn;

    await createSession({ user, accessToken });

    revalidatePath("/");
    return {
      success: true,
      message: message ?? "Signed in successfully!",
    };
  } catch (error) {
    console.error("Sign in failed:", error);

    return {
      data: {
        email: String(rawData.email ?? ""),
      },
      message: getErrorMessage(error),
      success: false,
    };
  }
}

export async function forgotPassword(
  state: ForgotPasswordFormState,
  formData: FormData,
): Promise<ForgotPasswordFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = ForgotPasswordFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: {
        email: String(rawData.email ?? ""),
      },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await fetchGraphQL(print(FORGOT_PASSWORD_MUTATION), {
      input: {
        email: validatedFields.data.email,
      },
    });

    return {
      data: {
        email: validatedFields.data.email,
      },
      message: data.forgotPassword.message,
      success: true,
    };
  } catch (error) {
    console.error("Forgot password failed:", error);

    return {
      data: {
        email: validatedFields.data.email,
      },
      message: getErrorMessage(
        error,
        "We couldn't process your request. Please try again.",
      ),
    };
  }
}

export async function resetPassword(
  state: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = ResetPasswordFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: {
        token: String(rawData.token ?? ""),
      },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await fetchGraphQL(print(RESET_PASSWORD_MUTATION), {
      input: {
        token: validatedFields.data.token,
        password: validatedFields.data.password,
      },
    });

    return {
      data: {
        token: validatedFields.data.token,
      },
      message: data.resetPassword.message,
      success: true,
    };
  } catch (error) {
    console.error("Reset password failed:", error);

    return {
      data: {
        token: validatedFields.data.token,
      },
      message: getErrorMessage(
        error,
        "We couldn't reset your password. Please try again.",
      ),
    };
  }
}

export async function verifyEmail(token: string) {
  if (!token) {
    return {
      success: false,
      message: "The verification link is missing a token.",
    };
  }

  try {
    const data = await fetchGraphQL(print(VERIFY_EMAIL_MUTATION), {
      token,
    });

    return {
      success: true,
      message: data.verifyEmail.message,
    };
  } catch (error) {
    console.error("Email verification failed:", error);

    return {
      success: false,
      message: getErrorMessage(
        error,
        "We couldn't verify your email. Please try again.",
      ),
    };
  }
}

export async function resendVerificationEmail(
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = ResendVerificationEmailSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: {
        email: String(rawData.email ?? ""),
      },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const email = validatedFields.data.email;

  try {
    const data = await fetchGraphQL(print(RESEND_VERIFICATION_EMAIL_MUTATION), {
      email,
    });

    return {
      data: {
        email,
      },
      message: data.resendVerificationEmail.message,
      success: true,
    };
  } catch (error) {
    console.error("Resend verification email failed:", error);

    return {
      data: {
        email,
      },
      message: getErrorMessage(
        error,
        "We couldn't send the verification email. Please try again.",
      ),
    };
  }
}
