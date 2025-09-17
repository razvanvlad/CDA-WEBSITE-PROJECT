const { executeGraphQLQuery } = require('./src/lib/graphql-queries');

async function testAboutQueryError() {
  console.log('Testing current about page GraphQL query for errors...\n');
  
  const ABOUT_ID = parseInt(process.env.NEXT_PUBLIC_ABOUT_PAGE_ID || '317', 10);
  
  // Test the exact query from the about page
  const aboutQuery = `{
    page(id: ${ABOUT_ID}, idType: DATABASE_ID) {
      id
      title
      aboutUsContent {
        contentPageHeader {
          title
          text
          image { node { sourceUrl altText } }
          cta { url title target }
        }
        globalContentSelection {
          enableImageFrame
          enableServicesAccordion
          enableWhyCda
          enableShowreel
          enableApproach
          enableTechnologiesSlider
          enableValues
          enableStatsImage
          enableLocationsImage
          enableNewsCarousel
          enableNewsletterSignup
        }
      }
    }
  }`;

  const globalQuery = `{
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
          services {
            nodes {
              ... on Service { id title uri }
            }
          }
        }
        whyCda {
          title
          subtitle
        }
        cultureGallerySlider {
          title
          subtitle
          useGlobalSocialLinks
          images {
            node {
              sourceUrl
              altText
            }
          }
        }
        showreel {
          title
          subtitle
          button { url title target }
          largeImage { node { sourceUrl altText } }
          logos { logo { node { sourceUrl altText } } }
        }
      }
    }
  }`;

  console.log('1. Testing about page query...');
  try {
    const aboutResult = await executeGraphQLQuery(aboutQuery);
    if (aboutResult.errors) {
      console.error('❌ About query errors:');
      aboutResult.errors.forEach(error => console.error('   •', error.message));
    } else {
      console.log('✅ About query successful');
    }
  } catch (error) {
    console.error('❌ About query failed:', error.message);
  }

  console.log('\n2. Testing global content query...');
  try {
    const globalResult = await executeGraphQLQuery(globalQuery);
    if (globalResult.errors) {
      console.error('❌ Global query errors:');
      globalResult.errors.forEach(error => console.error('   •', error.message));
    } else {
      console.log('✅ Global query successful');
    }
  } catch (error) {
    console.error('❌ Global query failed:', error.message);
  }
}

testAboutQueryError().catch(console.error);
