import ApproachBlock from '@/components/GlobalBlocks/ApproachBlock'
import CaseStudies from '@/components/GlobalBlocks/CaseStudies'
import { getCaseStudiesWithPagination } from '@/lib/graphql-queries.js'

// Server component that renders common global sections at the end of a page.
// If the global Case Studies section is not defined in your schema/options,
// we gracefully fall back to the latest 2 case studies.
export default async function GlobalTailSections({ globalData, enableCaseStudiesFallback = true }) {
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

  return (
    <>
      {csData && (
        <CaseStudies globalData={csData} />
      )}
      {globalData?.approach && (
        <ApproachBlock globalData={globalData.approach} />
      )}
    </>
  )
}

