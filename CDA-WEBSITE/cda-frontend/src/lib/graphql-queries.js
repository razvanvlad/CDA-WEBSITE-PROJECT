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

// Core-only Services query (safe for client usage)
export const GET_SERVICES_CORE_WITH_PAGINATION = `
  query GetServicesCoreWithPagination($first: Int = 12, $after: String, $search: String) {
    services(first: $first, after: $after, where: { search: $search }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
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

export const GET_CASE_STUDY_BY_URI = `
  query GetCaseStudyByUri($uri: ID!) {
    caseStudy(id: $uri, idType: URI) {
      id
      title
      slug
      date
      content
      excerpt
      featuredImage { node { sourceUrl altText } }
      caseStudyFields {
        projectOverview {
          clientName
          clientLogo { node { sourceUrl altText } }
          projectUrl
          completionDate
        }
        challenge
        solution
        results
        featured
      }
      projectTypes { nodes { id name slug } }
    }
  }
`;

// Core-only fallback queries (for environments without ACF mappings)
export const GET_CASE_STUDY_CORE_BY_URI = `
  query GetCaseStudyCoreByUri($uri: ID!) {
    caseStudy(id: $uri, idType: URI) {
      id
      title
      slug
      date
      content
      excerpt
      featuredImage { node { sourceUrl altText } }
    }
  }
