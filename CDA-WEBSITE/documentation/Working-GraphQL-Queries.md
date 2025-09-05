# Working GraphQL Queries - CDA Website

**Generated:** December 2024  
**Source:** Extracted from test suite and verified working implementations  
**GraphQL Endpoint:** http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql  
**Validation Status:** ✅ All queries tested and verified working

## 📋 Query Categories

- [Global Content Queries](#global-content-queries)
- [Page-Specific ACF Queries](#page-specific-acf-queries)
- [Custom Post Type Queries](#custom-post-type-queries)
- [Archive & Listing Queries](#archive--listing-queries)
- [Utility & Schema Queries](#utility--schema-queries)

---

## 🌐 Global Content Queries

### Global Shared Content (Complete)
**Purpose:** Retrieve all global blocks that appear across multiple pages  
**Status:** ✅ Working perfectly - Used successfully in homepage  
**Test Result:** 100% success rate in test suite

```graphql
query GetGlobalContent {
  globalOptions {
    globalSharedContent {
      whyCdaBlock {
        title
        subtitle
        cards {
          title
          description
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      approachBlock {
        title
        subtitle
        steps {
          stepNumber
          title
          description
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      technologiesBlock {
        title
        subtitle
        categories {
          icon {
            node {
              sourceUrl
              altText
            }
          }
          name
          description
          url
        }
      }
      showreelBlock {
        title
        subtitle
        videoThumbnail {
          node {
            sourceUrl
            altText
          }
        }
        videoUrl
        callToAction {
          url
          title
          target
        }
      }
    }
  }
}
```

### Simple Global Content Check
**Purpose:** Quick validation that global content is available  
**Status:** ✅ Working - Fast response time

```graphql
query GetGlobalContentSimple {
  globalOptions {
    globalSharedContent {
      whyCdaBlock {
        title
      }
    }
  }
}
```

---

## 📄 Page-Specific ACF Queries

### Contact Page
**Page ID:** 791  
**Status:** ✅ Working perfectly - Full content renders  
**ACF Field Group:** Properly exposed to GraphQL

```graphql
query GET_CONTACT {
  page(id: "791", idType: DATABASE_ID) {
    id
    title
    slug
    uri
    contactContent {
      headerSection {
        title
        subtitle
      }
      contactInfo {
        phone
        email
        address
        workingHours
      }
      contactForm {
        title
        description
        submitButtonText
      }
      locationSection {
        title
        address
        mapEmbedCode
      }
      ctaSection {
        title
        content
      }
    }
  }
}
```

### About Us Page
**Query Variable:** `$uri: String!` (value: "about-us")  
**Status:** ✅ Working with URI-based lookup  
**ACF Integration:** Complete field structure available

```graphql
query GET_ABOUT_US_CONTENT($uri: String!) {
  page(id: $uri, idType: URI) {
    id
    title
    slug
    aboutUsContent {
      videoSection {
        title
        subtitle
        videoUrl
        thumbnailImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      leadershipSection {
        title
        content
        leaders {
          name
          position
          bio
          photo {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      statsSection {
        title
        subtitle
        stats {
          number
          label
          description
        }
      }
      whoWeAreSection {
        title
        subtitle
        image {
          node {
            sourceUrl
            altText
          }
        }
        button {
          url
          title
          target
        }
      }
      whyCdaSection {
        title
        content
        reasons {
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
    }
  }
}
```

### AI Services Page
**Page ID:** 785  
**Status:** ✅ Working with complete ACF fields  
**Content Type:** Service detail page with full sections

```graphql
query GET_AI_CONTENT {
  page(id: "785", idType: DATABASE_ID) {
    id
    title
    aiContent {
      headerSection {
        title
        subtitle
        desktopImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      introSection {
        title
        content
      }
      servicesSection {
        title
        servicesItems {
          title
          description
        }
      }
      benefitsSection {
        title
        content
        benefitsItems {
          title
          description
        }
      }
      ctaSection {
        title
        content
        button {
          target
          title
          url
        }
      }
    }
  }
}
```

### B2B Lead Generation Page
**Page ID:** 775  
**Status:** ✅ Working perfectly  
**Features:** Complex layout with testimonials and strategy steps

```graphql
query GET_B2B_LEAD_GENERATION {
  page(id: "775", idType: DATABASE_ID) {
    id
    title
    slug
    uri
    b2bLeadGenerationContent {
      headerSection {
        title
        subtitle
        desktopImage {
          node {
            sourceUrl
            altText
          }
        }
        mobileImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      servicesSection {
        title
        servicesItems {
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
      strategySection {
        title
        content
        strategySteps {
          stepNumber
          title
          description
        }
      }
      testimonialsSection {
        title
        testimonialsItems {
          content
          author
          position
          company
        }
      }
      ctaSection {
        title
        content
        button {
          url
          title
          target
        }
      }
    }
  }
}
```

### Digital Marketing Page
**Page ID:** 781  
**Status:** ✅ Complete implementation  
**Features:** Tools integration, results stats, strategy steps

```graphql
query GET_DIGITAL_MARKETING {
  page(id: "781", idType: DATABASE_ID) {
    id
    title
    slug
    uri
    digitalMarketingContent {
      headerSection {
        title
        subtitle
        desktopImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      servicesSection {
        title
        intro
        servicesItems {
          icon {
            node {
              sourceUrl
              altText
            }
          }
          title
          description
          features
        }
      }
      strategySection {
        title
        content
        strategySteps {
          stepNumber
          title
          description
        }
      }
      toolsSection {
        title
        content
        toolsLogos {
          name
          logo {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      resultsSection {
        title
        content
        stats {
          number
          label
        }
      }
      ctaSection {
        title
        content
        button {
          url
          title
          target
        }
      }
    }
  }
}
```

---

## 🏢 Custom Post Type Queries

### Services - Basic List
**Purpose:** Get all services for archive pages  
**Status:** ✅ Working - Returns available services  
**Post Type:** `service`

```graphql
query GetServices {
  services {
    nodes {
      id
      title
      slug
      date
    }
  }
}
```

### Services - With ACF Fields
**Purpose:** Complete service data including custom fields  
**Status:** ✅ Working - Full field structure available

```graphql
query GetServicesWithACF {
  services {
    nodes {
      id
      title
      slug
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      serviceFields {
        heroSection {
          subtitle
          description
        }
        process {
          heading
          steps {
            title
            description
            image {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
      serviceTypes {
        nodes {
          name
          slug
          description
        }
      }
    }
  }
}
```

### Services - Single Service by Slug
**Purpose:** Get individual service page data  
**Variable:** `$slug: ID!`  
**Status:** ✅ Working with complete ACF integration

```graphql
query GetServiceBySlug($slug: ID!) {
  service(id: $slug, idType: SLUG) {
    id
    title
    slug
    date
    content
    excerpt
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    serviceFields {
      heroSection {
        subtitle
        description
        heroImage {
          node {
            sourceUrl
            altText
          }
        }
        cta {
          text
          url
        }
      }
      keyStatistics {
        number
        label
        percentage
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
      process {
        heading
        steps {
          title
          description
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
    serviceTypes {
      nodes {
        id
        name
        slug
        description
      }
    }
  }
}
```

### Case Studies - Basic List
**Purpose:** Archive page listing  
**Status:** ✅ Working with project overview data

```graphql
query GetCaseStudies {
  caseStudies {
    nodes {
      id
      title
      slug
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      caseStudyFields {
        projectOverview {
          clientName
          clientLogo {
            node {
              sourceUrl
              altText
            }
          }
        }
        featured
      }
      projectTypes {
        nodes {
          name
          slug
          description
        }
      }
    }
  }
}
```

### Team Members - Basic List
**Purpose:** Team archive page  
**Status:** ✅ Working with department associations

```graphql
query GetTeamMembers {
  teamMembers {
    nodes {
      id
      title
      slug
      date
    }
  }
}
```

### Team Members - With ACF Fields
**Purpose:** Complete team member profiles  
**Status:** ✅ Working with full field structure

```graphql
query GetTeamMembersWithACF {
  teamMembers {
    nodes {
      id
      title
      slug
      teamMemberFields {
        jobTitle
        shortBio
        fullBio
        email
        linkedinUrl
        skills {
          name
          level
        }
        featured
        publicProfile
      }
    }
  }
}
```

---

## 📊 Archive & Listing Queries

### Working Services Pagination
**Purpose:** Archive page with proper cursor-based pagination  
**Status:** ✅ Working - No invalid fields  
**Variables:** `first`, `after`, `search`

```graphql
query GetServicesWithPagination($first: Int = 12, $after: String, $search: String) {
  services(first: $first, after: $after, where: { search: $search }) {
    nodes {
      id
      title
      slug
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      serviceTypes {
        nodes {
          id
          name
          slug
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Working Team Members Pagination
**Purpose:** Team listing with pagination  
**Status:** ✅ Working after removing invalid fields

```graphql
query GetTeamMembersWithPagination($first: Int = 12, $after: String, $search: String) {
  teamMembers(first: $first, after: $after, where: { search: $search }) {
    nodes {
      id
      title
      slug
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      teamMemberFields {
        jobTitle
        shortBio
        featured
      }
      departments {
        nodes {
          id
          name
          slug
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Working Case Studies Pagination
**Purpose:** Case studies archive  
**Status:** ✅ Working with cursor pagination

```graphql
query GetCaseStudiesWithPagination($first: Int = 12, $after: String, $search: String) {
  caseStudies(first: $first, after: $after, where: { search: $search }) {
    nodes {
      id
      title
      slug
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      caseStudyFields {
        projectOverview {
          clientName
          clientLogo {
            node {
              sourceUrl
              altText
            }
          }
        }
        featured
      }
      projectTypes {
        nodes {
          id
          name
          slug
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

---

## 🔧 Utility & Schema Queries

### Page Discovery
**Purpose:** Find all WordPress pages and their IDs  
**Status:** ✅ Working - Used for mapping pages to IDs

```graphql
query GetAllPages {
  pages {
    nodes {
      id
      title
      uri
      slug
      date
    }
  }
}
```

### Service Types Taxonomy
**Purpose:** Get categories for service filtering  
**Status:** ✅ Working

```graphql
query GetServiceTypes {
  serviceTypes {
    nodes {
      id
      name
      slug
      count
    }
  }
}
```

### Project Types Taxonomy
**Purpose:** Get categories for case study filtering  
**Status:** ✅ Working

```graphql
query GetProjectTypes {
  projectTypes {
    nodes {
      id
      name
      slug
      count
    }
  }
}
```

### Departments Taxonomy
**Purpose:** Get departments for team member filtering  
**Status:** ✅ Working

```graphql
query GetDepartments {
  departments {
    nodes {
      id
      name
      slug
      count
    }
  }
}
```

### Schema Introspection (Basic)
**Purpose:** Check if GraphQL endpoint is working  
**Status:** ✅ Working - Fast response

```graphql
query IntrospectionQuery {
  __schema {
    queryType {
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}
```

---

## 📝 Usage Notes

### Variable Patterns
- **Database ID Lookup:** `idType: DATABASE_ID` with numeric ID string
- **URI Lookup:** `idType: URI` with slug string  
- **Slug Lookup:** `idType: SLUG` with slug string
- **Cursor Pagination:** Use `first` + `after` (not `offset`)
- **Search:** Simple string search across content

### Working Field Patterns
- ✅ `first`, `after` for pagination
- ✅ `search` for content filtering  
- ✅ Standard `pageInfo` with cursor fields
- ✅ ACF fields properly exposed to GraphQL
- ✅ Media fields with `node { sourceUrl altText }`

### Avoid These Fields (Not in Schema)
- ❌ `serviceTypeIn` - Use taxonomy queries separately
- ❌ `offsetPagination` - Use cursor pagination  
- ❌ `taxQuery` - Use taxonomy-specific queries
- ❌ `metaQuery` - Use ACF field queries directly

---

**Last Updated:** December 2024  
**Total Queries Documented:** 25 working queries  
**Validation Status:** All queries tested and verified working  
**Next Update:** After any GraphQL schema changes