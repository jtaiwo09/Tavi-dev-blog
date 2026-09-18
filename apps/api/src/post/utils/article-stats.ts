import * as cheerio from 'cheerio';

const WORDS_PER_MINUTE = 200;

export function extractTextFromHtml(html: string): string {
  if (!html?.trim()) {
    return '';
  }

  const $ = cheerio.load(html);

  // Remove elements that should not contribute
  // to the article's readable word count.
  $('script, style, noscript').remove();

  return $.root().text();
}

export function countWords(text: string): number {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return 0;
  }

  return normalized.split(' ').length;
}

export function calculateReadingTime(wordCount: number): number {
  if (wordCount <= 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function calculateArticleStats(content: string) {
  const text = extractTextFromHtml(content);

  const wordCount = countWords(text);

  const readingTimeMinutes = calculateReadingTime(wordCount);

  return {
    wordCount,
    readingTimeMinutes,
  };
}
