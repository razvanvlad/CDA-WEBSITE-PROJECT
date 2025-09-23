# Header Implementation (Zero-delay Primary Menu)

This document describes the current Header implementation in the CDA frontend and the related WordPress theme setup that enables fetching menus from WordPress via WPGraphQL with zero perceived load time on the primary navigation.

## Overview

The Header is split into two parts:

- Server wrapper (SSR) that fetches menu data at request/build time and passes it to the client UI. This ensures the top-bar primary navigation renders instantly with no “loading” flicker.
- Client UI that hydrates the server-rendered markup and only fetches in the background if initial props are missing.

Company (sidebar) and Primary (top bar) menus are both fetched from WordPress via WPGraphQL. Menu fetching prefers database IDs and falls back to name and a safety auto-resolve.

## File map (frontend)

- cda-frontend/src/components/Header.js
  Server component (wrapper). Fetches menus on the server using executeGraphQLQuery and renders the client UI with initial props.
- cda-frontend/src/components/HeaderClient.js
  Client component ("use client"). Receives initialPrimaryLinks and initialCompanyLinks and renders the header UI and the side menu.
- cda-frontend/src/lib/graphql-queries.js
  Contains executeGraphQLQuery() used by the server wrapper to call the GraphQL endpoint.

## File map (WordPress theme)

- wordpress-backend/wp-content/themes/cdatheme/functions.php
  - Registers the following nav menu locations: primary, footer, company.
  - Ensures the 'company' theme location is assigned to menu term ID 18 if it exists and hasn’t already been assigned (one-time safeguard).
- wordpress-backend/wp-content/themes/cdatheme/header.php and footer.php
  - Theme-side rendering (not used by the headless frontend), but they demonstrate location registration works.

## GraphQL endpoint & caching

- The frontend uses:
  - NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
- Server-side requests are made via executeGraphQLQuery().
- ISR/Cache window is controlled by NEXT_PUBLIC_GRAPHQL_REVALIDATE (seconds). Default in the repo is 300 seconds. Adjust as needed for faster menu updates.

## Fetch strategy & fallbacks

All menu fetches use the same strategy (in this order):
1) Fetch by database ID (preferred) — Primary: 4, Company: 18.
2) If empty, fetch by name — "primary" or "company".
3) If still empty, list all menus and auto-pick a menu by name using a regex:
   - Primary: /primary/i
   - Company: /company|sidebar/i

Links normalization:
- Prefer item.path (WPGraphQL Menus) then item.url.
- Internal links are used as-is (path/relative). External links pass through.
- Items are sorted by order when present.

## Zero-delay primary nav

- Header.js (server wrapper) performs SSR fetch and passes the links as props to HeaderClient.
- HeaderClient renders the top bar immediately from initialPrimaryLinks — no loading text, no flicker.
- Background client fetching only runs if a prop array was empty (edge cases). With normal configuration, it skips fetching entirely.

## Side menu behavior (Company ↔ Services)

- Side menu defaults to company menu (isServicesOpen=false).
- Clicking "Our Services" switches to the primary (services) list; clicking Back returns to company list.
- Company menu shows only items fetched from WordPress (no static fallbacks), ordered by the menu item order in WP Admin.

## WordPress theme setup

Location registration (functions.php):
- primary — Primary Menu
- footer — Footer Menu
- company — Company Menu (added)

Auto-assignment safeguard (functions.php):
- On init, if the 'company' theme location is not set, assign it to the menu term with ID 18 (if that menu exists).

This keeps WPGraphQL aware of the location and consistent across environments.

## Testing & debugging

### Manual checks
- Test page: http://localhost:3000/test-global-components-page
  - Menus (WPGraphQL) block prints:
    - byIdPrimary, byIdCompany, byIdFooter
    - menusList (databaseId + name for all menus)
- Expected: byIdPrimary (4) and byIdFooter (41) populated. byIdCompany (18) populated after creating the menu and assigning items.

### Headless checks (optional)
- With Puppeteer MCP:
  - Navigate to /test-global-components-page and assert byIdX fields.
  - Navigate to homepage, open side menu button (aria-label="Open side menu"), assert that company links are present by default, then click “Our Services” and assert primary links.

## Common pitfalls

- If company menu doesn’t show:
  - Ensure a menu exists in WP Admin with ID 18 (or at least name “company”).
  - Ensure the ‘company’ theme location exists (functions.php) and is assigned to a real menu; the auto-assignment helper assigns ID 18 if unset.
  - Check the test page menusList to confirm real database IDs.
- If primary or footer appear delayed:
  - Convert any residual client-only fetches to server-side (this has been done for Header; Footer still fetches client-side by design and can be upgraded to SSR if desired).

## Configuration knobs

- Menu IDs (current defaults used by SSR fetch):
  - Primary: 4
  - Company: 18
  - Footer: 41 (Footer currently tests ID 18 by request; switch back to 41 after validation.)
- Optional recommended env vars (not yet required):
  - NEXT_PUBLIC_MENU_PRIMARY_ID, NEXT_PUBLIC_MENU_COMPANY_ID, NEXT_PUBLIC_MENU_FOOTER_ID
  - If added, code can prefer env IDs and still fall back to name/auto-resolve.

## How to change menu behavior

- Default view of side menu: set the initial state isServicesOpen in HeaderClient (defaults to false to show company first).
- Ordering: adjust item order in WordPress Admin → Appearance → Menus → drag & drop to re-order.
- Add dropdowns/submenus: WIP — current UI renders a flat list. If nested items are needed, we can extend the render to walk children.

## Footer note

- Footer was temporarily switched to fetch the company menu (ID 18) to validate the company data path. You can revert to the real footer (ID 41) in src/components/Footer.js, or request an SSR conversion similar to Header for zero-delay links.

## Summary of changes that enabled zero-delay

- Split Header into SSR wrapper + client UI to render navigation instantly.
- Standardized menu fetching to database ID with name and auto-resolve fallbacks.
- Registered a dedicated ‘company’ menu location in the theme and safeguarded location assignment.
- Removed any loading placeholders from the primary nav render path.

## Quick checklist

- [ ] WP Admin → Appearance → Menus → Ensure menus exist:
  - primary (id 4)
  - footer (id 41)
  - company (id 18)
- [ ] WP Admin → Appearance → Menus → Manage Locations → Ensure primary/footer assigned
- [ ] Verify test page Menus (WPGraphQL) shows byIdPrimary/byIdFooter/byIdCompany with nodes
- [ ] Observe top bar renders instantly (no loading) and side menu defaults to company list
