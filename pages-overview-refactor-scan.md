# Pages Overview & Refactor Scan

This document lists the current implementation patterns across pages and post types, and proposes refactors for a cleaner, more consistent codebase.

Legend
- Server: Page is a Next.js Server Component (async function) with server-side data fetching
- Client: Page (or key sections) use client-side fetching/useEffect
- Tail: Uses GlobalTailSections (Case Studies, Stats & Numbers, Approach) for consistent global tail
- ISR: Static generation with revalidate

Summary Table
- Home (/)
  - Status: Server + ISR
  - Data: getGlobalContent + homepageContentClean (GraphQL)
  - Interactivity: NewsCarouselClient (client subcomponent)
  - Tail: Not appended (per-page composition with toggles)
  - Notes: TechnologiesSlider marked as client

- About (/about)
  - Status: Server + ISR
  - Data: getGlobalContent + aboutUsContent (GraphQL)
  - Interactivity: CultureGallerySlider (client, now hardened)
  - Tail: Not appended (per-page composition with toggles)

- Case Studies (Archive /case-studies)
  - Status: Server (existing); renders a client CaseStudiesClient
  - Tail: Not used on archive

- Case Study (Single /case-studies/[slug])
  - Status: Server + SSG + ISR
  - Data: Robust fetch by URI/slug with core fallbacks
  - Tail: YES, via GlobalTailSections
  - Notes: generateStaticParams for pre-rendered slugs

- Services (Archive /services)
  - Status: Server
  - Data: getServicesWithPagination and custom GraphQLs
  - Tail: No (per-page composition)

- Service (Single /services/[slug])
  - Status: Server (dynamic)
  - Data: getServiceBySlug (plus enhanced fields where available)
  - Tail: Not currently

- Team (Archive /team)
  - Status: Server + ISR
  - Data: getTeamMembersCoreWithPagination
  - Tail: No

- Team Member (Single /team/[slug])
  - Status: Server + ISR
  - Data: core-only team member by slug
  - Tail: No

- Policies (Archive /policies)
  - Status: Server + ISR
  - Data: policies core fields with pagination fetch
  - Tail: No

- Policy (Single /policies/[slug])
  - Status: Server + ISR
  - Data: policy by slug (core fields)
  - Tail: No

- Technologies (/technologies)
  - Status: Server + ISR
  - Data: getTechnologiesWithPagination
  - Tail: YES, GlobalTailSections with enableStats={false}
  - Notes: ServicesSlider client component used on this page

- Jobs (Archive /jobs)
  - Status: Server (force-dynamic)
  - Data: getJobListingsWithPagination fallback to simple; JobListingsClient for rendering
  - Tail: No

- Job (Single /jobs/[slug])
  - Status: Server + ISR
  - Data: job listing by slug (core + ACF where available)
  - Tail: No

- News Article (/news-article/[slug])
  - Status: Server
  - Data: custom fetch by slug (GraphQL)
  - Tail: Uses per-page blocks (PhotoFrame + News Carousel), not GlobalTailSections

- News (/news/[slug])
  - Status: Server (fallback page)
  - Data: fetchBlogPostBySlug
  - Tail: Not used

- Other static pages (contact, roi, terms-conditions, knowledge-hub, 404)
  - Status: Server
  - Tail: Not used

Refactor Proposals
1) Consistent global tail via GlobalTailSections
- Add GlobalTailSections to the end of key content pages where it makes sense: Services (archive), Service (single), Team (archive), Team Member (single), Policies (archive + single), and News pages.
- Benefit: uniform display of Case Studies, Stats & Numbers, and Approach, controlled via enableStats prop as needed.

2) Server page convergence
- Ensure all major pages use server-side data fetching via helpers in src/lib/graphql-queries.js.
- Keep interactivity in small "use client" subcomponents (e.g., accordions, sliders) that accept precomputed props from the server.

3) GraphQL resilience
- Use core-only fallbacks where ACF fields may not exist (pattern used for case studies). Apply the same strategy for Services (single) and Team Members if their ACF/SEO fields are optional.

4) Component path normalization
- Normalize GlobalBlocks import casing and files (we currently have src/components/GlobalBlocks/* and src/components/globalblocks/*).
- Proposal: Move all global blocks into src/components/GlobalBlocks with consistent case and update imports.

5) Toggle-driven rendering audit
- Continue to respect per-page toggles (e.g., enableStatsImage) but consider a global default for the Tail (enabled unless disabled by page-level props). Keeps UX consistent and reduces conditional rendering boilerplate in pages.

6) Remove legacy client fetch patterns
- The Homepage and About refactor eliminated useEffect-based fetching; scan for any remaining pages using client fetching (e.g., older pages) and convert them to server fetching.

7) Clean-up plan
- Remove commented code and leftover fragments uncovered during refactors (e.g., the old News Carousel markup that remained in the homepage before cleanup).
- Standardize utilities in src/lib/graphql-queries.js, grouping helpers per post type and reusing core fallbacks across types.

Detailed Page Notes
- Home (/): Good. Keep NewsCarouselClient and consider appending GlobalTailSections if you want uniform footers everywhere.
- About (/about): Good. CultureGallerySlider hardened. Optional: add GlobalTailSections at end.
- Case Studies (single): Good pattern to follow elsewhere (URI/slug fallback + SSG+ISR + Tail).
- Services (archive/single): Candidate for tail, and to add core fallbacks where querying enhanced fields.
- Team (archive/single): Candidate for tail (if you want global sections consistently), already using core-only fields.
- Policies (archive/single): Candidate for tail.
- Technologies: Already using tail (with stats disabled), pattern OK.
- Jobs: Marked force-dynamic to avoid export issues while keeping current job client renderer. Could be refactored later to server-render the list and keep client interactions tiny.

Next Steps (if you approve)
- Implement GlobalTailSections on Service single and archive
- Implement GlobalTailSections on Team and Policy pages
- Normalize global blocks path casing (single directory) and update imports
- Add core-only fallback fetchers where needed (services, team member, policy) to avoid schema breakage
- Remove any leftover client-only fetch remnants

