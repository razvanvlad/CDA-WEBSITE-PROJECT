# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **headless WordPress + Next.js** website for CDA. The architecture consists of:
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS 4, Apollo Client
- **Backend**: WordPress with WPGraphQL, ACF Pro, and custom post types
- **Data Flow**: WordPress exposes content via GraphQL, Next.js consumes it

## Development Commands

### Frontend (Next.js)
All commands run from `CDA-WEBSITE/cda-frontend/`:

```bash
npm run dev                # Start dev server on port 3000 (with Turbopack)
npm run dev:3001           # Start dev server on port 3001
npm run build              # Production build
npm run start              # Start production server
npm run start:3001         # Start production server on port 3001
npm run lint               # Run ESLint
npm run test               # Run simple test suite
npm run test:full          # Run full test suite
```

### WordPress Backend
- Local development uses XAMPP: `http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend`
- WordPress admin: `/wp-admin/`
- GraphQL endpoint: `/graphql`

## Architecture & Code Organization

### Frontend Structure (`CDA-WEBSITE/cda-frontend/src/`)

**App Router Pages** (`app/`):
- Pages use Next.js 15 App Router conventions
- Dynamic routes use `[slug]` folders
- Each page has `page.js` for server components
- Client-side logic in separate `*Client.jsx` files (e.g., `ServicesClient.jsx`)

**Components** (`components/`):
- `GlobalBlocks/` - Reusable content blocks managed in WordPress Global Options (ApproachBlock, ValuesBlock, ServicesAccordion, TechnologiesSlider, NewsCarousel, WhyCdaBlock, etc.)
- `Sections/` - Page-specific sections (ContactForm, ServicesProcess, ServicesStats)
- `Header.js`, `Footer.js` - Site layout components
- `SEO.js` - SEO meta tags component

**GraphQL** (`lib/`):
- `graphql-queries.js` - **ALL GraphQL queries centralized here**
- `apollo-client.js` - Apollo Client configuration
- `graphql/` - Additional GraphQL utilities

### Backend Structure (`CDA-WEBSITE/wordpress-backend/`)

**Custom Plugin** (`wp-content/mu-plugins/cda-cms/`):
- `post-types/` - Custom post type definitions (services, case-studies, team-members, job-listings, blog-posts, technologies, policies)
- `acf-fields/` - ACF field group definitions
- `taxonomies/` - Custom taxonomies (blog-categories, departments, job-types, project-types, service-types)
- `includes/graphql-setup.php` - GraphQL configuration

## Custom Post Types

WordPress exposes these custom post types via GraphQL:

1. **Services** (`services`) - Business services with hero sections, features, process steps, statistics
2. **Case Studies** (`caseStudies`) - Client project portfolios with challenge/solution/results
3. **Team Members** (`teamMembers`) - Team profiles with skills, bios, social links
4. **Job Listings** (`jobListings`) - Career opportunities with requirements and qualifications
5. **Blog Posts** (`blogPosts`) - News articles and blog content
6. **Technologies** (`technologies`) - Technology logos and descriptions for sliders
7. **Policies** (`policies`) - Legal pages (privacy policy, terms, etc.)

**Important**: GraphQL names use camelCase (e.g., `caseStudies`, `jobListings`, `teamMembers`)

## Data Fetching Patterns

### Static Generation with ISR
Most pages use static generation with revalidation:

```javascript
export const revalidate = 300; // 5 minutes in dev, 1 hour in production

export async function generateStaticParams() {
  // Fetch all slugs at build time
}

export default async function Page({ params }) {
  // Fetch data server-side
}
```

### GraphQL Query Pattern
1. All queries defined in `src/lib/graphql-queries.js`
2. Use Apollo Client for data fetching
3. Server components fetch on server, client components use `useQuery`

```javascript
import { query } from '@apollo/client';
import client from '@/lib/apollo-client';
import { GET_SERVICE_BY_SLUG } from '@/lib/graphql-queries';

const { data } = await client.query({
  query: GET_SERVICE_BY_SLUG,
  variables: { slug }
});
```

### Global Content Blocks
WordPress Global Options store reusable content blocks. These are fetched via `GET_GLOBAL_CONTENT` query and include:
- Approach Block (company methodology)
- Values Block (core values)
- Services Accordion
- Technologies Slider
- Newsletter Signup
- News Carousel
- Why CDA Block

