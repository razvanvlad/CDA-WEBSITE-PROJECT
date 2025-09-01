// src/lib/graphql/queries.js
import { gql } from '@apollo/client';

export const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      ... on NodeWithTitle {
        title
      }
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      date
      ... on Page {
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
          platformsSection {
            title
            subtitle
            logos {
              logo {
                node {
                  sourceUrl
                  altText
                }
              }
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
          caseStudiesSection {
            title
            caseStudies {
              nodes {
                id
                ... on NodeWithTitle {
                  title
                }
                ... on NodeWithFeaturedImage {
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
          newsletterSection {
            title
            subtitle
          }
        }
      }
    }
    menu(id: "primary", idType: NAME) {
      menuItems {
        nodes {
          label
          url
          parentId
          id
        }
      }
    }
  }
`;