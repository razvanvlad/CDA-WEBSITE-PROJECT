import DOMPurify from 'isomorphic-dompurify';

// Sanitize WYSIWYG HTML for titles while allowing only our underline utility classes
export function sanitizeTitleHtml(html) {
  if (!html || typeof html !== 'string') return '';

  // ACF WYSIWYG often wraps in <p>…</p> — strip those for inline title usage
  const stripped = html.replace(/<\/?p[^>]*>/gi, '');

  const allowedClasses = new Set([
    'title-underline',
    'title-large-orange',
    'title-large-pink',
    'title-large-purple',
    'title-large-light-blue',
    'title-large-green',
    'u-full',
    'u-half',
    'u-third',
    'u-gap-6',
    'u-gap-10',
    'u-gap-12',
    'u-gap-14',
    'u-thick-9',
    'u-thick-11',
    'u-thick-14',
  ]);

  // Hook to filter class attribute values to our whitelist
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    if (data.attrName !== 'class') return;
    const filtered = (data.attrValue || '')
      .split(/\s+/)
      .filter((cls) => allowedClasses.has(cls));
    if (filtered.length) {
      data.attrValue = filtered.join(' ');
    } else {
      // No allowed classes remain; drop the attribute
      return DOMPurify.removed.push({ element: node, attr: 'class' });
    }
  });

  const clean = DOMPurify.sanitize(stripped, {
    ALLOWED_TAGS: ['span', 'strong', 'em', 'b', 'i', 'br'],
    ALLOWED_ATTR: ['class'],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    // SAFER_TEMPLATES prevents e.g. Mustache/Angular-like templates
    SAFE_FOR_TEMPLATES: true,
    FORBID_TAGS: ['style', 'script'],
    FORBID_ATTR: ['style', 'on*'],
  });

  // Important: remove the hook so it doesn't affect other sanitizations
  DOMPurify.removeAllHooks();

  return clean;
}

// Sanitize text for use in Image alt attributes by converting Unicode characters to ASCII
export function sanitizeImageAlt(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    // Replace smart quotes with regular quotes
    .replace(/[\u2018\u2019]/g, "'")  // Single quotes
    .replace(/[\u201C\u201D]/g, '"')  // Double quotes
    // Replace en-dash and em-dash with hyphen
    .replace(/[\u2013\u2014]/g, '-')  // En-dash (8211), Em-dash (8212)
    // Replace other common Unicode characters
    .replace(/\u2026/g, '...')        // Ellipsis
    .replace(/[\u2018-\u201F]/g, '')  // Remove other quote-like characters
    // Remove any remaining non-ASCII characters
    .replace(/[^\x00-\x7F]/g, '')
    .trim();
}

