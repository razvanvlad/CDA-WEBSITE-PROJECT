// src/app/services/page.js
import { getServicesWithPagination, executeGraphQLQuery, getServiceOverviewContent, getServiceBySlug } from '@/lib/graphql-queries.js'
import { getPaginationFromSearchParams } from '@/lib/pagination-utils'
import Pagination from '@/components/Pagination'
import ApproachBlock from '@/components/GlobalBlocks/ApproachBlock'
import ValuesBlock from '@/components/GlobalBlocks/ValuesBlock'
import ServicesProcess from '@/components/Sections/ServicesProcess'
import ServicesStats from '@/components/Sections/ServicesStats'
import ServicesCaseStudiesPreview from '@/components/Sections/ServicesCaseStudiesPreview'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Our Services',
  description: 'Discover our comprehensive range of digital services including web development, digital marketing, eCommerce solutions, B2B lead generation, and business consulting. Professional solutions tailored to your business needs.',
  keywords: ['web development services', 'digital marketing', 'eCommerce development', 'B2B lead generation', 'business consulting', 'SEO services'],
  openGraph: {
    title: 'Our Services - CDA Website Solutions',
    description: 'Discover our comprehensive range of digital services including web development, digital marketing, eCommerce solutions, and business consulting.',
    type: 'website',
    images: [
      {
        url: '/images/services-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CDA Website Solutions Services'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services - CDA Website Solutions',
    description: 'Professional digital services including web development, marketing, and business consulting.',
    images: ['/images/services-twitter.jpg']
  },
  alternates: {
    canonical: '/services'
  }
}

// Get all service types for filtering
async function getServiceTypes() {
  const query = `
    query GetServiceTypes {
      serviceTypes {
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
    return response.data?.serviceTypes?.nodes || []
  } catch (error) {
    console.error('Failed to fetch service types:', error)
    return []
  }
}

// Get global content for Approach Block and Values Block
async function getGlobalContent() {
  const query = `
    query GetGlobalContent {
      globalOptions {
        globalSharedContent {
          approachBlock {
            title
            subtitle
            steps {
              stepNumber
              title
              description
              image {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
          valuesBlock {
            title
            subtitle
            cards {
              cardNumber
              title
              description
              image {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            cornerImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  `
  
  try {
    const response = await executeGraphQLQuery(query)
    return response.data?.globalOptions?.globalSharedContent || null
  } catch (error) {
    console.error('Failed to fetch global content:', error)
    return null
  }
}

export default async function ServicesPage({ searchParams }) {
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

    // Get filters  
    const searchQuery = searchParamsObj.get('search') || ''
    const serviceTypeFilter = searchParamsObj.getAll('service_type')
    
    // Fetch overview ACF content for this page
    const overviewContent = await getServiceOverviewContent()

    // Fetch services (simplified - no advanced pagination for now)
    const { nodes: services } = await getServicesWithPagination({
      first: 12,
      search: searchQuery || undefined
    })

    // Fetch service types for filtering
    const serviceTypes = await getServiceTypes()
    
    // Fetch global content for Approach Block
    const globalContent = await getGlobalContent()

    // Resolve featured case study for left column
    let featuredCaseStudy = null
    let selectedServiceSlug = overviewContent?.featuredServiceSection?.selectedService?.slug || overviewContent?.featuredServiceSection?.selectedService?.node?.slug
    const overrideCS = overviewContent?.featuredServiceSection?.caseStudyOverride
    if (overrideCS) {
      featuredCaseStudy = Array.isArray(overrideCS) ? overrideCS[0] : overrideCS
    }
    if (!featuredCaseStudy && selectedServiceSlug) {
      const selService = await getServiceBySlug(selectedServiceSlug)
      const csList = selService?.serviceFields?.caseStudiesSection?.caseStudies || []
      if (Array.isArray(csList) && csList.length > 0) {
        featuredCaseStudy = csList[0]
      }
    }

    // Basic pagination (simplified)
    const totalPages = 1
    const currentPage = 1
    const itemsPerPage = 12
    const total = services.length

    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero from ACF (Service Overview Content) */}
          {overviewContent?.heroSection ? (
            <section className="relative bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 mb-12 overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                {overviewContent.heroSection.title && (
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{overviewContent.heroSection.title}</h1>
                )}
                {overviewContent.heroSection.description && (
                  <p className="text-lg text-gray-600">{overviewContent.heroSection.description}</p>
                )}
              </div>
              {overviewContent.heroSection.imageRight?.node?.sourceUrl && (
                <img
                  src={overviewContent.heroSection.imageRight.node.sourceUrl}
                  alt={overviewContent.heroSection.imageRight.node.altText || ''}
                  className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[40%] max-w-[520px] object-contain opacity-90"
                />
              )}
            </section>
          ) : (
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our comprehensive range of digital services designed to help your business grow and succeed in the digital landscape.
              </p>
            </div>
          )}

          {/* Service Landing Two-Column Section */}
          {(overviewContent?.featuredServiceSection || overviewContent?.rightColumn) && (
            <section className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Left column 1/3 - Featured Case Study */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow p-6 h-full">
                    {overviewContent?.featuredServiceSection?.leftColumnTitle && (
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">{overviewContent.featuredServiceSection.leftColumnTitle}</h2>
                    )}
                    {featuredCaseStudy ? (
                      <div>
                        {featuredCaseStudy?.featuredImage?.node?.sourceUrl && (
                          <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                            <Image
                              src={featuredCaseStudy.featuredImage.node.sourceUrl}
                              alt={featuredCaseStudy.featuredImage.node.altText || featuredCaseStudy.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-md font-semibold mb-2">{featuredCaseStudy.title}</h3>
                        <Link
                          href={`/case-studies/${featuredCaseStudy.slug}`}
                          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {overviewContent?.featuredServiceSection?.caseStudyCtaLabel || 'Explore Case Study'}
                        </Link>
                      </div>
                    ) : (
                      <p className="text-gray-500">Configure a featured case study in Service Overview Content.</p>
                    )}
                  </div>
                </div>

                {/* Right column 2/3 - From service post */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow p-6 h-full">
                    {overviewContent?.rightColumn?.title && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">{overviewContent.rightColumn.title}</h2>
                    )}
                    {overviewContent?.rightColumn?.description && (
                      <p className="text-gray-700 mb-4">{overviewContent.rightColumn.description}</p>
                    )}

                    {/* Bullets */}
                    {overviewContent?.rightColumn?.bulletPoints && overviewContent.rightColumn.bulletPoints.length > 0 && (
                      <div className={`grid gap-2 ${overviewContent.rightColumn.bulletsTwoRows ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
                        {overviewContent.rightColumn.bulletPoints.map((b, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                            <span className="text-gray-700">{b.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {overviewContent?.rightColumn?.ctaServiceLink?.url && (
                        <Link href={overviewContent.rightColumn.ctaServiceLink.url} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                          {overviewContent.rightColumn.ctaServiceLink.title || 'View Service'}
                        </Link>
                      )}
                      {overviewContent?.rightColumn?.ctaContactUs?.url && (
                        <Link href={overviewContent.rightColumn.ctaContactUs.url} className="px-5 py-2 border border-blue-600 text-blue-700 rounded hover:bg-blue-50">
                          {overviewContent.rightColumn.ctaContactUs.title || 'Speak To Us'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form method="GET" className="space-y-4">
              {/* Search Bar */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Services
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search by service name or description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Service Type Filter */}
              {serviceTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Service Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypes.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          name="service_type"
                          value={type.id}
                          defaultChecked={serviceTypeFilter.includes(type.id)}
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

              {/* Filter Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Apply Filters
                </button>
                <Link
                  href="/services"
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
                {searchQuery || serviceTypeFilter.length > 0 ? (
                  <>
                    Showing {services.length} of {total} services
                    {searchQuery && <span> matching "{searchQuery}"</span>}
                    {serviceTypeFilter.length > 0 && (
                      <span> in {serviceTypeFilter.length} selected categories</span>
                    )}
                  </>
                ) : (
                  `Showing all ${total} services`
                )}
              </p>
            </div>
          )}

          {/* Services Grid */}
          {services.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {services.map((service) => (
                  <Link 
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {service.featuredImage?.node?.sourceUrl && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={service.featuredImage.node.sourceUrl}
                            alt={service.featuredImage.node.altText || service.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {service.serviceTypes?.nodes?.map((type) => (
                            <span 
                              key={type.id}
                              className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {type.name}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h2>

                        {service.serviceFields?.heroSection?.subtitle && (
                          <p className="text-blue-600 font-medium mb-3 text-sm">
                            {service.serviceFields.heroSection.subtitle}
                          </p>
                        )}

                        {service.excerpt && (
                          <div 
                            className="text-gray-600 text-sm line-clamp-3 mb-4"
                            dangerouslySetInnerHTML={{ __html: service.excerpt }}
                          />
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-800 transition-colors">
                            Learn more
                            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          
                          {service.date && (
                            <div className="text-xs text-gray-400">
                              Updated {new Date(service.date).toLocaleDateString()}
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
                    basePath="/services"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery || serviceTypeFilter.length > 0 
                    ? "Try adjusting your search criteria or clearing filters."
                    : "No services are available at the moment. Please check back later."
                  }
                </p>
                {(searchQuery || serviceTypeFilter.length > 0) && (
                  <Link
                    href="/services"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Services
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Our Values Global Block */}
          {globalContent?.valuesBlock && (
            <ValuesBlock 
              globalData={globalContent.valuesBlock}
              pageData={null}
              useOverride={false}
            />
          )}

          {/* Our Approach Global Block */}
          {globalContent?.approachBlock && (
            <ApproachBlock 
              globalData={globalContent.approachBlock}
              pageData={null}
              useOverride={false}
            />
          )}

          {/* Services: Process, Stats, Case Studies Preview */}
          <ServicesProcess />
          <ServicesStats />
          <ServicesCaseStudiesPreview />

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Can't find exactly what you're looking for? We specialize in creating tailored solutions for unique business needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Discuss Your Project
              </Link>
              <Link
                href="/case-studies"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                View Our Work
              </Link>
            </div>
          </section>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load services:', error)
    notFound()
  }
}