import { GraphQLError } from "../fetchGraphQL";

type DateInput = Date | string | number | null | undefined;

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

export function formatDate(
  date: DateInput,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  if (!date) return "";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "";
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  return parsedDate.toLocaleDateString(locale, mergedOptions);
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  return error instanceof GraphQLError ? error.message : fallback;
}
