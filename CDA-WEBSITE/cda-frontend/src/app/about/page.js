'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PhotoFrame from '../../components/GlobalBlocks/PhotoFrame';
import WhyCdaBlock from '../../components/GlobalBlocks/WhyCdaBlock';
import ServicesAccordion from '../../components/GlobalBlocks/ServicesAccordion';
import Showreel from '../../components/GlobalBlocks/Showreel';
import ApproachBlock from '../../components/GlobalBlocks/ApproachBlock';
import TechnologiesSlider from '../../components/GlobalBlocks/TechnologiesSlider';
import ValuesBlock from '../../components/GlobalBlocks/ValuesBlock';
import LocationsImage from '../../components/GlobalBlocks/LocationsImage';
import CultureGallerySlider from '../../components/GlobalBlocks/CultureGallerySlider';
import { sanitizeTitleHtml } from '../../lib/sanitizeTitleHtml';
import { executeGraphQLQuery } from '../../lib/graphql-queries';

export default function AboutPage() {
  const [globalData, setGlobalData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Configure which WP page to read for About via database ID (same model as homepage)
        const ABOUT_ID = parseInt(process.env.NEXT_PUBLIC_ABOUT_PAGE_ID || '317', 10);

        // Global content query - identical to homepage
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
              technologiesSlider {
                title
                subtitle
                logos {
                  nodes { 
                    ... on Technology { 
                      id
                      title
                      uri
                      featuredImage { node { sourceUrl altText } }
                    }
                  }
                }
              }
              valuesBlock {
                title
                subtitle
                values { title text }
                illustration { node { sourceUrl altText } }
              }
              showreel {
                title
                subtitle
                button { url title target }
                largeImage { node { sourceUrl altText } }
                logos { logo { node { sourceUrl altText } } }
              }
              approach {
                title
                subtitle
                steps {
                  title
                  image { node { sourceUrl altText } }
                }
              }
              whyCda {
                title
                subtitle
                usp {
                  title
                  description
                  icon { node { sourceUrl altText } }
                }
              }
              cultureGallerySlider {
                title
                subtitle
                useGlobalSocialLinks
                images {
                  nodes {
                    sourceUrl
                    altText
                  }
                }
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
                manualArticles {
                  nodes { ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } } }
                }
              }
              newsletterSignup {
                title
                subtitle
                hubspotScript
                termsText
              }
            }
          }
        }`;
        
        // About page query - using working version from test results with correct image field
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
                enableCultureGallerySlider
              }
            }
          }
        }`;
        
        // Fetch both using centralized GraphQL function
        const [globalResult, aboutResult] = await Promise.all([
          executeGraphQLQuery(globalQuery),
          executeGraphQLQuery(aboutQuery)
        ]);
        
        // Handle errors
        if (globalResult.errors) {
          console.error('Global content errors:', globalResult.errors);
        }
        if (aboutResult.errors) {
          console.error('About content errors:', aboutResult.errors);
        }
        
        // Normalize global blocks (same as homepage)
        const rawBlocks = globalResult?.data?.globalOptions?.globalContentBlocks || {};
        const normalizedBlocks = {
          ...rawBlocks,
          // Map 'image' field to 'statsImage' for consistency with components
          statsImage: rawBlocks?.image || rawBlocks?.statsImage,
          technologiesSlider: rawBlocks?.technologiesSlider
            ? {
                ...rawBlocks.technologiesSlider,
                logos: (rawBlocks.technologiesSlider.logos?.nodes || [])
                  .map((node) => ({
                    url: node?.featuredImage?.node?.sourceUrl,
                    alt: node?.featuredImage?.node?.altText || node?.title || 'Tech logo',
                    title: node?.title || 'Technology'
                  })),
              }
            : undefined,
          // Map whyCda and approach from globalContentBlocks - use correct field names
          whyCdaBlock: rawBlocks?.whyCda, // Use 'whyCda' not 'whyCdaBlock'
          approachBlock: rawBlocks?.approach, // Use 'approach' not 'approachBlock'
          // Map culture gallery slider from raw blocks
          cultureGallerySlider: rawBlocks?.cultureGallerySlider,
          // Temporarily disabled fields
          fullVideo: null,
          joinOurTeam: null,
        };
        
        setGlobalData(normalizedBlocks);
        setAboutData(aboutResult?.data?.page?.aboutUsContent || null);
      } catch (err) {
        console.error('Failed to load About page data:', err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  // Extract data with safe fallbacks
  const globalContentBlocks = globalData || {};
  const aboutContent = aboutData || {};
  const globalSelection = aboutContent?.globalContentSelection || {};

  return (
    <>
      <Header />
      
      {/* About Page Header */}
      {aboutContent?.contentPageHeader && (
        <section className="about-hero-section">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <h1 
                  className="title-large-pink mb-6"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeTitleHtml(
                      aboutContent.contentPageHeader.title || 'About Us'
                    )
                  }}
                />
                <div 
                  className="about-hero-subtitle text-lg mb-6"
                  dangerouslySetInnerHTML={{
                    __html: aboutContent.contentPageHeader.text || 'Learn more about our company.'
                  }}
                />
                {aboutContent.contentPageHeader.cta && (
                  <a 
                    href={aboutContent.contentPageHeader.cta.url || '#'} 
                    className="button-l"
                    target={aboutContent.contentPageHeader.cta.target || '_self'}
                  >
                    {aboutContent.contentPageHeader.cta.title || 'Get Started'}
                  </a>
                )}
              </div>
              <div className="flex justify-center">
                {aboutContent.contentPageHeader.image?.node?.sourceUrl ? (
                  <img 
                    src={aboutContent.contentPageHeader.image.node.sourceUrl}
                    alt={aboutContent.contentPageHeader.image.node.altText || 'About Us'}
                    className="w-full h-auto max-w-md rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No header image set in WordPress</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Global Content Blocks - Only show if toggles are enabled and data exists */}
      
      {/* Image Frame Block */}
      {globalSelection?.enableImageFrame && globalContentBlocks?.imageFrameBlock && (
        <PhotoFrame globalData={globalContentBlocks.imageFrameBlock} />
      )}

      {/* Services Accordion Block */}
      {globalSelection?.enableServicesAccordion && globalContentBlocks?.servicesAccordion && (
        <ServicesAccordion globalData={globalContentBlocks.servicesAccordion} />
      )}
      
      {/* Why CDA Block */}
      {globalSelection?.enableWhyCda && globalContentBlocks?.whyCdaBlock && (
        <WhyCdaBlock globalData={globalContentBlocks.whyCdaBlock} />
      )}
      
      {/* Showreel Block */}
      {globalSelection?.enableShowreel && globalContentBlocks?.showreel && (
        <Showreel globalData={globalContentBlocks.showreel} />
      )}
      
      {/* Culture Gallery Slider Block */}
      {globalSelection?.enableCultureGallerySlider && globalContentBlocks?.cultureGallerySlider && (
        <CultureGallerySlider globalData={globalContentBlocks.cultureGallerySlider} />
      )}
      
      {/* Approach Block */}
      {globalSelection?.enableApproach && globalContentBlocks?.approachBlock && (
        <ApproachBlock globalData={globalContentBlocks.approachBlock} />
      )}
      
      {/* Technologies Slider Block */}
      {globalSelection?.enableTechnologiesSlider && globalContentBlocks?.technologiesSlider && (
        <TechnologiesSlider 
          title={globalContentBlocks.technologiesSlider.title}
          subtitle={globalContentBlocks.technologiesSlider.subtitle}
          logos={globalContentBlocks.technologiesSlider.logos}
        />
      )}
      
      {/* Values Block */}
      {globalSelection?.enableValues && globalContentBlocks?.valuesBlock && (
        <ValuesBlock globalData={globalContentBlocks.valuesBlock} />
      )}
      
      {/* Locations Block */}
      {globalSelection?.enableLocationsImage && globalContentBlocks?.locationsImage && (
        <LocationsImage globalData={globalContentBlocks.locationsImage} />
      )}
      
      <Footer />
    </>
  );
}
