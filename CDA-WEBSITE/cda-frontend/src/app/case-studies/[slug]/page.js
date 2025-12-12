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
import TechnologiesGrid from '@/components/case-studies/TechnologiesGrid';
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
                {hero?.servicesUsed?.nodes && hero.servicesUsed.nodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {hero.servicesUsed.nodes.map((service) => (
                      <Link
                        key={service.id}
                        href={service.uri || `/services/${service.slug}`}
                        className="inline-block px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold hover:bg-purple-100 transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                )}

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
                    className="text-lg text-gray-600 mb-8 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: hero.text }}
                  />
                )}

                <div className="flex flex-wrap gap-4">
                  {hero?.liveSite?.url && (
                    <Link
                      href={hero.liveSite.url}
                      target={hero.liveSite.target || "_blank"}
                      rel="noopener noreferrer"
                      className="button-l text-white bg-black hover:bg-gray-800 transition-colors"
                    >
                      {hero.liveSite.title || "Visit Live Site"}
                    </Link>
                  )}
                  {hero?.downloadPdf?.node?.mediaItemUrl && (
                    <Link
                      href={hero.downloadPdf.node.mediaItemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-l text-black border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                    >
                      {hero.downloadPdf.node.title || "Download PDF"}
                      <span className="text-xl">↓</span>
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
          <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <ResponsiveUnderlinedTitle
                    as="h2"
                    className="text-3xl font-bold mb-6"
                    underlineColor="#AD80F9"
                  >
                    {customerDetails.company ? `The Company` : "About the Client"}
                  </ResponsiveUnderlinedTitle>

                  {customerDetails.text && (
                    <div
                      className="prose prose-lg max-w-none text-gray-600 mb-8"
                      dangerouslySetInnerHTML={{ __html: customerDetails.text }}
                    />
                  )}
                </div>

                <div>
                  <ResponsiveUnderlinedTitle
                    as="h3"
                    className="text-3xl font-bold mb-6"
                    underlineColor="#AD80F9" // Or different color if needed
                  >
                    Their Goals
                  </ResponsiveUnderlinedTitle>

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
          <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:items-center">
                {challenge.image?.node?.sourceUrl ? (
                  <div className="relative w-full aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={challenge.image.node.sourceUrl}
                      alt={challenge.image.node.altText || challenge.title || "Challenge"}
                      fill
                      className="object-contain lg:object-cover"
                    />
                  </div>
                ) : (
                  <div className="hidden lg:block"></div> // Spacer if no image
                )}

                <div>
                  <ResponsiveUnderlinedTitle
                    as="h2"
                    className="text-3xl font-bold mb-6"
                    underlineColor="#FF6B6B" // Specific color for challenge if needed, keeping varied
                  >
                    {challenge.title || "The Challenge"}
                  </ResponsiveUnderlinedTitle>
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
        {technologies?.logos?.nodes && technologies.logos.nodes.length > 0 && (
          <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{technologies.title || "The Technologies We Used"}</h2>
              </div>
              <TechnologiesGrid technologies={technologies.logos} />
            </div>
          </section>
        )}

        {/* Solution Section */}
        {solution && (
          <section className="py-16 lg:py-24 bg-white overflow-hidden">

            {/* Solution Text Content */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
              <ResponsiveUnderlinedTitle
                as="h2"
                className="section-title mb-6"
                underlineColor="#AD80F9"
              >
                {solution.title || "Our Solution"}
              </ResponsiveUnderlinedTitle>

              {/* Desktop Text */}
              {solution.desktopText && (
                <div className="hidden lg:block prose prose-lg max-w-4xl text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: solution.desktopText }} />
              )}
              {/* Mobile Text (fallback to desktop if not present, or just show desktop text always?) 
                    Usually easier to show one text block, but user schema has both. 
                    Let's show mobileText on mobile if exists, otherwise desktopText.
                */}
              {solution.mobileText && (
                <div className="lg:hidden prose prose-lg max-w-none text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: solution.mobileText }} />
              )}
            </div>

            {/* Solution Gallery */}
            <div className="max-w-[1620px] mx-auto px-4 lg:px-8">
              <SolutionGallery
                desktopImages={solution.desktopImage?.nodes}
                mobileImages={solution.mobileImage?.nodes}
              />
            </div>

            {/* Results Section (Nested in Solution in user schema) */}
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