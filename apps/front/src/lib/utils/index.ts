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

export const stripHtml = (html?: string | null) => {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li)>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

export const createExcerpt = (content?: string | null, maxLength = 150) => {
  const text = stripHtml(content);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}…`;
};
