import { getCaseStudyBySlug, getCaseStudySlugs } from '@/lib/graphql-queries.js'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface CaseStudyPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all case studies
export async function generateStaticParams() {
  try {
    const slugs = await getCaseStudySlugs()
    return slugs.map((slug: string) => ({ slug }))
  } catch (error) {
    console.error('Failed to generate case study params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CaseStudyPageProps) {
  try {
    const { slug } = await params
    const caseStudy = await getCaseStudyBySlug(slug)
    
    if (!caseStudy) {
      return {
        title: 'Case Study Not Found - CDA',
        description: 'The requested case study could not be found.',
      }
    }

    const clientName = caseStudy.caseStudyFields?.projectOverview?.clientName
    const title = clientName ? `${caseStudy.title} - ${clientName} Case Study` : caseStudy.title

    return {
      title: caseStudy.seo?.title || `${title} - CDA Case Studies`,
      description: caseStudy.seo?.metaDesc || caseStudy.excerpt || `Discover how CDA helped ${clientName || 'this client'} achieve their goals`,
      openGraph: {
        title,
        description: caseStudy.excerpt,
        images: caseStudy.seo?.opengraphImage?.sourceUrl ? [caseStudy.seo.opengraphImage.sourceUrl] : [],
      },
    }
  } catch (error) {
    console.error('Failed to generate case study metadata:', error)
    return {
      title: 'Case Study - CDA',
      description: 'CDA Case Study',
    }
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  try {
    const { slug } = await params
    const caseStudy = await getCaseStudyBySlug(slug)

    if (!caseStudy) {
      notFound()
    }

    const { projectOverview, challenge, solution, results, keyMetrics, projectGallery } = caseStudy.caseStudyFields || {}

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {caseStudy.projectTypes?.nodes && caseStudy.projectTypes.nodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseStudy.projectTypes.nodes.map((type: any) => (
                      <span
                        key={type.id}
                        className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  {caseStudy.title}
                </h1>

                {projectOverview?.clientName && (
                  <p className="text-xl text-gray-200 mb-6">
                    Client: <span className="font-semibold text-white">{projectOverview.clientName}</span>
                  </p>
                )}

                {caseStudy.excerpt && (
                  <div 
                    className="text-lg text-gray-200 mb-8"
                    dangerouslySetInnerHTML={{ __html: caseStudy.excerpt }}
                  />
                )}

                <div className="flex flex-wrap gap-4">
                  {projectOverview?.projectUrl && (
                    <Link
                      href={projectOverview.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      View Live Project
                    </Link>
                  )}
                  <Link
                    href="/contact"
                    className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    Start Your Project
                  </Link>
                </div>
              </div>

              {projectOverview?.clientLogo?.node?.sourceUrl && (
                <div className="flex justify-center lg:justify-end">
                  <div className="bg-white p-8 rounded-lg shadow-2xl">
                    <Image
                      src={projectOverview.clientLogo.node.sourceUrl}
                      alt={projectOverview.clientLogo.node.altText || `${projectOverview.clientName} logo`}
                      width={300}
                      height={150}
                      className="max-h-32 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Project Overview */}
        {projectOverview && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Project Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projectOverview.completionDate && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Date(projectOverview.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {projectOverview.duration && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Duration</h3>
                    <p className="text-2xl font-bold text-blue-600">{projectOverview.duration}</p>
                  </div>
                )}
                {projectOverview.clientName && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Client</h3>
                    <p className="text-2xl font-bold text-blue-600">{projectOverview.clientName}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Key Metrics */}
        {keyMetrics && keyMetrics.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Key Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {keyMetrics.map((metric: any, index: number) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {metric.value}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {metric.metric}
                    </h3>
                    {metric.description && (
                      <p className="text-gray-600 text-sm">{metric.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Challenge, Solution, Results */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="space-y-16">
              {/* Challenge */}
              {challenge && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                      {challenge.title || 'The Challenge'}
                    </h2>
                    <div className="text-lg text-gray-600 leading-relaxed">
                      {challenge.description}
                    </div>
                  </div>
                  {challenge.image?.node?.sourceUrl && (
                    <div className="relative h-80">
                      <Image
                        src={challenge.image.node.sourceUrl}
                        alt={challenge.image.node.altText || 'Challenge illustration'}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Solution */}
              {solution && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {solution.image?.node?.sourceUrl && (
                    <div className="relative h-80 order-2 lg:order-1">
                      <Image
                        src={solution.image.node.sourceUrl}
                        alt={solution.image.node.altText || 'Solution illustration'}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  <div className="order-1 lg:order-2">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                      {solution.title || 'Our Solution'}
                    </h2>
                    <div className="text-lg text-gray-600 leading-relaxed">
                      {solution.description}
                    </div>
                  </div>
                </div>
              )}

              {/* Results */}
              {results && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                      {results.title || 'The Results'}
                    </h2>
                    <div className="text-lg text-gray-600 leading-relaxed">
                      {results.description}
                    </div>
                  </div>
                  {results.image?.node?.sourceUrl && (
                    <div className="relative h-80">
                      <Image
                        src={results.image.node.sourceUrl}
                        alt={results.image.node.altText || 'Results illustration'}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Project Gallery */}
        {projectGallery && projectGallery.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectGallery.map((item: any, index: number) => (
                  <div key={index} className="relative group">
                    <div className="relative h-64 overflow-hidden rounded-lg">
                      <Image
                        src={item.image.node.sourceUrl}
                        alt={item.image.node.altText || `Project image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {item.caption && (
                      <p className="mt-2 text-sm text-gray-600 text-center">
                        {item.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Success Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Your Project
              </Link>
              <Link
                href="/case-studies"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                View More Case Studies
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        {caseStudy.content && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: caseStudy.content }}
              />
            </div>
          </section>
        )}
      </div>
    )
  } catch (error) {
    console.error('Failed to load case study:', error)
    notFound()
  }
}