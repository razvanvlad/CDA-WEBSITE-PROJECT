// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/lib/graphql/queries.js
// Query to fetch homepage content with all required sections
export const GET_HOMEPAGE_CONTENT = `
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
      date
      testContentFields {
        testText
        testTextarea
        testNumber
        testToggle
        testImage {
          node {
            sourceUrl
            altText
            title
            mediaDetails {
              width
              height
            }
          }
        }
        testGallery {
          nodes {
            sourceUrl
            altText
            title
          }
        }
        testFlexibleContent {
          __typename
          ... on TestContentFieldsTestFlexibleContentCtaSectionLayout {
            title
            buttonText
            buttonLink
          }
          ... on TestContentFieldsTestFlexibleContentTextBlockLayout {
            title
            content
          }
          ... on TestContentFieldsTestFlexibleContentImageSectionLayout {
            image {
              node {
                sourceUrl
                altText
                title
              }
            }
            caption
          }
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