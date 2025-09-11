# Test Run Report — Frontend and Backend

Last updated: 2025-09-11 05:25:25 +03:00

Summary
- Navigation successful across pages: Home, Services, About, Knowledge Hub, Case Studies (all 200 responses). 
- Fixed: next/image invalid src prop errors by adding images.remotePatterns for localhost WP uploads in next.config.js.
- Fixed: Footer link normalization to match Header (handles base path, absolute URLs, index.php). 
- No SSR/runtime errors seen after fixes; warning remains about metadataBase not set in Next.js metadata (non-blocking).

Load Times (observed from dev logs)
- / (Home): ~190–220 ms
- /services: initial ~4.8–4.9 s (GraphQL + image-heavy); subsequent ~4.9 s
- /about: ~175 ms
- /knowledge-hub: ~1.3–1.8 s
- /case-studies: ~2.5–2.9 s
- /services/ai: ~3.9 s (first render)
- Favicon requests: ~300–390 ms (normal)

Key Errors and Warnings
- 404 GET /@vite/client persists (likely a stray reference in dev tools or legacy code; not functional impact under Next dev server).
- Warning: metadataBase property in metadata export not set; Next falls back to http://localhost:3000. Consider setting in app/layout metadata.

Navigation Validation
- Home, Services, About, Knowledge Hub, Case Studies pages render without 500s now.
- Header and Footer links tested across primary nav; no broken links observed in this pass.

Recent Fixes Implemented
- next.config.js: added images.remotePatterns to allow localhost WordPress uploads.
- Footer.js: unified resolveHref with Header behavior (normalizePath with base path, absolute URLs, index.php pruning).

Performance Notes and Opportunities
- Services page load (~4.9 s) suggests heavy data/images. Consider:
  - Enable Next.js image optimization for remote images (already allowed); ensure correct sizes and priority on LCP images.
  - Cache WP GraphQL requests on server (revalidate or SSG for stable content).
  - Consider code-splitting for heavy components.
- Knowledge Hub (~1.3–1.8 s) and Case Studies (~2.5–2.9 s) reasonable in dev; verify in prod build.

Next Steps
- Add metadataBase in app/(root)/layout.tsx or equivalent metadata export to remove warning.
- Investigate and remove any references to /@vite/client.
- Add simple timers (performance marks) to capture client-side TTI/LCP metrics or run Lighthouse on prod build.
- Consider caching layers for WP GraphQL (Incremental Static Regeneration or edge cache) for Services and dynamic pages.

Artifacts
- Screenshots captured during this run (Home, Services, About, Knowledge Hub, Case Studies) via automation.

Changes Touched
- cda-frontend/next.config.js
- cda-frontend/src/components/Footer.js