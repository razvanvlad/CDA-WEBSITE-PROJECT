import { getServiceSlugs, getCaseStudySlugs, getTeamMemberSlugs } from '@/lib/graphql-queries.js'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cda-website-solutions.com'
  
  try {
    const [serviceSlugs, caseStudySlugs, teamMemberSlugs] = await Promise.all([
      getServiceSlugs(),
      getCaseStudySlugs(),
      getTeamMemberSlugs(),
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

    const teamRoutes = teamMemberSlugs.map((slug) => ({
      url: `${baseUrl}/team/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...teamRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
      { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ]
  }
}