Toggle fields (`showApproach`, `showValues`, etc.) control which blocks appear per page.

## Environment Configuration

The project uses **automatic environment detection** in `next.config.js`:

- **Development**: Auto-detects localhost WordPress
- **Production**: Uses WP Engine WordPress (cdanewwebsite.wpenginepowered.com)
- **Vercel**: Auto-detects Vercel deployment URL

**Environment Variables** (set in `.env.local` or Vercel dashboard):
```bash
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: The config automatically constructs these if not set, so you usually don't need to set them manually.

## ACF & GraphQL Integration

### Querying ACF Fields
- ACF field groups have `graphql_field_name` set in their configuration
- Use camelCase for field names in queries
- Flexible content uses `fieldGroupName` to determine type
- Repeater fields return arrays

**Example**: See `ACF-GraphQL-Query-Construction-Guide.md` for detailed patterns.

### Adding New ACF Fields
1. Create/modify field group in WordPress admin
2. Set "Show in GraphQL" to Yes
3. Set GraphQL field name (camelCase)
4. Add query to `src/lib/graphql-queries.js`
5. Update TypeScript types if needed

## Image Optimization

Next.js Image component is configured for WordPress uploads:

```javascript
import Image from 'next/image';

<Image
  src={wpImageUrl}
  alt="Description"
  width={800}
  height={600}
  priority={false} // Set true for above-fold images
