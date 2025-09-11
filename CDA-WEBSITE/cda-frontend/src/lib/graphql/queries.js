// src/lib/graphql/queries.js - COMPLETE VERSION
import { gql } from '@apollo/client';

// Updated Homepage Query - Add to your queries.js
export const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title

      # Homepage-specific content
      homepageContent {
        headerSection {
          title
          subtitle
          primaryCta { url title target }
          secondaryCta { url title target }
          desktopImage { node { sourceUrl altText } }
        }

        whoWeAreSection {
          title
          subtitle
          image { node { sourceUrl altText } }
          button { url title target }
        }

        servicesAccordion {
          title
          description
          link { url title target }
        }

        platformsSection {
          title
          subtitle
          logos { logo { node { sourceUrl altText } } }
        }

        valuesSection {
          title
          valueItems { title description }
        }

        caseStudiesSection {
          title
          caseStudies { nodes { id title } }
        }

        newsletterSection {
          title
          subtitle
        }
      }

      # Page-level global block overrides (optional)
      globalBlockOverrides {
        whyCdaOverride { overrideWhyCda }
        approachOverride { overrideApproach }
      }

      # SEO Settings
      seoSettings {
        seoTitle
        seoDescription
        seoKeywords
        noindex
        nofollow
        canonicalUrl
      }
    }

    # Global Options - Contains both Why CDA and Approach blocks
    globalOptions {
      globalContentBlocks {
        whyCdaBlock {
          title
          subtitle
          cards { title description image { node { sourceUrl altText } } }
        }
        approach {
          title
          subtitle
          steps { stepNumber title description image { node { sourceUrl altText } } }
        }
      }
    }
  }
`;

// Replace legacy export with new one or keep both if referenced elsewhere
export const GET_GLOBAL_CONTENT_BLOCKS = gql`
  query GetGlobalContentBlocks {
    globalOptions {
      globalContentBlocks {
        imageFrameBlock {
          title
          subtitle
          text
          button { url title target }
          contentImage { node { sourceUrl altText } }
          frameImage { node { sourceUrl altText } }
          arrowImage { node { sourceUrl altText } }
        }
        servicesAccordion {
          title
          subtitle
          illustration { node { sourceUrl altText } }
          services { nodes { ... on Service { id title uri } } }
        }
        technologiesSlider {
          title
          subtitle
          logos { nodes { ... on Technology { id title uri } } }
        }
        valuesBlock {
          title
          subtitle
          values { title text }
          illustration { node { sourceUrl altText } }
        }
        whyCdaBlock {
          title
          subtitle
          cards { title description image { node { sourceUrl altText } } }
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
          countries { countryName offices { name address email phone } }
          illustration { node { sourceUrl altText } }
        }
        newsCarousel {
          title
          subtitle
          articleSelection
          category { nodes { name slug } }
          manualArticles { nodes { ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } } } }
        }
        newsletterSignup {
          title
          subtitle
          hubspotScript
          termsText
        }
        statsImage {
          text
          button { url title target }
          stats { number text }
          illustration { node { sourceUrl altText } }
        }
        cultureGallerySlider {
          title
          subtitle
          useGlobalSocialLinks
          images { sourceUrl altText caption }
        }
        approach {
          title
          subtitle
          steps { image { node { sourceUrl altText } } title }
        }
        fullVideo { url file { node { mediaItemUrl } } }
        joinOurTeam {
          leftMediaType
          leftImage { node { sourceUrl altText } }
          leftVideo { node { mediaItemUrl } }
          leftGif { node { sourceUrl altText } }
          title
          text
          button { url title target }
          rightMediaType
          rightImage { node { sourceUrl altText } }
          rightVideo { node { mediaItemUrl } }
          rightGif { node { sourceUrl altText } }
        }
        columnsWithIcons3X { title subtitle columns { iconClass title description } }
        contactFormLeftImageRight { title subtitle formShortcode image { node { sourceUrl altText } } }
      }
    }
  }
`;

// Remove or deprecate legacy GET_GLOBAL_SHARED_CONTENT block
// export const GET_GLOBAL_SHARED_CONTENT = ... (deprecated)

export const GET_FOOTER_MENU = gql`
  query GetFooterMenu {
    footerMenu: menu(id: FOOTER, idType: LOCATION) {
      menuItems(first: 100) {
        nodes {
          id
          parentId
          label
          url
          connectedNode {
            node {
              ... on MenuItemLinkable {
                uri
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_MENU = gql`
  query GetPrimaryMenu {
    primaryMenu: menu(id: PRIMARY, idType: LOCATION) {
      menuItems(first: 100) {
        nodes {
          id
          parentId
          label
          url
          connectedNode {
            node {
              ... on MenuItemLinkable {
                uri
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_TERMS_CONDITIONS_CONTENT = gql`
  query GetTermsConditionsContent {
    page(id: "/terms-conditions", idType: URI) {
      id
      title
      slug
      uri
      termsConditionsContent {
        headerSection {
          title
          lastUpdated
        }
        sections {
          title
          content
        }
      }
    }
  }
`;
export const GET_404_CONTENT = gql`
  query Get404Content {
    page(id: "/404", idType: URI) {
      id
      title
      error404Content {
        mainSection {
          title
          subtitle
          message
          image { node { sourceUrl altText } }
        }
        actionsSection {
          title
          homeButton { url title target }
          contactButton { url title target }
        }
        searchSection {
          title
          searchPlaceholder
        }
        suggestionsSection {
          title
          suggestionsItems {
            title
            description
            link { url title target }
          }
        }
      }
    }
  }
`;

// Case Study page content used by src/app/case-study/page.js
export const GET_CASE_STUDY_CONTENT = gql`
  query GetCaseStudyContent {
    page(id: "/case-study", idType: URI) {
      id
      title
      slug
      uri
      caseStudyOakleighContent {
        headerSection {
          title
          subtitle
        }
      }
    }
  }
`;
