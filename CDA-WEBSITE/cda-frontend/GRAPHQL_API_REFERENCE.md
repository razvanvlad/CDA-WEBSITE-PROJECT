# GraphQL API Reference

## Metadata
- **Status**: ACTIVE
- **Category**: GUIDE
- **Last Modified**: November 14, 2025
- **Last Verified**: November 14, 2025
- **Related Files**: PROJECT-OVERVIEW.md
- **Code Dependencies**: `src/lib/graphql-queries.js`, `src/lib/apollo-client.js`

---

## Overview

This document provides a comprehensive reference for all GraphQL queries used in the CDA Website project. The WordPress backend exposes data via WPGraphQL, and this frontend consumes that data through Apollo Client.

**GraphQL Endpoint:**
- **Local**: `http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql`
- **Production**: `https://cdanewwebsite.wpenginepowered.com/graphql`

---

## Table of Contents

1. [Services Queries](#services-queries)
2. [Case Studies Queries](#case-studies-queries)
3. [Team Members Queries](#team-members-queries)
4. [Job Listings Queries](#job-listings-queries)
5. [Blog/News Queries](#blognews-queries)
6. [Policies Queries](#policies-queries)
7. [Technologies Queries](#technologies-queries)
8. [Global Content Queries](#global-content-queries)
9. [Helper Functions](#helper-functions)
10. [Error Handling](#error-handling)

---

## Services Queries

### Get All Services

**Query Name**: `GET_ALL_SERVICES`

**Purpose**: Fetch all services with complete data for the services listing page.

**Variables**:
- `first` (Int): Number of services to fetch (default: 100)
- `after` (String, optional): Cursor for pagination

**GraphQL Query**:
```graphql
query GetAllServices($first: Int = 100, $after: String) {
  services(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      databaseId
      slug
      title
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      serviceTypes {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

**Helper Function**:
```javascript
import { GET_ALL_SERVICES } from '@/lib/graphql-queries';

const { data } = await apolloClient.query({
  query: GET_ALL_SERVICES,
  variables: { first: 100 }
});

const services = data?.services?.nodes || [];
```

**Response Structure**:
```typescript
{
  services: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: Array<{
      id: string;
      databaseId: number;
      slug: string;
      title: string;
      excerpt: string;
      date: string;
      featuredImage: {
        node: {
          sourceUrl: string;
          altText: string;
        }
      };
      serviceTypes: {
        nodes: Array<{
          name: string;
          slug: string;
        }>
      };
    }>;
  }
}
```

---

### Get Service by Slug

**Query Name**: `GET_SERVICE_BY_SLUG`

**Purpose**: Fetch detailed information for a single service page.

**Variables**:
- `slug` (ID!): Service slug

**GraphQL Query**:
```graphql
query GetServiceBySlug($slug: ID!) {
  service(id: $slug, idType: SLUG) {
    id
    databaseId
    slug
    title
    content
    excerpt
    date
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    serviceFields {
      heroSection {
        title
        subtitle
        description
        ctaText
        ctaLink
        backgroundImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      bulletPoints
      statistics {
        number
        label
        color
      }
      features {
        icon {
          node {
            sourceUrl
            altText
          }
        }
        title
        description
      }
      processSteps {
        stepNumber
        title
        description
      }
    }
    seo {
      title
      metaDesc
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
    }
  }
}
```

**Usage**:
```javascript
const { data } = await apolloClient.query({
  query: GET_SERVICE_BY_SLUG,
  variables: { slug: 'ecommerce-development' }
});

const service = data?.service;
```

---

### Get Service Slugs (for Static Generation)

**Query Name**: `GET_SERVICE_SLUGS`

**Purpose**: Get all service slugs for `generateStaticParams()`.

**GraphQL Query**:
```graphql
query GetServiceSlugs {
  services(first: 100) {
    nodes {
      slug
    }
  }
}
```

**Usage in generateStaticParams()**:
```javascript
export async function generateStaticParams() {
  const { data } = await apolloClient.query({
    query: GET_SERVICE_SLUGS
  });

  return data.services.nodes.map(service => ({
    slug: service.slug
  }));
}
```

---

## Case Studies Queries

### Get All Case Studies

**Query Name**: `GET_ALL_CASE_STUDIES`

**Variables**:
- `first` (Int): Number to fetch (default: 100 for client-side filtering)

**GraphQL Query**:
```graphql
query GetAllCaseStudies($first: Int = 100) {
  caseStudies(first: $first) {
    nodes {
      id
      databaseId
      slug
      title
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      caseStudyFields {
        clientName
        clientLogo {
          node {
            sourceUrl
            altText
          }
        }
        projectUrl
        completionDate
        featured
      }
      projectTypes {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

---

### Get Case Study by Slug

**Query Name**: `GET_CASE_STUDY_BY_SLUG`

**Variables**:
- `slug` (ID!): Case study slug

**GraphQL Query**:
```graphql
query GetCaseStudyBySlug($slug: ID!) {
  caseStudy(id: $slug, idType: SLUG) {
    id
    slug
    title
    content
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    caseStudyFields {
      clientName
      clientLogo {
        node {
          sourceUrl
          altText
        }
      }
      projectUrl
      completionDate
      challenge
      solution
      results
      featured
    }
    projectTypes {
      nodes {
        name
        slug
      }
    }
    seo {
      title
      metaDesc
    }
  }
}
```

---

## Team Members Queries

### Get All Team Members

**Query Name**: `GET_ALL_TEAM_MEMBERS`

**GraphQL Query**:
```graphql
query GetAllTeamMembers($first: Int = 100) {
  teamMembers(first: $first) {
    nodes {
      id
      databaseId
      slug
      title
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      teamMemberFields {
        jobTitle
        shortBio
        email
        linkedinUrl
        publicProfile
        featured
      }
      departments {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

---

### Get Team Member by Slug

**Query Name**: `GET_TEAM_MEMBER_BY_SLUG`

**Variables**:
- `slug` (ID!): Team member slug

**GraphQL Query**:
```graphql
query GetTeamMemberBySlug($slug: ID!) {
  teamMember(id: $slug, idType: SLUG) {
    id
    slug
    title
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    teamMemberFields {
      jobTitle
      shortBio
      fullBio
      email
      linkedinUrl
      skills {
        skillName
        proficiency
      }
      publicProfile
    }
    departments {
      nodes {
        name
        slug
      }
    }
  }
}
```

---

## Job Listings Queries

### Get All Job Listings

**Query Name**: `GET_ALL_JOB_LISTINGS`

**GraphQL Query**:
```graphql
query GetAllJobListings($first: Int = 50) {
  jobListings(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      id
      databaseId
      slug
      title
      excerpt
      date
      jobListingFields {
        location
        salaryRange
        experienceLevel
        jobStatus
        publishDate
      }
    }
  }
}
```

---

### Get Job Listing by Slug

**Query Name**: `GET_JOB_LISTING_BY_SLUG`

**Variables**:
- `slug` (ID!): Job listing slug

**GraphQL Query**:
```graphql
query GetJobListingBySlug($slug: ID!) {
  jobListing(id: $slug, idType: SLUG) {
    id
    slug
    title
    content
    date
    jobListingFields {
      location
      salaryRange
      experienceLevel
      publishDate
      jobStatus
      positionDescription
      idealCandidate
      requiredSkills
      qualifications
    }
    seo {
      title
      metaDesc
    }
  }
}
```

---

## Blog/News Queries

### Get All Blog Posts

**Query Name**: `GET_ALL_BLOG_POSTS`

**GraphQL Names**:
- Singular: `blogPost`
- Plural: `blogPosts`

**GraphQL Query**:
```graphql
query GetAllBlogPosts($first: Int = 10, $after: String) {
  blogPosts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      databaseId
      slug
      title
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      blogCategories {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

---

### Get Blog Post by Slug

**Query Name**: `GET_BLOG_POST_BY_SLUG`

**Variables**:
- `slug` (ID!): Blog post slug

**GraphQL Query**:
```graphql
query GetBlogPostBySlug($slug: ID!) {
  blogPost(id: $slug, idType: SLUG) {
    id
    slug
    title
    content
    excerpt
    date
    modified
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    blogCategories {
      nodes {
        name
        slug
      }
    }
    seo {
      title
      metaDesc
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
    }
  }
}
```

**Frontend Route**: `/news/[slug]`

---

## Policies Queries

### Get All Policies

**Query Name**: `GET_POLICIES_CORE`

**GraphQL Query**:
```graphql
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

---

### Get Policy by Slug

**Query Name**: `GET_POLICY_BY_SLUG`

**Variables**:
- `slug` (ID!): Policy slug

**GraphQL Query**:
```graphql
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
      node {
        sourceUrl
        altText
      }
    }
  }
}
```

**Note**: Policies use core WordPress fields only. ACF fields (`policyFields`) are optional and may not be available depending on backend configuration.

---

## Technologies Queries

### Get All Technologies

**Query Name**: `GET_ALL_TECHNOLOGIES`

**GraphQL Query**:
```graphql
query GetAllTechnologies($first: Int = 100) {
  technologies(first: $first) {
    nodes {
      id
      databaseId
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}
```

**Usage**: Typically used in technology sliders to display client logos.

---

## Global Content Queries

### Get Global Content Blocks

**Query Name**: `GET_GLOBAL_CONTENT`

**Purpose**: Fetch reusable content blocks configured in WordPress Global Options.

**GraphQL Query**:
```graphql
query GetGlobalContent {
  globalOptions {
    globalContent {
      approachBlock {
        title
        subtitle
        steps {
          stepNumber
          icon {
            node {
              sourceUrl
              altText
            }
          }
          title
          description
        }
      }
      valuesBlock {
        title
        subtitle
        values {
          icon {
            node {
              sourceUrl
              altText
            }
          }
          title
          description
        }
      }
      whyCda {
        title
        subtitle
        usp {
          title
          description
          icon {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      servicesAccordion {
        title
        services {
          title
          description
          link
        }
      }
      statsBlock {
        stats {
          number
          label
          color
        }
      }
      technologiesSlider {
        title
        technologies {
          logo {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      showreel {
        videoUrl
        posterImage {
          node {
            sourceUrl
            altText
          }
        }
        brandLogos {
          nodes {
            sourceUrl
            altText
          }
        }
      }
      cultureGallerySlider {
        title
        subtitle
        useGlobalSocialLinks
        images {
          nodes {
            sourceUrl
            altText
          }
        }
      }
      locationsImage {
        title
        countries {
          countryName
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      newsletterSignup {
        title
        description
        placeholder
        buttonText
      }
    }
    globalContentSelection {
      enableImageFrame
      enableServicesAccordion
      enableWhyCda
      enableShowreel
      enableApproach
      enableTechnologiesSlider
      enableValues
      enableStatsImage
      enableLocationsImage
      enableNewsCarousel
      enableNewsletterSignup
      enableCultureGallerySlider
    }
  }
}
```

---

## Helper Functions

### Pagination Helper

**File**: `src/lib/graphql-queries.js`

```javascript
/**
 * Fetch data with pagination
 * @param {DocumentNode} query - GraphQL query
 * @param {string} typename - Type name (e.g., 'services', 'blogPosts')
 * @param {number} first - Items per page
 * @returns {Promise<Array>} All items
 */
export async function fetchAllPaginated(query, typename, first = 100) {
  let allItems = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const { data } = await apolloClient.query({
      query,
      variables: { first, after: endCursor }
    });

    const pageData = data[typename];
    allItems = [...allItems, ...pageData.nodes];

    hasNextPage = pageData.pageInfo.hasNextPage;
    endCursor = pageData.pageInfo.endCursor;
  }

  return allItems;
}
```

---

### Error Handling

**Pattern for all queries:**

```javascript
import { apolloClient } from '@/lib/apollo-client';
import { GET_SERVICE_BY_SLUG } from '@/lib/graphql-queries';

export default async function ServicePage({ params }) {
  try {
    const { data } = await apolloClient.query({
      query: GET_SERVICE_BY_SLUG,
      variables: { slug: params.slug }
    });

    if (!data?.service) {
      notFound(); // Next.js 404
    }

    return <div>{/* Render service */}</div>;

  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error; // Let Next.js error boundary handle it
  }
}
```

---

## GraphQL Introspection

### Inspect Type Structure

Use these queries to explore the schema:

```graphql
# Inspect Service type
query IntrospectServiceType {
  __type(name: "Service") {
    name
    fields {
      name
      type {
        kind
        name
        ofType { kind name }
      }
    }
  }
}

# Inspect Policy type
query IntrospectPolicyType {
  __type(name: "Policy") {
    name
    fields {
      name
      type {
        kind
        name
        ofType { kind name }
      }
    }
  }
}

# Inspect available fields
query IntrospectPolicyFieldsType {
  __type(name: "PolicyFields") {
    name
    fields {
      name
      type {
        kind
        name
      }
    }
  }
}
```

### Testing Queries

**Using PowerShell:**
```powershell
$body = @{
  query = @"
query GetServiceBySlug(`$slug: ID!) {
  service(id: `$slug, idType: SLUG) {
    id
    title
    slug
  }
}
"@
  variables = @{ slug = "ecommerce-development" }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body |
  Select-Object -ExpandProperty Content
```

**Using cURL:**
```bash
curl -X POST \
  http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query GetServiceBySlug($slug: ID!) { service(id: $slug, idType: SLUG) { id title slug } }","variables":{"slug":"ecommerce-development"}}'
```

---

## Common GraphQL Patterns

### Gallery Fields (nodes vs node)

**CORRECT** - Use `nodes` (plural) for galleries:
```graphql
images {
  nodes {
    sourceUrl
    altText
  }
}
```

**WRONG** - Don't use `node` (singular):
```graphql
images {
  node {  # ❌ This will cause an error
    sourceUrl
  }
}
```

### Nested ACF Repeater Fields

```graphql
serviceFields {
  features {          # Repeater field
    icon {            # Image field within repeater
      node {          # Use 'node' for single image
        sourceUrl
        altText
      }
    }
    title
    description
  }
}
```

### Optional Fields

Always use optional chaining when accessing data:

```javascript
const title = data?.service?.serviceFields?.heroSection?.title || 'Default Title';
const image = data?.service?.featuredImage?.node?.sourceUrl;
```

---

## Best Practices

### 1. Always Specify Required Fields
Don't query for fields you won't use. Keep queries lean.

### 2. Use Fragments for Repeated Structures
```graphql
fragment ImageFields on MediaItem {
  sourceUrl
  altText
  mediaDetails {
    width
    height
  }
}

query GetService($slug: ID!) {
  service(id: $slug, idType: SLUG) {
    featuredImage {
      node {
        ...ImageFields
      }
    }
  }
}
```

### 3. Handle Pagination Properly
For large datasets, always implement proper pagination instead of fetching everything at once.

### 4. Validate GraphQL Responses
```javascript
const service = data?.service;
if (!service) {
  notFound();
}

// Validate required fields
if (!service.serviceFields) {
  console.warn('Service missing ACF fields:', service.slug);
}
```

### 5. Use TypeScript Types
Define TypeScript interfaces matching your GraphQL schema:

```typescript
interface Service {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    }
  };
  serviceFields: {
    heroSection: {
      title: string;
      subtitle: string;
      description: string;
    };
  };
}
```

---

## Troubleshooting

### Common Issues

**1. Field not found error**
```
Cannot query field "policyFields" on type "Policy"
```
**Solution**: Field may not exist in schema. Run introspection query to verify available fields.

**2. Gallery returns null**
```
images { node { sourceUrl } }  // ❌ Wrong
```
**Solution**: Use `nodes` (plural) for gallery/relationship connections.

**3. ACF fields return null**
**Solution**: Ensure WPGraphQL for ACF plugin is active and fields are set to "Show in GraphQL".

**4. Pagination not working**
**Solution**: Verify `pageInfo` structure and use `endCursor` correctly.

---

## Related Documentation
- [Apollo Client Configuration](src/lib/apollo-client.js)
- [GraphQL Queries File](src/lib/graphql-queries.js)
- [PROJECT-OVERVIEW.md](PROJECT-OVERVIEW.md) - Custom post types structure
- [policies.md](policies.md) - Policies implementation guide

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Maintained By**: Development Team
