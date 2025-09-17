/**
 * GraphQL Queries for CDA Website
 * Single post and archive queries for all custom post types
 */

// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
  (process?.env?.NEXT_PUBLIC_WORDPRESS_URL
    ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, '')}/graphql`
    : '/api/wp-graphql');

// Resolve endpoint to absolute URL on server; relative is fine on the client
function resolveGraphQLEndpoint() {
  const endpoint = GRAPHQL_ENDPOINT;
  // Absolute URL already
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  // Running in the browser: resolve against current origin
  if (typeof window !== 'undefined' && window?.location?.origin) {
    try {
      return new URL(endpoint, window.location.origin).href;
    } catch (e) {
      // fallthrough to server fallback
    }
  }

  // Server-side: prefer absolute WP endpoint when using the internal proxy route
  if (endpoint.startsWith('/api/wp-graphql') && process.env.NEXT_PUBLIC_WORDPRESS_URL) {
    try {
      return `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, '')}/graphql`;
    } catch (e) {
      // fall through to site URL resolution
    }
  }

  // Server-side fallback: use site URL env or localhost
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
  try {
    return new URL(endpoint, siteUrl).href;
  } catch (e) {
    return `${siteUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }
}

/**
 * Execute GraphQL query
 */
export async function executeGraphQLQuery(query, variables = {}) {
  try {
    const resolvedEndpoint = resolveGraphQLEndpoint();
    const response = await fetch(resolvedEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      // Enable static generation with ISR instead of forcing dynamic rendering
      next: { revalidate: Number(process.env.NEXT_PUBLIC_GRAPHQL_REVALIDATE || 300) },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    throw error;
  }
}

// =============================================================================
// SERVICES QUERIES
// =============================================================================

export const GET_ALL_SERVICES = `
  query GetAllServices($first: Int, $after: String, $where: RootQueryToServiceConnectionWhereArgs) {
    services(first: $first, after: $after, where: $where) {
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
          serviceBulletPoints {
            title
            bullets {
              text
            }
          }
        }
        serviceTypes {
          nodes {
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
      edges {
        cursor
      }
    }
  }
`;

export const GET_SERVICES_WITH_PAGINATION = `
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
          serviceBulletPoints {
            title
            bullets {
              text
            }
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
`;

export const GET_SERVICE_BY_SLUG = `
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
            url
            title
          }
        }
        serviceBulletPoints {
          title
          bullets {
            text
          }
        }
        valueDescription {
          title
          description
          cta {
            url
            title
          }
        }
        caseStudies {
          nodes {
            ... on CaseStudy {
              id
              title
              uri
              excerpt
              featuredImage {
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
    globalOptions {
      globalContentBlocks {
        approach {
          title
          subtitle
          steps {
            title
            image {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        newsCarousel {
          title
          subtitle
          articleSelection
          category { nodes { name slug } }
          manualArticles {
            nodes {
              __typename
              ... on BlogPost { id title excerpt uri featuredImage { node { sourceUrl altText } } }
              ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_BY_SLUG_TEST_ACF = `
  query GetServiceBySlugTestACF($slug: ID!) {
    service(id: $slug, idType: SLUG) {
      id
      title
      slug
      serviceDetail {
        hero {
          subtitle
          description
        }
      }
    }
  }
`;

export const GET_SERVICE_BY_SLUG_WITH_ACF = `
  query GetServiceBySlugWithACF($slug: ID!) {
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
        statistics {
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
        valuesSection {
          title
          valueItems {
            title
            description
          }
        }
        caseStudiesSection {
          title
          caseStudies {
            ... on CaseStudy {
              id
              title
              slug
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
              }
            }
          }
        }
        newsletterSection {
          title
          subtitle
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
      seo {
        title
        metaDesc
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_SERVICE_SLUGS = `
  query GetServiceSlugs {
    services {
      nodes {
        slug
      }
    }
  }
`;

// =============================================================================
// CASE STUDIES QUERIES
// =============================================================================

export const GET_ALL_CASE_STUDIES = `
  query GetAllCaseStudies($first: Int, $after: String, $where: RootQueryToCaseStudyConnectionWhereArgs) {
    caseStudies(first: $first, after: $after, where: $where) {
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
`;

export const GET_CASE_STUDIES_WITH_PAGINATION = `
  query GetCaseStudiesWithPagination($first: Int = 12, $after: String, $search: String) {
    caseStudies(first: $first, after: $after, where: { search: $search }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
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
`;

export const GET_CASE_STUDY_BY_SLUG = `
  query GetCaseStudyBySlug($slug: ID!) {
    caseStudy(id: $slug, idType: SLUG) {
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
      caseStudyFields {
        projectOverview {
          clientName
          clientLogo {
            node {
              sourceUrl
              altText
            }
          }
          projectUrl
          completionDate
        }
        challenge
        solution
        results
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
  }
`;

export const GET_CASE_STUDY_SLUGS = `
  query GetCaseStudySlugs {
    caseStudies {
      nodes {
        slug
      }
    }
  }
`;

// =============================================================================
// TEAM MEMBERS QUERIES
// =============================================================================

export const GET_ALL_TEAM_MEMBERS = `
  query GetAllTeamMembers($first: Int, $after: String, $where: RootQueryToTeamMemberConnectionWhereArgs) {
    teamMembers(first: $first, after: $after, where: $where) {
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
`;

export const GET_TEAM_MEMBERS_WITH_PAGINATION = `
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
`;

export const GET_TEAM_MEMBER_BY_SLUG = `
  query GetTeamMemberBySlug($slug: ID!) {
    teamMember(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
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
          name
          level
        }
        featured
        publicProfile
      }
      departments {
        nodes {
          id
          name
          slug
          description
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
`;

export const GET_TEAM_MEMBER_SLUGS = `
  query GetTeamMemberSlugs {
    teamMembers {
      nodes {
        slug
      }
    }
  }
`;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export async function getServiceBySlug(slug) {
  // Fetch the base service fields
  const response = await executeGraphQLQuery(GET_SERVICE_BY_SLUG, { slug });
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }
  const service = response.data?.service;
  if (!service) return null;

  return service;
}

export async function getCaseStudyBySlug(slug) {
  const response = await executeGraphQLQuery(GET_CASE_STUDY_BY_SLUG, { slug });
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.caseStudy || null;
}

export async function getTeamMemberBySlug(slug) {
  const response = await executeGraphQLQuery(GET_TEAM_MEMBER_BY_SLUG, { slug });
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.teamMember || null;
}

export async function getAllServices() {
  const response = await executeGraphQLQuery(GET_ALL_SERVICES);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.services?.nodes || [];
}

export async function getServicesWithPagination(variables) {
  const response = await executeGraphQLQuery(GET_SERVICES_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], pageInfo: null };
  }

  return {
    nodes: response.data?.services?.nodes || [],
    pageInfo: response.data?.services?.pageInfo || null
  };
}

export async function getAllCaseStudies() {
  const response = await executeGraphQLQuery(GET_ALL_CASE_STUDIES);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.caseStudies?.nodes || [];
}

export async function getCaseStudiesWithPagination(variables) {
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

export async function getAllTeamMembers() {
  const response = await executeGraphQLQuery(GET_ALL_TEAM_MEMBERS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.teamMembers?.nodes || [];
}

export async function getTeamMembersWithPagination(variables) {
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

// Functions to get all slugs for generateStaticParams
export async function getServiceSlugs() {
  const response = await executeGraphQLQuery(GET_SERVICE_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.services?.nodes?.map((service) => service.slug) || [];
}

export async function getCaseStudySlugs() {
  const response = await executeGraphQLQuery(GET_CASE_STUDY_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.caseStudies?.nodes?.map((caseStudy) => caseStudy.slug) || [];
}

export async function getTeamMemberSlugs() {
  const response = await executeGraphQLQuery(GET_TEAM_MEMBER_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.teamMembers?.nodes?.map((teamMember) => teamMember.slug) || [];
}

// Global content query (for layout/shared components)
export const GET_GLOBAL_CONTENT = `
  query GetGlobalContent {
    globalOptions {
      globalContentBlocks {
        whyCdaBlock {
          title
          subtitle
        }
        ctaBlock {
          pretitle
          title
          buttonText
          buttonUrl
        }
        newsletterBlock {
          title
          subtitle
          description
        }
        photoFrameBlock {
          frameImage {
            node {
              sourceUrl
              altText
            }
          }
          innerImage {
            node {
              sourceUrl
              altText
            }
          }
          subtitle
          title
          text
          buttonTitle
          buttonUrl
          buttonTarget
          arrowIllustration {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

export async function getGlobalContent() {
  const response = await executeGraphQLQuery(GET_GLOBAL_CONTENT);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.globalOptions?.globalContentBlocks || null;
}

export async function getJobListingBySlug(slug) {
  const response = await executeGraphQLQuery(GET_JOB_LISTING_BY_SLUG, { slug });
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.jobListing || null;
}

export async function getAllJobListings() {
  const response = await executeGraphQLQuery(GET_ALL_JOB_LISTINGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.jobListings?.nodes || [];
}

export async function getJobListingsWithPagination(variables) {
  const response = await executeGraphQLQuery(GET_JOB_LISTINGS_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], pageInfo: null };
  }

  return {
    nodes: response.data?.jobListings?.nodes || [],
    pageInfo: response.data?.jobListings?.pageInfo || null
  };
}

export async function getJobListingSlugs() {
  const response = await executeGraphQLQuery(GET_JOB_LISTING_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.jobListings?.nodes?.map((jobListing) => jobListing.slug) || [];
}

export async function getJobListingsSimple() {
  const response = await executeGraphQLQuery(GET_JOB_LISTINGS_SIMPLE);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.jobListings?.nodes || [];
}

// =============================================================================
// SERVICES ENHANCED FIELDS (queried separately and merged if available)
// =============================================================================
export const GET_SERVICE_ENHANCED_FIELDS = `
  query GetServiceEnhanced($slug: ID!) {
    service(id: $slug, idType: SLUG) {
      serviceFields {
        serviceCards { title description pinIcon cta { url title target } }
        serviceBulletPoints { title bullets { text } }
        valueDescription { title description cta { url title target } }
        clientsLogos {
          title
          description
          largeImage { node { sourceUrl altText } }
          logos { logo { node { sourceUrl altText } } }
        }
      }
    }
  }
`;

// =============================================================================
// SERVICES OVERVIEW PAGE ("/services")
// =============================================================================
export const GET_SERVICE_OVERVIEW_CONTENT = `
  query GetServiceOverviewContent {
    page(id: "/services", idType: URI) {
      id
      title
      slug
      uri
    }
  }
`;

export async function getServiceOverviewContent() {
  const response = await executeGraphQLQuery(GET_SERVICE_OVERVIEW_CONTENT);
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }
  return response.data?.page || null;
}

// =============================================================================
// JOB LISTINGS QUERIES
// =============================================================================

export const GET_ALL_JOB_LISTINGS = `
  query GetAllJobListings($first: Int, $after: String, $where: RootQueryToJobListingConnectionWhereArgs) {
    jobListings(first: $first, after: $after, where: $where) {
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
        jobListingFields {
          jobDetails {
            location
            salary
            experienceLevel
            publishDate
          }
          requirements {
            aboutThePosition
            ourDreamCandidate
            requiredSkills {
              responsability
            }
            requiredQualifications {
              qualification
            }
          }
          jobStatus
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
`;

export const GET_JOB_LISTINGS_WITH_PAGINATION = `
  query GetJobListingsWithPagination($first: Int = 12, $after: String, $search: String) {
    jobListings(first: $first, after: $after, where: { search: $search }) {
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
        jobListingFields {
          jobDetails {
            location
            salary
            experienceLevel
            publishDate
          }
          requirements {
            aboutThePosition
            ourDreamCandidate
            requiredSkills {
              responsability
            }
            requiredQualifications {
              qualification
            }
          }
          jobStatus
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
`;

export const GET_JOB_LISTING_BY_SLUG = `
  query GetJobListingBySlug($slug: ID!) {
    jobListing(id: $slug, idType: SLUG) {
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
      jobListingFields {
        jobDetails {
          location
          salary
          experienceLevel
          publishDate
        }
        requirements {
          aboutThePosition
          ourDreamCandidate
          requiredSkills {
            responsability
          }
          requiredQualifications {
            qualification
          }
        }
        jobStatus
      }
    }
  }
`;

export const GET_JOB_LISTING_SLUGS = `
  query GetJobListingSlugs {
    jobListings {
      nodes {
        slug
      }
    }
  }
`;

// Simple test query to check available fields
export const GET_JOB_LISTINGS_SIMPLE = `
  query GetJobListingsSimple {
    jobListings {
      nodes {
        id
        title
        slug
        date
        excerpt
      }
    }
  }
`;
