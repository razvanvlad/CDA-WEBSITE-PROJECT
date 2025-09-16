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
import { sanitizeTitleHtml } from '../../lib/sanitizeTitleHtml';

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
        const GRAPHQL_URL =
          process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
          '/api/wp-graphql';
        
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
              technologiesSlider {
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
        
        // About page query - matching ACF structure
        const aboutQuery = `{
          page(id: ${ABOUT_ID}, idType: DATABASE_ID) {
            id
            title
            aboutUsContent {
              contentPageHeader {
                title
                text
                headerImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
                cta {
                  url
                  title
                  target
                }
              }
              leadershipSection {
                title
                subtitle
                description
                image {
                  node {
                    sourceUrl
                    altText
                  }
                }
                cta { url title target }
              }
              globalContentSelection {
                enableImageFrame
                enableServicesAccordion
                enableWhyCda
                enableShowreel
                enableCultureGallerySlider
                enableApproach
                enableFullVideo
                enableJoinOurTeam
                enableThreeColumnsWithIcons
                enableContactFormLeftImageRight
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
        
        // Fetch both in parallel
        const [globalResponse, aboutResponse] = await Promise.all([
          fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: globalQuery })
          }),
          fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: aboutQuery })
          })
        ]);
        
        const globalResult = await globalResponse.json();
        const aboutResult = await aboutResponse.json();
        
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
          // Map whyCda and approach from globalContentBlocks
          whyCdaBlock: rawBlocks?.whyCdaBlock || rawBlocks?.whyCda,
          approachBlock: rawBlocks?.approachBlock || rawBlocks?.approach,
          // Temporarily disabled fields
          cultureGallerySlider: null,
          fullVideo: null,
          joinOurTeam: null,
        };
        
        globalResult.data = { globalOptions: { globalContentBlocks: normalizedBlocks } };
        
        setGlobalData(globalResult?.data?.globalOptions?.globalContentBlocks || null);
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
                {aboutContent.contentPageHeader.headerImage?.node?.sourceUrl ? (
                  <img 
                    src={aboutContent.contentPageHeader.headerImage.node.sourceUrl}
                    alt={aboutContent.contentPageHeader.headerImage.node.altText || 'About Us'}
                    className="w-full h-auto max-w-md rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Add image in WordPress Admin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Who We Are Section */}
      {aboutContent?.whoWeAreSection && (
        <section className="who-we-are-section">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 
                  className="text-3xl font-bold mb-4"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeTitleHtml(
                      aboutContent.whoWeAreSection.sectionTitle || 'Who We Are'
                    )
                  }}
                />
                <div 
                  className="text-lg mb-6"
                  dangerouslySetInnerHTML={{
                    __html: aboutContent.whoWeAreSection.sectionText || 'Our story and mission.'
                  }}
                />
                {aboutContent.whoWeAreSection.cta && (
                  <a 
                    href={aboutContent.whoWeAreSection.cta.url || '#'} 
                    className="button-l"
                    target={aboutContent.whoWeAreSection.cta.target || '_self'}
                  >
                    {aboutContent.whoWeAreSection.cta.title || 'Learn More'}
                  </a>
                )}
              </div>
              <div>
                {aboutContent.whoWeAreSection.imageWithFrame?.node?.sourceUrl && (
                  <img 
                    src={aboutContent.whoWeAreSection.imageWithFrame.node.sourceUrl}
                    alt={aboutContent.whoWeAreSection.imageWithFrame.node.altText || 'Who we are'}
                    className="w-full h-auto rounded-lg"
                  />
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
