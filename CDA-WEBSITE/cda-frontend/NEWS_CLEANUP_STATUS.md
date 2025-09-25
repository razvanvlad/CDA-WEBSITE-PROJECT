# News cleanup status and refactor suggestions

Completed changes
- Unified slug to /news/[slug]
- Removed duplicate route: cda-frontend/src/app/news-article
- Updated internal links:
  - Knowledge Hub cards now link to /news/${slug}
  - NewsCarouselClient now generates links to /news/${slug}
- Next.js config updates:
  - Added permanent redirect: /news-article/:slug -> /news/:slug
  - Rewrites legacy WP-style permalinks: /blog/:year/:month/:day/:slug -> /news/:slug

Verification
- Code search shows no remaining references to "news-article" in src/.
- Existing direct traffic/bookmarks to /news-article/<slug> will 301 to /news/<slug>.

Notes
- The working page at /news/[slug]/page.js remains the single source for blog posts rendered from WordPress blogPost by slug.

Suggested refactors
1) Consolidate root layouts
- You currently have both src/app/layout.js and src/app/layout.tsx. Keep one (prefer layout.tsx) and remove the other to avoid ambiguity. Merge metadata, schema, and resource hints.

2) GenerateStaticParams + ISR for News
- For SEO and speed, consider pre-rendering recent news slugs:
  - Add generateStaticParams() to src/app/news/[slug]/page.js to prebuild N recent posts.
  - Add export const revalidate = 300 for ISR.

3) Centralize fetch helpers
- Move the GraphQL fetch for blog posts into lib/graphql-queries.js (e.g., getBlogPostBySlug) and reuse across pages (Knowledge Hub, any listing components) for consistency.

4) GlobalTailSections for articles (optional)
- If you want consistent tail experiences on articles (e.g., more news, CTAs, columns), factor those blocks into GlobalTailSections so News detail pages can consume the same configurable patterns.

5) Link generation utility
- Replace ad-hoc slug extraction with a small helper (e.g., resolveNewsHref(uri) => `/news/${slug}`) and reuse in NewsCarouselClient and any other cards.

6) Tests and linting
- Add a simple test to assert redirects/rewrites route correctly (Next.js middleware test or unit test on route util). Consider enabling ESLint during builds once the codebase is stabilized.

Next actions (on approval)
- Remove src/app/layout.js and unify into layout.tsx, merging metadata and preconnect/dns-prefetch logic.
- Add generateStaticParams + revalidate to /news/[slug] and implement a fetch for recent slugs.
- Create a small helper in lib/link-utils.ts: resolveNewsHref(uri: string): string.
- Move the blog post fetch into lib/graphql-queries.js and refactor /news/[slug] & Knowledge Hub to use it.

