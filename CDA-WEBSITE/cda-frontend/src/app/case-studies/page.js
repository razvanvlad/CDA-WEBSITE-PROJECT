import { getCaseStudiesWithPagination, executeGraphQLQuery } from '@/lib/graphql-queries.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CaseStudiesClient from './CaseStudiesClient'

export const metadata = {
  title: 'Case Studies - CDA Success Stories',
  description: 'Explore our portfolio of successful digital marketing and web development projects. Discover how we helped businesses achieve growth through strategic solutions, increased conversions, and measurable results.',
  keywords: ['case studies', 'client success stories', 'web development portfolio', 'digital marketing results', 'client testimonials', 'project portfolio'],
  openGraph: {
    title: 'Case Studies - CDA Success Stories',
    description: 'Explore our portfolio of successful digital marketing and web development projects with measurable results and client transformations.',
    type: 'website',
    images: [
      { url: '/images/case-studies-og.jpg', width: 1200, height: 630, alt: 'CDA Case Studies and Success Stories' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies - CDA Success Stories',
    description: 'Discover successful digital marketing and web development projects with measurable results.',
    images: ['/images/case-studies-twitter.jpg'],
  },
  alternates: { canonical: '/case-studies' },
}

async function getProjectTypes() {
  const query = `
    query GetProjectTypes {
      projectTypes { nodes { id name slug count } }
    }
  `
  try {
    const response = await executeGraphQLQuery(query)
    return response.data?.projectTypes?.nodes || []
  } catch (error) {
    console.error('Failed to fetch project types:', error)
    return []
  }
}

export const revalidate = 300

export default async function CaseStudiesPage() {
  try {
    // Fetch a reasonable set for client filtering
    const { nodes: caseStudies } = await getCaseStudiesWithPagination({ first: 100 })
    const projectTypes = await getProjectTypes()

    return (
      <>
        <Header />
        <CaseStudiesClient initialItems={caseStudies} projectTypes={projectTypes} />
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error rendering case studies page:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load case studies.</p>
      </div>
    )
  }
}
