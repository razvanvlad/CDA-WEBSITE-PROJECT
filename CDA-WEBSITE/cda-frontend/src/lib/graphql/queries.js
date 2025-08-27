// src/lib/graphql/queries.js
import { gql } from '@apollo/client';

export const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
      date
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
        caseStudiesSection {
          title
          caseStudies {
            nodes {
              id
              title
              featuredImage {
                node {
                  sourceUrl
                  altText
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
    }
  }
`;