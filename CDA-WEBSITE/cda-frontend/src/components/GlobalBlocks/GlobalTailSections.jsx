import ApproachBlock from '@/components/GlobalBlocks/ApproachBlock'
import CaseStudies from '@/components/GlobalBlocks/CaseStudies'
import StatsBlock from '@/components/GlobalBlocks/StatsBlock.jsx'
import PhotoFrame from '@/components/GlobalBlocks/PhotoFrame'
import NewsCarouselClient from '@/components/GlobalBlocks/NewsCarouselClient.jsx'
import { getCaseStudiesWithPagination, executeGraphQLQuery } from '@/lib/graphql-queries.js'

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

      {enableColumnsWithIcons3X && (globalData?.threeColumnsWithIcons || globalData?.columnsWithIcons3X) && (() => {
        const cols = globalData.threeColumnsWithIcons || globalData.columnsWithIcons3X
        return (
          <section className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                {cols.sectionTitle && (
                  <h2 className="text-[32px] md:text-[40px] font-bold text-black">{cols.sectionTitle}</h2>
                )}
                {cols.subtitle && !cols.sectionTitle && (
                  <p className="text-xs tracking-[0.18em] font-semibold uppercase text-black mb-3">{cols.subtitle}</p>
                )}
                {cols.title && !cols.sectionTitle && (
                  <h2 className="text-[32px] md:text-[40px] font-bold text-black">{cols.title}</h2>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(cols.columns || []).map((col, idx) => {
                  const iconUrl = col?.icon?.node?.sourceUrl
                  return (
                    <div key={idx} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                      {iconUrl ? (
                        <img src={iconUrl} alt={col?.icon?.node?.altText || col.title || 'Icon'} className="w-10 h-10 mb-4" />
                      ) : col.iconClass ? (
                        <div className="text-3xl mb-4"><i className={col.iconClass} aria-hidden="true" /></div>
                      ) : null}
                      {col.title && <h3 className="text-xl font-bold text-black mb-2">{col.title}</h3>}
                      {(col.text || col.description) && (
                        <p className="text-[16px] leading-[1.7] text-black">{col.text || col.description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {globalData?.approach && (
        <ApproachBlock globalData={globalData.approach} />
      )}
    </>
  )
}

