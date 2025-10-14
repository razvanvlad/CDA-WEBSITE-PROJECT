# Policies Post Type – Implementation and Integration Notes

This document explains how the Policies post type was added, why policies initially didn’t render on the frontend, the queries used to inspect the schema, and how we made the pages work using the simplest, schema-safe approach.

## What we added

- WordPress: A new custom post type `policies` (exposed via WPGraphQL)
- WordPress: ACF field group for Policies (optional, GraphQL-enabled), but not required for the initial working version
- Frontend: GraphQL queries and pages for policies list and individual policy
- Frontend: Fixed a Server Component build error (styled-jsx) and a missing `return` in the page

## WordPress backend (mu-plugin)

Locations (relative to wordpress-backend):
- Post type registration: `wp-content/mu-plugins/cda-cms/post-types/policies.php`
- Loader update: `wp-content/mu-plugins/cda-cms.php`
  - Added `'policies'` to the `$post_types` array so the file is loaded
- ACF fields file: `wp-content/mu-plugins/cda-cms/acf-fields/policies-fields.php`
  - Group: “Policy Details”
  - Subfields (GraphQL-enabled): Policy Title, Policy Description, Last Updated, Effective Date
  - We mapped internal ACF names to GraphQL field names via `graphql_field_name` (e.g., `policy_title` -> `title`) to avoid collisions with core WP fields

Notes:
- ACF GraphQL exposure depends on WPGraphQL + WPGraphQL ACF plugins. If those aren’t active, ACF fields won’t be in the schema. That’s why the initial queries asking for `policyFields` failed on your machine.
- The post type was registered with `show_in_graphql: true`, `graphql_single_name: 'policy'`, `graphql_plural_name: 'policies'`.

## Why policies didn’t load at first

The initial frontend queries asked for `policyFields { title description lastUpdated effectiveDate }` and `seo { ... }`. Your schema didn’t expose those fields (likely because the GraphQL ACF layer wasn’t available yet), so WPGraphQL returned errors and the frontend showed empty/error states.

We fixed this by querying only core WordPress fields (title, content, excerpt, date, featuredImage) which are always present when the post type is in GraphQL.

## Queries to inspect the schema

Use these to see exactly what’s in your runtime schema.

1) Introspect the Policy type
```graphql path=null start=null
query IntrospectPolicyType {
  __type(name: "Policy") {
    name
    fields {
      name
      type {
        kind
        name
        ofType { kind name ofType { kind name } }
      }
    }
  }
}
```

2) Introspect PolicyFields (only if ACF GraphQL is enabled)
```graphql path=null start=null
query IntrospectPolicyFieldsType {
  __type(name: "PolicyFields") {
    name
    fields {
      name
      type {
        kind
        name
        ofType { kind name ofType { kind name } }
      }
    }
  }
}
```

## Queries used by the frontend (schema-safe)

List page (no ACF):
```graphql path=null start=null
query PoliciesCore($first: Int = 50) {
  policies(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      id
      databaseId
      slug
      title
      date
      modified
      excerpt
    }
  }
}
```

Single policy by slug (no ACF):
```graphql path=null start=null
query PolicyCoreBySlug($slug: ID!) {
  policy(id: $slug, idType: SLUG) {
    id
    databaseId
    slug
    title
    date
    modified
    excerpt
    content
    featuredImage {
      node { sourceUrl altText }
    }
  }
}
```

PowerShell example to test locally:
```powershell path=null start=null
$body = @{
  query = @"
query PolicyCoreBySlug($slug: ID!) {
  policy(id: $slug, idType: SLUG) {
    id
    slug
    title
    date
    modified
    excerpt
    content
    featuredImage { node { sourceUrl altText } }
  }
}
"@
  variables = @{ slug = "privacy-policy" }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql" `
  -Method POST -ContentType "application/json" -Body $body |
  Select-Object -ExpandProperty Content
```

## Frontend updates

Files (relative to cda-frontend):
- Queries: `src/lib/graphql-queries.js`
  - Added policies queries (core fields only) and utilities: `getPoliciesWithPagination`, `getPolicyBySlug`, `getPolicySlugs`
- List page: `src/app/policies/page.js`
  - Server Component fetching policies with pagination
  - Renders title/excerpt; removed reliance on missing ACF fields
- Detail page: `src/app/policies/[slug]/page.js`
  - Server Component; `generateStaticParams()` for SSG; `generateMetadata()` built from core fields
  - Fixed a syntax error (missing `return` before JSX)
  - Removed styled-jsx (client-only) in favor of Tailwind/global CSS
- Global styles: `src/styles/global.css`
  - Added a `.policy-content` ruleset for headings, lists, links, tables, etc.

What changed to fix the build:
- The dynamic policy page removed `styled-jsx` (only works in Client Components) and used global/Tailwind classes instead.
- Added a missing `return` to the page component so it returns JSX correctly.
- Trimmed queries to schema-safe core fields.

## How to verify end-to-end

1) In WordPress Admin
- Ensure the “Policies” post type appears in the menu.
- Publish at least one policy (e.g., “Privacy Policy”) so it has a public permalink.

2) GraphQL
- POST to `.../graphql` with `PoliciesCore` to verify your policy appears.
- POST `PolicyCoreBySlug` with the policy slug to confirm content comes back.

3) Frontend
- Visit `/policies` – the list should render your policy.
- Visit `/policies/<your-slug>` – the detail page should render, with content and (optional) featured image.

## Optional: Using ACF fields on the frontend

If you want to render the ACF fields on the page:
- First run the introspection query for `PolicyFields` to see the exact field names your schema exposes.
- Update the policy queries to include `policyFields { ... }` with the real subfield names.
- Then map those fields in `src/app/policies/page.js` and `src/app/policies/[slug]/page.js`.

Tip: The ACF fields were created with `graphql_field_name` set to `title`, `description`, `lastUpdated`, `effectiveDate`. Depending on your plugin setup, WPGraphQL may expose them under `policyFields { title description lastUpdated effectiveDate }`. If not, introspect to see the actual names and adjust the queries.

## Troubleshooting

- Still seeing empty list?
  - Confirm at least one policy post is published and not in draft.
  - Run `PoliciesCore` directly against the GraphQL endpoint to confirm data is present.
- GraphQL errors about unknown fields?
  - Remove ACF-dependent fields and query only core fields (like above).
  - Ensure WPGraphQL and (optionally) WPGraphQL ACF plugins are active.
- Images not loading?
  - Make sure `next.config.js` image `remotePatterns` allow your WordPress uploads domain.

## Summary

- We added a Policies post type and wired it into WPGraphQL.
- We made the frontend pages work reliably using core WordPress fields only.
- We provided introspection + test queries to validate the schema and evolve to ACF fields later if desired.
- Build errors were fixed by removing client-only styling from a Server Component and adding the missing return.

