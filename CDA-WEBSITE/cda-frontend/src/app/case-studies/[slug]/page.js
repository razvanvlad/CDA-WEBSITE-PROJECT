import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ResponsiveUnderlinedTitle from '../../../components/ResponsiveUnderlinedTitle';
import { notFound } from 'next/navigation';
import { getCaseStudyByAny, getGlobalContent, getCaseStudySlugs } from '../../../lib/graphql-queries';
import Image from 'next/image';
import Link from 'next/link';
import GlobalTailSections from '../../../components/GlobalBlocks/GlobalTailSections.jsx';
import TestimonialCard from '@/components/TestimonialCard';
import TextLinkButton from '../../../components/ui/TextLinkButton';
import SolutionGallery from '@/components/case-studies/SolutionGallery';
import TechnologiesSection from '@/components/case-studies/TechnologiesSection';
import ResultsCards from '@/components/case-studies/ResultsCards';

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

  const clientName = caseStudy.caseStudyProjects?.customerDetails?.company;
  const heroTitle = caseStudy.caseStudyProjects?.hero?.title || caseStudy.title;
  const title = clientName ? `${heroTitle} - ${clientName} Case Study` : heroTitle;

  return {
    title: caseStudy.seo?.title || `${title} - CDA Case Studies`,
    description: caseStudy.seo?.metaDesc || caseStudy.caseStudyProjects?.hero?.text || caseStudy.excerpt || `Discover how CDA helped ${clientName || 'this client'} achieve their goals`,
    openGraph: {
      title,
      description: caseStudy.caseStudyProjects?.hero?.text || caseStudy.excerpt,
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

  const { hero, customerDetails, challenge, technologies, solution } = caseStudy.caseStudyProjects || {};

  return (
    <>
      <Header />

      <main className="case-study-detail-page">


        {/* Hero Section */}
        <section className="relative bg-white text-black">
          <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <ResponsiveUnderlinedTitle
                  as="h1"
                  className="cda-title mb-6"
                  underlineColor="#AD80F9"
                >
                  {hero?.title || caseStudy.title}
                </ResponsiveUnderlinedTitle>

                {customerDetails?.company && (
                  <p className="text-xl text-gray-600 mb-6 font-medium">
                    Client: <span className="text-black">{customerDetails.company}</span>
                  </p>
                )}

                {hero?.text && (
                  <div
                    className="text-lg text-gray-600 mb-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: hero.text }}
                  />
                )}

                {hero?.servicesUsed?.nodes && hero.servicesUsed.nodes.length > 0 && (
                  <div className="mb-8">
                    <p className="font-bold text-gray-900 mb-3">Services Used:</p>
                    <div className="flex flex-wrap gap-3">
                      {hero.servicesUsed.nodes.map((service) => (
                        <Link
                          key={service.id}
                          href={service.uri || `/services/${service.slug}`}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 force-rounded hover:bg-gray-200 transition-colors"
                        >
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {hero?.liveSite?.url && (
                    <Link
                      href={hero.liveSite.url}
                      target={hero.liveSite.target || "_blank"}
                      rel="noopener noreferrer"
                      className="button-l"
                    >
                      {hero.liveSite.title || "Visit Live Site"}
                    </Link>
                  )}
                  {hero?.downloadPdf?.node?.mediaItemUrl && (
                    <Link
                      href={hero.downloadPdf.node.mediaItemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-l-transparent inline-flex items-center justify-center gap-2"
                    >
                      {hero.downloadPdf.node.title || "Download PDF"}
                      <img
                        src="/images/arrow-icons/download-icon.svg"
                        alt=""
                        width="16"
                        height="16"
                        className="w-4 h-4"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>
              </div>

              <div className="relative">
                {hero?.image?.node?.sourceUrl && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl shadow-2xl">
                    <Image
                      src={hero.image.node.sourceUrl}
                      alt={hero.image.node.altText || hero?.title || caseStudy.title}
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

        {/* Customer Details */}
        {customerDetails && (
          <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    {customerDetails.company ? `The Company` : "About the Client"}
                  </h2>

                  {customerDetails.text && (
                    <div
                      className="prose prose-lg max-w-none text-gray-600 mb-8"
                      dangerouslySetInnerHTML={{ __html: customerDetails.text }}
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    The Goals
                  </h3>

                  {customerDetails.goals && (
                    <div
                      className="prose prose-lg max-w-none text-gray-600 mb-8"
                      dangerouslySetInnerHTML={{ __html: customerDetails.goals }}
                    />
                  )}

                  {customerDetails.text2 && (
                    <div
                      className="prose prose-lg max-w-none text-gray-600"
                      dangerouslySetInnerHTML={{ __html: customerDetails.text2 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Challenge Section */}
        {challenge && (
          <section className="py-16 lg:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
                {/* Image on LEFT */}
                {challenge.image?.node?.sourceUrl && (
                  <div className="relative w-full max-w-[447px] h-[339px] overflow-hidden rounded-lg shadow-lg mx-auto lg:mx-0">
                    <Image
                      src={challenge.image.node.sourceUrl}
                      alt={challenge.image.node.altText || challenge.title || "Challenge"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Text on RIGHT with gray background extending to edge */}
                <div className="relative -mr-4 lg:-mr-[50vw] lg:pr-[calc(50vw-1rem)] py-12 px-8 lg:px-12 bg-gray-50">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    {challenge.title || "The Challenge"}
                  </h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: challenge.text }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Technologies Section */}
        <TechnologiesSection technologies={technologies} />

        {/* Solution Section - REPLACED BLOCK */}
        {solution && (
          <section className="py-16 lg:py-24 bg-[#F9F9F9] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <SolutionGallery data={solution} />
            </div>

            {/* Results Section */}
            {solution.results && (solution.results.first || solution.results.second || solution.results.third) && (
              <div className="max-w-7xl mx-auto px-4 mt-24">
                <ResultsCards results={solution.results} />
              </div>
            )}
          </section>
        )}

        {/* Testimonial Section */}
        {solution?.testimonial && (
          <TestimonialCard
            title={solution.testimonial.title}
            text={solution.testimonial.text}
            logo={solution.testimonial.logo?.node?.sourceUrl}
            profile={solution.testimonial.profile?.node?.sourceUrl}
            name={solution.testimonial.name}
            job={solution.testimonial.job}
          />
        )}

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="button-l bg-white text-black hover:bg-gray-200 border-none"
              >
                Get Started Today
              </Link>
              <TextLinkButton href="/case-studies" variant="white">
                View More Case Studies
              </TextLinkButton>
            </div>
          </div>
        </section>

      </main>

      <GlobalTailSections globalData={globalData} />

      <Footer />
    </>
  );
}