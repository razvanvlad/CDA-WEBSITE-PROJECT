import { getServiceBySlug, getServiceSlugs } from '@/lib/graphql-queries.js'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface ServicePageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all services
export async function generateStaticParams() {
  try {
    const slugs = await getServiceSlugs()
    return slugs.map((slug: string) => ({ slug }))
  } catch (error) {
    console.error('Failed to generate service params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ServicePageProps) {
  try {
    const { slug } = await params
    const service = await getServiceBySlug(slug)
    
    if (!service) {
      return {
        title: 'Service Not Found - CDA',
        description: 'The requested service could not be found.',
      }
    }

    return {
      title: service.seo?.title || `${service.title} - CDA Services`,
      description: service.seo?.metaDesc || service.serviceFields?.heroSection?.description || `Learn more about our ${service.title} service`,
      openGraph: {
        title: service.title,
        description: service.serviceFields?.heroSection?.description,
        images: service.seo?.opengraphImage?.sourceUrl ? [service.seo.opengraphImage.sourceUrl] : [],
      },
    }
  } catch (error) {
    console.error('Failed to generate service metadata:', error)
    return {
      title: 'Service - CDA',
      description: 'CDA Service page',
    }
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  try {
    const { slug } = await params
    const service = await getServiceBySlug(slug)

    if (!service) {
      notFound()
    }

    // Structured data for the service
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.title,
      "description": service.serviceFields?.heroSection?.description || service.excerpt,
      "provider": {
        "@type": "Organization",
        "name": "CDA Website Solutions",
        "url": "https://cda-website-solutions.com"
      },
      "url": `https://cda-website-solutions.com/services/${service.slug}`,
      "image": service.featuredImage?.node?.sourceUrl,
      "serviceType": service.serviceTypes?.nodes?.map(type => type.name).join(", "),
      "offers": {
        "@type": "Offer",
        "description": service.serviceFields?.heroSection?.description,
        "seller": {
          "@type": "Organization", 
          "name": "CDA Website Solutions"
        }
      }
    };

    return (
      <div className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="max-w-4xl">
              {service.serviceFields?.heroSection?.subtitle && (
                <p className="text-blue-200 text-lg mb-4 font-medium">
                  {service.serviceFields.heroSection.subtitle}
                </p>
              )}
              
              <h1 className="text-5xl font-bold mb-6">
                {service.title}
              </h1>
              
              {service.serviceFields?.heroSection?.description && (
                <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                  {service.serviceFields.heroSection.description}
                </p>
              )}

              {service.serviceFields?.heroSection?.cta && (
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={service.serviceFields.heroSection.cta.url || '/contact'}
                    className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    {service.serviceFields.heroSection.cta.text || 'Get Started'}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {service.serviceFields?.heroSection?.heroImage?.node?.sourceUrl && (
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
              <Image
                src={service.serviceFields.heroSection.heroImage.node.sourceUrl}
                alt={service.serviceFields.heroSection.heroImage.node.altText || service.title}
                fill
                className="object-cover opacity-20"
              />
            </div>
          )}
        </section>

        {/* Service Types */}
        {service.serviceTypes?.nodes && service.serviceTypes.nodes.length > 0 && (
          <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap gap-3">
                {service.serviceTypes.nodes.map((type: any) => (
                  <span
                    key={type.id}
                    className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {type.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Key Statistics */}
        {service.serviceFields?.keyStatistics && service.serviceFields.keyStatistics.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {service.serviceFields.keyStatistics.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {stat.number}
                      {stat.percentage && <span className="text-2xl">%</span>}
                    </div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        {service.serviceFields?.features && service.serviceFields.features.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                What We Offer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.serviceFields.features.map((feature: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    {feature.icon?.node?.sourceUrl && (
                      <div className="w-16 h-16 mb-4">
                        <Image
                          src={feature.icon.node.sourceUrl}
                          alt={feature.icon.node.altText || feature.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Service Cards (3 Columns) */}
        {service.serviceFields?.serviceCards && service.serviceFields.serviceCards.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Service Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {service.serviceFields.serviceCards.map((card: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-3">
                      {card.pinIcon && <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-600"></span>}
                      <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                    </div>
                    {card.description && (
                      <p className="text-gray-600 mb-4">{card.description}</p>
                    )}
                    {card.cta?.url && (
                      <Link href={card.cta.url} className="text-blue-600 font-medium hover:underline">
                        {card.cta.title || 'Learn more'}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Service Bullet Points */}
        {service.serviceFields?.serviceBulletPoints?.bullets && service.serviceFields.serviceBulletPoints.bullets.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              {service.serviceFields.serviceBulletPoints.title && (
                <h2 className="text-3xl font-bold mb-6 text-gray-900">{service.serviceFields.serviceBulletPoints.title}</h2>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {service.serviceFields.serviceBulletPoints.bullets.map((b: any, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="text-gray-700">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Value Description */}
        {(service.serviceFields?.valueDescription?.title || service.serviceFields?.valueDescription?.description) && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              {service.serviceFields.valueDescription.title && (
                <h2 className="text-3xl font-bold mb-4 text-gray-900">{service.serviceFields.valueDescription.title}</h2>
              )}
              {service.serviceFields.valueDescription.description && (
                <p className="text-lg text-gray-700 mb-6">{service.serviceFields.valueDescription.description}</p>
              )}
              {service.serviceFields.valueDescription.cta?.url && (
                <Link href={service.serviceFields.valueDescription.cta.url} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {service.serviceFields.valueDescription.cta.title || 'Get Started'}
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Clients Logos */}
        {(service.serviceFields?.clientsLogos?.logos && service.serviceFields.clientsLogos.logos.length > 0) && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              {(service.serviceFields.clientsLogos.title || service.serviceFields.clientsLogos.description) && (
                <div className="text-center mb-8">
                  {service.serviceFields.clientsLogos.title && (
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{service.serviceFields.clientsLogos.title}</h2>
                  )}
                  {service.serviceFields.clientsLogos.description && (
                    <p className="text-gray-700">{service.serviceFields.clientsLogos.description}</p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
                {service.serviceFields.clientsLogos.logos.map((item: any, index: number) => (
                  <div key={index} className="h-12 flex items-center justify-center">
                    {item?.logo?.node?.sourceUrl && (
                      <Image src={item.logo.node.sourceUrl} alt={item.logo.node.altText || 'Client logo'} width={160} height={48} className="object-contain max-h-12" />
                    )}
                  </div>
                ))}
              </div>
              {service.serviceFields.clientsLogos.largeImage?.node?.sourceUrl && (
                <div className="mt-10 flex justify-center">
                  <Image src={service.serviceFields.clientsLogos.largeImage.node.sourceUrl} alt={service.serviceFields.clientsLogos.largeImage.node.altText || 'Clients'} width={800} height={300} className="object-contain w-full max-w-4xl" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Process */}
        {service.serviceFields?.process?.steps && service.serviceFields.process.steps.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                {service.serviceFields.process.heading || 'Our Process'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.serviceFields.process.steps.map((step: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {index + 1}
                      </div>
                      {step.image?.node?.sourceUrl && (
                        <div className="w-32 h-32 mx-auto">
                          <Image
                            src={step.image.node.sourceUrl}
                            alt={step.image.node.altText || step.title}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Case Studies */}
        {service.serviceFields?.caseStudiesSection?.caseStudies && service.serviceFields.caseStudiesSection.caseStudies.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                {service.serviceFields.caseStudiesSection.title || 'Success Stories'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.serviceFields.caseStudiesSection.caseStudies.map((caseStudy: any) => (
                  <Link
                    key={caseStudy.id}
                    href={`/case-studies/${caseStudy.slug}`}
                    className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      {caseStudy.caseStudyFields?.projectOverview?.clientLogo?.node?.sourceUrl && (
                        <div className="h-16 mb-4">
                          <Image
                            src={caseStudy.caseStudyFields.projectOverview.clientLogo.node.sourceUrl}
                            alt={caseStudy.caseStudyFields.projectOverview.clientLogo.node.altText || caseStudy.caseStudyFields.projectOverview.clientName}
                            width={200}
                            height={64}
                            className="h-full object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">
                        {caseStudy.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Client: {caseStudy.caseStudyFields?.projectOverview?.clientName}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how we can help transform your business with our {service.title.toLowerCase()} solutions.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Us Today
            </Link>
          </div>
        </section>

        {/* Main Content */}
        {service.content && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </div>
          </section>
        )}
      </div>
    )
  } catch (error) {
    console.error('Failed to load service:', error)
    notFound()
  }
}