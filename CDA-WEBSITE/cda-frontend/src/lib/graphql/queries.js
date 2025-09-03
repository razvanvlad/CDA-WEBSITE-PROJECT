// src/lib/graphql/queries.js
import { gql } from '@apollo/client';

export const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
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
  }
`;

// src/lib/graphql/queries.js - Replace GET_ABOUT_US_CONTENT with this:

export const GET_ABOUT_US_CONTENT = gql`
  query GetAboutUsContent($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      uri
      date
      ... on Page {
        aboutUsContent {
          contentPageHeader {
            title
            text
            cta {
              url
              title
              target
            }
          }
          whoWeAreSection {
            imageWithFrame {
              node {
                sourceUrl
                altText
              }
            }
            sectionTitle
            sectionText
            cta {
              url
              title
              target
            }
          }
          whyCdaSection {
            title
            description
            icon {
              node {
                sourceUrl
                altText
              }
            }
          }
          servicesSection {
            servicesAccordion {
              title
              description
              link {
                url
                title
                target
              }
            }
          }
          cultureSection {
            gallery {
              nodes {
                sourceUrl
                altText
              }
            }
          }
          approachSection {
            title
            text
            image {
              node {
                sourceUrl
                altText
              }
            }
          }
          statsSection {
            number
            label
            image {
              node {
                sourceUrl
                altText
              }
            }
          }
          videoSection {
            url
            title
          }
          leadershipSection {
            image {
              node {
                sourceUrl
                altText
              }
            }
            name
            position
            bio
          }
          showreelSection {
            video
          }
        }
      }
    }
  }
`;