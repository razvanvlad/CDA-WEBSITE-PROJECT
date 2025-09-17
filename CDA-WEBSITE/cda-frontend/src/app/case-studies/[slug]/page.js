import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { getCaseStudyByAny, getGlobalContent, getCaseStudySlugs } from '../../../lib/graphql-queries';
import Image from 'next/image';
import Link from 'next/link';
import GlobalTailSections from '../../../components/GlobalBlocks/GlobalTailSections.jsx';

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const slugs = await getCaseStudySlugs()
    return (slugs || []).map((slug) => ({ slug }))
  } catch (e) {
    console.warn('Failed to pre-generate case study slugs:', e)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata(props) {
  const { slug } = await props.params
  const safe = decodeURIComponent(slug)
  const caseStudy = await getCaseStudyByAny({ uri: `/case-studies/${safe}/`, slug: safe });
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.'
    };
  }

  const clientName = caseStudy.caseStudyFields?.projectOverview?.clientName;
  const title = clientName ? `${caseStudy.title} - ${clientName} Case Study` : caseStudy.title;

  return {
    title: caseStudy.seo?.title || `${title} - CDA Case Studies`,
    description: caseStudy.seo?.metaDesc || caseStudy.excerpt || `Discover how CDA helped ${clientName || 'this client'} achieve their goals`,
    openGraph: {
      title,
      description: caseStudy.excerpt,
      images: caseStudy.seo?.opengraphImage?.sourceUrl ? [caseStudy.seo.opengraphImage.sourceUrl] : [],
    },
  };
}

export default async function CaseStudyPage(props) {
  const { slug } = await props.params
  const safe = decodeURIComponent(slug)
  const caseStudy = await getCaseStudyByAny({ uri: `/case-studies/${safe}/`, slug: safe });
  const globalData = await getGlobalContent();

  if (!caseStudy) {
    notFound();
  }

  const { projectOverview, challenge, solution, results } = caseStudy.caseStudyFields || {};

  return (
    <>
      <Header />
      
      <main className="case-study-detail-page">
        {/* Hero Section */}
        <section className="relative bg-white text-black">
          <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {caseStudy.projectTypes?.nodes && caseStudy.projectTypes.nodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseStudy.projectTypes.nodes.map((type) => (
                      <span
                        key={type.id}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-black">
                  {caseStudy.title}
                </h1>

                {projectOverview?.clientName && (
                  <p className="text-xl text-gray-600 mb-6">
                    Client: <span className="font-semibold text-black">{projectOverview.clientName}</span>
                  </p>
                )}

                {caseStudy.excerpt && (
                  <div 
                    className="text-lg text-gray-600 mb-8"
                    dangerouslySetInnerHTML={{ __html: caseStudy.excerpt }}
                  />
                )}

                <div className="flex flex-wrap gap-4">
                  {projectOverview?.projectUrl && (
                    <Link
                      href={projectOverview.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-l"
                    >
                      View Site Live
                    </Link>
                  )}
                  <Link
                    href="/case-studies"
                    className="button-without-box"
                  >
                    View All Case Studies
                  </Link>
                </div>
              </div>

              <div className="relative">
                {caseStudy.featuredImage?.node?.sourceUrl && (
                  <div className="relative h-96 lg:h-[500px] overflow-hidden shadow-lg">
                    <Image
                      src={caseStudy.featuredImage.node.sourceUrl}
                      alt={caseStudy.featuredImage.node.altText || caseStudy.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        {projectOverview && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
                  
                  {projectOverview.description && (
                    <div 
                      className="prose prose-lg max-w-none text-gray-600 mb-8"
                      dangerouslySetInnerHTML={{ __html: projectOverview.description }}
                    />
                  )}


                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h3>
                    
                    {projectOverview.clientName && (
                      <div className="mb-4">
                        <dt className="text-sm font-medium text-gray-500">Client</dt>
                        <dd className="text-lg text-gray-900">{projectOverview.clientName}</dd>
                      </div>
                    )}

                    {projectOverview.industry && (
                      <div className="mb-4">
                        <dt className="text-sm font-medium text-gray-500">Industry</dt>
                        <dd className="text-lg text-gray-900">{projectOverview.industry}</dd>
                      </div>
                    )}




                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Challenge Section */}
        {challenge && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: challenge }}
              />
            </div>
          </section>
        )}

        {/* Solution Section */}
        {solution && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: solution }}
              />
            </div>
          </section>
        )}

        {/* Results Section */}
        {results && (
          <section className="py-16 bg-blue-50">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Results & Impact</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: results }}
              />
            </div>
          </section>
        )}



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

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="button-l"
              >
                Get Started Today
              </Link>
              <Link
                href="/case-studies"
                className="button-without-box text-white"
              >
                View More Case Studies
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalTailSections globalData={globalData} />
      
      <Footer />
    </>
  );
}