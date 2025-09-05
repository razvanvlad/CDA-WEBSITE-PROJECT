import { getCaseStudiesWithPagination, executeGraphQLQuery } from '@/lib/graphql-queries'
import { getPaginationFromSearchParams } from '@/lib/pagination-utils'
import Pagination from '@/components/Pagination'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Case Studies - CDA Success Stories',
  description: 'Explore our portfolio of successful digital marketing and web development projects. Discover how we helped businesses achieve growth through strategic solutions, increased conversions, and measurable results.',
  keywords: ['case studies', 'client success stories', 'web development portfolio', 'digital marketing results', 'client testimonials', 'project portfolio'],
  openGraph: {
    title: 'Case Studies - CDA Success Stories',
    description: 'Explore our portfolio of successful digital marketing and web development projects with measurable results and client transformations.',
    type: 'website',
    images: [
      {
        url: '/images/case-studies-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CDA Case Studies and Success Stories'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies - CDA Success Stories',
    description: 'Discover successful digital marketing and web development projects with measurable results.',
    images: ['/images/case-studies-twitter.jpg']
  },
  alternates: {
    canonical: '/case-studies'
  }
}

interface CaseStudiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Get all project types for filtering
async function getProjectTypes() {
  const query = `
    query GetProjectTypes {
      projectTypes {
        nodes {
          id
          name
          slug
          count
        }
      }
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

export default async function CaseStudiesPage({ searchParams }: CaseStudiesPageProps) {
  try {
    // Await search parameters for Next.js 15+
    const awaitedSearchParams = await searchParams
    
    // Parse search parameters
    const searchParamsObj = new URLSearchParams()
    Object.entries(awaitedSearchParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParamsObj.append(key, v))
        } else {
          searchParamsObj.set(key, value)
        }
      }
    })

    // Get pagination info
    const { currentPage, itemsPerPage, offset } = getPaginationFromSearchParams(searchParamsObj, 12)
    
    // Get filters
    const searchQuery = searchParamsObj.get('search') || ''
    const projectTypeFilter = searchParamsObj.getAll('project_type')
    const featuredOnly = searchParamsObj.get('featured') === 'true'
    
    // Fetch case studies with pagination
    const { nodes: caseStudies, pageInfo } = await getCaseStudiesWithPagination({
      first: itemsPerPage,
      search: searchQuery || undefined
    })
    
    const total = caseStudies.length // Simplified total count

    // Fetch project types for filtering
    const projectTypes = await getProjectTypes()

    // Calculate pagination
    const totalPages = Math.ceil(total / itemsPerPage)

    // Separate featured and regular case studies for display
    const featuredCaseStudies = caseStudies.filter((cs: any) => cs.caseStudyFields?.featured && !featuredOnly)
    const regularCaseStudies = featuredOnly ? caseStudies : caseStudies.filter((cs: any) => !cs.caseStudyFields?.featured)

    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how we've helped businesses transform and grow through our innovative solutions and strategic partnerships.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form method="GET" className="space-y-4">
              {/* Search Bar */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Case Studies
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search by client, project name, or description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Type Filter */}
                {projectTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Project Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {projectTypes.map((type: any) => (
                        <label key={type.id} className="flex items-center">
                          <input
                            type="checkbox"
                            name="project_type"
                            value={type.id}
                            defaultChecked={projectTypeFilter.includes(type.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {type.name} ({type.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Options
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      value="true"
                      defaultChecked={featuredOnly}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Show only featured case studies
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Apply Filters
                </button>
                <Link
                  href="/case-studies"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            </form>
          </div>

          {/* Results Summary */}
          {total > 0 && (
            <div className="mb-6">
              <p className="text-gray-600">
                {searchQuery || projectTypeFilter.length > 0 || featuredOnly ? (
                  <>
                    Showing {caseStudies.length} of {total} case studies
                    {searchQuery && <span> matching "{searchQuery}"</span>}
                    {projectTypeFilter.length > 0 && (
                      <span> in {projectTypeFilter.length} selected categories</span>
                    )}
                    {featuredOnly && <span> (featured only)</span>}
                  </>
                ) : (
                  `Showing all ${total} case studies`
                )}
              </p>
            </div>
          )}

          {/* Featured Case Studies (only if not filtered) */}
          {!featuredOnly && featuredCaseStudies.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Success Stories</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {featuredCaseStudies.slice(0, 2).map((caseStudy: any) => (
                  <Link 
                    key={caseStudy.id}
                    href={`/case-studies/${caseStudy.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {caseStudy.featuredImage?.node?.sourceUrl && (
                        <div className="relative h-64 w-full">
                          <Image
                            src={caseStudy.featuredImage.node.sourceUrl}
                            alt={caseStudy.featuredImage.node.altText || caseStudy.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                              FEATURED
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        {caseStudy.caseStudyFields?.projectOverview?.clientLogo?.node?.sourceUrl && (
                          <div className="h-12 mb-4">
                            <Image
                              src={caseStudy.caseStudyFields.projectOverview.clientLogo.node.sourceUrl}
                              alt={caseStudy.caseStudyFields.projectOverview.clientLogo.node.altText || 'Client logo'}
                              width={200}
                              height={48}
                              className="h-full object-contain"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          {caseStudy.projectTypes?.nodes?.map((type: any) => (
                            <span 
                              key={type.id}
                              className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                            >
                              {type.name}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {caseStudy.title}
                        </h2>

                        {caseStudy.caseStudyFields?.projectOverview?.clientName && (
                          <p className="text-gray-600 mb-4 text-sm font-medium">
                            Client: {caseStudy.caseStudyFields.projectOverview.clientName}
                          </p>
                        )}

                        {caseStudy.excerpt && (
                          <div 
                            className="text-gray-600 text-sm line-clamp-3 mb-4"
                            dangerouslySetInnerHTML={{ __html: caseStudy.excerpt }}
                          />
                        )}

                        <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-800">
                          View case study
                          <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Case Studies Grid */}
          {caseStudies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {(featuredOnly ? caseStudies : regularCaseStudies).map((caseStudy: any) => (
                  <Link 
                    key={caseStudy.id}
                    href={`/case-studies/${caseStudy.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      {caseStudy.featuredImage?.node?.sourceUrl && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={caseStudy.featuredImage.node.sourceUrl}
                            alt={caseStudy.featuredImage.node.altText || caseStudy.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {caseStudy.caseStudyFields?.featured && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-block px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                                FEATURED
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-6">
                        {caseStudy.caseStudyFields?.projectOverview?.clientLogo?.node?.sourceUrl && (
                          <div className="h-10 mb-3">
                            <Image
                              src={caseStudy.caseStudyFields.projectOverview.clientLogo.node.sourceUrl}
                              alt={caseStudy.caseStudyFields.projectOverview.clientLogo.node.altText || 'Client logo'}
                              width={150}
                              height={40}
                              className="h-full object-contain"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          {caseStudy.projectTypes?.nodes?.slice(0, 2).map((type: any) => (
                            <span 
                              key={type.id}
                              className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded"
                            >
                              {type.name}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {caseStudy.title}
                        </h3>

                        {caseStudy.caseStudyFields?.projectOverview?.clientName && (
                          <p className="text-gray-600 mb-3 text-sm">
                            Client: {caseStudy.caseStudyFields.projectOverview.clientName}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-800">
                            View details
                            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          
                          {caseStudy.date && (
                            <div className="text-xs text-gray-400">
                              {new Date(caseStudy.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={total}
                    itemsPerPage={itemsPerPage}
                    basePath="/case-studies"
                    searchParams={searchParamsObj}
                  />
                </div>
              )}
            </>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No case studies found</h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery || projectTypeFilter.length > 0 || featuredOnly
                    ? "Try adjusting your search criteria or clearing filters."
                    : "No case studies are available at the moment. Please check back later."
                  }
                </p>
                {(searchQuery || projectTypeFilter.length > 0 || featuredOnly) && (
                  <Link
                    href="/case-studies"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Case Studies
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Be Our Next Success Story?</h2>
            <p className="text-xl text-green-100 mb-8">
              Join the ranks of successful businesses who have transformed their operations with our innovative solutions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-white text-green-900 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Start Your Project
              </Link>
              <Link
                href="/services"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </section>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load case studies:', error)
    notFound()
  }
}