`;

export const GET_CASE_STUDY_CORE_BY_SLUG = `
  query GetCaseStudyCoreBySlug($slug: ID!) {
    caseStudy(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
      featuredImage { node { sourceUrl altText } }
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

// Minimal, schema-safe core queries for Team Members (no ACF)
export const GET_TEAM_MEMBERS_CORE_WITH_PAGINATION = `
  query GetTeamMembersCoreWithPagination($first: Int = 12, $after: String, $search: String) {
    teamMembers(first: $first, after: $after, where: { search: $search }) {
      nodes {
        id
        title
        slug
        date
        modified
        excerpt
        featuredImage {
          node { sourceUrl altText }
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

export const GET_TEAM_MEMBER_CORE_BY_SLUG = `
  query GetTeamMemberCoreBySlug($slug: ID!) {
    teamMember(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      modified
      excerpt
      content
      featuredImage { node { sourceUrl altText } }
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
  // Try enhanced fields first
  try {
    const response = await executeGraphQLQuery(GET_CASE_STUDY_BY_SLUG, { slug });
    if (!response.errors && response.data?.caseStudy) return response.data.caseStudy;
  } catch (e) {
    console.warn('Enhanced case study (slug) failed, trying core fallback...', e)
  }
  // Fallback to core-only query
  try {
    const coreRes = await executeGraphQLQuery(GET_CASE_STUDY_CORE_BY_SLUG, { slug });
    if (!coreRes.errors && coreRes.data?.caseStudy) return coreRes.data.caseStudy;
  } catch (e) {
    console.error('Core case study (slug) failed:', e)
  }
  return null;
}

export async function getCaseStudyByUri(uri) {
  // Try enhanced fields first
  try {
    const response = await executeGraphQLQuery(GET_CASE_STUDY_BY_URI, { uri });
    if (!response.errors && response.data?.caseStudy) return response.data.caseStudy;
  } catch (e) {
    console.warn('Enhanced case study (uri) failed, trying core fallback...', e)
  }
  // Fallback to core-only query
  try {
    const coreRes = await executeGraphQLQuery(GET_CASE_STUDY_CORE_BY_URI, { uri });
    if (!coreRes.errors && coreRes.data?.caseStudy) return coreRes.data.caseStudy;
  } catch (e) {
    console.error('Core case study (uri) failed:', e)
  }
  return null;
}

export async function getCaseStudyByAny(params) {
  // Accept either a slug or a uri and try multiple strategies for resilience
  const slug = typeof params === 'string' ? params : params?.slug
  const uri = typeof params === 'object' && params?.uri ? params.uri : null

  // 1) If URI provided, try exact URI as-is
  if (uri) {
    const byUri = await getCaseStudyByUri(uri)
    if (byUri) return byUri
  }

  // 2) If slug present, try URI patterns commonly used by WP
  if (slug) {
    const safe = decodeURIComponent(slug)
    const candidates = [
      `/case-studies/${safe}/`,
      `/case-studies/${safe}`,
      `case-studies/${safe}/`,
      `case-studies/${safe}`,
    ]
    for (const u of candidates) {
      try {
        const byUri = await getCaseStudyByUri(u)
        if (byUri) return byUri
      } catch (_) { /* ignore and continue */ }
    }

    // 3) Fallback to idType: SLUG
    try {
      const bySlug = await getCaseStudyBySlug(safe)
      if (bySlug) return bySlug
    } catch (_) { /* ignore */ }
  }

  return null
}

export async function getTeamMemberBySlug(slug) {
  // Prefer core-only query to avoid ACF/SEO dependency
  const response = await executeGraphQLQuery(GET_TEAM_MEMBER_CORE_BY_SLUG, { slug });
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.teamMember || null;
}

export async function getTeamMembersCoreWithPagination(variables) {
  const response = await executeGraphQLQuery(GET_TEAM_MEMBERS_CORE_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], pageInfo: null };
  }

  return {
    nodes: response.data?.teamMembers?.nodes || [],
    pageInfo: response.data?.teamMembers?.pageInfo || null
  };
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

export async function getServicesCoreWithPagination(variables) {
  const response = await executeGraphQLQuery(GET_SERVICES_CORE_WITH_PAGINATION, variables);
  
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
        # APPROACH
        approach {
          title
          subtitle
          steps {
            title
            image { node { sourceUrl altText } }
          }
        }
        # CULTURE GALLERY SLIDER
        cultureGallerySlider {
          title
          subtitle
          useGlobalSocialLinks
          images {
            edges { node { sourceUrl altText } }
          }
        }
        # WHY CDA
        whyCda {
          title
          subtitle
          usp {
            title
            description
            icon { node { sourceUrl altText } }
          }
        }
        # VALUES BLOCK
        valuesBlock {
          title
          subtitle
          illustration { node { sourceUrl altText } }
          values { title }
        }
        # FULL VIDEO
        fullVideo {
          url
          file { node { sourceUrl altText } }
        }
        # CONTACT FORM LEFT / IMAGE RIGHT
        contactFormLeftImageRight {
          title
          formCode
          contactDetailsOverride
          useGlobalContactDetails
          rightMediaType
          rightImage { node { sourceUrl altText } }
          rightGif { node { sourceUrl altText } }
          rightVideo { node { sourceUrl altText } }
        }
        # IMAGE FRAME BLOCK
        imageFrameBlock {
          title
          subtitle
          text
          button { url title target }
          contentImage { node { sourceUrl altText } }
          frameImage { node { sourceUrl altText } }
          arrowImage { node { sourceUrl altText } }
        }
        # SERVICES ACCORDION
        servicesAccordion {
          title
          subtitle
          illustration { node { sourceUrl altText } }
          services {
            nodes {
              ... on Service { id title uri slug }
            }
          }
        }
        # TECHNOLOGIES SLIDER
        technologiesSlider {
          title
          subtitle
          logos {
            nodes {
              ... on Technology {
                id
                title
                uri
                featuredImage { node { sourceUrl altText } }
              }
            }
          }
        }
        # SHOWREEL
        showreel {
          title
          subtitle
          button { url title target }
          largeImage { node { sourceUrl altText } }
          logos { logo { node { sourceUrl altText } } }
        }
        # LOCATIONS
        locationsImage {
          title
          subtitle
          countries { countryName offices { name address email phone } }
          illustration { node { sourceUrl altText } }
        }
        # NEWS CAROUSEL
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
        # NEWSLETTER SIGNUP
        newsletterSignup {
          title
          subtitle
          hubspotScript
          termsText
        }
      }
    }
  }
`;

// Query to fetch Global Stats block (manual ACF as statsAndNumbers)
export const GET_GLOBAL_STATS = `
  query GetGlobalStatsAndNumbers {
    globalOptions {
      globalContentBlocks {
        statsAndNumbers {
          image { node { sourceUrl altText } }
          stats { number text }
          description
          cta { url title target }
        }
      }
    }
  }
