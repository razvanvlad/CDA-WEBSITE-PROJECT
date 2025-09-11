import { getServiceSlugs, getCaseStudySlugs } from '@/lib/graphql-queries.js'

export const revalidate = 300

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cda-website-solutions.com'
  
  try {
    const [serviceSlugs, caseStudySlugs] = await Promise.all([
      getServiceSlugs(),
      getCaseStudySlugs(),
    ])

    const staticRoutes = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
      { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ]

    const serviceRoutes = serviceSlugs.map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    const caseStudyRoutes = caseStudySlugs.map((slug) => ({
      url: `${baseUrl}/case-studies/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
      { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ]
  }
}