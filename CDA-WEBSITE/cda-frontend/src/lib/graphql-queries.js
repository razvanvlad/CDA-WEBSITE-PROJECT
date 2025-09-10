/**
 * GraphQL Queries for CDA Website
 * Single post and archive queries for all custom post types
 */

// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
  (process?.env?.NEXT_PUBLIC_WORDPRESS_URL
    ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, '')}/graphql`
    : 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql');

/**
 * Execute GraphQL query
 */
export async function executeGraphQLQuery(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
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
          duration
        }
        challenge {
          title
          description
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        solution {
          title
          description
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        results {
          title
          description
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        keyMetrics {
          metric
          value
          description
        }
        projectGallery {
          image {
            node {
              sourceUrl
              altText
            }
          }
          caption
        }
        featured
      }
      projectTypes {
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
      globalSharedContent {
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

  return response.data?.globalOptions?.globalSharedContent || null;
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
      serviceOverviewContent {
        heroSection {
          title
          description
          imageRight { node { sourceUrl altText } }
        }
        featuredServiceSection {
          leftColumnTitle
          selectedService { ... on Service { id title slug } }
          caseStudyOverride { ... on CaseStudy { id title slug featuredImage { node { sourceUrl altText } } } }
          caseStudyCtaLabel
          caseStudyCtaLink { url title target }
        }
        rightColumn {
          title
          description
          bulletPoints { text }
          bulletsTwoRows
          ctaServiceLink { url title target }
          ctaContactUs { url title target }
        }
        globalContentToggles {
          enableApproach
          enableProjectsFilteredByService
          enableLatestNews
          enableOurServicesSlider
        }
        ourServicesSlider {
          title
          subtitle
          image { node { sourceUrl altText } }
          cta { url title target }
        }
      }
    }
  }
`;

export async function getServiceOverviewContent() {
  const response = await executeGraphQLQuery(GET_SERVICE_OVERVIEW_CONTENT);
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }
  return response.data?.page?.serviceOverviewContent || null;
}
