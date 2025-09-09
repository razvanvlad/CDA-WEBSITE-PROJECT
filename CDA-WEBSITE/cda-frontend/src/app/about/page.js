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
          'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
        
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
              image {
                __typename
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
        
        // About page query - matching ACF structure
        const aboutQuery = `{
          page(id: ${ABOUT_ID}, idType: DATABASE_ID) {
            id
            title
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
        
        if (globalResult.errors || aboutResult.errors) {
          console.log("GraphQL errors:", globalResult.errors || aboutResult.errors);
          setError(globalResult.errors?.[0] || aboutResult.errors?.[0]);
          return;
        }
        
        console.log("Global response:", globalResult.data);
        console.log("About response:", aboutResult.data);
        
        setGlobalData(globalResult.data);
        setAboutData(aboutResult.data);
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', width: '3rem', height: '3rem', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem'}}></div>
          <p style={{color: '#4b5563', fontSize: '1.1rem'}}>Loading About Us content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2'}}>
        <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '32rem'}}>
          <h2 style={{color: '#dc2626', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Error Loading Content</h2>
          <p style={{color: '#4b5563', fontSize: '0.9rem', marginBottom: '1rem'}}>Failed to fetch About Us data.</p>
          
          <details style={{marginTop: '1rem'}}>
            <summary style={{cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'}}>Error Details</summary>
            <pre style={{marginTop: '0.5rem', fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.25rem', overflow: 'auto'}}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  // Extract data with safe fallbacks
  const globalContentBlocks = globalData?.globalOptions?.globalContentBlocks || {};
  const aboutContent = aboutData?.page?.aboutUsContent || {};
  const globalSelection = aboutContent?.globalContentSelection || {};

  return (
    <div style={{minHeight: '100vh', backgroundColor: 'white'}}>
      <Header />
      
      {/* Header Section from WordPress */}
      {aboutContent?.contentPageHeader ? (
        <section className="about-hero-section" style={{padding: '5rem 1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: 'white'}}>
            <h1
              style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem'}}
              dangerouslySetInnerHTML={{
                __html: sanitizeTitleHtml(
                  aboutContent.contentPageHeader.title || 'About Us'
                )
              }}
            />
            {aboutContent.contentPageHeader.text && (
              <div 
                style={{fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.95}}
                dangerouslySetInnerHTML={{ __html: aboutContent.contentPageHeader.text }}
              />
            )}
            {aboutContent.contentPageHeader.cta && (
              <a 
                href={aboutContent.contentPageHeader.cta.url || '#'} 
                className="button-l"
                style={{backgroundColor: 'white', color: '#667eea'}}
                target={aboutContent.contentPageHeader.cta.target || '_self'}
              >
                {aboutContent.contentPageHeader.cta.title || 'Get Started'}
              </a>
            )}
          </div>
        </section>
      ) : (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>About Us</h1>
            <p style={{color: '#6b7280'}}>Configure header in WordPress Admin → Pages → Edit About Us</p>
          </div>
        </section>
      )}

      {/* Who We Are Section - Individual content with global frame option */}
      {globalSelection?.enableImageFrame && globalContentBlocks?.imageFrameBlock ? (
        <PhotoFrame 
          globalData={globalContentBlocks.imageFrameBlock}
          contentOverride={aboutContent?.whoWeAreSection ? {
            title: aboutContent.whoWeAreSection.sectionTitle,
            text: aboutContent.whoWeAreSection.sectionText,
            button: aboutContent.whoWeAreSection.cta,
            contentImage: aboutContent.whoWeAreSection.imageWithFrame
          } : null}
        />
      ) : aboutContent?.whoWeAreSection && (
        <section style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center'}}>
              {(() => {
                const img = aboutContent.whoWeAreSection.imageWithFrame?.node || aboutContent.whoWeAreSection.imageWithFrame;
                return img ? (
                  <img 
                    src={img.sourceUrl}
                    alt={img.altText || 'Who We Are'}
                    style={{width: '100%', borderRadius: '0.5rem'}}
                  />
                ) : null;
              })()}
              <div>
                <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
                  {aboutContent.whoWeAreSection.sectionTitle || 'Who We Are'}
                </h2>
                <div dangerouslySetInnerHTML={{ __html: aboutContent.whoWeAreSection.sectionText || '' }} />
                {aboutContent.whoWeAreSection.cta && (
                  <a 
                    href={aboutContent.whoWeAreSection.cta.url}
                    className="button-l"
                    target={aboutContent.whoWeAreSection.cta.target || '_self'}
                    style={{marginTop: '1.5rem', display: 'inline-block'}}
                  >
                    {aboutContent.whoWeAreSection.cta.title}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Global Content Blocks - Controlled by toggles */}
      
      {/* Why CDA Block */}
      {globalSelection?.enableWhyCda && globalContentBlocks?.whyCdaBlock && (
        <WhyCdaBlock globalData={globalContentBlocks.whyCdaBlock} />
      )}

      {/* Services Accordion */}
      {globalSelection?.enableServicesAccordion && globalContentBlocks?.servicesAccordion && (
        <ServicesAccordion globalData={globalContentBlocks.servicesAccordion} />
      )}

      {/* Culture Gallery Slider */}
      {globalSelection?.enableCultureGallerySlider && globalContentBlocks?.cultureGallerySlider && (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
              {globalContentBlocks.cultureGallerySlider.title || 'Our Culture'}
            </h2>
            <p style={{color: '#6b7280', marginBottom: '2rem'}}>
              {globalContentBlocks.cultureGallerySlider.subtitle}
            </p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
              {(globalContentBlocks.cultureGallerySlider.images || []).slice(0, 6).map((img, idx) => (
                <img 
                  key={idx}
                  src={img.sourceUrl}
                  alt={img.altText || `Culture ${idx + 1}`}
                  style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem'}}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Approach Block */}
      {globalSelection?.enableApproach && globalContentBlocks?.approachBlock && (
        <ApproachBlock globalData={globalContentBlocks.approachBlock} />
      )}

      {/* Technologies Slider */}
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

      {/* Stats & Image Block */}
      {globalSelection?.enableStatsImage && globalContentBlocks?.statsImage && (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f0f9ff'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center'}}>Our Impact</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
              {(globalContentBlocks.statsImage.stats || []).map((stat, index) => (
                <div key={index} style={{textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem'}}>
                  <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem'}}>{stat.number}</div>
                  <div style={{fontSize: '1rem', color: '#4b5563'}}>{stat.text}</div>
                </div>
              ))}
            </div>
            {globalContentBlocks.statsImage.text && (
              <p style={{textAlign: 'center', fontSize: '1.1rem', color: '#4b5563', marginBottom: '2rem'}}>
                {globalContentBlocks.statsImage.text}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Full Video */}
      {globalSelection?.enableFullVideo && globalContentBlocks?.fullVideo && (
        <section style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem'}}>Our Story</h2>
            {globalContentBlocks.fullVideo.url && (
              <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
                <iframe 
                  src={globalContentBlocks.fullVideo.url}
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Leadership Section - Individual content */}
      {aboutContent?.leadershipSection && (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem'}}>Leadership</h2>
            <div style={{maxWidth: '400px', margin: '0 auto'}}>
              {(() => {
                const img = aboutContent.leadershipSection.image?.node || aboutContent.leadershipSection.image;
                return img ? (
                  <img 
                    src={img.sourceUrl}
                    alt={img.altText || aboutContent.leadershipSection.name}
                    style={{width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1.5rem'}}
                  />
                ) : null;
              })()}
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem'}}>
                {aboutContent.leadershipSection.name}
              </h3>
              <p style={{color: '#667eea', marginBottom: '1rem'}}>
                {aboutContent.leadershipSection.position}
              </p>
              {aboutContent.leadershipSection.bio && (
                <div dangerouslySetInnerHTML={{ __html: aboutContent.leadershipSection.bio }} />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Join Our Team CTA */}
      {globalSelection?.enableJoinOurTeam && globalContentBlocks?.joinOurTeam && (
        <section style={{padding: '5rem 1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'white'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
              {globalContentBlocks.joinOurTeam.title || 'Join Our Team'}
            </h2>
            {globalContentBlocks.joinOurTeam.text && (
              <div dangerouslySetInnerHTML={{ __html: globalContentBlocks.joinOurTeam.text }} />
            )}
            {globalContentBlocks.joinOurTeam.button && (
              <a 
                href={globalContentBlocks.joinOurTeam.button.url}
                className="button-l"
                style={{backgroundColor: 'white', color: '#667eea', marginTop: '1.5rem', display: 'inline-block'}}
                target={globalContentBlocks.joinOurTeam.button.target || '_self'}
              >
                {globalContentBlocks.joinOurTeam.button.title}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Showreel Block */}
      {globalSelection?.enableShowreel && globalContentBlocks?.showreel && (
        <Showreel globalData={globalContentBlocks.showreel} />
      )}

      {/* Locations Block */}
      {globalSelection?.enableLocationsImage && globalContentBlocks?.locationsImage && (
        <LocationsImage globalData={globalContentBlocks.locationsImage} />
      )}

      {/* Global Content Debug (same as homepage) */}
      <div style={{padding: '3rem 1rem', backgroundColor: '#f0f9ff', borderTop: '1px solid #e0e7ff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e40af'}}>About Page Content Status</h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            {[
              { name: 'Image Frame', key: 'enableImageFrame', data: globalContentBlocks?.imageFrameBlock },
              { name: 'Why CDA', key: 'enableWhyCda', data: globalContentBlocks?.whyCdaBlock },
              { name: 'Services Accordion', key: 'enableServicesAccordion', data: globalContentBlocks?.servicesAccordion },
              { name: 'Culture Gallery', key: 'enableCultureGallerySlider', data: globalContentBlocks?.cultureGallerySlider },
              { name: 'Approach', key: 'enableApproach', data: globalContentBlocks?.approachBlock },
              { name: 'Technologies', key: 'enableTechnologiesSlider', data: globalContentBlocks?.technologiesSlider },
              { name: 'Values', key: 'enableValues', data: globalContentBlocks?.valuesBlock },
              { name: 'Stats & Image', key: 'enableStatsImage', data: globalContentBlocks?.statsImage },
              { name: 'Full Video', key: 'enableFullVideo', data: globalContentBlocks?.fullVideo },
              { name: 'Join Our Team', key: 'enableJoinOurTeam', data: globalContentBlocks?.joinOurTeam },
              { name: 'Showreel', key: 'enableShowreel', data: globalContentBlocks?.showreel },
              { name: 'Locations', key: 'enableLocationsImage', data: globalContentBlocks?.locationsImage },
            ].map((block) => {
              const isEnabled = globalSelection?.[block.key];
              const hasData = !!block.data;
              const willShow = isEnabled && hasData;
              
              return (
                <div key={block.key} style={{padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: `2px solid ${willShow ? '#10b981' : isEnabled ? '#f59e0b' : '#e5e7eb'}`}}>
                  <h3 style={{fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>{block.name}</h3>
                  <div style={{fontSize: '0.8rem', lineHeight: '1.4'}}>
                    <div style={{color: isEnabled ? '#059669' : '#6b7280'}}>Toggle: {isEnabled ? '✅ On' : '❌ Off'}</div>
                    <div style={{color: hasData ? '#059669' : '#6b7280'}}>Data: {hasData ? '✅ Yes' : '❌ No'}</div>
                    <div style={{color: willShow ? '#059669' : '#ef4444', fontWeight: '600'}}>Status: {willShow ? '✅ Showing' : '❌ Hidden'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <Footer globalOptions={globalData?.globalOptions} />

      {/* Inline CSS for spinner animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}
