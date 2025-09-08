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

