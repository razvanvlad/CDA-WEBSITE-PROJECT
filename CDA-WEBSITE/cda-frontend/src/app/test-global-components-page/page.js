import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GlobalTailSections from '../../components/GlobalBlocks/GlobalTailSections.jsx'
import { getAllGlobalContentBlocks, executeGraphQLQuery, GET_GLOBAL_IMAGE_FRAME_MIN } from '../../lib/graphql-queries'

export const revalidate = 60

export default async function TestGlobalComponentsPage() {
  // For debugging, fetch ALL global blocks regardless of per-entry toggles
  let globalData = await getAllGlobalContentBlocks()

  // Fallback fetch for imageFrameBlock if missing
  try {
    if (!globalData?.imageFrameBlock) {
      const rawFrame = await executeGraphQLQuery(GET_GLOBAL_IMAGE_FRAME_MIN)
      const frame = rawFrame?.data?.globalOptions?.globalContentBlocks?.imageFrameBlock || null
      if (frame) globalData = { ...(globalData || {}), imageFrameBlock: frame }
    }
  } catch (_) {}

  return (
    <>
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-6">Test Global Components Page</h1>
          <p className="text-gray-600 mb-10">This page renders ALL global blocks below (debug mode).</p>
        </div>
      </main>

      <GlobalTailSections
        globalData={globalData}
        enableImageFrame
        enableNewsCarousel
        enableColumnsWithIcons3X
        enableStats
        enableApproach
        enableValues
        enableWhyCda
        enableServicesAccordion
        enableTechnologiesSlider
        enableShowreel
        enableLocationsImage
        enableNewsletterSignup
        enableContactFormLeftImageRight
        enableJoinOurTeam
        enableFullVideo
        enableCultureGallerySlider
      />

      <Footer />
    </>
  )
}

