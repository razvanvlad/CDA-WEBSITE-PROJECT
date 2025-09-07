'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ValuesBlock from '../components/GlobalBlocks/ValuesBlock';
import PhotoFrame from '../components/GlobalBlocks/PhotoFrame';
import TechnologiesSlider from '../components/GlobalBlocks/TechnologiesSlider';

export default function Home() {
  const [globalData, setGlobalData] = useState(null);
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using simplified, working GraphQL queries
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
                services {
                  nodes {
                    ... on Service { id title uri }
                  }
                }
              }
              image { __typename }
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
        
        const homepageQuery = `{
          page(id: "289", idType: DATABASE_ID) {
            title
            homepageContentClean {
              headerSection {
                title
                text
                button1 {
                  url
                  title
                  target
                }
                button2 {
                  url
                  title
                  target
                }
                illustration {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
              projectsSection {
                title
                subtitle
                link {
                  url
                  title
                  target
                }
              }
              caseStudiesSection {
                subtitle
                title
                knowledgeHubLink {
                  url
                  title
                  target
                }
                selectedStudies {
                  nodes {
                    ... on CaseStudy {
                      id
                      title
                      uri
                      excerpt
                    }
                  }
                }
              }
              globalContentSelection {
                enableValues
                enableImageFrame
                enableTechnologiesSlider
                enableServicesAccordion
                enableShowreel
                enableStatsImage
                enableLocationsImage
                enableNewsCarousel
                enableNewsletterSignup
              }
            }
          }
        }`;
        
        // Fetch global data
        const globalResponse = await fetch('http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: globalQuery })
        });
        const globalResult = await globalResponse.json();

        // Normalize global blocks to align with components
        const rawBlocks = globalResult?.data?.globalOptions?.globalContentBlocks || {};
        const normalizedBlocks = {
          ...rawBlocks,
          // Map statsImage to image if backend exposes it that way
          statsImage: rawBlocks?.statsImage || rawBlocks?.image,
          // Flatten technologies logos connection into plain image objects for the slider
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
        };
        
        // Overwrite with normalized structure for downstream rendering
        globalResult.data = { globalOptions: { globalContentBlocks: normalizedBlocks } };
        
        // Fetch homepage data
        const homepageResponse = await fetch('http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: homepageQuery })
        });
        const homepageResult = await homepageResponse.json();
        
        if (globalResult.errors || homepageResult.errors) {
          console.log("GraphQL errors:", globalResult.errors || homepageResult.errors);
          setError(globalResult.errors?.[0] || homepageResult.errors?.[0]);
          return;
        }
        
        console.log("Global response:", globalResult.data);
        console.log("Homepage response:", homepageResult.data);
        console.log("Header section:", homepageResult.data?.page?.homepageContentClean?.headerSection);
        console.log("Case studies:", homepageResult.data?.page?.homepageContentClean?.caseStudiesSection);
        
        setGlobalData(globalResult.data);
        setHomepageData(homepageResult.data);
        
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
          <p style={{color: '#4b5563', fontSize: '1.1rem'}}>Loading content from WordPress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2'}}>
        <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '32rem'}}>
          <h2 style={{color: '#dc2626', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Error Loading Content</h2>
          <p style={{color: '#4b5563', fontSize: '0.9rem', marginBottom: '1rem'}}>Failed to fetch data from WordPress GraphQL endpoint.</p>
          
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
  const homepageContent = homepageData?.page?.homepageContentClean || {};
  const globalSelection = homepageContent?.globalContentSelection || {};

  return (
    <div style={{minHeight: '100vh', backgroundColor: 'white'}}>
      <Header />
      
      {/* Success Status Bar */}
      <div style={{backgroundColor: '#dcfce7', borderLeft: '4px solid #16a34a', color: '#15803d', padding: '1rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center'}}>
          <span style={{fontSize: '1rem', fontWeight: '600'}}>✅ WordPress Integration Active</span>
          <span style={{marginLeft: '1rem', fontSize: '0.9rem'}}>Loading content from WordPress ACF fields</span>
        </div>
      </div>
      
      {/* Debug Data Display */}
      <div style={{backgroundColor: '#fef3c7', padding: '1rem', borderBottom: '1px solid #f59e0b'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <details style={{fontSize: '0.8rem'}}>
            <summary style={{cursor: 'pointer', fontWeight: '600', color: '#92400e'}}>Debug: WordPress Data</summary>
            <div style={{marginTop: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '0.25rem', overflow: 'auto'}}>
              <p><strong>Homepage Data:</strong></p>
              <pre style={{fontSize: '0.7rem', color: '#374151'}}>{JSON.stringify(homepageData, null, 2)}</pre>
              <p><strong>Global Data:</strong></p>
              <pre style={{fontSize: '0.7rem', color: '#374151'}}>{JSON.stringify(globalData, null, 2)}</pre>
            </div>
          </details>
        </div>
      </div>
      
      {/* Header Section from WordPress */}
      {homepageContent?.headerSection ? (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f8fafc'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center'}}>
            <div style={{textAlign: 'left'}}>
              <h1 style={{fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>
                {homepageContent.headerSection.title || 'Welcome to CDA Website'}
              </h1>
              <p style={{fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem'}}>
                {homepageContent.headerSection.text || 'Digital solutions that drive results.'}
              </p>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start'}}>
                {homepageContent.headerSection.button1 && (
                  <a 
                    href={homepageContent.headerSection.button1.url || '#'} 
                    style={{display: 'inline-block', padding: '0.75rem 2rem', backgroundColor: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600'}}
                    target={homepageContent.headerSection.button1.target || '_self'}
                  >
                    {homepageContent.headerSection.button1.title || 'Get Started'}
                  </a>
                )}
                {homepageContent.headerSection.button2 && (
                  <a 
                    href={homepageContent.headerSection.button2.url || '#'} 
                    style={{display: 'inline-block', padding: '0.75rem 2rem', border: '2px solid #7c3aed', color: '#7c3aed', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600'}}
                    target={homepageContent.headerSection.button2.target || '_self'}
                  >
                    {homepageContent.headerSection.button2.title || 'Learn More'}
                  </a>
                )}
              </div>
            </div>
            <div style={{textAlign: 'center'}}>
              {homepageContent.headerSection.illustration?.node?.sourceUrl ? (
                <img 
                  src={homepageContent.headerSection.illustration.node.sourceUrl}
                  alt={homepageContent.headerSection.illustration.node.altText || 'Header illustration'}
                  style={{maxWidth: '100%', height: 'auto', borderRadius: '0.5rem'}}
                />
              ) : (
                <div style={{backgroundColor: '#e5e7eb', padding: '3rem', borderRadius: '0.5rem', color: '#6b7280'}}>
                  <p>Upload illustration in WordPress Admin → Pages → Edit Homepage → Header Section</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f8fafc', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>
              Welcome to CDA Website
            </h1>
            <p style={{fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem'}}>
              Digital solutions that drive results.
            </p>
            <p style={{fontSize: '0.9rem', color: '#f59e0b', backgroundColor: '#fef3c7', padding: '0.5rem 1rem', borderRadius: '0.25rem', display: 'inline-block'}}>
              Configure header section in WordPress Admin → Pages → Edit Homepage
            </p>
          </div>
        </section>
      )}
      
      {/* Global Content Blocks - Only show if toggles are enabled and data exists */}
      {globalSelection?.enableValues && globalContentBlocks?.valuesBlock && (
        <>
          {/* Debug: Show Values Block is rendering */}
          <div style={{backgroundColor: '#dcfce7', padding: '1rem', textAlign: 'center', borderLeft: '4px solid #16a34a'}}>
            <p style={{color: '#15803d', fontWeight: '600'}}>✅ Values Block is rendering below</p>
          </div>
          <ValuesBlock globalData={globalContentBlocks.valuesBlock} />
        </>
      )}
      
      {/* Debug: Show Values Block data structure */}
      {globalSelection?.enableValues && (
        <div style={{backgroundColor: '#f3f4f6', padding: '1rem', margin: '1rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <details style={{fontSize: '0.8rem'}}>
              <summary style={{cursor: 'pointer', fontWeight: '600', color: '#374151'}}>Debug: Values Block Data Structure</summary>
              <div style={{marginTop: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '0.25rem', overflow: 'auto'}}>
                <pre style={{fontSize: '0.7rem', color: '#374151'}}>{JSON.stringify(globalContentBlocks?.valuesBlock, null, 2)}</pre>
              </div>
            </details>
          </div>
        </div>
      )}
      
      {globalSelection?.enableImageFrame && globalContentBlocks?.imageFrameBlock && (
        <PhotoFrame globalData={globalContentBlocks.imageFrameBlock} />
      )}
      
      {globalSelection?.enableTechnologiesSlider && globalContentBlocks?.technologiesSlider && (
        <TechnologiesSlider 
          title={globalContentBlocks.technologiesSlider.title}
          subtitle={globalContentBlocks.technologiesSlider.subtitle}
          logos={globalContentBlocks.technologiesSlider.logos}
        />
      )}

      {/* Showreel Block */}
      {globalSelection?.enableShowreel && globalContentBlocks?.showreel && (
        <section style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <p style={{color: '#7c3aed', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>{globalContentBlocks.showreel.subtitle}</p>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>{globalContentBlocks.showreel.title}</h2>
            {globalContentBlocks.showreel.largeImage?.node?.sourceUrl && (
              <img src={globalContentBlocks.showreel.largeImage.node.sourceUrl} alt={globalContentBlocks.showreel.largeImage.node.altText || ''} style={{maxWidth: '100%', borderRadius: '8px', marginBottom: '1.5rem'}} />
            )}
            {globalContentBlocks.showreel.button && (
              <a href={globalContentBlocks.showreel.button.url || '#'} target={globalContentBlocks.showreel.button.target || '_self'} style={{display: 'inline-block', padding: '0.75rem 2rem', backgroundColor: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600'}}>
                {globalContentBlocks.showreel.button.title || 'Learn More'}
              </a>
            )}
          </div>
        </section>
      )}
      
      {/* Stats & Image Block */}
      {globalSelection?.enableStatsImage && globalContentBlocks?.statsImage && (
        <div style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center'}}>Statistics & Achievements</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
              {globalContentBlocks.statsImage.stats?.map((stat, index) => (
                <div key={index} style={{textAlign: 'center', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
                  <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '0.5rem'}}>{stat.number}</div>
                  <div style={{fontSize: '1rem', color: '#4b5563'}}>{stat.text}</div>
                </div>
              )) || []}
            </div>
            <div style={{textAlign: 'center'}}>
              <p style={{fontSize: '1.1rem', color: '#4b5563', marginBottom: '2rem'}}>{globalContentBlocks.statsImage.text}</p>
              {globalContentBlocks.statsImage.button && (
                <a 
                  href={globalContentBlocks.statsImage.button.url || '#'}
                  style={{display: 'inline-block', padding: '0.75rem 2rem', backgroundColor: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600'}}
                  target={globalContentBlocks.statsImage.button.target || '_self'}
                >
                  {globalContentBlocks.statsImage.button.title || 'Learn More'}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Locations Block */}
      {globalSelection?.enableLocationsImage && globalContentBlocks?.locationsImage && (
        <div style={{padding: '5rem 1rem', backgroundColor: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
              <p style={{color: '#7c3aed', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>{globalContentBlocks.locationsImage.subtitle}</p>
              <h2 style={{fontSize: '2rem', fontWeight: 'bold'}}>{globalContentBlocks.locationsImage.title}</h2>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
              {globalContentBlocks.locationsImage.countries?.map((country, index) => (
                <div key={index} style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937'}}>{country.countryName}</h3>
                  {country.offices?.map((office, officeIndex) => (
                    <div key={officeIndex} style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: officeIndex < country.offices.length - 1 ? '1px solid #e5e7eb' : 'none'}}>
                      <h4 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>{office.name}</h4>
                      <p style={{fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem'}}>{office.address}</p>
                      <p style={{fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem'}}>Email: {office.email}</p>
                      <p style={{fontSize: '0.9rem', color: '#6b7280'}}>Phone: {office.phone}</p>
                    </div>
                  )) || []}
                </div>
              )) || []}
            </div>
          </div>
        </div>
      )}
      
      {/* News Carousel Block */}
      {globalSelection?.enableNewsCarousel && globalContentBlocks?.newsCarousel && (
        <section style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
              <p style={{color: '#7c3aed', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>{globalContentBlocks.newsCarousel.subtitle}</p>
              <h2 style={{fontSize: '2rem', fontWeight: 'bold'}}>{globalContentBlocks.newsCarousel.title}</h2>
            </div>
            <div style={{backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center'}}>
              <p style={{color: '#6b7280'}}>News carousel component ready — {globalContentBlocks.newsCarousel.manualArticles?.nodes?.length || 0} articles selected.</p>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup Block */}
      {globalSelection?.enableNewsletterSignup && globalContentBlocks?.newsletterSignup && (
        <div style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
            <p style={{color: '#7c3aed', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>{globalContentBlocks.newsletterSignup.subtitle}</p>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem'}}>{globalContentBlocks.newsletterSignup.title}</h2>
            <div style={{backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
              <p style={{color: '#6b7280', marginBottom: '1rem'}}>HubSpot newsletter form would be embedded here</p>
              {globalContentBlocks.newsletterSignup.hubspotScript && (
                <div style={{fontSize: '0.8rem', color: '#10b981'}}>
                  ✓ HubSpot script configured
                </div>
              )}
            </div>
            {globalContentBlocks.newsletterSignup.termsText && (
              <p style={{fontSize: '0.8rem', color: '#6b7280'}}>{globalContentBlocks.newsletterSignup.termsText}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Services Accordion Block */}
      {globalSelection?.enableServicesAccordion && globalContentBlocks?.servicesAccordion && (
        <section style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
              <h2 style={{fontSize: '2rem', fontWeight: 'bold'}}>{globalContentBlocks.servicesAccordion.title || 'Our Services'}</h2>
            </div>
            {(() => {
              const servicesNodes = globalContentBlocks.servicesAccordion.services?.nodes || globalContentBlocks.servicesAccordion.servicesList?.nodes || globalContentBlocks.servicesAccordion.servicesList || [];
              if (Array.isArray(servicesNodes) && servicesNodes.length > 0) {
                return (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem'}}>
                    {servicesNodes.map((svc, idx) => {
                      const node = svc?.node || svc;
                      return (
                        <a key={node?.id || idx} href={node?.uri || '#'} style={{display: 'block', padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', textDecoration: 'none'}}>
                          <h3 style={{fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0}}>{node?.title || 'Service'}</h3>
                          <p style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem'}}>Explore service</p>
                        </a>
                      );
                    })}
                  </div>
                );
              }
              return (
                <div style={{backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center'}}>
                  <p style={{color: '#6b7280'}}>No services linked yet. Add Services in Global Content → Services Accordion. If you don’t see them in GraphQL, ensure the Services field is set to Show in GraphQL and GraphQL Field Name = "services".</p>
                </div>
              );
            })()}
          </div>
        </section>
      )}
      
      {/* Projects Section from WordPress */}
      {homepageContent?.projectsSection && (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>{homepageContent.projectsSection.title}</h2>
            <p style={{fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem'}}>{homepageContent.projectsSection.subtitle}</p>
            {homepageContent.projectsSection.link && (
              <a 
                href={homepageContent.projectsSection.link.url}
                style={{display: 'inline-block', padding: '0.75rem 2rem', backgroundColor: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600'}}
                target={homepageContent.projectsSection.link.target || '_self'}
              >
                {homepageContent.projectsSection.link.title}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Case Studies Section from WordPress */}
      {homepageContent?.caseStudiesSection && (
        <section style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <p style={{color: '#7c3aed', marginBottom: '1rem'}}>{homepageContent.caseStudiesSection.subtitle}</p>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem'}}>{homepageContent.caseStudiesSection.title}</h2>
            
            {/* Selected Case Studies */}
            {homepageContent.caseStudiesSection.selectedStudies?.nodes && homepageContent.caseStudiesSection.selectedStudies.nodes.length > 0 && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem'}}>
                {homepageContent.caseStudiesSection.selectedStudies.nodes.map((study, index) => (
                  <div key={study.id || index} style={{backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '0.5rem', textAlign: 'left'}}>
                    {study.featuredImage?.node?.sourceUrl && (
                      <img 
                        src={study.featuredImage.node.sourceUrl}
                        alt={study.featuredImage.node.altText || study.title}
                        style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '1rem'}}
                      />
                    )}
                    <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937'}}>{study.title}</h3>
                    <div style={{color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem'}} dangerouslySetInnerHTML={{__html: study.excerpt}} />
                    <a 
                      href={study.uri}
                      style={{display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '0.25rem', fontSize: '0.9rem', fontWeight: '500'}}
                    >
                      Read Case Study
                    </a>
                  </div>
                ))}
              </div>
            )}
            
            {homepageContent.caseStudiesSection.knowledgeHubLink && (
              <a 
                href={homepageContent.caseStudiesSection.knowledgeHubLink.url}
                style={{display: 'inline-block', padding: '0.75rem 2rem', border: '2px solid #7c3aed', color: '#7c3aed', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '600'}}
                target={homepageContent.caseStudiesSection.knowledgeHubLink.target || '_self'}
              >
                {homepageContent.caseStudiesSection.knowledgeHubLink.title}
              </a>
            )}
          </div>
        </section>
      )}
      
      {/* Global Content Debug & Configuration Section */}
      <div style={{padding: '3rem 1rem', backgroundColor: '#f0f9ff', borderTop: '1px solid #e0e7ff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e40af'}}>Global Content Status</h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            {[
              { name: 'Values Block', key: 'enableValues', data: globalContentBlocks?.valuesBlock },
              { name: 'Image Frame Block', key: 'enableImageFrame', data: globalContentBlocks?.imageFrameBlock },
              { name: 'Technologies Slider', key: 'enableTechnologiesSlider', data: globalContentBlocks?.technologiesSlider },
              { name: 'Services Accordion', key: 'enableServicesAccordion', data: globalContentBlocks?.servicesAccordion },
              { name: 'Stats & Image', key: 'enableStatsImage', data: globalContentBlocks?.statsImage || globalContentBlocks?.image },
              { name: 'Locations', key: 'enableLocationsImage', data: globalContentBlocks?.locationsImage },
              { name: 'News Carousel', key: 'enableNewsCarousel', data: globalContentBlocks?.newsCarousel },
              { name: 'Newsletter Signup', key: 'enableNewsletterSignup', data: globalContentBlocks?.newsletterSignup },
            ].map((block) => {
              const isEnabled = globalSelection?.[block.key];
              
              // Improved data checking for different block types
              let hasData = false;
              if (block.data) {
                if (block.key === 'enableLocationsImage') {
                  hasData = Array.isArray(block.data.countries) && block.data.countries.length > 0;
                } else if (block.key === 'enableValues') {
                  hasData = Array.isArray(block.data.values) && block.data.values.length > 0;
                } else if (block.key === 'enableTechnologiesSlider') {
                  hasData = Array.isArray(block.data.logos) && block.data.logos.length > 0;
                } else if (block.key === 'enableServicesAccordion') {
                  hasData = !!block.data.title; // schema shows only title for now
                } else if (block.key === 'enableStatsImage') {
                  hasData = !!block.data; // presence of object indicates data fetched
                } else if (block.key === 'enableNewsCarousel') {
                  hasData = !!block.data.title || !!block.data.subtitle;
                } else if (block.key === 'enableNewsletterSignup') {
                  hasData = !!(block.data.title || block.data.hubspotScript);
                } else {
                  hasData = !!(block.data.title || block.data.subtitle);
                }
              }
              
              const willShow = isEnabled && hasData;
              
              return (
                <div key={block.key} style={{padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: `2px solid ${willShow ? '#10b981' : isEnabled ? '#f59e0b' : '#e5e7eb'}`}}>
                  <h3 style={{fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>{block.name}</h3>
                  <div style={{fontSize: '0.8rem', lineHeight: '1.4'}}>
                    <div style={{color: isEnabled ? '#059669' : '#6b7280'}}>Toggle: {isEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
                    <div style={{color: hasData ? '#059669' : '#6b7280'}}>Data: {hasData ? '✅ Available' : '❌ Missing'}</div>
                    <div style={{color: willShow ? '#059669' : '#ef4444', fontWeight: '600'}}>Status: {willShow ? '✅ Showing' : '❌ Hidden'}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {Object.keys(globalSelection).length === 0 ? (
            <div style={{backgroundColor: '#fef3c7', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#92400e'}}>No Global Content Blocks Enabled</h3>
              <p style={{color: '#a16207', marginBottom: '1.5rem'}}>Enable global content blocks in WordPress admin to display them here.</p>
              <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'left'}}>
                <h4 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem'}}>Quick Setup:</h4>
                <ol style={{color: '#4b5563', lineHeight: '1.6', fontSize: '0.9rem'}}>
                  <li>WordPress Admin → Options → Global Content → Fill in content</li>
                  <li>Pages → Edit Homepage → Global Content Selection → Toggle ON blocks</li>
                  <li>Save and refresh this page</li>
                </ol>
              </div>
            </div>
          ) : (
            <div style={{backgroundColor: '#ecfdf5', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center'}}>
              <p style={{color: '#059669', fontSize: '0.9rem'}}>Global content system is active! Green blocks above are currently showing on the page.</p>
            </div>
          )}
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
