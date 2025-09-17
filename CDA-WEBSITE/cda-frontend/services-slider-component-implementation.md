# Services Slider Component – Implementation Overview

This document explains how the reusable Services Slider was implemented, why it works reliably with your setup, and how to include it on any page.

## Goals
- Provide a culture-style horizontal slider populated from the Services CPT
- Keep it independent of WordPress admin (no ACF required)
- Reusable across pages (drop-in component)
- Render reliably regardless of optional ACF fields

## Component
- File: `src/components/GlobalBlocks/ServicesSlider.jsx`
- Type: Client component (`"use client"`)
- Data source: GraphQL (Services CPT) via a core-only query
- Features:
  - Responsive (4 per view desktop, 1 per view mobile)
  - Arrow navigation with wrap-around
  - Renders service featured image and title linking to `/services/[slug]`
  - Props: `title`, `subtitle`, `first` (default 12)

### Why a core-only query?
Some ACF/SEO fields are not guaranteed to be available on the client. The slider uses a safe, minimal query that only asks for:
- `id`, `title`, `slug`, `date`, `excerpt`, `featuredImage { node { sourceUrl altText } }`
This prevents schema errors and ensures the slider renders reliably.

## GraphQL
- File: `src/lib/graphql-queries.js`
- Added:
  - `GET_SERVICES_CORE_WITH_PAGINATION`
  - Helper `getServicesCoreWithPagination(variables)`
- Used by `ServicesSlider.jsx`

## Usage
Import and render on any page:

```js path=null start=null
import ServicesSlider from '@/components/GlobalBlocks/ServicesSlider.jsx'

<ServicesSlider
  title="You May Also Be Interested In"
  subtitle="Our Services"
  first={12}
/>
```

## Where it’s included now
- Technologies page: `src/app/technologies/page.js`
  - Inserted: `<ServicesSlider />` above the global tail sections
- Service detail page: `src/app/services/[slug]/page.js`
  - Inserted `<ServicesSlider />` near the end of the main content
- Team member page: `src/app/team/[slug]/page.js`
  - Inserted slider at the end of the article (lazy `require()` inline to avoid forcing the page into client mode)

## Styling & Behavior
- The slider is contained to its own section. It does not depend on external global blocks.
- Uses `next/image` with `fill` for responsive images.
- Navigation arrows appear only when there are more slides than visible per view.

## Troubleshooting
- Slider shows empty: ensure published Services exist and have featured images.
- Build issues on client pages: ensure the services slider is a client component (it is marked with `"use client"`).
- Slow images: confirm Next image remotePatterns include your WordPress uploads host.

## Extending
- To show only services by type, update the query in `GET_SERVICES_CORE_WITH_PAGINATION` with a `where` filter.
- To change slides-per-view, tweak `perView` in the component.
- To add badges or short excerpts, map `serviceTypes` or `excerpt` from the query into the card.

