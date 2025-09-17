// Orchestrator to fetch only requested global sections, in parallel.
// This avoids over-fetching while keeping pages simple.

import { executeGraphQLQuery } from '@/lib/graphql-queries'
import { GET_GLOBAL_IMAGE_FRAME_MIN as GET_GLOBAL_IMAGE_FRAME, GET_GLOBAL_NEWS_CAROUSEL_MIN as GET_GLOBAL_NEWS_CAROUSEL, GET_GLOBAL_THREE_COLUMNS_MIN as GET_GLOBAL_THREE_COLUMNS } from '@/lib/graphql-queries'

async function getImageFrame() {
  const res = await executeGraphQLQuery(GET_GLOBAL_IMAGE_FRAME)
  return res?.data?.globalOptions?.globalContentBlocks?.imageFrameBlock || null
}

async function getNewsCarousel() {
  const res = await executeGraphQLQuery(GET_GLOBAL_NEWS_CAROUSEL)
  const cfg = res?.data?.globalOptions?.globalContentBlocks?.newsCarousel || null
  if (!cfg) return null
  // Note: Keep computation minimal here; pages/components can enrich if needed
  return cfg
}

async function getThreeColumns() {
  const res = await executeGraphQLQuery(GET_GLOBAL_THREE_COLUMNS)
  return res?.data?.globalOptions?.globalContentBlocks?.threeColumnsWithIcons || null
}

export async function getGlobalContentSections(opts) {
  const { imageFrame = false, newsCarousel = false, threeColumns = false, stats = false, caseStudiesSection = false } = opts || {}

  const tasks = []
  const result = {}

  if (imageFrame) tasks.push(getImageFrame().then(v => { if (v) result.imageFrameBlock = v }))
  if (newsCarousel) tasks.push(getNewsCarousel().then(v => { if (v) result.newsCarousel = v }))
  if (threeColumns) tasks.push(getThreeColumns().then(v => { if (v) result.threeColumnsWithIcons = v }))

  // These can be wired similarly when you want smaller queries for them too
  if (stats) {
    // reuse existing getGlobalContent for stats if needed, or add a tiny stats query
    // Placeholder: keep undefined unless you want me to wire it fully
  }
  if (caseStudiesSection) {
    // Placeholder: same note as stats
  }

  await Promise.all(tasks)
  return result
}

