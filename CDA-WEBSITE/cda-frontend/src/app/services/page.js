// src/app/services/page.js
import { getServicesWithPagination, executeGraphQLQuery, getServiceOverviewContent, getServiceBySlug } from '@/lib/graphql-queries.js'
import { getPaginationFromSearchParams } from '@/lib/pagination-utils'
import Pagination from '@/components/Pagination'
import ApproachBlock from '@/components/GlobalBlocks/ApproachBlock'
import ValuesBlock from '@/components/GlobalBlocks/ValuesBlock'
import ServicesProcess from '@/components/Sections/ServicesProcess'
import ServicesStats from '@/components/Sections/ServicesStats'
import ServicesCaseStudiesPreview from '@/components/Sections/ServicesCaseStudiesPreview'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Service color mapping
const getServiceColor = (slug) => {
  const colorMap = {
    'ecommerce': '#3CBEEB',
    'b2b-lead-generation': '#AD80F9',
    'software-development': '#01E486',
    'franchise-booking-systems': '#FD8721',
    'booking-systems': '#FD8721',
    'digital-marketing': '#FF60DF',
    'outsourced-cmo': '#FF5C8A',
    'ai': '#3CBEEB'
  };
  return colorMap[slug] || '#7c3aed'; // fallback to purple
};

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
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <section className="relative bg-white rounded-xl p-8 mb-12 overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover our comprehensive range of digital services designed to help your business grow and succeed in the digital landscape.
              </p>
            </div>
          </section>



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



          {/* Services Grid */}
          {services.length > 0 ? (
            <>
              <div className="space-y-6 mb-16">
                {services.map((service) => (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Section */}
                      {service.featuredImage?.node?.sourceUrl && (
                        <div className="lg:w-1/3">
                          <div className="relative h-64 lg:h-full w-full overflow-hidden">
                            <Image
                              src={service.featuredImage.node.sourceUrl}
                              alt={service.featuredImage.node.altText || service.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Content Section */}
                      <div className={`p-6 ${service.featuredImage?.node?.sourceUrl ? 'lg:w-2/3' : 'w-full'}`}>
                        <div className="flex items-center gap-2 mb-4">
                          {service.serviceTypes?.nodes?.slice(0, 2).map((type) => (
                            <span 
                              key={type.id}
                              className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                            >
                              {type.name}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          <Link 
                            href={`/services/${service.slug}`} 
                            className="transition-colors"
                            style={{
                              textDecoration: 'underline',
                              textDecorationColor: getServiceColor(service.slug),
                              textDecorationThickness: '4px'
                            }}
                          >
                            {service.title}
                          </Link>
                        </h2>

                        {/* {service.serviceFields?.heroSection?.subtitle && (
                          <p 
                            className="font-medium mb-4 text-base"
                            style={{ color: getServiceColor(service.slug) }}
                          >
                            {service.serviceFields.heroSection.subtitle}
                          </p>
                        )} */}

                        {service.excerpt && (
                          <div 
                            className="text-gray-600 mb-4"
                            dangerouslySetInnerHTML={{ __html: service.excerpt }}
                          />
                        )}

                        {/* Service Description from Hero Section */}
                        {service.serviceFields?.heroSection?.description && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="text-gray-700 leading-relaxed">
                              {service.serviceFields.heroSection.description}
                            </div>
                          </div>
                        )}

                        {/* Service Bullet Points */}
                        {service.serviceFields?.serviceBulletPoints?.bullets && service.serviceFields.serviceBulletPoints.bullets.length > 0 && (
                          <div className="mb-6">
                            {service.serviceFields.serviceBulletPoints.title && (
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {service.serviceFields.serviceBulletPoints.title}
                              </h3>
                            )}
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {service.serviceFields.serviceBulletPoints.bullets.slice(0, 6).map((bullet, index) => {
                                const serviceColor = getServiceColor(service.slug);
                                return (
                                  <li key={index} className="flex items-start space-x-2">
                                    <div 
                                      className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                                      style={{ backgroundColor: serviceColor }}
                                    ></div>
                                    <span className="text-gray-700 text-sm">{bullet.text}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        <Link 
                          href={`/services/${service.slug}`}
                          className="button-without-box"
                        >
                          Learn more
                        </Link>
                      </div>
                    </div>
                  </div>
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

          {/* CTA Section */}
          <section className="mt-16 bg-white border border-gray-200 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Need a Custom Solution?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Can't find exactly what you're looking for? We specialize in creating tailored solutions for unique business needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="button-l"
              >
                Discuss Your Project
              </Link>
              <Link
                href="/case-studies"
                className="button-l"
              >
                View Our Work
              </Link>
            </div>
          </section>
          </div>
        </div>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Failed to load services:', error)
    notFound()
  }
}