`;

// Optional query for Global Case Studies Section (kept separate to avoid breaking base fetch if not present)
export const GET_GLOBAL_CASE_STUDIES_SECTION = `
  query GetGlobalCaseStudiesSection {
    globalOptions {
      globalContentBlocks {
        caseStudiesSection {
          title
          subtitle
          knowledgeHubLink { url title target }
          selectedStudies {
            nodes {
              ... on CaseStudy {
                id
                title
                uri
                excerpt
                featuredImage { node { sourceUrl altText } }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getGlobalContent() {
  const response = await executeGraphQLQuery(GET_GLOBAL_CONTENT);
  
  // Be tolerant of partial GraphQL errors – return whatever data we have
  if (response.errors) {
    console.warn('Global content GraphQL warnings:', response.errors);
  }

  const baseBlocks = response.data?.globalOptions?.globalContentBlocks || null;

  // Try to fetch optional case studies section separately; ignore errors
  let merged = baseBlocks ? { ...baseBlocks } : {}
  try {
    const csRes = await executeGraphQLQuery(GET_GLOBAL_CASE_STUDIES_SECTION);
    if (csRes?.data?.globalOptions?.globalContentBlocks?.caseStudiesSection) {
      merged.caseStudiesSection = csRes.data.globalOptions.globalContentBlocks.caseStudiesSection
    }
  } catch (e) {
    // ignore
  }

  // Try to fetch optional statsAndNumbers separately; ignore errors
  try {
    const statsRes = await executeGraphQLQuery(GET_GLOBAL_STATS);
    if (statsRes?.data?.globalOptions?.globalContentBlocks?.statsAndNumbers) {
      merged.statsAndNumbers = statsRes.data.globalOptions.globalContentBlocks.statsAndNumbers
    }
  } catch (e) {
    // ignore
  }

  return Object.keys(merged).length ? merged : baseBlocks;
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
// ALL GLOBAL CONTENT BLOCKS (full schema)
// =============================================================================
export const GET_ALL_GLOBAL_CONTENT_BLOCKS = `
  query GetAllGlobalContentBlocks {
    globalOptions {
      globalContentBlocks {
        approach {
          title
          subtitle
          steps {
            title
            image { node { sourceUrl altText } }
          }
        }
        cultureGallerySlider {
          title
          subtitle
          useGlobalSocialLinks
          images { edges { node { sourceUrl altText } } }
        }
        whyCda: whyCdaBlock {
          title
          subtitle
          usp {
            title
            description
            icon { node { sourceUrl altText } }
          }
        }
        valuesBlock {
          title
          subtitle
          illustration { node { sourceUrl altText } }
          values { title text }
        }
        servicesAccordion {
          title
          subtitle
          illustration { node { sourceUrl altText } }
          services {
            edges {
              node { ... on Service { id title slug } }
            }
          }
        }
        technologiesSlider {
          title
          subtitle
          logos { edges { node { ... on Technology { id title slug } } } }
        }
        showreel {
          title
          subtitle
          button { url title target }
          largeImage { node { sourceUrl altText } }
          logos { logo { node { sourceUrl altText } } }
        }
        locationsImage {
          title
          subtitle
          illustration { node { sourceUrl altText } }
          countries {
            countryName
            offices { name address email phone }
          }
        }
        newsCarousel {
          title
          subtitle
          articleSelection
          manualArticles { edges { node { ... on BlogPost { id title slug } } } }
        }
        newsletterSignup {
          title
          subtitle
          hubspotScript
          termsText
        }
        contactFormLeftImageRight {
          title
          formCode
          useGlobalContactDetails
          contactDetailsOverride
          rightMediaType
          rightImage { node { sourceUrl altText } }
          rightVideo { node { sourceUrl } }
          rightGif { node { sourceUrl altText } }
        }
        joinOurTeam {
          title
          text
          button { url title target }
          leftMediaType
          leftImage { node { sourceUrl altText } }
          leftVideo { node { sourceUrl } }
          leftGif { node { sourceUrl altText } }
          rightMediaType
          rightImage { node { sourceUrl altText } }
          rightVideo { node { sourceUrl } }
          rightGif { node { sourceUrl altText } }
        }
        threeColumnsWithIcons {
          sectionTitle
          columns {
            icon { node { sourceUrl altText } }
            title
            text
          }
        }
        fullVideo {
          url
          file { node { sourceUrl } }
        }
        statsAndNumbers {
          image { node { sourceUrl altText } }
          stats { number text }
          description
          cta { url title target }
        }
      }
    }
  }
`;

export async function getAllGlobalContentBlocks() {
  const response = await executeGraphQLQuery(GET_ALL_GLOBAL_CONTENT_BLOCKS);
  if (response.errors) {
    console.warn('Global content GraphQL warnings:', response.errors);
  }
  return response.data?.globalOptions?.globalContentBlocks || null;
}

// =============================================================================
// SMALL GLOBAL SECTION QUERIES (per-section, minimal)
// =============================================================================
export const GET_GLOBAL_APPROACH = `
  query GetGlobalApproach {
    globalOptions { globalContentBlocks {
      approach {
        title
        subtitle
        steps { title image { node { sourceUrl altText } } }
      }
    } }
  }
`;

export const GET_GLOBAL_CASE_STUDIES_SECTION_ONLY = `
  query GetGlobalCaseStudiesSectionOnly {
    globalOptions { globalContentBlocks {
      caseStudiesSection {
        title
        subtitle
        knowledgeHubLink { url title target }
        selectedStudies {
          nodes {
            ... on CaseStudy { id title uri excerpt featuredImage { node { sourceUrl altText } } }
          }
        }
      }
    } }
  }
`;

export const GET_GLOBAL_STATS_MIN = `
  query GetGlobalStatsMin {
    globalOptions { globalContentBlocks {
      statsAndNumbers {
        image { node { sourceUrl altText } }
        stats { number text }
        description
        cta { url title target }
      }
    } }
  }
`;

export const GET_GLOBAL_IMAGE_FRAME_MIN = `
  query GetGlobalImageFrame {
    globalOptions { globalContentBlocks {
      imageFrameBlock {
        title
        subtitle
        text
        button { url title target }
        contentImage { node { sourceUrl altText } }
        frameImage   { node { sourceUrl altText } }
        arrowImage   { node { sourceUrl altText } }
      }
    } }
  }
`;

export const GET_GLOBAL_NEWS_CAROUSEL_MIN = `
  query GetGlobalNewsCarousel {
    globalOptions { globalContentBlocks {
      newsCarousel {
        title
        subtitle
        articleSelection
        manualArticles { edges { node { ... on BlogPost { id title slug } } } }
      }
    } }
  }
`;

export const GET_GLOBAL_THREE_COLUMNS_MIN = `
  query GetGlobalThreeColumns {
    globalOptions { globalContentBlocks {
      threeColumnsWithIcons {
        sectionTitle
        columns {
          icon { node { sourceUrl altText } }
          title
          text
        }
      }
    } }
  }
`;

export async function getGlobalApproachBlock() {
  const res = await executeGraphQLQuery(GET_GLOBAL_APPROACH);
  return res?.data?.globalOptions?.globalContentBlocks?.approach || null;
}

export async function getGlobalCaseStudiesSectionOnly() {
  const res = await executeGraphQLQuery(GET_GLOBAL_CASE_STUDIES_SECTION);
  return res?.data?.globalOptions?.globalContentBlocks?.caseStudiesSection || null;
}

export async function getGlobalStatsBlock() {
  const res = await executeGraphQLQuery(GET_GLOBAL_STATS_MIN);
  return res?.data?.globalOptions?.globalContentBlocks?.statsAndNumbers || null;
}

export async function getGlobalImageFrameBlockMin() {
  const res = await executeGraphQLQuery(GET_GLOBAL_IMAGE_FRAME_MIN);
  return res?.data?.globalOptions?.globalContentBlocks?.imageFrameBlock || null;
}

export async function getGlobalNewsCarouselConfigMin() {
  const res = await executeGraphQLQuery(GET_GLOBAL_NEWS_CAROUSEL_MIN);
  return res?.data?.globalOptions?.globalContentBlocks?.newsCarousel || null;
}

export async function getGlobalThreeColumnsMin() {
  const res = await executeGraphQLQuery(GET_GLOBAL_THREE_COLUMNS_MIN);
  return res?.data?.globalOptions?.globalContentBlocks?.threeColumnsWithIcons || null;
}

// =============================================================================
// ENTRY-LEVEL TOGGLES (per page/post)
// =============================================================================
export const GET_PAGE_GLOBAL_TOGGLES = `
  query GetPageGlobalToggles($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      slug
      globalContentToggles {
        showApproach
        showCaseStudies
        showImageFrame
        showNewsCarousel
        showThreeColumns
        showValues
        showWhyCda
        showServicesAccordion
        showTechnologiesSlider
        showShowreel
        showLocationsImage
        showNewsletterSignup
        showContactFormLeftImageRight
        showJoinOurTeam
        showFullVideo
        showStatsAndNumbers
      }
    }
  }
`;

export async function getPageGlobalTogglesByUri(uri) {
  const res = await executeGraphQLQuery(GET_PAGE_GLOBAL_TOGGLES, { uri });
  return res?.data?.page?.globalContentToggles || null;
}

// =============================================================================
// TECHNOLOGIES UTILITY FUNCTIONS (core)
// =============================================================================

// =============================================================================
// TECHNOLOGIES UTILITY FUNCTIONS (core)
// =============================================================================
export async function getTechnologiesWithPagination(variables) {
  const response = await executeGraphQLQuery(GET_TECHNOLOGIES_WITH_PAGINATION, variables);
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], pageInfo: null };
  }
  return {
    nodes: response.data?.technologies?.nodes || [],
    pageInfo: response.data?.technologies?.pageInfo || null
  };
}

export async function getTechnologyBySlug(slug) {
  const response = await executeGraphQLQuery(GET_TECHNOLOGY_BY_SLUG, { slug });
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }
  return response.data?.technology || null;
}

export async function getTechnologySlugs() {
  const response = await executeGraphQLQuery(GET_TECHNOLOGY_SLUGS);
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }
  return response.data?.technologies?.nodes?.map(t => t.slug) || [];
}

// =============================================================================
// POLICIES UTILITY FUNCTIONS
// =============================================================================

export async function getPolicyBySlug(slug) {
  const response = await executeGraphQLQuery(GET_POLICY_BY_SLUG, { slug });
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.policy || null;
}

export async function getAllPolicies() {
  const response = await executeGraphQLQuery(GET_ALL_POLICIES);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.policies?.nodes || [];
}

export async function getPoliciesWithPagination(variables) {
  const response = await executeGraphQLQuery(GET_POLICIES_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], pageInfo: null };
  }

  return {
    nodes: response.data?.policies?.nodes || [],
    pageInfo: response.data?.policies?.pageInfo || null
  };
}

export async function getPolicySlugs() {
  const response = await executeGraphQLQuery(GET_POLICY_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.policies?.nodes?.map((policy) => policy.slug) || [];
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

// =============================================================================
// POLICIES QUERIES
// =============================================================================

export const GET_ALL_POLICIES = `
  query GetAllPolicies($first: Int, $after: String, $where: RootQueryToPolicyConnectionWhereArgs) {
    policies(first: $first, after: $after, where: $where) {
      nodes {
        id
        title
        slug
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_POLICIES_WITH_PAGINATION = `
  query GetPoliciesWithPagination($first: Int = 12, $after: String, $search: String) {
    policies(first: $first, after: $after, where: { search: $search }) {
      nodes {
        id
        title
        slug
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_POLICY_BY_SLUG = `
  query GetPolicyBySlug($slug: ID!) {
    policy(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      modified
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_POLICY_SLUGS = `
  query GetPolicySlugs {
    policies {
      nodes {
        slug
      }
    }
  }
`;

// =============================================================================
// TECHNOLOGIES QUERIES (core fields)
// =============================================================================
export const GET_TECHNOLOGIES_WITH_PAGINATION = `
  query GetTechnologiesWithPagination($first: Int = 50, $after: String, $search: String) {
    technologies(first: $first, after: $after, where: { search: $search }) {
      nodes {
        id
        title
        slug
        date
        modified
        excerpt
        content
        featuredImage { node { sourceUrl altText } }
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

export const GET_TECHNOLOGY_BY_SLUG = `
  query GetTechnologyBySlug($slug: ID!) {
    technology(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      modified
      excerpt
      content
      featuredImage { node { sourceUrl altText } }
    }
  }
`;

export const GET_TECHNOLOGY_SLUGS = `
  query GetTechnologySlugs {
    technologies {
      nodes { slug }
    }
  }
`;
