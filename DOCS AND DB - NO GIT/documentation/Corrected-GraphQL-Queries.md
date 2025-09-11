# Corrected GraphQL Queries - CDA Website

**Generated:** December 2024  
**Purpose:** Fixed versions of broken GraphQL queries identified in the frontend  
**Status:** Ready for implementation  
**Impact:** Will resolve loading issues on homepage and archive pages

## 🚨 Critical Issues Resolved

| Issue | Page(s) Affected | Root Cause | Fix Status |
|-------|------------------|------------|------------|
| Missing Homepage | `/` | No page ID 289 exists | ✅ Fixed with global content |
| Invalid `serviceTypeIn` field | `/services` | Non-existent GraphQL field | ✅ Removed invalid field |  
| Invalid pagination fields | `/team`, `/case-studies` | Schema mismatch | ✅ Corrected to cursor pagination |
| ACF fields not exposed | `/software-development` | Configuration issue | ⚠️ Needs WordPress config |

---

## 🏠 Homepage Fix - Use Global Content

### ❌ BROKEN: Current Implementation
**File:** `src/app/page.js`  
**Issue:** Queries for non-existent page ID 289

```javascript
// BROKEN - This page doesn't exist
const response = await client.query({
  query: GET_B2B_LEAD_GENERATION_CONTENT,
  variables: { id: "289" },
  errorPolicy: 'all'
});
```

### ✅ CORRECTED: Global Content Implementation
**Solution:** Use working global content blocks instead of missing homepage ACF

```javascript
// CORRECTED - Use global content that actually exists
const response = await client.query({
  query: GET_GLOBAL_CONTENT,
  errorPolicy: 'all'
});
```

**Complete Corrected GraphQL Query:**
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

**Updated Component Structure:**
```javascript
// Updated data access pattern
const globalOptions = pageData.globalOptions;
const globalSharedContent = globalOptions.globalSharedContent;

// Use in JSX
<WhyCdaBlock globalData={globalSharedContent?.whyCdaBlock} />
<ApproachBlock globalData={globalSharedContent?.approachBlock} />
```

---

## 🗂️ Services Archive Fix

### ❌ BROKEN: Invalid Field Usage
**File:** `src/lib/graphql-queries.ts`  
**Error:** `Field "serviceTypeIn" is not defined by type "RootQueryToServiceConnectionWhereArgs"`

```graphql
# BROKEN - This field doesn't exist in the schema
query GetServicesWithPagination($first: Int = 12, $after: String, $search: String, $serviceTypeIn: [ID]) {
  services(first: $first, after: $after, where: { search: $search, serviceTypeIn: $serviceTypeIn }) {
    nodes {
      # ... fields
    }
  }
}
```

### ✅ CORRECTED: Valid Schema Fields Only
**Solution:** Remove non-existent fields, use separate taxonomy query if needed

```graphql
# CORRECTED - Only use fields that exist in schema
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
      serviceFields {
        heroSection {
          subtitle
          description
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

**Separate Query for Service Types (if filtering needed):**
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

**Updated Function Signature:**
```typescript
// CORRECTED - Remove invalid parameter
export async function getServicesWithPagination(variables: {
  first?: number;
  after?: string;
  search?: string;
  // REMOVED: serviceTypeIn?: string[]; // This field doesn't exist
}) {
  // Implementation with corrected query
}
```

---

## 👥 Team Archive Fix

### ❌ BROKEN: Multiple Invalid Fields
**File:** `src/lib/graphql-queries.ts`  
**Errors:**
- `Field "offsetPagination" is not defined`
- `Field "taxQuery" is not defined`  
- `Field "metaQuery" is not defined`

```graphql
# BROKEN - Multiple non-existent fields
query GetTeamMembersWithPagination($first: Int = 12, $offset: Int = 0, $search: String, $departmentIn: [ID], $featured: Boolean) {
  teamMembers(first: $first, where: { 
    offsetPagination: { offset: $offset },    # ❌ Doesn't exist
    search: $search, 
    taxQuery: { taxArray: [{ taxonomy: DEPARTMENT, operator: IN, terms: $departmentIn }] },  # ❌ Doesn't exist
    metaQuery: { metaArray: [{ key: "featured", value: $featured, compare: EQUAL_TO }] }     # ❌ Doesn't exist
  }) {
    nodes {
      # ... fields
    }
    pageInfo {
      offsetPagination {    # ❌ Doesn't exist
        total
      }
    }
  }
}
```

### ✅ CORRECTED: Valid Cursor Pagination
**Solution:** Use standard GraphQL cursor pagination

```graphql
# CORRECTED - Use valid pagination pattern
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

