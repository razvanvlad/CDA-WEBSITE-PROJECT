import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GlobalTailSections from '../../components/GlobalBlocks/GlobalTailSections.jsx'
import { getAllGlobalContentBlocks, executeGraphQLQuery, GET_GLOBAL_IMAGE_FRAME_MIN, getPageGlobalTogglesByUri, getPageGlobalTogglesBySlug } from '../../lib/graphql-queries'

export const revalidate = 60

// Debug server component
async function DebugToggles({ uri, toggles }) {
  const QUERY = `
    query ToggleDebug($uri: ID!) {
      page(id: $uri, idType: URI) {
        id
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
          }
        }
      }
    }
  `
  let raw = null
  // Try both URI variants to accommodate local permalink differences
  const variants = [uri]
  if (uri.startsWith('/index.php/')) {
    variants.push(uri.replace('/index.php/', '/'))
  } else {
    variants.push(`/index.php${uri.startsWith('/') ? '' : '/'}${uri}`)
  }
  for (const u of variants) {
    try {
      const res = await executeGraphQLQuery(QUERY, { uri: u })
      raw = res?.data?.page || null
      if (raw) break
    } catch (_) { /* continue */ }
  }
  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold text-black mb-2">Toggle Debug</h3>
      <div className="text-xs text-gray-700 bg-gray-50 border rounded p-3 overflow-auto">
        <pre>{JSON.stringify({ toggles, raw }, null, 2)}</pre>
      </div>
    </section>
  )
}

export default async function TestGlobalComponentsPage() {
  // 1) Read per-entry toggles from WP Page URI (prefer URI for Page idType)
  // Try both URI variants explicitly for local permalinks
  let toggles = await getPageGlobalTogglesByUri('/index.php/test-global-components-page/')
  if (!toggles) toggles = await getPageGlobalTogglesByUri('/test-global-components-page/')
  if (!toggles) toggles = await getPageGlobalTogglesBySlug('test-global-components-page')

  // 2) Fetch all blocks (keeps test page simple) and patch missing imageFrameBlock if needed
  let globalData = await getAllGlobalContentBlocks()
  try {
    if (!globalData?.imageFrameBlock) {
      const rawFrame = await executeGraphQLQuery(GET_GLOBAL_IMAGE_FRAME_MIN)
      const frame = rawFrame?.data?.globalOptions?.globalContentBlocks?.imageFrameBlock || null
      if (frame) globalData = { ...(globalData || {}), imageFrameBlock: frame }
    }
  } catch (_) {}

  // Default: if toggles missing, treat as all on for testing
  const t = toggles || {}

  // Build toggle status list (green: enabled+data, yellow: enabled but no data, red: disabled)
  const presence = (key) => !!key
  // Map known toggle keys to labels and their data presence check in the fetched globalData
  const knownToggleMap = {
    showApproach: { label: 'Show Approach', data: (g) => presence(g?.approach) },
    showCaseStudies: { label: 'Show Case Studies', data: (g) => presence(g?.caseStudiesSection) },
    showImageFrame: { label: 'Show Image Frame', data: (g) => presence(g?.imageFrameBlock) },
    showNewsCarousel: { label: 'Show News Carousel', data: (g) => presence(g?.newsCarousel) },
    showThreeColumns: { label: 'Show 3 Columns With Icons', data: (g) => presence(g?.threeColumnsWithIcons || g?.columnsWithIcons3X) },
    showValues: { label: 'Show Values', data: (g) => presence(g?.valuesBlock) },
    showWhyCda: { label: 'Show Why CDA', data: (g) => presence(g?.whyCda || g?.whyCdaBlock) },
    showServicesAccordion: { label: 'Show Services Accordion', data: (g) => presence(g?.servicesAccordion) },
    showTechnologiesSlider: { label: 'Show Technologies Slider', data: (g) => presence(g?.technologiesSlider) },
    showShowreel: { label: 'Show Showreel', data: (g) => presence(g?.showreel) },
    showLocationsImage: { label: 'Show Locations', data: (g) => presence(g?.locationsImage) },
    showNewsletterSignup: { label: 'Show Newsletter', data: (g) => presence(g?.newsletterSignup) },
    showContactFormLeftImageRight: { label: 'Show Contact Form Left / Image Right', data: (g) => presence(g?.contactFormLeftImageRight) },
    showJoinOurTeam: { label: 'Show Join Our Team', data: (g) => presence(g?.joinOurTeam) },
    showFullVideo: { label: 'Show Full Video', data: (g) => presence(g?.fullVideo) },
    showStatsAndNumbers: { label: 'Show Stats & Numbers', data: (g) => presence(g?.statsAndNumbers) },
    showCultureGallerySlider: { label: 'Show Culture Gallery Slider', data: (g) => presence(g?.cultureGallerySlider) },
  }

  // Build sections from whatever toggles exist on this entry so we never miss newly added ones
  const sections = Object.keys(t).map((key) => {
    const map = knownToggleMap[key]
    const label = map?.label || key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
    const data = map ? map.data(globalData) : false
    return { key, label, enabled: !!t[key], data }
  })

  const statusClass = (s) => {
    if (!s.enabled) return 'bg-red-100 text-red-700 border-red-300'
    return s.data ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }
  const statusText = (s) => {
    if (!s.enabled) return 'Disabled'
    return s.data ? 'Fetched' : 'Enabled, no data'
  }

  return (
    <>
      <Header />
      <main className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-6">Test Global Components Page</h1>
          <p className="text-gray-600 mb-6">Use the GLOBAL CONTENT BLOCKS TOGGLE on this page in WP Admin, then refresh to see sections show/hide.</p>

      {/* Toggle status grid */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-black mb-3">Toggles</h2>
        {sections.length === 0 ? (
          <div className="text-sm text-red-600">No toggle data returned for this page.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((s) => (
              <div key={s.key} className={`border rounded px-3 py-2 flex items-center justify-between ${statusClass(s)}`}>
                <span className="font-medium">{s.label}</span>
                <span className="text-xs px-2 py-1 rounded border bg-white/50">{statusText(s)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toggle debug */}
      <DebugToggles uri={'/test-global-components-page/'} toggles={t} />
        </div>
      </main>

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

