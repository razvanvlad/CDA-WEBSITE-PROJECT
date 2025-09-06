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
        
        servicesAccordion {
          title
          description
          link {
            url
            title
            target
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
              # Add other case study fields as needed
            }
          }
        }
        
        newsletterSection {
          title
          subtitle
        }
      }
      
      # Page-level global block overrides (optional)
      globalBlockOverrides {
        whyCdaOverride {
          overrideWhyCda
          # Custom Why CDA fields would go here if override is enabled
        }
        
        approachOverride {
          overrideApproach
          # Custom approach fields would go here if override is enabled
        }
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
      globalSharedContent {
        
        # Why CDA Block - Global content
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
        
        # Approach Block - Global content  
        approachBlock {
          title
          subtitle
          steps {
            stepNumber
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

// B2B Lead Generation Query (ID: 775)
export const GET_B2B_LEAD_GENERATION_CONTENT = gql`
  query GET_B2B_LEAD_GENERATION {
    page(id: "775", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      b2bLeadGenerationContent {
        headerSection {
          title
          subtitle
          desktopImage {
            node {
              sourceUrl
              altText
            }
          }
          mobileImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        servicesSection {
          title
          servicesItems {
            icon {
              node {
                sourceUrl
                altText
              }
            }
            title
            description
          }
        }
        strategySection {
          title
          content
          strategySteps {
            stepNumber
            title
            description
          }
        }
        testimonialsSection {
          title
          testimonialsItems {
            content
            author
            position
            company
          }
        }
        ctaSection {
          title
          content
          button {
            url
            title
            target
          }
        }
      }
    }
  }
`;

// Software Development Query (ID: 777) - ❌ ACF field not exposed to GraphQL
export const GET_SOFTWARE_DEVELOPMENT_CONTENT = gql`
  query GET_SOFTWARE_DEVELOPMENT {
    page(id: "777", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      # softwareDevelopmentContent field is not available in GraphQL
      # Need to configure ACF field group to "Show in GraphQL"
    }
  }
`;

// Booking Systems Query (ID: 779)
export const GET_BOOKING_SYSTEMS_CONTENT = gql`
  query GET_BOOKING_SYSTEMS {
    page(id: "779", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      bookingSystemsContent {
        headerSection {
          title
          subtitle
          desktopImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        featuresSection {
          title
          featuresItems {
            icon {
              node {
                sourceUrl
                altText
              }
            }
            title
            description
          }
        }
        integrationsSection {
          title
          content
          integrationsLogos {
            name
            logo {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        demoSection {
          title
          content
          demoVideo
          demoButton {
            url
            title
            target
          }
        }
        ctaSection {
          title
          content
          button {
            url
            title
            target
          }
        }
      }
    }
  }
`;

// Digital Marketing Query (ID: 781)
export const GET_DIGITAL_MARKETING_CONTENT = gql`
  query GET_DIGITAL_MARKETING {
    page(id: "781", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      digitalMarketingContent {
        headerSection {
          title
          subtitle
          desktopImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        servicesSection {
          title
          intro
          servicesItems {
            icon {
              node {
                sourceUrl
                altText
              }
            }
            title
            description
            features
          }
        }
        strategySection {
          title
          content
          strategySteps {
            stepNumber
            title
            description
          }
        }
        toolsSection {
          title
          content
          toolsLogos {
            name
            logo {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        resultsSection {
          title
          content
          stats {
            number
            label
          }
        }
        ctaSection {
          title
          content
          button {
            url
            title
            target
          }
        }
      }
    }
  }
`;

// Outsourced CMO Query (ID: 783)
export const GET_OUTSOURCED_CMO_CONTENT = gql`
  query GET_OUTSOURCED_CMO {
    page(id: "783", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      outsourcedCmoContent {
        headerSection {
          title
          subtitle
          desktopImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        introSection {
          title
          content
        }
        servicesSection {
          title
          content
          servicesItems {
            icon {
              node {
                sourceUrl
                altText
              }
            }
            title
            description
          }
        }
        benefitsSection {
          title
          content
          benefitsItems {
            number
            title
            description
          }
        }
        processSection {
          title
          content
          processSteps {
            stepNumber
            title
            description
          }
        }
        testimonialsSection {
          title
          testimonialsItems {
            content
            author
            position
            company
            photo {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        ctaSection {
          title
          content
          button {
            url
            title
            target
          }
        }
      }
    }
  }
`;

export const GET_AI_CONTENT = gql`
  query GET_AI_CONTENT {
  page(id: "785", idType: DATABASE_ID) {
    id
    title
    aiContent {
      headerSection {
        title
        subtitle
        desktopImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      introSection {
        title
        content
      }
      servicesSection{
        title
        servicesItems{
          title
          description
        }
      }
      benefitsSection{
        title
        content
        benefitsItems{
          title
          description
        }
      }
      ctaSection{
        title
        content
        button {
          target
          title
          url
        }
      }
    }
  }
}
`;


// Knowledge Hub Query (ID: 787)
export const GET_KNOWLEDGE_HUB_CONTENT = gql`
  query GET_KNOWLEDGE_HUB {
    page(id: "787", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      knowledgeHubContent {
        headerSection {
          title
          subtitle
          searchPlaceholder
        }
        featuredArticle {
          title
          excerpt
          author
          publishDate
          readTime
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          url
        }
        categoriesSection {
          title
          categories {
            name
            color
            articleCount
            url
          }
        }
        articlesSection {
          title
          articles {
            title
            excerpt
            author
            publishDate
            readTime
            category
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            url
          }
        }
      }
    }
  }
`;

// Project Case Study Query (ID: 789)
export const GET_CASE_STUDY_CONTENT = gql`
  query GET_CASE_STUDY {
    page(id: "789", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      caseStudyOakleighContent {
        headerSection {
          title
          subtitle
          clientName
          projectType
          projectDuration
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        challengeSection {
          title
          content
          challenges {
            title
            description
          }
        }
        solutionSection {
          title
          content
          solutions {
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
        resultsSection {
          title
          content
          results {
            metric
            value
            description
          }
        }
        technologiesSection {
          title
          technologies {
            name
            logo {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        ctaSection {
          title
          content
          button {
            url
            title
            target
          }
        }
      }
    }
  }
`;

// Contact Query (ID: 791)
export const GET_CONTACT_CONTENT = gql`
  query GET_CONTACT {
    page(id: "791", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      contactContent {
        headerSection {
          title
          subtitle
        }
        contactInfo {
          phone
          email
          address
          workingHours
        }
        contactForm {
          title
          description
          submitButtonText
        }
        locationSection {
          title
          address
          mapEmbedCode
        }
        ctaSection {
          title
          content
        }
      }
    }
  }
`;

// Terms & Conditions Query (ID: 793)
export const GET_TERMS_CONDITIONS_CONTENT = gql`
  query GET_TERMS_CONDITIONS {
    page(id: "793", idType: DATABASE_ID) {
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

// 404 Error Page Query (ID: 795)
export const GET_404_CONTENT = gql`
  query GET_404 {
    page(id: "795", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      error404Content {
        mainSection {
          title
          subtitle
          message
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        actionsSection {
          title
          homeButton {
            url
            title
            target
          }
          contactButton {
            url
            title
            target
          }
        }
        searchSection {
          title
          searchPlaceholder
        }
        suggestionsSection {
          title
          suggestionsItems {
            title
            link {
              url
              title
              target
            }
            description
          }
        }
      }
    }
  }
`;

// About Us Content Query (ID: 317)
export const GET_ABOUT_US_CONTENT = gql`
  query GET_ABOUT_US_CONTENT($uri: String!) {
    page(id: $uri, idType: URI) {
      id
      title
      slug
      aboutUsContent {
        videoSection {
          title
          subtitle
          videoUrl
          thumbnailImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        leadershipSection {
          title
          content
          leaders {
            name
            position
            bio
            photo {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        statsSection {
          title
          subtitle
          stats {
            number
            label
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
        whyCdaSection {
          title
          content
          reasons {
            title
            description
            icon {
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

export const GET_MENU = gql`
  query GetMenu {
    primaryMenu: menu(id: "primary", idType: SLUG) {
      menuItems {
        nodes {
          id
          label
          url
          parentId
          order
        }
      }
    }
  }
`;

export const GET_WHY_CDA_GLOBAL = gql`
  query GetWhyCdaGlobal {
    globalBlocks: acfOptionsGlobalBlocks {
      whyCdaTitle
      whyCdaSubtitle
      whyCdaCards {
        title
        description
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`;

// Working Global Content Query (tested and working)
export const GET_GLOBAL_CONTENT = gql`
  query GetGlobalContent {
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
        approachBlock {
          title
          subtitle
          steps {
            stepNumber
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
        technologiesSliderBlock {
          title
          subtitle
          logos {
            image {
              node {
                sourceUrl
                altText
              }
            }
            name
            url
          }
        }
      }
    }
  }
`;