// src/lib/graphql/queries.js - COMPLETE VERSION
import { gql } from '@apollo/client';

// Updated Homepage Query - Add to your queries.js
export const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
      homepageContent {
        headerSection {
          title
          subtitle
          primaryCta {
            url
            title
            target
          }
          secondaryCta {
            url
            title
            target
          }
          desktopImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        servicesAccordion {
          title
          description
          link {
            url
            title
            target
          }
        }
        valuesSection {
          title
          valueItems {
            title
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
        newsletterSection {
          title
          subtitle
        }
      }
    }
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
      }
    }
  }
`;