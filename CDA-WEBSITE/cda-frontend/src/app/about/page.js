import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/GlobalBlocks/HeroSection';
import PhotoFrame from '../../components/GlobalBlocks/PhotoFrame';
import WhyCdaBlock from '../../components/GlobalBlocks/WhyCdaBlock';
import ServicesAccordion from '../../components/GlobalBlocks/ServicesAccordion';
import Showreel from '../../components/GlobalBlocks/Showreel';
import ApproachBlock from '../../components/GlobalBlocks/ApproachBlock';
import CultureGallerySlider from '../../components/GlobalBlocks/CultureGallerySlider';
import StatsBlock from '../../components/GlobalBlocks/StatsBlock';
import ResponsiveUnderlinedTitle from '../../components/ResponsiveUnderlinedTitle';
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
      
      {/* 1) Hero individual */}
      {aboutContent?.contentPageHeader && (
        <HeroSection
          sectionClassName="bg-white"
          title={
            <ResponsiveUnderlinedTitle
              as="h1"
              className="cda-title"
              underlineColor="#FF60DF"
            >
              {aboutContent.contentPageHeader.title || 'Learn More About Us'}
            </ResponsiveUnderlinedTitle>
          }
          descriptionHtml={aboutContent.contentPageHeader.text || ''}
          ctas={[
            aboutContent.contentPageHeader.cta
              ? {
                  href: aboutContent.contentPageHeader.cta.url || '#',
                  label: aboutContent.contentPageHeader.cta.title || 'Get Started',
                  target: aboutContent.contentPageHeader.cta.target || '_self',
                  className: 'button-without-box',
                }
              : null,
          ]}
          image={
            aboutContent.contentPageHeader.image?.node?.sourceUrl ? (
              <img
                src={aboutContent.contentPageHeader.image.node.sourceUrl}
                alt={aboutContent.contentPageHeader.image.node.altText || 'About illustration'}
                width={700}
                height={520}
                className="cda-hero__image-media"
              />
            ) : (
              <div className="cda-hero__image-placeholder">
                <p>Upload illustration in WordPress Admin → Pages → Edit About → Header Section</p>
              </div>
            )
          }
        />
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
      {/* 4) [Global] Services Accordion */}
{/* 4) [Global] Services Accordion */}
{t.showServicesAccordion && globalContentBlocks?.servicesAccordion && (
  <ServicesAccordion
    globalData={{
      title: globalContentBlocks.servicesAccordion.title,
      subtitle: globalContentBlocks.servicesAccordion.subtitle,
      illustration: globalContentBlocks.servicesAccordion.illustration,
      services: {
        nodes: (
          globalContentBlocks.servicesAccordion?.services?.nodes
          ?? (globalContentBlocks.servicesAccordion?.services?.edges || []).map(e => e?.node)
          ?? globalContentBlocks.servicesAccordion?.servicesList?.nodes
          ?? (globalContentBlocks.servicesAccordion?.servicesList?.edges || []).map(e => e?.node)
          ?? (Array.isArray(globalContentBlocks.servicesAccordion?.servicesList)
                ? globalContentBlocks.servicesAccordion.servicesList
                : [])
        ).filter(Boolean),
      },
    }}
    overlap={false}
    bg="bg-white"
    panelBg="bg-white"
    className="pt-10 md:pt-12"
  />
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
              const raw = globalContentBlocks.fullVideo.file?.node?.sourceUrl || globalContentBlocks.fullVideo.url
              if (!raw) return null
              const isVimeo = /vimeo\.com/.test(raw)
              const isYouTube = /youtube\.com|youtu\.be/.test(raw)
              if (isVimeo || isYouTube) {
                let embedUrl = raw
                if (isVimeo) {
                  const m = raw.match(/vimeo\.com\/(?:video\/)?(?:.+\/)?(\d+)/)
                  const id = m && m[1]
                  if (id) embedUrl = `https://player.vimeo.com/video/${id}`
                }
                return (
                  <div className="aspect-video w-full rounded overflow-hidden">
                    <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                  </div>
                )
              }
              return (
                <video className="w-full rounded-lg" controls>
                  <source src={raw} />
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
                  <ResponsiveUnderlinedTitle
                    as="h2"
                    className="section-title mb-4"
                    underlineColor="#FF60DF"
                  >
                    {aboutContent.behindCda.title}
                  </ResponsiveUnderlinedTitle>
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
