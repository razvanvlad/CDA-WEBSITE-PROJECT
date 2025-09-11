/**
 * CDA WEBSITE - CONFIRMED WORKING GRAPHQL QUERIES
 * Tested and validated against your WordPress backend
 * Copy these into your Next.js components
 */

// ============================================
// BASIC QUERIES
// ============================================

export const GET_ALL_PAGES = `
  query GetPages {
    pages {
      nodes {
        id
        title
        slug
        uri
      }
    }
  }
`;

export const GET_MENUS = `
  query GetMenus {
    menus {
      nodes {
        name
        menuItems {
          nodes {
            label
            url
          }
        }
      }
    }
  }
`;

// ============================================
// HOMEPAGE QUERIES
// ============================================

export const GET_HOMEPAGE_BY_ID = `
  query GetHomepageById {
    page(id: "289", idType: DATABASE_ID) {
      id
      title
      homepageContent {
        headerSection {
          title
          subtitle
        }
      }
    }
  }
`;

export const GET_HOMEPAGE_BY_URI = `
  query GetHomepageByUri {
    page(id: "/", idType: URI) {
      title
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

// ============================================
// GLOBAL OPTIONS - WHY CDA BLOCK (FULLY WORKING)
// ============================================

// Simple version - just title and subtitle
export const GET_WHY_CDA_SIMPLE = `
  query GetWhyCdaBlockSimple {
    globalOptions {
      globalSharedContent {
        whyCdaBlock {
          title
          subtitle
        }
      }
    }
  }
`;

// With cards but no images
export const GET_WHY_CDA_WITH_CARDS = `
  query GetWhyCdaBlockWithCards {
    globalOptions {
      globalSharedContent {
        whyCdaBlock {
          title
          subtitle
          cards {
            title
            description
          }
        }
      }
    }
  }
`;

// ⭐ COMPLETE VERSION WITH IMAGES - USE THIS ONE!
export const GET_WHY_CDA_COMPLETE = `
  query GetWhyCdaBlockComplete {
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

// ============================================
// ALL GLOBAL SHARED CONTENT
// ============================================

export const GET_ALL_GLOBAL_CONTENT = `
  query GetAllGlobalSharedContent {
    globalOptions {
      globalSharedContent {
        contactInfo {
          __typename
        }
        footerContent {
          __typename
        }
        headerContent {
          __typename
        }
        scriptsTracking {
          __typename
        }
        socialMedia {
          __typename
        }
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

// ============================================
// COMBINED QUERIES (More Efficient)
// ============================================

export const GET_HOMEPAGE_WITH_GLOBAL = `
  query GetHomepageWithGlobal {
    page(id: "289", idType: DATABASE_ID) {
      id
      title
      homepageContent {
        headerSection {
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

// ============================================
// EXAMPLE USAGE IN NEXT.JS COMPONENT
// ============================================

/*
import { useQuery } from '@apollo/client';
import { GET_WHY_CDA_COMPLETE } from '@/lib/queries';

export default function WhyCdaSection() {
  const { loading, error, data } = useQuery(GET_WHY_CDA_COMPLETE);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  const whyCda = data?.globalOptions?.globalSharedContent?.whyCdaBlock;
  
  return (
    <section>
      <h2>{whyCda?.title}</h2>
      <p>{whyCda?.subtitle}</p>
      <div className="cards">
        {whyCda?.cards?.map((card, index) => (
          <div key={index} className="card">
            {card.image?.node && (
              <img 
                src={card.image.node.sourceUrl} 
                alt={card.image.node.altText || card.title}
              />
            )}
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
*/

// ============================================
// KEY PATTERNS TO REMEMBER
// ============================================

/**
 * 1. ALWAYS use 'globalOptions' not 'acfOptionsGlobalContent'
 * 
 * 2. Image fields need the 'node' wrapper:
 *    WRONG: image { sourceUrl }
 *    RIGHT: image { node { sourceUrl } }
 * 
 * 3. Homepage can be accessed two ways:
 *    - By ID: page(id: "289", idType: DATABASE_ID)
 *    - By URI: page(id: "/", idType: URI)
 * 
 * 4. Global content structure:
 *    globalOptions > globalSharedContent > [field]
 * 
 * 5. Available global fields:
 *    - contactInfo
 *    - footerContent
 *    - headerContent
 *    - scriptsTracking
 *    - socialMedia
 *    - whyCdaBlock
 */

// ============================================
// INTROSPECTION QUERIES (For Discovering Fields)
// ============================================

export const INTROSPECT_ROOT_FIELDS = `
  query GetRootQueryFields {
    __type(name: "RootQuery") {
      fields {
        name
        type {
          name
        }
      }
    }
  }
`;

export const INTROSPECT_GLOBAL_OPTIONS = `
  query GetGlobalOptionsStructure {
    __type(name: "GlobalOptions") {
      fields {
        name
        type {
          name
        }
      }
    }
  }
`;

export const INTROSPECT_GLOBAL_SHARED_CONTENT = `
  query GetGlobalSharedContentStructure {
    __type(name: "GlobalSharedContent") {
      fields {
        name
        type {
          name
        }
      }
    }
  }
`;