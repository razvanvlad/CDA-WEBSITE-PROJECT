'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ValuesBlock from '../components/GlobalBlocks/ValuesBlock';
import PhotoFrame from '../components/GlobalBlocks/PhotoFrame';
import TechnologiesSlider from '../components/GlobalBlocks/TechnologiesSlider';
import Showreel from '../components/GlobalBlocks/Showreel';
import ServicesAccordion from '../components/GlobalBlocks/ServicesAccordion';
import LocationsImage from '../components/GlobalBlocks/LocationsImage';
import { sanitizeTitleHtml } from '../lib/sanitizeTitleHtml';
import NewsletterSignup from '../components/GlobalBlocks/NewsletterSignup';

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
        const GRAPHQL_URL =
          process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
          'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
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
                subtitle
                illustration { node { sourceUrl altText } }
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
                  nodes {
                    __typename
                    ... on BlogPost { id title excerpt uri featuredImage { node { sourceUrl altText } } }
                    ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } }
                  }
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
                      featuredImage { node { sourceUrl altText } }
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
        const globalResponse = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: globalQuery })
        });
        const globalResult = await globalResponse.json();

        // Normalize global blocks to align with components
        const rawBlocks = globalResult?.data?.globalOptions?.globalContentBlocks || {};
        let normalizedBlocks = {
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
        
        // Compute News Carousel articles based on selection (manual/latest/category)
        try {
          const newsConfig = rawBlocks?.newsCarousel;
          if (newsConfig) {
            let computedArticles = [];
            const selection = newsConfig.articleSelection;

            if (selection === 'manual') {
              computedArticles = (newsConfig.manualArticles?.nodes || [])
                .filter((n) => n?.__typename === 'BlogPost')
                .map((n) => ({
                  id: n?.id,
                  title: n?.title,
                  excerpt: n?.excerpt,
                  uri: n?.uri,
                  imageUrl: n?.featuredImage?.node?.sourceUrl || '',
                  imageAlt: n?.featuredImage?.node?.altText || n?.title || 'Article image',
                }));
            } else {
              const selectedSlug = newsConfig?.category?.nodes?.[0]?.slug;
              const firstCount = selection === 'category' ? 12 : 6;
              const blogQuery = `{
                blogPosts(first: ${firstCount}, where: { orderby: {field: DATE, order: DESC} }) {
                  nodes {
                    id
                    title
                    excerpt
                    uri
                    date
                    featuredImage { node { sourceUrl altText } }
                    blogCategories { nodes { name slug } }
                  }
                }
              }`;
              const blogRes = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: blogQuery })
              });
              const blogJson = await blogRes.json();
              const blogNodes = (blogJson?.data?.blogPosts?.nodes || []);
              const filteredNodes = (selection === 'category' && selectedSlug)
                ? blogNodes.filter((n) => (n?.blogCategories?.nodes || []).some((c) => c?.slug === selectedSlug))
                : blogNodes;

              computedArticles = filteredNodes.map((n) => ({
                id: n?.id,
                title: n?.title,
                excerpt: n?.excerpt,
                uri: n?.uri,
                date: n?.date,
                imageUrl: n?.featuredImage?.node?.sourceUrl || '',
                imageAlt: n?.featuredImage?.node?.altText || n?.title || 'Article image',
                categories: (n?.blogCategories?.nodes || []).map((c) => c?.name).filter(Boolean),
              }));
            }

            normalizedBlocks = {
              ...normalizedBlocks,
              newsCarousel: newsConfig ? { ...newsConfig, computedArticles } : undefined,
            };
          }
        } catch (e) {
          console.warn('News Carousel posts fetch failed, falling back to config only.', e);
          // keep normalizedBlocks as-is; UI will gracefully show placeholder
        }
        
        // Overwrite with normalized structure for downstream rendering
        globalResult.data = { globalOptions: { globalContentBlocks: normalizedBlocks } };
        
        // Fetch homepage data
        const homepageResponse = await fetch(GRAPHQL_URL, {
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
           
      {/* Header Section from WordPress */}
      {homepageContent?.headerSection ? (
        <section className="home-hero-section">
          <div className="home-header-grid mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="home-header-text text-center md:text-left">
              <h1
                className="home-hero-title"
                dangerouslySetInnerHTML={{
                  __html: sanitizeTitleHtml(
                    homepageContent.headerSection.title || 'Welcome to CDA Website'
                  )
                }}
              />
              <p className="home-hero-subtitle">
                {homepageContent.headerSection.text || 'Digital solutions that drive results.'}
              </p>
              <div className="home-header-cta home-hero-cta">
                {homepageContent.headerSection.button1 && (
                  <a 
                    href={homepageContent.headerSection.button1.url || '#'} 
                    className="button-l"
                    target={homepageContent.headerSection.button1.target || '_self'}
                  >
                    {homepageContent.headerSection.button1.title || 'Get Started'}
                  </a>
                )}
                {homepageContent.headerSection.button2 && (
                  <a 
                    href={homepageContent.headerSection.button2.url || '#'} 
                    className="button-without-box"
                    target={homepageContent.headerSection.button2.target || '_self'}
                  >
                    {homepageContent.headerSection.button2.title || 'Learn More'}
                  </a>
                )}
              </div>
            </div>
            <div className="home-header-illustration-wrap">
              {homepageContent.headerSection.illustration?.node?.sourceUrl ? (
                <img 
                  src={homepageContent.headerSection.illustration.node.sourceUrl}
                  alt={homepageContent.headerSection.illustration.node.altText || 'Header illustration'}
                  className="home-header-illustration"
                />
              ) : (
                <div className="home-hero-illustration-placeholder">
                  <p>Upload illustration in WordPress Admin → Pages → Edit Homepage → Header Section</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="home-hero-section">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 text-center">
            <h1 className="home-hero-title">
              Welcome to CDA Website
            </h1>
            <p className="home-hero-subtitle">
              Digital solutions that drive results.
            </p>
            <p className="home-hero-config-hint">
              Configure header section in WordPress Admin → Pages → Edit Homepage
            </p>
          </div>
        </section>
      )}
      
       
      
      {globalSelection?.enableImageFrame && globalContentBlocks?.imageFrameBlock && (
        <PhotoFrame globalData={globalContentBlocks.imageFrameBlock} />
      )}

      {/* Services Accordion Block */}
      {globalSelection?.enableServicesAccordion && globalContentBlocks?.servicesAccordion && (
        // New styled accordion component
        <ServicesAccordion globalData={globalContentBlocks.servicesAccordion} />
      )}
      
      {globalSelection?.enableTechnologiesSlider && globalContentBlocks?.technologiesSlider && (
        <TechnologiesSlider 
          title={globalContentBlocks.technologiesSlider.title}
          subtitle={globalContentBlocks.technologiesSlider.subtitle}
          logos={globalContentBlocks.technologiesSlider.logos}
        />
      )}

      {/* Global Content Blocks - Only show if toggles are enabled and data exists */}
      {globalSelection?.enableValues && globalContentBlocks?.valuesBlock && (
        <>
          <ValuesBlock globalData={globalContentBlocks.valuesBlock} />
        </>
      )}

{/* Showreel Block */}
      {globalSelection?.enableShowreel && globalContentBlocks?.showreel && (
        <Showreel globalData={globalContentBlocks.showreel} />
      )}
      
      {/* Stats & Image Block */}
      {globalSelection?.enableStatsImage && globalContentBlocks?.statsImage && (
        <div style={{padding: '5rem 1rem'}}>
<div style={{maxWidth: '1620px', margin: '0 auto'}}>
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
                  className="button-l"
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
        <LocationsImage globalData={globalContentBlocks.locationsImage} />
      )}
      
      {/* Projects Section from WordPress */}
      {homepageContent?.projectsSection && (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f9fafb'}}>
<div style={{maxWidth: '1620px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>{homepageContent.projectsSection.title}</h2>
            <p style={{fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem'}}>{homepageContent.projectsSection.subtitle}</p>
            {homepageContent.projectsSection.link && (
              <a 
                href={homepageContent.projectsSection.link.url}
                className="button-l"
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
        <section className="home-case-studies" style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1620px', margin: '0 auto'}}>
            {/* Header: left subtitle + title, right CTA (empty box style) */}
            <div className="cs-header">
              <div className="cs-head-left">
                {homepageContent.caseStudiesSection.subtitle && (
                  <p className="cs-subtitle">{homepageContent.caseStudiesSection.subtitle}</p>
                )}
                {homepageContent.caseStudiesSection.title && (
                  <h2 className="cs-heading">{homepageContent.caseStudiesSection.title}</h2>
                )}
              </div>
              {homepageContent.caseStudiesSection.knowledgeHubLink && (
                <a
                  href={homepageContent.caseStudiesSection.knowledgeHubLink.url}
                  className="button-without-box cs-header-cta"
                  target={homepageContent.caseStudiesSection.knowledgeHubLink.target || '_self'}
                >
                  {homepageContent.caseStudiesSection.knowledgeHubLink.title}
                </a>
              )}
            </div>
            
            {/* Selected Case Studies - Alternating two-up layout */}
            {homepageContent.caseStudiesSection.selectedStudies?.nodes && homepageContent.caseStudiesSection.selectedStudies.nodes.length > 0 && (
              <div className="cs-list" style={{marginBottom: '3rem'}}>
                {homepageContent.caseStudiesSection.selectedStudies.nodes.slice(0, 2).map((study, index) => (
                  <article key={study.id || index} className={`cs-item ${index % 2 === 1 ? 'cs-item--reverse' : ''}`}>
                    <div className="cs-media">
                      {study.featuredImage?.node?.sourceUrl && (
                        <img 
                          src={study.featuredImage.node.sourceUrl}
                          alt={study.featuredImage.node.altText || study.title}
                          className="cs-img"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="cs-content">
                      <h3 className="cs-title">{study.title}</h3>
                      <div className="cs-excerpt" dangerouslySetInnerHTML={{__html: study.excerpt}} />
                      <a href={study.uri} className="button-l button-l--white cs-cta">Read Case Study</a>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {/* Removed bottom CTA; moved to header */}
          </div>
        </section>
      )}

      {/* News Carousel Block */}
      {globalSelection?.enableNewsCarousel && globalContentBlocks?.newsCarousel && (
        <section className="news-carousel-section">
          <div className="news-carousel-container">
            <div className="news-carousel-header">
              <div className="news-carousel-header-left">
                <h2 className="news-carousel-subtitle">{globalContentBlocks.newsCarousel.subtitle}</h2>
                <h2 className="news-carousel-title">{globalContentBlocks.newsCarousel.title}</h2>
              </div>
              <a href="/news" className="news-carousel-all">All News</a>
            </div>

            {(globalContentBlocks.newsCarousel.computedArticles?.length || 0) > 0 ? (
              <div className="news-carousel-list">
                {globalContentBlocks.newsCarousel.computedArticles.map((post) => {
                  const slugFromUri = (() => {
                    try {
                      // wp uri example: /index.php/blog/magento-vs-shopify-which-platform-is-best/
                      const parts = (post.uri || '').split('/').filter(Boolean);
                      // last segment is slug
                      return parts[parts.length - 1] || '';
                    } catch (_) { return ''; }
                  })();
                  const nextHref = slugFromUri ? `/news-article/${slugFromUri}` : (post.uri || '#');
                  return (
                    <article key={post.id || post.uri} className="news-card">
                      {post.imageUrl ? (
                        <a href={nextHref} className="news-card-image" aria-label={post.title}>
                          <img src={post.imageUrl} alt={post.imageAlt || post.title} />
                        </a>
                      ) : null}
                      <div className="news-card-content">
                        <h3 className="news-card-title" dangerouslySetInnerHTML={{ __html: post.title }} />
                        {post.excerpt && (
                          <div className="news-card-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                        )}
                        <a href={nextHref} className="news-card-link">Read more →</a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="news-carousel-placeholder">
                <p>No articles found. Add posts in WordPress or adjust the News Carousel settings.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter Signup Block */}
      {globalSelection?.enableNewsletterSignup && globalContentBlocks?.newsletterSignup && (
        <NewsletterSignup globalData={globalContentBlocks.newsletterSignup} />
      )}
      
      
      
      {/* Projects Section from WordPress */}
      {homepageContent?.projectsSection && (
        <section style={{padding: '5rem 1rem', backgroundColor: '#f9fafb'}}>
<div style={{maxWidth: '1620px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>{homepageContent.projectsSection.title}</h2>
            <p style={{fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem'}}>{homepageContent.projectsSection.subtitle}</p>
            {homepageContent.projectsSection.link && (
              <a 
                href={homepageContent.projectsSection.link.url}
                className="button-l"
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
        <section className="home-case-studies" style={{padding: '5rem 1rem'}}>
          <div style={{maxWidth: '1620px', margin: '0 auto'}}>
            {/* Header: left subtitle + title, right CTA (empty box style) */}
            <div className="cs-header">
              <div className="cs-head-left">
                {homepageContent.caseStudiesSection.subtitle && (
                  <p className="cs-subtitle">{homepageContent.caseStudiesSection.subtitle}</p>
                )}
                {homepageContent.caseStudiesSection.title && (
                  <h2 className="cs-heading">{homepageContent.caseStudiesSection.title}</h2>
                )}
              </div>
              {homepageContent.caseStudiesSection.knowledgeHubLink && (
                <a
                  href={homepageContent.caseStudiesSection.knowledgeHubLink.url}
                  className="button-without-box cs-header-cta"
                  target={homepageContent.caseStudiesSection.knowledgeHubLink.target || '_self'}
                >
                  {homepageContent.caseStudiesSection.knowledgeHubLink.title}
                </a>
              )}
            </div>
            
            {/* Selected Case Studies - Alternating two-up layout */}
            {homepageContent.caseStudiesSection.selectedStudies?.nodes && homepageContent.caseStudiesSection.selectedStudies.nodes.length > 0 && (
              <div className="cs-list" style={{marginBottom: '3rem'}}>
                {homepageContent.caseStudiesSection.selectedStudies.nodes.slice(0, 2).map((study, index) => (
                  <article key={study.id || index} className={`cs-item ${index % 2 === 1 ? 'cs-item--reverse' : ''}`}>
                    <div className="cs-media">
                      {study.featuredImage?.node?.sourceUrl && (
                        <img 
                          src={study.featuredImage.node.sourceUrl}
                          alt={study.featuredImage.node.altText || study.title}
                          className="cs-img"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="cs-content">
                      <h3 className="cs-title">{study.title}</h3>
                      <div className="cs-excerpt" dangerouslySetInnerHTML={{__html: study.excerpt}} />
                      <a href={study.uri} className="button-l button-l--white cs-cta">Read Case Study</a>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {/* Removed bottom CTA; moved to header */}
          </div>
        </section>
      )}

      {/* Global Content Debug & Configuration Section */}
      <div style={{padding: '3rem 1rem', backgroundColor: '#f0f9ff', borderTop: '1px solid #e0e7ff'}}>
<div style={{maxWidth: '1620px', margin: '0 auto'}}>
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
