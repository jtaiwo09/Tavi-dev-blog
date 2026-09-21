export function decodeBase64Content(content: string): string {
  try {
    const isBase64 =
      /^[A-Za-z0-9+/=]+$/.test(content.trim()) && content.length % 4 === 0;

    if (!isBase64) {
      return content;
    }

    const decoded = Buffer.from(content, 'base64').toString('utf-8');
    return decoded;
  } catch {
    return content;
  }
}
