import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from '../components/GlobalBlocks/HeroSection'
import ResponsiveUnderlinedTitle from '../components/ResponsiveUnderlinedTitle'
import { sanitizeTitleHtml } from '../lib/sanitizeTitleHtml'
import PhotoFrame from '../components/GlobalBlocks/PhotoFrame'
import ServicesAccordion from '../components/GlobalBlocks/ServicesAccordion'
import TechnologiesSlider from '../components/GlobalBlocks/TechnologiesSlider'
import ValuesBlock from '../components/GlobalBlocks/ValuesBlock'
import Showreel from '../components/GlobalBlocks/Showreel'
import StatsBlock from '../components/GlobalBlocks/StatsBlock.jsx'
import CaseStudies from '../components/GlobalBlocks/CaseStudies'
import LocationsImage from '../components/GlobalBlocks/LocationsImage'
import NewsletterSignup from '../components/GlobalBlocks/NewsletterSignup'
import { executeGraphQLQuery, getAllGlobalContentBlocks, GET_GLOBAL_IMAGE_FRAME_MIN, getPageGlobalTogglesByUri, getPageGlobalTogglesByDbId, getCaseStudiesWithPagination } from '../lib/graphql-queries'

export const revalidate = 120

// Fetch homepage hero (ACF) with the provided working query by DB ID
const HOMEPAGE_ID = '289'
const GET_HOMEPAGE_CONTENT = `
  query GetHomepageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
      date
      ... on NodeWithFeaturedImage {
        featuredImage { node { sourceUrl altText } }
      }
      ... on Page {
        homepageContentClean {
          headerSection {
            title
            text
            button1 { url title target }
            button2 { url title target }
            illustration { node { sourceUrl altText } }
            hoverIllustration { node { sourceUrl altText } }  # ⬅ NEW
          }
        }
      }
    }
  }
`

// Robustly resolve homepage toggles even when the site root URI is used
async function getHomeToggles() {
  // First, try typical root URIs
  let t = await getPageGlobalTogglesByUri('/index.php/')
  if (t) return t
  t = await getPageGlobalTogglesByUri('/')
  if (t) return t

  // Next, try to resolve the front page via nodeByUri and then by databaseId
  const NODE_QUERY = `
    query HomeNodeToggles($uri: String!) {
      nodeByUri(uri: $uri) {
        __typename
        ... on Page {
          databaseId
          uri
          globalContentToggles {
            showApproach
            showCaseStudies
            showImageFrame
            showNewsCarousel
            showThreeColumns
            showValues
            showWhyCda
            showServicesAccordion
            showTechnologiesSlider
            showShowreel
            showLocationsImage
            showNewsletterSignup
            showContactFormLeftImageRight
            showJoinOurTeam
            showFullVideo
            showStatsAndNumbers
            showCultureGallerySlider
          }
          gLOBALCONTENTBLOCKSTOGGLE {
            globalContentToggles {
              showApproach
              showCaseStudies
              showImageFrame
              showNewsCarousel
              showThreeColumns
              showValues
              showWhyCda
              showServicesAccordion
              showTechnologiesSlider
              showShowreel
              showLocationsImage
              showNewsletterSignup
              showContactFormLeftImageRight
              showJoinOurTeam
              showFullVideo
              showStatsAndNumbers
              showCultureGallerySlider
            }
          }
        }
      }
    }
  `
  for (const uri of ['/', '/index.php/']) {
    try {
      const res = await executeGraphQLQuery(NODE_QUERY, { uri })
      const node = res?.data?.nodeByUri
      const direct = node?.globalContentToggles
      if (direct) return direct
      const nested = node?.gLOBALCONTENTBLOCKSTOGGLE?.globalContentToggles
      if (nested) return nested
      const dbid = node?.databaseId
      if (dbid) {
        const byId = await getPageGlobalTogglesByDbId(String(dbid))
        if (byId) return byId
      }
    } catch (_) { /* continue */ }
  }

  // Finally, try common slugs used for home pages
  const slugs = ['home', 'homepage', 'front-page']
  for (const slug of slugs) {
    for (const uri of [`/${slug}/`, `/index.php/${slug}/`]) {
      try {
        const byUri = await getPageGlobalTogglesByUri(uri)
        if (byUri) return byUri
      } catch (_) { /* ignore */ }
    }
  }
  return null
}

