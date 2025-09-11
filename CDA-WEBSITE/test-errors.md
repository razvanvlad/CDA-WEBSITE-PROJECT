# Test & Error Log

Date: <auto>

## Context
- Environment: Local dev (Next.js frontend at http://localhost:3000, WordPress backend proxied via /api/wp-graphql)
- Browser automation: Puppeteer via IDE

## Findings

### 1) Performance metrics (Home page)
- TTFB: ~946 ms
- DOMContentLoaded: ~982 ms
- Load: ~1119 ms

### 2) Runtime errors observed
- On About/Services puppeteer evaluate, saw script error: "Cannot convert undefined or null to object". Root cause was the evaluation script assuming an object where null may be returned.
- Services page had GraphQL fetch using relative endpoint ('/api/wp-graphql') from server-side, causing SSR fetch to fail in some contexts.

## Fixes Applied
- Implemented endpoint resolution in src/lib/graphql-queries.js so that when GRAPHQL_ENDPOINT is relative, it resolves to an absolute URL on server using NEXT_PUBLIC_SITE_URL or fallback http://localhost:3000. Also added cache: 'no-store' to SSR fetch.

## Next Steps
- Re-test Services page data fetching and rendering.
- Re-run performance metrics collection for Home, Services, About pages.
- Capture 1400x900 screenshots for Home, Services, About.
- Monitor dev server logs for new errors after the fix.