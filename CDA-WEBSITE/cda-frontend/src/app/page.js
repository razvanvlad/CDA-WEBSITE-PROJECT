import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalTailSections from '../components/GlobalBlocks/GlobalTailSections.jsx'
import { sanitizeTitleHtml } from '../lib/sanitizeTitleHtml'
import { executeGraphQLQuery, getAllGlobalContentBlocks, GET_GLOBAL_IMAGE_FRAME_MIN, getPageGlobalTogglesByUri, getPageGlobalTogglesByDbId } from '../lib/graphql-queries'

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
    'showApproach','showCaseStudies','showImageFrame','showNewsCarousel','showThreeColumns','showValues','showWhyCda','showServicesAccordion','showTechnologiesSlider','showShowreel','showLocationsImage','showNewsletterSignup','showContactFormLeftImageRight','showJoinOurTeam','showFullVideo','showStatsAndNumbers','showCultureGallerySlider'
  ]
  const hasAny = toggles && typeof toggles === 'object' && knownKeys.some(k => Object.prototype.hasOwnProperty.call(toggles, k))
  const t = hasAny ? toggles : Object.fromEntries(knownKeys.map(k => [k, true]))

  // 2) Fetch all global content blocks and patch missing imageFrame if needed (same as test page)
  let globalData = await getAllGlobalContentBlocks()
  try {
    if (!globalData?.imageFrameBlock) {
      const rawFrame = await executeGraphQLQuery(GET_GLOBAL_IMAGE_FRAME_MIN)
      const frame = rawFrame?.data?.globalOptions?.globalContentBlocks?.imageFrameBlock || null
      if (frame) globalData = { ...(globalData || {}), imageFrameBlock: frame }
    }
  } catch (_) {}

// 3) Fetch homepage hero (ACF) via DB ID 289
  const homeRes = await executeGraphQLQuery(GET_HOMEPAGE_CONTENT, { id: HOMEPAGE_ID })
  const hero = homeRes?.data?.page?.homepageContentClean?.headerSection || null

  return (
    <>
      <Header />

      {/* Hero section (extra on top of test page content) */}
      {hero && (
        <section className="home-hero-section bg-white">
          <div className="home-header-grid mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="home-header-text text-center md:text-left">
              <h1
                className="cda-page-title title-large-light-blue"
                dangerouslySetInnerHTML={{ __html: sanitizeTitleHtml(hero.title || 'Welcome to CDA') }}
              />
              {hero.text && (
                <p className="home-hero-subtitle">{hero.text}</p>
              )}
              <div className="home-header-cta home-hero-cta">
                {hero.button1 && (
                  <a href={hero.button1.url || '#'} className="button-l" target={hero.button1.target || '_self'}>
                    {hero.button1.title || 'Get Started'}
                  </a>
                )}
                {hero.button2 && (
                  <a href={hero.button2.url || '#'} className="button-without-box" target={hero.button2.target || '_self'}>
                    {hero.button2.title || 'Learn More'}
                  </a>
                )}
              </div>
            </div>
            <div className="home-header-illustration-wrap">
              {hero.illustration?.node?.sourceUrl ? (
                <img
                  src={hero.illustration.node.sourceUrl}
                  alt={hero.illustration.node.altText || 'Header illustration'}
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
      )}

      {/* Global sections below, driven by the homepage toggles (same as test page) */}
      <GlobalTailSections
        globalData={globalData}
        enableCaseStudies={!!t.showCaseStudies}
        enableCaseStudiesFallback={!!t.showCaseStudies}
        enableImageFrame={!!t.showImageFrame}
        enableNewsCarousel={!!t.showNewsCarousel}
        enableColumnsWithIcons3X={!!t.showThreeColumns}
        enableStats={!!t.showStatsAndNumbers}
        enableApproach={!!t.showApproach}
        enableValues={!!t.showValues}
        enableWhyCda={!!t.showWhyCda}
        enableServicesAccordion={!!t.showServicesAccordion}
        enableTechnologiesSlider={!!t.showTechnologiesSlider}
        enableShowreel={!!t.showShowreel}
        enableLocationsImage={!!t.showLocationsImage}
        enableNewsletterSignup={!!t.showNewsletterSignup}
        enableContactFormLeftImageRight={!!t.showContactFormLeftImageRight}
        enableJoinOurTeam={!!t.showJoinOurTeam}
        enableFullVideo={!!t.showFullVideo}
        enableCultureGallerySlider={!!t.showCultureGallerySlider}
      />

      <Footer />
    </>
  )
}