/>
```

**Configured domains**:
- `http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/wp-content/uploads/**`
- `https://cdanewwebsite.wpenginepowered.com/wp-content/uploads/**`

## Common Development Tasks

### Adding a New Page
1. Create folder in `src/app/[page-name]/`
2. Add `page.js` for server component
3. Add `[page-name]Client.jsx` if client-side logic needed
4. Create GraphQL query in `src/lib/graphql-queries.js`
5. Add route to `next.config.js` redirects/rewrites if needed

### Adding a New Component
1. Determine if it's a GlobalBlock or Section
2. Create in appropriate folder
3. If WordPress-managed content, add ACF fields in WordPress
4. Add GraphQL query to fetch data
5. Import and use in pages

### Modifying GraphQL Queries
1. **Always** edit `src/lib/graphql-queries.js`
2. Test query in WordPress GraphQL IDE first (`/graphql`)
3. Ensure ACF fields have "Show in GraphQL" enabled
4. Use proper GraphQL naming (camelCase for fields)

### Debugging GraphQL Issues
1. Check WordPress GraphQL IDE: `http://localhost/.../wordpress-backend/graphql`
2. Verify ACF field is exposed to GraphQL (check field group settings)
3. Check query in `graphql-queries.js` matches schema
4. Review `next.config.js` debug output in terminal
5. Check Apollo Client errors in browser console

## Key Implementation Details

### Homepage Architecture
- Fetches global content blocks from WordPress Global Options
- Uses toggle system to enable/disable blocks per page
- Server-rendered for SEO
- Global blocks are reusable across pages

### Services Pages Pattern
- Overview page: `/services` lists all services with filtering
- Individual service: `/services/[slug]` uses `generateStaticParams()`
- Rich content: hero, statistics, features, process steps, case studies
- Includes global blocks (Values, Approach, Newsletter)

### Case Studies Pattern
- Fetches 100 items for client-side filtering (performance optimization)
- Client-side search and filter by project type
- Uses `CaseStudiesClient.jsx` for interactivity
- Individual case study shows project overview, challenge, solution, results

### Navigation & Routing
- Header fetches menu from WordPress
- Redirects configured in `next.config.js`:
  - `/eCommerce` → `/services/ecommerce`
  - `/sectors` → `/services`
  - `/news-article/:slug` → `/news/:slug`
- Rewrites proxy GraphQL requests

## Testing & Quality

- ESLint configured but ignored during builds (`ignoreDuringBuilds: true`)
- Test suites available: `npm run test` and `npm run test:full`
- Use TypeScript for type safety (components can be `.js` or `.tsx`)

## Deployment

### Frontend (Vercel)
- Automatic deployments from Git
- Set environment variables in Vercel dashboard
- Build command: `npm run build`
- Framework: Next.js

### Backend (WP Engine)
- Managed WordPress hosting
- GraphQL endpoint: `https://cdanewwebsite.wpenginepowered.com/graphql`
- ACF Pro and WPGraphQL plugins required

## Important Notes

- **GraphQL queries are centralized** - always check `src/lib/graphql-queries.js` first
- **Never commit `.env.local`** - it contains local configuration
- **WordPress is the source of truth** - all content managed there
- **Use Server Components by default** - only use Client Components when needed (interactivity, hooks)
- **Image optimization is automatic** - always use Next.js `<Image>` component
- **Global blocks are reusable** - don't duplicate content, use WordPress Global Options
- **ACF fields must be GraphQL-enabled** - check "Show in GraphQL" in WordPress admin
- The `.windsurfrules` file contains UI design guidelines but is not applicable to this project's current workflow

### ADDED .md #1

# Project Operator Guide for Claude

## Mission
Implement the pixel-perfect fixes in `/spec/cda3/ISSUE.md` using the reference images in `/spec/cda3/images/`. Keep diffs tiny and verifiable.

## Guardrails
- Allowed edits: `/app`, `/components`, `/pages`, `/styles` (adjust if project differs).
- Do not change build/infra/CI or secrets.
- Always **show diffs first**. Ask before running commands or updating snapshots.

## Fonts & Visual Accuracy
- Use **Inter** (400, 600) and **Poppins** (700) — self-host WOFF2.
- Normalize `<h2>` weight/leading so visual size matches spec exactly (no browser default inflation).
- Icon sizing: the “View Our Services” arrow must be **14×14px**.
- Vertical label “Start a project” reads bottom→top (`writing-mode: vertical-rl; transform: rotate(180deg)`).

## Workflow
1. Read `/spec/cda3/ISSUE.md` and open `/spec/cda3/images`.
2. Propose a **minimal plan** by section (Hero, Your digital partner, Missing block, Buttons & services, Header).
3. Present the **first small diff (≤60 lines)** that yields a visible improvement with zero regressions.
4. After approval, run the standard checks, then proceed section-by-section.
5. Add/adjust tests only for impacted components. Ask before snapshot updates.

## Commands (prefer these)
- `npm ci`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test` or `npm run test:fast`
- `npm run test:ui:snap` (Playwright image snapshots)

## Test Plan
- Unit tests pass.
- Visual check against `/spec/cda3/images` for: **Hero**, **Your digital partner**, **Services header**.
- 2–3 Playwright snapshots for those sections; update snapshots only after I approve diffs.

## Commit Style
Small, focused commits, e.g.:
- `fix(hero): Inter 18px body + tighten CTA spacing`
- `fix(services): arrow 14x14; button size per spec`
- `chore(h2): normalize weight/leading to match 38px visual`

## Tools (MCP) you may use
- **Markitdown**: convert PDF→MD/HTML for quick grep.
- **Playwright MCP**: spin up a headless browser for UI checks.
- **Chrome DevTools MCP**: attach to a running Chrome (9222) for live DOM/CSS inspection.
- **GitHub MCP**: repo info / issues (if configured with token).
- **Serena**: semantic code retrieval for this workspace.
- **Context7**: fetch framework docs w/ versions.

### Tool usage examples (ask before using)
- “Use *Markitdown* to convert `/spec/cda3/ISSUE.md` to HTML and summarize acceptance criteria.”
- “Use *Serena* to find all components rendering the hero CTA.”
- “Use *Playwright MCP* to visit `http://localhost:3000` and screenshot `/#hero`.”
- “Attach *Chrome DevTools MCP* to localhost:9222, get computed styles for `.services h2`.”

## Stop Conditions
- >2 test failures in a row.
- Edit outside allowed paths.
- Ambiguity in spec → ask with a proposed assumption.

## Dev Server Policy
- Use a dedicated terminal named **dev** to run the app.
- Command to start: `npm run dev`
- Do **not** kill the dev terminal unless I say so.
- Before starting, check if the app is already up at http://localhost:3000.
- If down, start the server and poll http://localhost:3000 until it returns 200 (max 60s).
- After the server is up, use Chrome DevTools MCP or Playwright MCP to inspect/screenshot.
- Never install packages or create files for this; use built-in tools only.

## Allowed Commands
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test` / `npm run test:fast`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` (port check)