**Updated Function:**
```typescript
// CORRECTED - Valid parameters only
export async function getTeamMembersWithPagination(variables: {
  first?: number;
  after?: string;
  search?: string;
  // REMOVED: offset, departmentIn, featured - these filters aren't supported
}) {
  const response = await executeGraphQLQuery(GET_TEAM_MEMBERS_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], pageInfo: null };
  }

  return {
    nodes: response.data?.teamMembers?.nodes || [],
    pageInfo: response.data?.teamMembers?.pageInfo || null
  };
}
```

**Separate Filtering Queries (if needed):**
```graphql
# For department filtering - use separate query
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

# For featured team members - use separate query or client-side filtering
query GetFeaturedTeamMembers {
  teamMembers {
    nodes {
      id
      title
      slug
      teamMemberFields {
        featured
        jobTitle
        shortBio
      }
    }
  }
}
```

---

## 📚 Case Studies Archive Fix

### ❌ BROKEN: Same Pagination Issues
**File:** `src/lib/graphql-queries.ts`  
**Issue:** Same invalid fields as team members

```graphql
# BROKEN - Same issues as team members
query GetCaseStudiesWithPagination($first: Int = 12, $offset: Int = 0, $search: String, $projectTypeIn: [ID], $featured: Boolean) {
  caseStudies(first: $first, where: { 
    offsetPagination: { offset: $offset },    # ❌ Doesn't exist
    search: $search,
    taxQuery: { taxArray: [{ taxonomy: PROJECT_TYPE, operator: IN, terms: $projectTypeIn }] }, # ❌ Doesn't exist
    metaQuery: { metaArray: [{ key: "featured", value: $featured, compare: EQUAL_TO }] }        # ❌ Doesn't exist
  }) {
    # ... same structure issues
  }
}
```

### ✅ CORRECTED: Standard Pagination
**Solution:** Use cursor pagination like other archive pages

