import Header from '../components/Header';
import Footer from '../components/Footer';
import ValuesBlock from '../components/GlobalBlocks/ValuesBlock';
import PhotoFrame from '../components/GlobalBlocks/PhotoFrame';
import TechnologiesSlider from '../components/GlobalBlocks/TechnologiesSlider';
import Showreel from '../components/GlobalBlocks/Showreel';
import ServicesAccordion from '../components/GlobalBlocks/ServicesAccordion';
import LocationsImage from '../components/GlobalBlocks/LocationsImage';
import CaseStudies from '../components/GlobalBlocks/CaseStudies';
import StatsBlock from '../components/GlobalBlocks/StatsBlock';
import { sanitizeTitleHtml } from '../lib/sanitizeTitleHtml';
import NewsletterSignup from '../components/GlobalBlocks/NewsletterSignup';
import NewsCarouselClient from '../components/GlobalBlocks/NewsCarouselClient.jsx';
import { executeGraphQLQuery, getGlobalContent } from '../lib/graphql-queries';

export const revalidate = 300;

export default async function Home() {
  // Fetch global options via centralized helper (includes approach, case studies section, statsAndNumbers)
  const globalBlocks = await getGlobalContent();

  // Fetch homepage CMS content
  const homepageQuery = `{
    page(id: "289", idType: DATABASE_ID) {
      title
      homepageContentClean {
        headerSection {
          title
          text
          button1 { url title target }
          button2 { url title target }
          illustration { node { sourceUrl altText } }
        }
        projectsSection { title subtitle link { url title target } }
        caseStudiesSection {
          subtitle
          title
          knowledgeHubLink { url title target }
          selectedStudies { nodes { ... on CaseStudy { id title uri excerpt featuredImage { node { sourceUrl altText } } } } }
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
  const homepageRes = await executeGraphQLQuery(homepageQuery);
  const homepageData = homepageRes?.data?.page?.homepageContentClean || {};

  // Compute News Carousel articles server-side (manual / latest / category)
  let newsCarousel = globalBlocks?.newsCarousel || null;
  if (newsCarousel) {
    try {
      const selection = newsCarousel.articleSelection;
      let computedArticles = [];
      if (selection === 'manual') {
        computedArticles = (newsCarousel.manualArticles?.nodes || [])
          .filter(n => !!n)
          .map((n) => ({
            id: n?.id,
            title: n?.title,
            excerpt: n?.excerpt,
            uri: n?.uri,
            imageUrl: n?.featuredImage?.node?.sourceUrl || '',
            imageAlt: n?.featuredImage?.node?.altText || n?.title || 'Article image',
          }));
      } else {
        const selectedSlug = newsCarousel?.category?.nodes?.[0]?.slug;
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
        const blogRes = await executeGraphQLQuery(blogQuery);
        const blogNodes = blogRes?.data?.blogPosts?.nodes || [];
        const filtered = (selection === 'category' && selectedSlug)
          ? blogNodes.filter((n) => (n?.blogCategories?.nodes || []).some((c) => c?.slug === selectedSlug))
          : blogNodes;
        computedArticles = filtered.map((n) => ({
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
      newsCarousel = { ...newsCarousel, computedArticles };
    } catch (_) {
      // keep as-is
    }
  }

  // Merge back normalized globalBlocks with computed news carousel
  const globalContentBlocks = { ...(globalBlocks || {}), ...(newsCarousel ? { newsCarousel } : {}) };
  const globalSelection = homepageData?.globalContentSelection || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Header />

      {/* Header Section */}
      {homepageData?.headerSection ? (
        <section className="home-hero-section">
          <div className="home-header-grid mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="home-header-text text-center md:text-left">
              <h1
                className="cda-page-title title-large-light-blue"
                dangerouslySetInnerHTML={{ __html: sanitizeTitleHtml(homepageData.headerSection.title || 'Welcome to CDA Website') }}
              />
              <p className="home-hero-subtitle">{homepageData.headerSection.text || 'Digital solutions that drive results.'}</p>
              <div className="home-header-cta home-hero-cta">
                {homepageData.headerSection.button1 && (
                  <a href={homepageData.headerSection.button1.url || '#'} className="button-l" target={homepageData.headerSection.button1.target || '_self'}>
                    {homepageData.headerSection.button1.title || 'Get Started'}
                  </a>
                )}
                {homepageData.headerSection.button2 && (
                  <a href={homepageData.headerSection.button2.url || '#'} className="button-without-box" target={homepageData.headerSection.button2.target || '_self'}>
                    {homepageData.headerSection.button2.title || 'Learn More'}
                  </a>
                )}
              </div>
            </div>
            <div className="home-header-illustration-wrap">
              {homepageData.headerSection.illustration?.node?.sourceUrl ? (
                <img
                  src={homepageData.headerSection.illustration.node.sourceUrl}
                  alt={homepageData.headerSection.illustration.node.altText || 'Header illustration'}
                  width={700}
                  height={520}
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
      ) : null}

      {/* Image Frame Block */}
      {globalSelection?.enableImageFrame && globalContentBlocks?.imageFrameBlock && (
        <PhotoFrame globalData={globalContentBlocks.imageFrameBlock} />
      )}

      {/* Services Accordion */}
      {globalSelection?.enableServicesAccordion && globalContentBlocks?.servicesAccordion && (
        <ServicesAccordion globalData={globalContentBlocks.servicesAccordion} />
      )}

      {/* Technologies Slider */}
      {globalSelection?.enableTechnologiesSlider && globalContentBlocks?.technologiesSlider && (
        <TechnologiesSlider
          title={globalContentBlocks.technologiesSlider.title}
          subtitle={globalContentBlocks.technologiesSlider.subtitle}
          logos={globalContentBlocks.technologiesSlider.logos}
        />
      )}

      {/* Showreel */}
      {globalSelection?.enableShowreel && globalContentBlocks?.showreel && (
        <Showreel globalData={globalContentBlocks.showreel} />
      )}

      {/* Stats & Numbers */}
      {globalSelection?.enableStatsImage && globalContentBlocks?.statsAndNumbers && (
        <StatsBlock data={globalContentBlocks.statsAndNumbers} />
      )}

      {/* Locations */}
      {globalSelection?.enableLocationsImage && globalContentBlocks?.locationsImage && (
        <LocationsImage globalData={globalContentBlocks.locationsImage} />
      )}

      {/* Case Studies (from homepage page) */}
      {homepageData?.caseStudiesSection && (
        <CaseStudies globalData={homepageData.caseStudiesSection} />
      )}

      {/* News Carousel */}
      {globalSelection?.enableNewsCarousel && globalContentBlocks?.newsCarousel && (
        <NewsCarouselClient
          title={globalContentBlocks.newsCarousel.title}
          subtitle={globalContentBlocks.newsCarousel.subtitle}
          articles={globalContentBlocks.newsCarousel.computedArticles || []}
        />
      )}

      {/* Newsletter Signup */}
      {globalSelection?.enableNewsletterSignup && globalContentBlocks?.newsletterSignup && (
        <NewsletterSignup globalData={globalContentBlocks.newsletterSignup} />
      )}

      <Footer globalOptions={{ globalContentBlocks }} />
    </div>
  );
}
