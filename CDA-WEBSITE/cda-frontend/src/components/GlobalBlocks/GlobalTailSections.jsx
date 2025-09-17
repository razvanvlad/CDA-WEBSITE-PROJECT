import ApproachBlock from '@/components/GlobalBlocks/ApproachBlock'
import CaseStudies from '@/components/GlobalBlocks/CaseStudies'
import StatsBlock from '@/components/GlobalBlocks/StatsBlock.jsx'
import PhotoFrame from '@/components/GlobalBlocks/PhotoFrame'
import NewsCarouselClient from '@/components/GlobalBlocks/NewsCarouselClient.jsx'
import ServicesAccordion from '@/components/GlobalBlocks/ServicesAccordion'
import TechnologiesSlider from '@/components/GlobalBlocks/TechnologiesSlider'
import Showreel from '@/components/GlobalBlocks/Showreel'
import LocationsImage from '@/components/GlobalBlocks/LocationsImage'
import ValuesBlock from '@/components/GlobalBlocks/ValuesBlock'
import WhyCdaBlock from '@/components/GlobalBlocks/WhyCdaBlock'
import ThreeColumnsWithIcons from '@/components/GlobalBlocks/ThreeColumnsWithIcons'
import CultureGallerySlider from '@/components/GlobalBlocks/CultureGallerySlider.jsx'
import { getCaseStudiesWithPagination, executeGraphQLQuery } from '@/lib/graphql-queries.js'
import HubspotFormClient from '@/components/Embeds/HubspotFormClient.jsx'

