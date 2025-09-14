`
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project scope
- Frontend for the CDA website built with Next.js (App Router) and TypeScript.
- Content and data come from a WordPress GraphQL endpoint; Apollo Client is set up for GraphQL, with some pages using direct fetch.
- Tailwind CSS v4 via PostCSS; ESLint (Next config) for linting.
- End-to-end/check scripts are included (Node.js and PowerShell) for smoke, SEO, and performance testing.

Commands you’ll use often
- Install deps (uses package-lock.json)
  - npm ci
  - If needed: npm install

- Development server
  - Default: npm run dev  (serves on http://localhost:3000)
  - Change port for tests (pick one as needed):
    - PowerShell (Windows): $env:PORT=3003; npm run dev
    - Bash (macOS/Linux): PORT=3003 npm run dev

- Lint
  - npm run lint

- Type check
  - npx tsc --noEmit

- Production build and serve
  - Build: npm run build
  - Start locally:
    - Default: npm start
    - Specific port:
      - PowerShell: $env:PORT=3000; npm start
      - Bash: PORT=3000 npm start
      - Or: npm start -- -p 3000

Tests and validation
Note: Several scripts assume a specific dev port. Start the dev server on the matching port first (see Development server above).

- Quick smoke test (curl-based simple suite)
  - npm test  (runs: node test-suite-simple.js)

- Comprehensive Node.js suite (recommended)
  - Expected server: http://localhost:3003
  - PowerShell: $env:PORT=3003; npm run dev
  - Then (in a second terminal): node test-suite-node.js

- Full-featured test suite
  - Expected server: http://localhost:3002
  - PowerShell: $env:PORT=3002; npm run dev
  - Then: node test-suite.js

- Windows PowerShell suite (parameterized)
  - pwsh -ExecutionPolicy Bypass -File test-suite.ps1 -BaseUrl http://localhost:3003 -GraphQLEndpoint http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
  - You can change -BaseUrl to match your chosen PORT.

- Performance tests
  - Expected server: http://localhost:3005
  - PowerShell: $env:PORT=3005; npm run dev
  - Then: node performance-test-suite.js

- SEO tests
  - Expected server: http://localhost:3005
  - PowerShell: $env:PORT=3005; npm run dev
  - Then: node seo-test-suite.js

- Running a single test (by suite)
  - Choose the specific script you want:
    - node test-suite-node.js            # end-to-end checks
    - node performance-test-suite.js     # performance only
    - node seo-test-suite.js             # SEO only
    - pwsh -File test-suite.ps1          # PowerShell variant with -BaseUrl/-GraphQLEndpoint

Environment configuration
- .env.local (example in .env.local.example) controls public site URL and related settings:
  - NEXT_PUBLIC_SITE_URL=...
- GraphQL endpoint used in code:
  - Preferred env var (used by src/lib/apollo-client.js): NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
  - If unset, the code falls back to: http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
  - Note: .env.local.example lists WORDPRESS_GRAPHQL_URL; prefer NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT to match the code.

High-level architecture
- App Router (src/app)
  - Root layout: src/app/layout.tsx
    - Sets global Metadata (title template, OpenGraph, Twitter, robots) via Next.js Metadata API.
    - Injects JSON-LD scripts for Organization and WebSite in <head>.
    - Applies global styles: src/app/globals.css and src/styles/global.css.
  - Route segments implement marketing pages (e.g., /services, /case-studies, /team, /about, /contact) and test pages.
  - Home page: src/app/page.js
    - Client component that fetches WordPress GraphQL data directly with fetch.
    - Normalizes “global content blocks” from WordPress (ACF-like) to the shape expected by UI components.
    - Toggles which blocks render based on WordPress flags.

- GraphQL data layer
  - Apollo Client setup: src/lib/apollo-client.js and src/lib/graphql/client.js
    - Reads NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT when set.
  - Centralized queries and helpers: src/lib/graphql-queries.ts
    - Query groups for Services, Case Studies, Team Members, plus utility helpers like getServiceBySlug(), getServiceSlugs(), etc.
    - Designed for reuse across routes/components.
  - Provider
    - src/components/providers/ApolloProvider.js wraps children with an ApolloProvider using the shared client.

- UI and composition
  - Shared UI: src/components
    - GlobalBlocks/… components render content blocks fed by WordPress (e.g., ValuesBlock, PhotoFrame, TechnologiesSlider, ServicesAccordion, LocationsImage).
    - Error handling primitives (ErrorBoundary, ErrorFallbacks) and misc components (Header, Footer, Pagination, SEO).
  - Styling
    - Tailwind CSS v4 via PostCSS plugin (@tailwindcss/postcss).
    - Global styles at src/styles/global.css in addition to App-level globals.

- Linting & TS
  - ESLint flat config (eslint.config.mjs) extending next/core-web-vitals and next/typescript.
  - TypeScript is strict and uses path alias:
    - '@/*' => './src/*' (see tsconfig.json)

- Build config
  - next.config.ts currently minimal; PostCSS config at postcss.config.mjs.
  - Dev uses Next’s Turbopack via npm run dev.

Notes for agents
- README.md is standard Next.js boilerplate; the key deltas for this repo are the GraphQL integration and the custom Node/PowerShell test suites above.
- No CLAUDE, Cursor, or Copilot rule files were found at the time of writing.