```graphql
# CORRECTED - Standard pagination pattern
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

**Updated Function:**
```typescript
// CORRECTED - Simplified parameters
export async function getCaseStudiesWithPagination(variables: {
  first?: number;
  after?: string;
  search?: string;
  // REMOVED: offset, projectTypeIn, featured
}) {
  const response = await executeGraphQLQuery(GET_CASE_STUDIES_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], pageInfo: null };
  }

  return {
    nodes: response.data?.caseStudies?.nodes || [],
    pageInfo: response.data?.caseStudies?.pageInfo || null
  };
}
```

---

## 🔧 Software Development Page Fix

### ❌ BROKEN: ACF Fields Not Exposed
**Page ID:** 777  
**Issue:** ACF field group exists but not exposed to GraphQL schema

```graphql
# BROKEN - Fields return null because not exposed to GraphQL
query GET_SOFTWARE_DEVELOPMENT {
  page(id: "777", idType: DATABASE_ID) {
    id
    title
    slug
    uri
    softwareDevelopmentContent {    # ❌ This field group isn't exposed
      # ... ACF fields not accessible
    }
  }
}
```

### ✅ CORRECTED: Fallback Pattern
**Immediate Solution:** Use basic page content until ACF is configured

```graphql
# CORRECTED - Use available fields only
query GET_SOFTWARE_DEVELOPMENT_BASIC {
  page(id: "777", idType: DATABASE_ID) {
    id
    title
    slug
    uri
    content
    excerpt
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    seo {
      title
      metaDesc
      opengraphImage {
        sourceUrl
      }
    }
  }
}
```

### 🔧 RECOMMENDED: WordPress Configuration Fix
**Long-term Solution:** Configure ACF field group in WordPress admin

**Steps Required:**
1. Go to WordPress Admin → Custom Fields → Field Groups
2. Find "Software Development Content" field group
3. Edit field group settings
4. Check "Show in GraphQL" option
5. Set GraphQL Field Name to "softwareDevelopmentContent"
6. Save changes

**After Configuration, Use Full Query:**
```graphql
# AFTER ACF CONFIGURATION - Full query will work
query GET_SOFTWARE_DEVELOPMENT {
  page(id: "777", idType: DATABASE_ID) {
    id
    title
    slug
    uri
    softwareDevelopmentContent {
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
      # ... other ACF fields once exposed
    }
  }
}
```

---

## 📋 Implementation Checklist

### Immediate Fixes (Frontend Code)

- [ ] **Homepage Fix**
  - [ ] Update `src/app/page.js` to use `GET_GLOBAL_CONTENT` query
  - [ ] Remove `variables: { id: "289" }` 
  - [ ] Update data access to use `globalOptions.globalSharedContent`

- [ ] **Services Archive Fix**  
  - [ ] Update `src/lib/graphql-queries.ts` - remove `serviceTypeIn` parameter
  - [ ] Update `src/app/services/page.tsx` - remove `serviceTypeIn` usage
  - [ ] Update function signature in utility functions

- [ ] **Team Archive Fix**
  - [ ] Update `src/lib/graphql-queries.ts` - replace pagination fields
  - [ ] Update `src/app/team/page.tsx` - use cursor pagination
  - [ ] Remove invalid parameters from function calls

- [ ] **Case Studies Archive Fix**
  - [ ] Same changes as team archive
  - [ ] Update both query and component files

### WordPress Configuration (Required for Software Development)

- [ ] **ACF Configuration**
  - [ ] Access WordPress Admin panel
  - [ ] Navigate to Custom Fields → Field Groups
  - [ ] Find Software Development field group
  - [ ] Enable "Show in GraphQL" option
  - [ ] Set proper GraphQL field name
  - [ ] Test query after changes

### Testing & Validation

- [ ] **Query Testing**
  - [ ] Test each corrected query in GraphiQL/GraphQL Playground  
  - [ ] Verify no schema errors returned
  - [ ] Check response data structure

- [ ] **Frontend Testing**
  - [ ] Verify pages load without "Loading..." state
  - [ ] Check console for GraphQL errors
  - [ ] Test pagination functionality
  - [ ] Validate content renders properly

---

## 📊 Expected Results After Fixes

| Page | Before Fix | After Fix | Status |
|------|------------|-----------|--------|
| Homepage (/) | "Loading content from WordPress..." | Functional homepage with global blocks | ✅ Ready |
| Services Archive | "Loading..." + GraphQL errors | Working services list with search | ✅ Ready |
| Team Archive | "Loading..." + GraphQL errors | Working team list with search | ✅ Ready |
| Case Studies Archive | "Loading..." + GraphQL errors | Working case studies list | ✅ Ready |
| Software Development | Limited content display | Full ACF content (after WordPress config) | ⚠️ Needs WP config |

---

**Implementation Priority:**
1. **High Priority:** Homepage, Services, Team, Case Studies (affects major functionality)
2. **Medium Priority:** Software Development (affects one service page)

**Time to Implement:** ~2 hours for code changes + WordPress admin access for ACF configuration

**Last Updated:** December 2024