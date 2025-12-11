import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import HeroSection from '../../../../components/GlobalBlocks/HeroSection';
import ResponsiveUnderlinedTitle from '../../../../components/ResponsiveUnderlinedTitle';
import ApproachBlock from '../../../../components/GlobalBlocks/ApproachBlock';
import { notFound } from 'next/navigation';
import { executeGraphQLQuery, GET_SUBSERVICE_BY_SLUG, GET_SUBSERVICE_SLUGS } from '../../../../lib/graphql-queries';
import { safeImageUrl } from '../../../../lib/imageUtils';
import { sanitizeTitleHtml, sanitizeImageAlt } from '../../../../lib/sanitizeTitleHtml';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 120;

// Generate static params for all sub-services
export async function generateStaticParams() {
  try {
    const result = await executeGraphQLQuery(GET_SUBSERVICE_SLUGS);
    const subServices = result?.data?.subServices?.nodes || [];

    // For now, return empty array - we'll need parent service info too
    // This will be handled dynamically
    return [];
  } catch (error) {
    console.error('Error generating static params for sub-services:', error);
    return [];
  }
}

import ServiceStatsSection from '../../../../components/ServiceStatsSection';

export default async function SubServicePage({ params }) {
  const { slug, subslug } = await params;

  if (!subslug) notFound();

  // Fetch sub-service data
  const result = await executeGraphQLQuery(GET_SUBSERVICE_BY_SLUG, { slug: subslug });

  if (result?.errors) {
    console.error('GraphQL errors:', result.errors);
    notFound();
  }

  const subService = result?.data?.subService || null;
  const globalData = result?.data?.globalOptions || null;

  if (!subService) notFound();

  const subServiceFields = subService.subServices || {};
  const heroSection = subServiceFields.heroSection || {};
  const stats = subServiceFields.stats || [];
  const videoSection = subServiceFields.videoSection || null;
  const frameSection = subServiceFields.frameSection || null;

  // Hero image
  const heroImageNode = heroSection.image?.node?.sourceUrl
    ? (
      <Image
        src={safeImageUrl(heroSection.image.node.sourceUrl)}
        alt={sanitizeImageAlt(heroSection.image.node.altText || subService.title)}
        width={600}
        height={400}
        className="cda-hero__image-media"
        style={{ maxHeight: '600px', objectFit: 'contain' }}
        priority
      />
    )
    : subService.featuredImage?.node?.sourceUrl
      ? (
        <Image
          src={safeImageUrl(subService.featuredImage.node.sourceUrl)}
          alt={sanitizeImageAlt(subService.featuredImage.node.altText || subService.title)}
          width={600}
          height={400}
          className="cda-hero__image-media"
          style={{ maxHeight: '600px', objectFit: 'contain' }}
          priority
        />
      )
      : null;

  return (
    <>
      <Header backButton={{ href: `/services/${slug}`, label: 'Back To Service' }} />
      <main className="subservice-detail-page">
        {/* Hero Section */}
        <HeroSection
          sectionClassName="bg-white"
          title={
            <ResponsiveUnderlinedTitle
              as="h1"
              className="cda-title"
              underlineColor="#3CBEEB"
            >
              {heroSection.title || subService.title}
            </ResponsiveUnderlinedTitle>
          }
          descriptionHtml={heroSection.text || subService.content || ''}
          descriptionClassName="service-hero-description text-lg text-gray-600"
          ctas={
            heroSection.cta?.title
              ? [
                {
                  href: heroSection.cta.url || '#contact',
                  label: heroSection.cta.title,
                  className: 'button-l',
                },
              ]
              : []
          }
          image={heroImageNode}
        />

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <ServiceStatsSection numbersFields={{ stats }} />
        )}

        {/* Video Section */}
        {videoSection && (
          <section className="py-16">
            <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image/Video */}
                <div className="relative">
                  {videoSection.image?.node?.sourceUrl && (
                    <Image
                      src={safeImageUrl(videoSection.image.node.sourceUrl)}
                      alt={sanitizeImageAlt(videoSection.image.node.altText || 'Video preview')}
                      width={800}
                      height={450}
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {videoSection.subtitle && (
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {videoSection.subtitle}
                    </div>
                  )}
                  {videoSection.title && (
                    <h2 className="text-3xl lg:text-4xl font-bold">
                      {videoSection.title}
                    </h2>
                  )}
                  {videoSection.description && (
                    <div
                      className="text-gray-600 text-lg"
                      dangerouslySetInnerHTML={{ __html: videoSection.description }}
                    />
                  )}
                  {videoSection.text && (
                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{ __html: videoSection.text }}
                    />
                  )}
                  {videoSection.cta?.url && (
                    <Link
                      href={videoSection.cta.url}
                      className="button-l"
                      target={videoSection.cta.target || '_self'}
                    >
                      {videoSection.cta.title || 'Learn More'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Frame Section */}
        {frameSection && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="space-y-6 lg:order-1">
                  {frameSection.title && (
                    <h2 className="text-3xl lg:text-4xl font-bold">
                      {frameSection.title}
                    </h2>
                  )}
                  {frameSection.text && (
                    <div
                      className="text-gray-600 text-lg"
                      dangerouslySetInnerHTML={{ __html: frameSection.text }}
                    />
                  )}
                  {frameSection.cta?.url && (
                    <Link
                      href={frameSection.cta.url}
                      className="button-l"
                      target={frameSection.cta.target || '_self'}
                    >
                      {frameSection.cta.title || 'Learn More'}
                    </Link>
                  )}
                </div>

                {/* Image */}
                <div className="relative lg:order-2">
                  {frameSection.image?.node?.sourceUrl && (
                    <Image
                      src={safeImageUrl(frameSection.image.node.sourceUrl)}
                      alt={sanitizeImageAlt(frameSection.image.node.altText || frameSection.title)}
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Approach Block */}
        {globalData?.globalContentBlocks?.approach && (
          <ApproachBlock
            globalData={{
              title: globalData.globalContentBlocks.approach.title || "Our Approach",
              subtitle: globalData.globalContentBlocks.approach.subtitle || "How We Deliver Results",
              steps: globalData.globalContentBlocks.approach.steps?.map((step, index) => ({
                stepNumber: index + 1,
                title: step.title,
                description: step.description || '',
                image: step.image
              })) || []
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
