// src/app/services/page.js
import { getServicesWithPagination, executeGraphQLQuery, getServiceOverviewContent, getServiceBySlug, getAllGlobalContentBlocks } from '@/lib/graphql-queries.js'
import ServicesClient from './ServicesClient'
import ServicesFilters from './ServicesFilters'
import ApproachBlock from '@/components/GlobalBlocks/ApproachBlock'
import HeroSection from '@/components/GlobalBlocks/HeroSection'
import Showreel from '@/components/GlobalBlocks/Showreel'
import ServicesProcess from '@/components/Sections/ServicesProcess'
import ServicesStats from '@/components/Sections/ServicesStats'
import ServicesCaseStudiesPreview from '@/components/Sections/ServicesCaseStudiesPreview'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 300

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

// Get global content for Approach Block and Values Block (use shared util)

export default async function ServicesPage() {
  try {
    // Fetch overview ACF content for this page
    const overviewContent = await getServiceOverviewContent()

    // Fetch services (larger set for client filtering)
    const { nodes: services } = await getServicesWithPagination({ first: 100 })

    // Fetch service types (if you later want to expose UI filters)
    const serviceTypes = await getServiceTypes()
    
    // Fetch global content for Approach Block
    const globalContent = await getAllGlobalContentBlocks()

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

    const heroSectionContent = overviewContent?.heroSection || {}
    // Use a static illustration for the Services list header with hover swap
    const heroImageNode = (
      <div className="cameleon-hero" style={{ width: 600 }}>
        <img
          src="/images/cameleon-right.svg"
          alt="Services illustration"
          width={600}
          height={400}
          className="cameleon-hero__img base"
          loading="eager"
        />
        <img
          src="/images/cameleon-right-hover.svg"
          alt=""
          aria-hidden="true"
          width={600}
          height={400}
          className="cameleon-hero__img hover"
          loading="eager"
        />
      </div>
    )

    const heroDescription =
      heroSectionContent.description ||
      'Discover our comprehensive range of digital services designed to help your business grow and succeed in the digital landscape.'

    const extraDescription = `
      <p>With over 30 years’ working in-house and at agencies, our experience goes way back to when it was called ‘that internet thing’.</p>
      <p>We’ve seen the digital landscape evolve to what it is today and we’re eager to see where it will go next. We believe in putting the user at the centre and creating seamless experiences around them.</p>
    `

    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <HeroSection
            sectionClassName="bg-white"
            titleHtml={'The Services We Offer'}
            titleClassName="text-4xl font-bold text-gray-900"
            titleStyle={{ textDecoration: 'underline', textDecorationColor: '#AD80F9', textDecorationThickness: '11px' }}
            descriptionHtml={`<p>${heroDescription}</p>${extraDescription}`}
            descriptionClassName="text-xl text-gray-600"
            image={heroImageNode}
          />

          {/* Service type filter chips */}
          <ServicesFilters options={(serviceTypes || []).map(t => ({ label: t.name, slug: t.slug }))} />
          <div className="max-w-7xl mx-auto px-4 py-16">
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



          {/* Services Grid - client-side filtering */}
          <ServicesClient initialItems={services} />

          {/* Our Approach Global Block (placed directly after the services list) */}
          {globalContent?.approach && (
            <ApproachBlock 
              globalData={globalContent.approach}
              pageData={null}
              useOverride={false}
            />
          )}

          {/* Showreel Global Block (instead of Values) */}
          {globalContent?.showreel && (
            <Showreel globalData={globalContent.showreel} />
          )}         

          </div>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Failed to load services:', error)
    return (
      <main>
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-5xl px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold">Services</h1>
            <p className="mt-4 text-lg text-gray-600">We’re having trouble loading services right now. Please try again in a moment.</p>
            <div className="mt-8">
              <a href="/services" className="inline-flex items-center rounded-md bg-black px-5 py-3 text-white hover:bg-gray-800 transition">Retry</a>
            </div>
          </div>
        </section>
      </main>
    )
  }
}