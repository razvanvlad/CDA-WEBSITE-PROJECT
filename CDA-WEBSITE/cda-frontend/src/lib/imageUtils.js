/**
 * Safely encode image URLs to handle special characters
 * Useful for WordPress media URLs that may contain Unicode characters like en-dashes
 */
export function safeImageUrl(url) {
  if (!url) return null;
  try {
    // Decode first in case it's already encoded, then encode properly
    const decoded = decodeURI(url);
    return encodeURI(decoded);
  } catch (e) {
    // If encoding fails, return original URL
    return url;
  }
}
