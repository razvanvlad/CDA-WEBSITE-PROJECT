import sanitizeHtml from 'sanitize-html';

// Sanitize WYSIWYG HTML for titles while allowing only our underline utility classes
export function sanitizeTitleHtml(html) {
  if (!html || typeof html !== 'string') return '';

  // ACF WYSIWYG often wraps in <p>…</p> — strip those for inline title usage
  const stripped = html.replace(/<\/?p[^>]*>/gi, '');

  const allowedClasses = [
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
  ];

  const clean = sanitizeHtml(stripped, {
    allowedTags: ['span', 'strong', 'em', 'b', 'i', 'br'],
    allowedAttributes: {
      'span': ['class'],
      'strong': ['class'],
      'em': ['class'],
      'b': ['class'],
      'i': ['class'],
    },
    allowedClasses: {
      '*': allowedClasses,
    },
    disallowedTagsMode: 'discard',
  });

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

