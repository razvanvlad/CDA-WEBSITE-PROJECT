/**
 * GraphQL Queries for CDA Website
 * Single post and archive queries for all custom post types
 */

// GraphQL endpoint configuration
const GRAPHQL_ENDPOINT = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

/**
 * Execute GraphQL query
 */
export async function executeGraphQLQuery<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<GraphQLResponse<T>> {
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

export async function getServiceBySlug(slug: string) {
  const response = await executeGraphQLQuery(GET_SERVICE_BY_SLUG, { slug });
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.service || null;
}

export async function getCaseStudyBySlug(slug: string) {
  const response = await executeGraphQLQuery(GET_CASE_STUDY_BY_SLUG, { slug });
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return null;
  }

  return response.data?.caseStudy || null;
}

export async function getTeamMemberBySlug(slug: string) {
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

export async function getServicesWithPagination(variables: {
  first?: number;
  after?: string;
  search?: string;
  serviceTypeIn?: string[];
}) {
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

export async function getCaseStudiesWithPagination(variables: {
  first?: number;
  offset?: number;
  search?: string;
  projectTypeIn?: string[];
  featured?: boolean;
}) {
  const response = await executeGraphQLQuery(GET_CASE_STUDIES_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], total: 0 };
  }

  return {
    nodes: response.data?.caseStudies?.nodes || [],
    total: response.data?.caseStudies?.pageInfo?.offsetPagination?.total || 0
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

export async function getTeamMembersWithPagination(variables: {
  first?: number;
  offset?: number;
  search?: string;
  departmentIn?: string[];
  featured?: boolean;
}) {
  const response = await executeGraphQLQuery(GET_TEAM_MEMBERS_WITH_PAGINATION, variables);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return { nodes: [], total: 0 };
  }

  return {
    nodes: response.data?.teamMembers?.nodes || [],
    total: response.data?.teamMembers?.pageInfo?.offsetPagination?.total || 0
  };
}

// Functions to get all slugs for generateStaticParams
export async function getServiceSlugs() {
  const response = await executeGraphQLQuery(GET_SERVICE_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.services?.nodes?.map((service: any) => service.slug) || [];
}

export async function getCaseStudySlugs() {
  const response = await executeGraphQLQuery(GET_CASE_STUDY_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.caseStudies?.nodes?.map((caseStudy: any) => caseStudy.slug) || [];
}

export async function getTeamMemberSlugs() {
  const response = await executeGraphQLQuery(GET_TEAM_MEMBER_SLUGS);
  
  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    return [];
  }

  return response.data?.teamMembers?.nodes?.map((teamMember: any) => teamMember.slug) || [];
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