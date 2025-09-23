import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PhotoFrame from '../../components/GlobalBlocks/PhotoFrame';
import WhyCdaBlock from '../../components/GlobalBlocks/WhyCdaBlock';
import ServicesAccordion from '../../components/GlobalBlocks/ServicesAccordion';
import Showreel from '../../components/GlobalBlocks/Showreel';
import ApproachBlock from '../../components/GlobalBlocks/ApproachBlock';
import CultureGallerySlider from '../../components/GlobalBlocks/CultureGallerySlider';
import StatsBlock from '../../components/GlobalBlocks/StatsBlock';
import { sanitizeTitleHtml } from '../../lib/sanitizeTitleHtml';
import { executeGraphQLQuery, getGlobalContent, getPageGlobalTogglesByUri, getPageGlobalTogglesBySlug } from '../../lib/graphql-queries';

export const revalidate = 300;

export default async function AboutPage() {

  // Use provided working query (by DB ID)
  const ABOUT_ID = String(process.env.NEXT_PUBLIC_ABOUT_PAGE_ID || '317')

  // Fetch global blocks (approach, values, statsAndNumbers, etc.)
  const globalBlocks = await getGlobalContent();

  // Fetch About page content with working query (includes behindCda)
  const GET_ABOUT = `
    query GetAboutUsPage($id: ID!) {
      page(id: $id, idType: DATABASE_ID) {
        id
        title
        date
        ... on NodeWithFeaturedImage {
          featuredImage { node { sourceUrl altText } }
        }
        ... on Page {
          aboutUsContent {
            contentPageHeader {
              title
              text
              cta { url title target }
              image { node { sourceUrl altText } }
            }
            behindCda {
              illustration { node { sourceUrl altText } }
              subtitle
              title
              description
              cta { url title target }
            }
          }
        }
      }
    }
  `
  const aboutRes = await executeGraphQLQuery(GET_ABOUT, { id: ABOUT_ID })
  const aboutData = aboutRes?.data?.page?.aboutUsContent || {};

  const globalContentBlocks = { ...(globalBlocks || {}) };
  const aboutContent = aboutData;

  // Per-page global toggles (same approach as test page)
  let toggles = await getPageGlobalTogglesByUri('/index.php/about/')
  if (!toggles) toggles = await getPageGlobalTogglesByUri('/about/')
  if (!toggles) toggles = await getPageGlobalTogglesBySlug('about')
  const knownFlags = ['showApproach','showCaseStudies','showImageFrame','showNewsCarousel','showThreeColumns','showValues','showWhyCda','showServicesAccordion','showTechnologiesSlider','showShowreel','showLocationsImage','showNewsletterSignup','showContactFormLeftImageRight','showJoinOurTeam','showFullVideo','showStatsAndNumbers','showCultureGallerySlider']
  const hasAny = toggles && typeof toggles === 'object' && knownFlags.some(k => Object.prototype.hasOwnProperty.call(toggles,k))
  const t = hasAny ? toggles : Object.fromEntries(knownFlags.map(k => [k, true]))

  return (
    <>
      <Header />
      
      {/* 1) Hero individual (uses same classes as homepage hero) */}
      {aboutContent?.contentPageHeader && (
        <section className="home-hero-section bg-white">
          <div className="home-header-grid mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="home-header-text text-center md:text-left">
              <h1
                className="cda-page-title title-large-light-blue"
                dangerouslySetInnerHTML={{ __html: sanitizeTitleHtml(aboutContent.contentPageHeader.title || 'About Us') }}
              />
              {aboutContent.contentPageHeader.text && (
                <div className="home-hero-subtitle" dangerouslySetInnerHTML={{ __html: aboutContent.contentPageHeader.text }} />
              )}
              {aboutContent.contentPageHeader.cta && (
                <div className="home-header-cta home-hero-cta">
                  <a href={aboutContent.contentPageHeader.cta.url || '#'} className="button-l" target={aboutContent.contentPageHeader.cta.target || '_self'}>
                    {aboutContent.contentPageHeader.cta.title || 'Get Started'}
                  </a>
                </div>
              )}
            </div>
            <div className="home-header-illustration-wrap">
              {aboutContent.contentPageHeader.image?.node?.sourceUrl ? (
                <img
                  src={aboutContent.contentPageHeader.image.node.sourceUrl}
                  alt={aboutContent.contentPageHeader.image.node.altText || 'About illustration'}
                  width={700}
                  height={520}
                  className="home-header-illustration"
                />
              ) : (
                <div className="home-hero-illustration-placeholder">
                  <p>Upload illustration in WordPress Admin → Pages → Edit About → Header Section</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Order below: 2 Image Frame, 3 WhyCda, 4 Services Accordion, 5 Culture Gallery, 6 Approach, 7 Stats, 8 Full Video, 9 Custom (placeholder), 10 Showreel */}

      {/* 2) [Global] Image Frame Block */}
      {t.showImageFrame && globalContentBlocks?.imageFrameBlock && (
        <PhotoFrame globalData={globalContentBlocks.imageFrameBlock} />
      )}

      {/* 3) [Global] Why CDA Block */}
      {t.showWhyCda && (globalContentBlocks?.whyCda || globalContentBlocks?.whyCdaBlock) && (
        <WhyCdaBlock globalData={globalContentBlocks.whyCda || globalContentBlocks.whyCdaBlock} />
      )}

      {/* 4) [Global] Services Accordion */}
      {t.showServicesAccordion && globalContentBlocks?.servicesAccordion && (
        <ServicesAccordion globalData={globalContentBlocks.servicesAccordion} />
      )}

      {/* 5) [Global] Culture Gallery Slider */}
      {t.showCultureGallerySlider && globalContentBlocks?.cultureGallerySlider && (
        <CultureGallerySlider globalData={globalContentBlocks.cultureGallerySlider} />
      )}

      {/* 6) [Global] Approach */}
      {t.showApproach && globalContentBlocks?.approach && (
        <ApproachBlock globalData={globalContentBlocks.approach} />
      )}

      {/* 7) [Global] Stats */}
      {t.showStatsAndNumbers && globalContentBlocks?.statsAndNumbers && (
        <StatsBlock data={globalContentBlocks.statsAndNumbers} />
      )}

      {/* 8) [Global] Full Video */}
      {t.showFullVideo && globalContentBlocks?.fullVideo && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-4">
            {(() => {
              const url = globalContentBlocks.fullVideo.file?.node?.sourceUrl || globalContentBlocks.fullVideo.url
              if (!url) return null
              const isVimeo = /vimeo\.com/.test(url)
              const isYouTube = /youtube\.com|youtu\.be/.test(url)
              if (isVimeo || isYouTube) {
                return (
                  <div className="aspect-video w-full rounded overflow-hidden">
                    <iframe src={url} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" />
                  </div>
                )
              }
              return (
                <video className="w-full rounded-lg" controls>
                  <source src={url} />
                </video>
              )
            })()}
          </div>
        </section>
      )}

      {/* 9) Custom individual (Behind CDA) */}
      {aboutContent?.behindCda && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-center">
              {/* Left: Image */}
              <div className="col-span-12 md:col-span-6">
                {aboutContent.behindCda.illustration?.node?.sourceUrl && (
                  <img
                    src={aboutContent.behindCda.illustration.node.sourceUrl}
                    alt={aboutContent.behindCda.illustration.node.altText || 'Behind CDA illustration'}
                    width={485}
                    height={586}
                    className="w-[485px] h-[586px] object-contain rounded"
                  />
                )}
              </div>
              {/* Right: Subtitle, Title, Text, CTA */}
              <div className="col-span-12 md:col-span-6">
                {aboutContent.behindCda.subtitle && (
                  <p className="cda-subtitle mb-2">{aboutContent.behindCda.subtitle}</p>
                )}
                {aboutContent.behindCda.title && (
                  <h2 className="cda-title mb-4" style={{ textDecoration: 'none' }}>{aboutContent.behindCda.title}</h2>
                )}
                {aboutContent.behindCda.description && (
                  <div className="wysiwyg-content text-[16px] md:text-[18px] leading-[1.7] text-[#4B5563] mb-6"
                       dangerouslySetInnerHTML={{ __html: aboutContent.behindCda.description }} />
                )}
                {aboutContent.behindCda.cta?.url && (
                  <a href={aboutContent.behindCda.cta.url}
                     target={aboutContent.behindCda.cta.target || '_self'}
                     className="button-without-box">
                    {aboutContent.behindCda.cta.title || 'Learn More'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10) [Global] Showreel Block */}
      {t.showShowreel && globalContentBlocks?.showreel && (
        <Showreel globalData={globalContentBlocks.showreel} />
      )}

      <Footer />
    </>
  );
}
