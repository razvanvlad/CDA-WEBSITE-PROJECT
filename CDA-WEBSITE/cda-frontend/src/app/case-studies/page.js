import { getCaseStudiesWithPagination, executeGraphQLQuery } from '@/lib/graphql-queries.js'
import { getPaginationFromSearchParams } from '@/lib/pagination-utils'
import Pagination from '@/components/Pagination'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'

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

export default async function CaseStudiesPage({ searchParams }) {
  try {
    const awaitedSearchParams = await searchParams

    const searchParamsObj = new URLSearchParams()
    Object.entries(awaitedSearchParams).forEach(([key, value]) => {
      if (!value) return
      if (Array.isArray(value)) value.forEach((v) => searchParamsObj.append(key, v))
      else searchParamsObj.set(key, value)
    })

    const { currentPage, itemsPerPage, offset } = getPaginationFromSearchParams(searchParamsObj, 12)

    const searchQuery = searchParamsObj.get('search') || ''
    const projectTypeFilter = searchParamsObj.getAll('project_type')
    const featuredOnly = searchParamsObj.get('featured') === 'true'

    const { nodes: caseStudies } = await getCaseStudiesWithPagination({ first: itemsPerPage, search: searchQuery || undefined })
    const total = caseStudies.length

    const projectTypes = await getProjectTypes()
    const totalPages = Math.ceil(total / itemsPerPage)

    const featuredCaseStudies = caseStudies.filter((cs) => cs.caseStudyFields?.featured && !featuredOnly)
    const regularCaseStudies = featuredOnly ? caseStudies : caseStudies.filter((cs) => !cs.caseStudyFields?.featured)

    return (
      <>
        <Header />
        <div className="min-h-screen bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how we've helped businesses transform and grow through our innovative solutions and strategic partnerships.
            </p>
          </div>



          {total > 0 && (
            <div className="mb-6">
              <p className="text-gray-600">
                {searchQuery || projectTypeFilter.length > 0 || featuredOnly ? (
                  <>
                    Showing {caseStudies.length} of {total} case studies
                    {searchQuery && <span> matching "{searchQuery}"</span>}
                    {projectTypeFilter.length > 0 && <span> in {projectTypeFilter.length} selected categories</span>}
                    {featuredOnly && <span> (featured only)</span>}
                  </>
                ) : (
                  `Showing all ${total} case studies`
                )}
              </p>
            </div>
          )}

          {!featuredOnly && featuredCaseStudies.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Success Stories</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {featuredCaseStudies.slice(0, 2).map((caseStudy) => (
                  <Link key={caseStudy.id} href={`/case-studies/${caseStudy.slug}`} className="group block">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {caseStudy.featuredImage?.node?.sourceUrl && (
                        <div className="relative h-64 w-full">
                          <Image src={caseStudy.featuredImage.node.sourceUrl} alt={caseStudy.featuredImage.node.altText || caseStudy.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">FEATURED</span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        {caseStudy.caseStudyFields?.projectOverview?.clientLogo?.node?.sourceUrl && (
                          <div className="h-12 mb-4">
                            <Image src={caseStudy.caseStudyFields.projectOverview.clientLogo.node.sourceUrl} alt={caseStudy.caseStudyFields.projectOverview.clientLogo.node.altText || `${caseStudy.title} logo`} width={120} height={48} className="object-contain" />
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{caseStudy.title}</h3>
                        <p className="text-gray-600 mb-4">{caseStudy.excerpt ? caseStudy.excerpt.replace(/<[^>]*>/g, '') : 'Read about this successful project and its impact.'}</p>
                        <div className="flex items-center text-blue-600 font-semibold">
                          Read Case Study
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCaseStudies.map((caseStudy) => (
              <Link key={caseStudy.id} href={`/case-studies/${caseStudy.slug}`} className="group block bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
                {caseStudy.featuredImage?.node?.sourceUrl && (
                  <div className="relative h-48 w-full">
                    <Image src={caseStudy.featuredImage.node.sourceUrl} alt={caseStudy.featuredImage.node.altText || caseStudy.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseStudy.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{caseStudy.excerpt ? caseStudy.excerpt.replace(/<[^>]*>/g, '') : 'Learn more about this project.'}</p>
                  <div className="text-blue-600 font-medium flex items-center">Read More <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/case-studies" searchQuery={searchQuery} extraParams={{ project_type: projectTypeFilter, featured: featuredOnly ? 'true' : undefined }} />
            </div>
          )}
          </div>
        </div>
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