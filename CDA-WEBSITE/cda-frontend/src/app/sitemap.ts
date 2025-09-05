import { MetadataRoute } from 'next'
import { getServiceSlugs, getCaseStudySlugs, getTeamMemberSlugs } from '@/lib/graphql-queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cda-website-solutions.com'
  
  try {
    // Get all dynamic routes
    const [serviceSlugs, caseStudySlugs, teamMemberSlugs] = await Promise.all([
      getServiceSlugs(),
      getCaseStudySlugs(),
      getTeamMemberSlugs()
    ])

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/case-studies`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/team`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ]

    // Dynamic service routes
    const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug: string) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // Dynamic case study routes
    const caseStudyRoutes: MetadataRoute.Sitemap = caseStudySlugs.map((slug: string) => ({
      url: `${baseUrl}/case-studies/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Dynamic team member routes
    const teamRoutes: MetadataRoute.Sitemap = teamMemberSlugs.map((slug: string) => ({
      url: `${baseUrl}/team/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...teamRoutes]

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return basic sitemap if GraphQL fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/case-studies`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/team`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ]
  }
}