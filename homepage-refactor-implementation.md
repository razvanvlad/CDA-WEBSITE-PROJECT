# Homepage Refactor Implementation

This document summarizes the refactor of the Homepage (src/app/page.js) from a client-driven page to a server component with small client-only subcomponents for interactivity.

Goals
- Reduce client-side data fetching and duplication
- Centralize global content fetching (approach, case studies section, stats & numbers, etc.)
- Keep interactivity (like the News Carousel) with small client components
- Maintain current content and toggles

Summary of Changes
1) Converted Homepage to a server component
- The page is now an async server function and exports `revalidate = 300` for ISR.
- All data fetching happens server-side.

2) Centralized global content
- Uses `getGlobalContent()` to fetch global blocks once (approach, values, whyCda, culture gallery, contact forms, etc.).
- Stats & Numbers is already included there (via separate optional fetch merged in).

3) Homepage content fetch
- Fetches `homepageContentClean` via a server-side GraphQL call using `executeGraphQLQuery`.
- Continues to respect page-level toggles like `enableStatsImage`, `enableTechnologiesSlider`, etc.

4) News Carousel interactivity
- Created `NewsCarouselClient` (a small client component) to keep scrolling behavior.
- The server computes the list of `computedArticles` from the global News Carousel settings (manual/latest/category) and passes them to the client component.

5) Client component boundaries fixed
- `TechnologiesSlider` is explicitly marked as a client component (`'use client'`) so it can be safely rendered from the server page without boundary warnings.

Key Files
- src/app/page.js (server page)
- src/components/GlobalBlocks/NewsCarouselClient.jsx (new client component)
- src/components/GlobalBlocks/TechnologiesSlider.js (marked as client)

Why this approach
- The server component keeps heavy data fetching off the client and reduces hydration work.
- Client interactivity is scoped to a small component (NewsCarouselClient) that receives pre-computed props from the server.
- Global sections can now be changed in one place (the global content query and shared components), making it easier to keep consistent across the site.

Follow-ups
- About page refactor (same pattern as homepage): server component fetches, with small client subcomponents for interactivity.
- Optionally unify more global section usage via GlobalTailSections where appropriate.

