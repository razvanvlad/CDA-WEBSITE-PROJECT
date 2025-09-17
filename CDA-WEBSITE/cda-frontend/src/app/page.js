'use client';

import { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ValuesBlock from '../components/GlobalBlocks/ValuesBlock';
import PhotoFrame from '../components/GlobalBlocks/PhotoFrame';
import TechnologiesSlider from '../components/GlobalBlocks/TechnologiesSlider';
import Showreel from '../components/GlobalBlocks/Showreel';
import ServicesAccordion from '../components/GlobalBlocks/ServicesAccordion';
import LocationsImage from '../components/GlobalBlocks/LocationsImage';
import CaseStudies from '../components/GlobalBlocks/CaseStudies';
import { sanitizeTitleHtml } from '../lib/sanitizeTitleHtml';
import NewsletterSignup from '../components/GlobalBlocks/NewsletterSignup';

export default function Home() {
  const [globalData, setGlobalData] = useState(null);
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const newsListRef = useRef(null);

  const scrollNews = (dir) => {
    if (!newsListRef.current) return;
    const el = newsListRef.current;
    const firstCard = el.querySelector('.news-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.86;
    const delta = dir === 'next' ? cardWidth + 16 : -(cardWidth + 16);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

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
                    ... on Service { id title uri slug }
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
                className="cda-page-title title-large-light-blue"
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
                <>
                  {(() => {
                    const src = homepageContent.headerSection.illustration.node.sourceUrl;
                    const alt = homepageContent.headerSection.illustration.node.altText || 'Header illustration';
                    const Image = require('next/image').default;
                    return (
                      <Image
                        src={src}
                        alt={alt}
                        priority
                        fetchPriority="high"
                        width={700}
                        height={520}
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 700px"
                        className="home-header-illustration"
                      />
                    );
                  })()}
                </>
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
            <h1 className="cda-page-title title-large-light-blue">
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
   
      {/* Case Studies Section from WordPress */}
      {homepageContent?.caseStudiesSection && (
        <CaseStudies globalData={homepageContent.caseStudiesSection} />
      )}

      {/* News Carousel Block */}
      {globalSelection?.enableNewsCarousel && globalContentBlocks?.newsCarousel && (
        <section className="news-carousel-section">
          <div className="news-carousel-container">
            <div className="news-carousel-header">
              <div className="news-carousel-header-left">
                <p className="cda-subtitle">{globalContentBlocks.newsCarousel.subtitle}</p>
                <h2 className="cda-title">{globalContentBlocks.newsCarousel.title}</h2>
              </div>
              <a href="/news" className="news-carousel-all">All News</a>
            </div>

            {(globalContentBlocks.newsCarousel.computedArticles?.length || 0) > 0 ? (
              <>
                <div ref={newsListRef} className="news-carousel-list">
                  {globalContentBlocks.newsCarousel.computedArticles.map((post) => {
                    const slugFromUri = (() => {
                      try {
                        const parts = (post.uri || '').split('/').filter(Boolean);
                        return parts[parts.length - 1] || '';
                      } catch (_) { return ''; }
                    })();
                    const nextHref = slugFromUri ? `/news-article/${slugFromUri}` : (post.uri || '#');
                    return (
                      <article key={post.id || post.uri} className="news-card">
                        {post.imageUrl ? (
                          <a href={nextHref} className="news-card-image" aria-label={post.title}>
{(() => { const Image = require('next/image').default; return (
                              <Image src={post.imageUrl} alt={post.imageAlt || post.title} width={400} height={260} sizes="(max-width: 768px) 90vw, 400px" />
                            ); })()}
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
                <div className="news-carousel-nav">
                  <button type="button" className="news-carousel-nav-btn prev" onClick={() => scrollNews('prev')} aria-label="Previous">
                    ←
                  </button>
                  <button type="button" className="news-carousel-nav-btn next" onClick={() => scrollNews('next')} aria-label="Next">
                    →
                  </button>
                </div>
              </>
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