// Server component that renders common global sections at the end of a page.
// If the global Case Studies section is not defined in your schema/options,
// we gracefully fall back to the latest 2 case studies.
export default async function GlobalTailSections({
  globalData,
  enableCaseStudiesFallback = true,
  enableStats = true,
  enableImageFrame = false,
  enableNewsCarousel = false,
  enableColumnsWithIcons3X = false,
  enableApproach = false,
  enableValues = false,
  enableWhyCda = false,
  enableServicesAccordion = false,
  enableTechnologiesSlider = false,
  enableShowreel = false,
  enableLocationsImage = false,
  enableNewsletterSignup = false,
  enableContactFormLeftImageRight = false,
  enableJoinOurTeam = false,
  enableFullVideo = false,
  enableCultureGallerySlider = false,
}) {
  if (!globalData) return null

  let csData = globalData?.caseStudiesSection || null

  // Fallback: fetch latest case studies and adapt to CaseStudies component shape
  if (!csData && enableCaseStudiesFallback) {
    try {
      const { nodes } = await getCaseStudiesWithPagination({ first: 2 })
      if (nodes && nodes.length > 0) {
        csData = {
          title: 'Case Studies',
          subtitle: 'Our Work',
          knowledgeHubLink: { url: '/case-studies', title: 'See All', target: '_self' },
          selectedStudies: {
            nodes: nodes.map((n) => ({
              id: n.id,
              title: n.title,
              uri: `/case-studies/${n.slug}`,
              excerpt: n.excerpt,
              featuredImage: n.featuredImage,
            })),
          },
        }
      }
    } catch (_) {
      // ignore fallback errors
    }
  }

  // Compute news carousel articles when enabled
  let newsArticles = []
  if (enableNewsCarousel && globalData?.newsCarousel) {
    const newsConfig = globalData.newsCarousel
    try {
      const selection = newsConfig.articleSelection
      if (selection === 'manual') {
        newsArticles = (newsConfig.manualArticles?.nodes || []).map((n) => ({
          id: n?.id,
          title: n?.title,
          excerpt: n?.excerpt,
          uri: n?.uri,
          imageUrl: n?.featuredImage?.node?.sourceUrl || '',
          imageAlt: n?.featuredImage?.node?.altText || n?.title || 'Article image',
        }))
      } else {
        const selectedSlug = newsConfig?.category?.nodes?.[0]?.slug
        const firstCount = selection === 'category' ? 12 : 6
        const BLOG_QUERY = `
          query GetLatestBlogPosts($first: Int!) {
            blogPosts(first: $first, where: { orderby: {field: DATE, order: DESC} }) {
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
          }
        `
        const blogRes = await executeGraphQLQuery(BLOG_QUERY, { first: firstCount })
        const blogNodes = blogRes?.data?.blogPosts?.nodes || []
        const filteredNodes = (selection === 'category' && selectedSlug)
          ? blogNodes.filter((n) => (n?.blogCategories?.nodes || []).some((c) => c?.slug === selectedSlug))
          : blogNodes
        newsArticles = filteredNodes.map((n) => ({
          id: n?.id,
          title: n?.title,
          excerpt: n?.excerpt,
          uri: n?.uri,
          date: n?.date,
          imageUrl: n?.featuredImage?.node?.sourceUrl || '',
          imageAlt: n?.featuredImage?.node?.altText || n?.title || 'Article image',
          categories: (n?.blogCategories?.nodes || []).map((c) => c?.name).filter(Boolean),
        }))
      }
    } catch (e) {
      console.warn('News Carousel compute failed, showing config without articles.', e)
    }
  }

  return (
    <>
      {csData && (
        <CaseStudies globalData={csData} />
      )}

      {enableStats && globalData?.statsAndNumbers && (
        <StatsBlock data={globalData.statsAndNumbers} />
      )}

      {enableImageFrame && globalData?.imageFrameBlock && (
        <PhotoFrame globalData={globalData.imageFrameBlock} />
      )}

      {enableNewsCarousel && globalData?.newsCarousel && (
        <NewsCarouselClient
          title={globalData.newsCarousel.title}
          subtitle={globalData.newsCarousel.subtitle}
          articles={newsArticles}
        />
      )}

      {enableColumnsWithIcons3X && (globalData?.threeColumnsWithIcons || globalData?.columnsWithIcons3X) && (
        <ThreeColumnsWithIcons globalData={globalData.threeColumnsWithIcons || globalData.columnsWithIcons3X} />
      )}

      {(enableApproach || globalData?.approach) && globalData?.approach && (
        <ApproachBlock globalData={globalData.approach} />
      )}

      {/* TODO: The following blocks require their own components.
          For now, they render only when data exists and corresponding enable flags are set. */}
      {enableValues && globalData?.valuesBlock && (
        <ValuesBlock globalData={globalData.valuesBlock} />
      )}

      {enableWhyCda && (globalData?.whyCda || globalData?.whyCdaBlock) && (
        <WhyCdaBlock globalData={globalData.whyCda || globalData.whyCdaBlock} />
      )}

      {enableServicesAccordion && globalData?.servicesAccordion && (
        <ServicesAccordion globalData={{
          title: globalData.servicesAccordion.title,
          subtitle: globalData.servicesAccordion.subtitle,
          illustration: globalData.servicesAccordion.illustration,
          services: { nodes: (globalData.servicesAccordion.services?.edges || []).map(e => e?.node).filter(Boolean) }
        }} />
      )}

      {enableTechnologiesSlider && globalData?.technologiesSlider && (
        <TechnologiesSlider globalData={{
          title: globalData.technologiesSlider.title,
          subtitle: globalData.technologiesSlider.subtitle,
          logos: (globalData.technologiesSlider.logos?.edges || []).map(e => ({ title: e?.node?.title }))
        }} />
      )}

      {enableShowreel && globalData?.showreel && (
        <Showreel globalData={globalData.showreel} />
      )}

      {enableLocationsImage && globalData?.locationsImage && (
        <LocationsImage globalData={globalData.locationsImage} />
      )}

      {enableNewsletterSignup && globalData?.newsletterSignup && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-4">
            {globalData.newsletterSignup.title && (
              <h2 className="text-3xl font-bold text-black mb-2">{globalData.newsletterSignup.title}</h2>
            )}
            {globalData.newsletterSignup.subtitle && (
              <p className="text-gray-600 mb-4">{globalData.newsletterSignup.subtitle}</p>
            )}
            {globalData.newsletterSignup.hubspotScript ? (
              <HubspotFormClient embedScript={globalData.newsletterSignup.hubspotScript} />
            ) : (
              <div className="text-sm text-gray-500">No form configured.</div>
            )}
          </div>
        </section>
      )}

      {enableContactFormLeftImageRight && globalData?.contactFormLeftImageRight && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {globalData.contactFormLeftImageRight.title && (
                <h2 className="text-3xl font-bold text-black mb-2">{globalData.contactFormLeftImageRight.title}</h2>
              )}
              {globalData.contactFormLeftImageRight.formCode ? (
                <HubspotFormClient embedScript={globalData.contactFormLeftImageRight.formCode} />
              ) : (
                <div className="text-sm text-gray-500">No form configured.</div>
              )}
            </div>
            <div>
              {globalData.contactFormLeftImageRight.rightMediaType === 'image' && globalData.contactFormLeftImageRight.rightImage?.node?.sourceUrl && (
                <img src={globalData.contactFormLeftImageRight.rightImage.node.sourceUrl} alt={globalData.contactFormLeftImageRight.rightImage.node.altText || ''} className="w-full h-auto rounded" />
              )}
            </div>
          </div>
        </section>
      )}

      {enableJoinOurTeam && globalData?.joinOurTeam && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {globalData.joinOurTeam.title && (
                <h2 className="text-3xl font-bold text-black mb-4">{globalData.joinOurTeam.title}</h2>
              )}
              {globalData.joinOurTeam.text && (
                <div className="prose prose-sm max-w-none text-black" dangerouslySetInnerHTML={{ __html: globalData.joinOurTeam.text }} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {globalData.joinOurTeam.leftImage?.node?.sourceUrl && (
                <img src={globalData.joinOurTeam.leftImage.node.sourceUrl} alt={globalData.joinOurTeam.leftImage.node.altText || ''} className="w-full h-auto rounded" />
              )}
              {globalData.joinOurTeam.rightImage?.node?.sourceUrl && (
                <img src={globalData.joinOurTeam.rightImage.node.sourceUrl} alt={globalData.joinOurTeam.rightImage.node.altText || ''} className="w-full h-auto rounded" />
              )}
            </div>
          </div>
        </section>
      )}

      {enableFullVideo && globalData?.fullVideo && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-4">
            {(() => {
              const url = globalData.fullVideo.file?.node?.sourceUrl || globalData.fullVideo.url
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

      {enableCultureGallerySlider && globalData?.cultureGallerySlider && (
        <CultureGallerySlider globalData={{
          title: globalData.cultureGallerySlider.title,
          subtitle: globalData.cultureGallerySlider.subtitle,
          images: (globalData.cultureGallerySlider.images?.edges || []).map(e => e?.node).filter(Boolean),
          useGlobalSocialLinks: !!globalData.cultureGallerySlider.useGlobalSocialLinks
        }} />
      )}
    </>
  )
}