export default async function Home() {
  // 1) Read per-page toggles for the homepage using a robust resolver
  let toggles = await getHomeToggles()

  // Known toggle keys used across pages
  const knownKeys = [
    'showApproach', 'showCaseStudies', 'showImageFrame', 'showNewsCarousel', 'showThreeColumns', 'showValues', 'showWhyCda', 'showServicesAccordion', 'showTechnologiesSlider', 'showShowreel', 'showLocationsImage', 'showNewsletterSignup', 'showContactFormLeftImageRight', 'showJoinOurTeam', 'showFullVideo', 'showStatsAndNumbers', 'showCultureGallerySlider'
  ]
  const hasAny = toggles && typeof toggles === 'object' && knownKeys.some(k => Object.prototype.hasOwnProperty.call(toggles, k))
  const t = hasAny ? toggles : Object.fromEntries(knownKeys.map(k => [k, true]))

  // 2) Fetch all global content blocks and patch missing imageFrame if needed
  let globalData = await getAllGlobalContentBlocks()
  try {
    if (!globalData?.imageFrameBlock) {
      const rawFrame = await executeGraphQLQuery(GET_GLOBAL_IMAGE_FRAME_MIN)
      const frame = rawFrame?.data?.globalOptions?.globalContentBlocks?.imageFrameBlock || null
      if (frame) globalData = { ...(globalData || {}), imageFrameBlock: frame }
    }
  } catch (_) { }

  // 3) Fetch homepage hero (ACF) via DB ID 289
  const homeRes = await executeGraphQLQuery(GET_HOMEPAGE_CONTENT, { id: HOMEPAGE_ID })
  const hero = homeRes?.data?.page?.homepageContentClean?.headerSection || null

  // 4) Prepare Case Studies (Global with fallback)
  let csData = null
  if (t.showCaseStudies) {
    csData = globalData?.caseStudiesSection || null
    if (!csData) {
      try {
        const { nodes } = await getCaseStudiesWithPagination({ first: 2 })
        if (nodes && nodes.length > 0) {
          csData = {
            title: 'Some Of Our Case Studies',
            subtitle: 'Projects',
            knowledgeHubLink: { url: '/case-studies', title: 'View All Case Studies', target: '_self' },
            selectedStudies: {
              nodes: nodes.map(n => ({
                id: n.id,
                title: n.title,
                uri: `/case-studies/${n.slug}`,
                excerpt: n.excerpt,
                featuredImage: n.featuredImage,
              }))
            }
          }
        }
      } catch (_) { }
    }
  }

  return (
    <>
      <Header />

      {/* 1) Hero individual */}
      {hero && (
        <HeroSection
          mobileOrder={{
            title: 1,
            text: 2,
            image: 3,
            cta: 4
          }}
          sectionClassName="bg-white"
          title={
            <ResponsiveUnderlinedTitle
              as="h1"
              className="cda-title"
              underlineColor="#3CBEEB"

            >
              {hero.title || 'Welcome to CDA'}
            </ResponsiveUnderlinedTitle>
          }
          description={hero.text}
          ctas={[
            hero.button1
              ? {
                href: hero.button1.url || '#',
                label: hero.button1.title || 'Start A Project',
                target: hero.button1.target || '_self',
                className: 'button-l',
              }
              : null,
            hero.button2
              ? {
                href: hero.button2.url || '#',
                label: hero.button2.title || 'View Our Services',
                target: hero.button2.target || '_self',
                className: 'button-without-box',
              }
              : null,
          ]}
          image={
            hero.illustration?.node?.sourceUrl ? (
              <div className="hero-hover-img cda-hero__image-media">
                {/* Base image */}
                <img
                  src={hero.illustration.node.sourceUrl}
                  alt={hero.illustration.node.altText || 'Header illustration'}
                  width={700}
                  height={520}
                  className="hero-img base"
                />
                {/* Hover image (optional) */}
                {hero.hoverIllustration?.node?.sourceUrl && (
                  <img
                    src={hero.hoverIllustration.node.sourceUrl}
                    alt=""            /* decorative, since it's a hover variant */
                    aria-hidden="true"
                    width={700}
                    height={520}
                    className="hero-img hover"
                  />
                )}
              </div>
            ) : (
              <div className="cda-hero__image-placeholder">
                <p>Upload illustration in WordPress Admin → Pages → Edit Homepage → Header Section</p>
              </div>
            )
          }
        />
      )}

      {/* 2) [Global] Image Frame Block */}
      {t.showImageFrame && globalData?.imageFrameBlock && (
        <PhotoFrame globalData={globalData.imageFrameBlock} />
      )}

      {/* 3) [Global] Services Accordion */}
      {t.showServicesAccordion && globalData?.servicesAccordion && (
        <ServicesAccordion globalData={{
          title: globalData.servicesAccordion.title,
          subtitle: globalData.servicesAccordion.subtitle,
          illustration: globalData.servicesAccordion.illustration,
          services: { nodes: (globalData.servicesAccordion.services?.edges || []).map(e => e?.node).filter(Boolean) }
        }} />
      )}

      {/* 4) [Global] Technologies Slider */}
      {t.showTechnologiesSlider && globalData?.technologiesSlider && (
        <TechnologiesSlider globalData={{
          title: globalData.technologiesSlider.title,
          subtitle: globalData.technologiesSlider.subtitle,
          logos: (globalData.technologiesSlider.logos?.edges || []).map(e => ({
            url: e?.node?.featuredImage?.node?.sourceUrl || '',
            alt: e?.node?.featuredImage?.node?.altText || e?.node?.title || 'Technology logo',
            title: e?.node?.title || ''
          }))
        }} />
      )}

      {/* 5) [Global] Values Block */}
      {t.showValues && globalData?.valuesBlock && (
        <ValuesBlock globalData={globalData.valuesBlock} />
      )}

      {/* 6) [Global] Showreel Block */}
      {t.showShowreel && globalData?.showreel && (
        <Showreel globalData={globalData.showreel} />
      )}

      {/* 7) [Global] Stats */}
      {t.showStatsAndNumbers && globalData?.statsAndNumbers && (
        <StatsBlock data={globalData.statsAndNumbers} />
      )}

      {/* 8) [Global] Projects / case studies (global or fallback) */}
      {t.showCaseStudies && csData && (
        <CaseStudies globalData={csData} />
      )}

      {/* 9) [Global] Locations with Image (match contact page design) */}
      {t.showLocationsImage && globalData?.locationsImage && (
        <LocationsImage globalData={globalData.locationsImage} />
      )}

      {/* 10) [Global] Newsletter (match contact page design) */}
      {t.showNewsletterSignup && globalData?.newsletterSignup && (
        <NewsletterSignup globalData={globalData.newsletterSignup} />
      )}

      <Footer />
    </>
  )
}
