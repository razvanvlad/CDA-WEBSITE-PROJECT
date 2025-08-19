// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/lib/graphql/queries.js
// Query to fetch homepage content with all required sections
export const GET_HOMEPAGE_CONTENT = `
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
      date
      homepageFields {
        headerTitle
        headerSubtitle
        headerImage {
          node {
            sourceUrl
            altText
            title
          }
        }
        primaryCta {
          title
          url
        }
        secondaryCta {
          title
          url
        }
        servicesAccordion {
          title
          subtitle
          services {
            title
            description
            link {
              url
              title
            }
          }
        }
        technologies {
          title
          subtitle
          logos {
            node {
              sourceUrl
              altText
              title
            }
          }
        }
        values {
          title
          subtitle
          valueItems {
            title
            description
          }
          image {
            node {
              sourceUrl
              altText
              title
            }
          }
        }
        caseStudies {
          title
          subtitle
          studies {
            title
            excerpt
            link {
              url
              title
            }
            image {
              node {
                sourceUrl
                altText
                title
              }
            }
          }
        }
        locations {
          title
          subtitle
          countries {
            countryName
            offices {
              name
              address
              email
              phone
            }
          }
          image {
            node {
              sourceUrl
              altText
              title
            }
          }
        }
        news {
          title
          subtitle
          articles {
            title
            excerpt
            category
            link {
              url
              title
            }
            image {
              node {
                sourceUrl
                altText
                title
            }
          }
        }
        newsletter {
          title
          subtitle
          buttonText
          privacyText
        }
      }
    }
  }
`;

// Query to fetch all pages for dynamic routing
export const GET_ALL_PAGES = `
  query GetAllPages {
    pages(first: 100) {
      nodes {
        id
        uri
        title
      }
    }
  }
`;

// Query to fetch a specific page by URI
export const GET_PAGE_BY_URI = `
  query GetPageByUri($uri: String!) {
    page(id: $uri, idType: URI) {
      id
      title
      content
      date
      modified
    }
  }
`;