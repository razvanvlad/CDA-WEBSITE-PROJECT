# Case Study Implementation

This document outlines the final Case Study page implementation in the Next.js app, the GraphQL queries used, data fetching strategy, and how global sections are rendered consistently across pages.

## Goals
- Prevent runtime 404s for individual Case Studies
- Decouple from ACF-only fields (work even when custom fields are missing)
- Render global tail sections (Case Studies, Stats & Numbers, Approach) consistently via a shared server component
- Support SSG with ISR for performance and freshness

## Summary of Changes

1) Robust data fetching (slug/URI + core fallbacks)
- Added a resilient resolver that fetches a Case Study by URI and falls back to slug. It also includes core-only query fallbacks (no ACF fields) to avoid schema issues.
- New utility: `getCaseStudyByAny({ uri, slug })` tries in order:
  - URI with idType: URI (with common variations for trailing slash)
  - Fallback to idType: SLUG
  - Falls back to core-only queries if enhanced fields fail

2) Pre-rendering with ISR
- `generateStaticParams()` for `/case-studies/[slug]` uses `getCaseStudySlugs()` to prerender known case studies.
- `export const revalidate = 300` on the page ensures incremental regeneration and freshness.

3) Global tail sections via a shared server component
- Case Study page renders `GlobalTailSections` which includes:
  - Case Studies (with a data-driven or fallback strategy)
  - Stats & Numbers (globalOptions.globalContentBlocks.statsAndNumbers)
  - Approach (globalOptions.globalContentBlocks.approach)

## Files Updated

- `src/app/case-studies/[slug]/page.js`
  - Added SSG (generateStaticParams) and ISR (revalidate).
  - Awaited `props.params` to satisfy Next.js dynamic params usage.
  - Switched to `getCaseStudyByAny` for resilient data fetching.
  - Replaced inline Stats block usage with `<GlobalTailSections globalData={globalData} />`.

- `src/lib/graphql-queries.js`
  - Added `GET_CASE_STUDY_BY_URI` to fetch via idType: URI.
  - Added core-only queries: `GET_CASE_STUDY_CORE_BY_URI`, `GET_CASE_STUDY_CORE_BY_SLUG`.
  - Added `getCaseStudyByAny({ uri, slug })` helper to try URI → slug with core fallbacks.
  - Updated `getCaseStudyBySlug` and `getCaseStudyByUri` to automatically retry core-only queries when enhanced fields are unavailable.

## Why this works well
- URI-based fetching matches WordPress canonical URLs, improving robustness.
- Slug fallback handles legacy/migrated data.
- Core fallbacks remove hard dependency on custom ACF field groups.
- Tail sections are now standardized across pages and easy to update from a single place.

## Future improvements
- Add tests or a quick health check endpoint to detect schema differences early (e.g., when ACF groups or GraphQL schema changes).
- Centralize more of the per-page global content logic into `getGlobalContent()` while staying tolerant of partial schema.

