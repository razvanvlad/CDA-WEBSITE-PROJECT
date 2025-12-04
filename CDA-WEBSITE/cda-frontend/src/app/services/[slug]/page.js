import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import HeroSection from '../../../components/GlobalBlocks/HeroSection';
import ResponsiveUnderlinedTitle from '../../../components/ResponsiveUnderlinedTitle';
import TextLinkButton from '../../../components/ui/TextLinkButton';
import { notFound } from 'next/navigation';
import { sanitizeTitleHtml, sanitizeImageAlt } from '../../../lib/sanitizeTitleHtml';
import { executeGraphQLQuery, GET_SERVICE_BY_SLUG } from '../../../lib/graphql-queries';
import { safeImageUrl } from '../../../lib/imageUtils';
import Image from 'next/image';
import Link from 'next/link';
import HubspotFormEmbed from '../../../components/HubspotFormEmbed';
import ApproachBlock from '../../../components/GlobalBlocks/ApproachBlock';
import NewsCarousel from '../../../components/GlobalBlocks/NewsCarousel';
import ServicesSlider from '../../../components/GlobalBlocks/ServicesSlider.jsx';
import SellOnline from '@/components/SellOnline';
import ClientShowcase from '../../../components/ClientShowcase';
import ChartServiceSection from '../../../components/ChartServiceSection';
import ServiceStatsSection from '../../../components/ServiceStatsSection';
import ServiceDetails from '../../../components/ServiceDetails';

export const revalidate = 120;

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

export default async function ServicePage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  // Fetch on server for zero client delay
  const result = await executeGraphQLQuery(GET_SERVICE_BY_SLUG, { slug });
  if (result?.errors) {
    console.error('GraphQL errors:', result.errors);
    notFound();
  }
  const service = result?.data?.service || null;
  const globalData = result?.data?.globalOptions || null;
  if (!service) notFound();

  const serviceFields = service.serviceFields || {};
  const heroSection = serviceFields.heroSection || {};
  const serviceBulletPoints = serviceFields.serviceBulletPoints || {};
  const valueDescription = serviceFields.valueDescription || {};

  // Get related sub-services for dynamic service cards
  const relatedSubServices = serviceFields.subservice?.nodes || [];

  // Map sub-services to service cards format
  const serviceCards = relatedSubServices
    .map(subService => ({
      title: subService.title,
      description: subService.subServices?.heroSection?.text || '',
      cta: {
        url: `/services/${service.slug}/${subService.slug}`,
        title: 'Find Out More',
        target: '_self'
      }
    }))
    .filter(card => card.title || card.description); // Only include cards with valid content

  // New ACF fields
  const serviceDetails = serviceFields.serviceDetails || null;
  const clientsLogos = serviceFields.clientsLogos || null;
  const performance = serviceFields.performance || null;
  const sellOnlineData = serviceFields.sellOnline || null;
  const numbers = serviceFields.numbers || null;
  const featuredCaseStudies = serviceFields.featuredCaseStudies?.nodes || [];

  const serviceColor = getServiceColor(service.slug);

  const heroImageNode = heroSection.heroImage?.node?.sourceUrl
    ? (
      <Image
        src={safeImageUrl(heroSection.heroImage.node.sourceUrl)}
        alt={sanitizeImageAlt(heroSection.heroImage.node.altText || service.title)}
        width={600}
        height={400}
        className="cda-hero__image-media"
        style={{ maxHeight: '600px', objectFit: 'contain' }}
        priority
      />
    )
    : service.featuredImage?.node?.sourceUrl
      ? (
        <Image
          src={safeImageUrl(service.featuredImage.node.sourceUrl)}
          alt={sanitizeImageAlt(service.featuredImage.node.altText || service.title)}
          width={600}
          height={400}
          className="cda-hero__image-media"
          style={{ maxHeight: '600px', objectFit: 'contain' }}
          priority
        />
      )
      : null;

  // Global content blocks
  const globalContentBlocks = globalData?.globalContentBlocks || {};
  const globalSelection = {
    enableApproach: true,
    enableCaseStudies: true,
    enableLatestNews: true
  };

  return (
    <>
      <Header backButton={{ href: '/services', label: 'Back To Services' }} />
      <main className="service-detail-page">
        {/* Hero Section */}
        <HeroSection
          sectionClassName="bg-white"
          title={
            <ResponsiveUnderlinedTitle
              as="h1"
              className="cda-title"
              underlineColor={serviceColor}
            >
              {service.title}
            </ResponsiveUnderlinedTitle>
          }
          descriptionHtml={heroSection.description || ''}
          descriptionClassName="service-hero-description text-lg text-gray-600"
          ctas={[
            heroSection.cta?.title
              ? {
                href: '#contact-form',
                label: heroSection.cta.title,
                className: 'button-l',
              }
              : null,
            heroSection.ctab?.title
              ? {
                href: heroSection.ctab.url || '#contact-form',
                label: heroSection.ctab.title,
                className: 'button-without-box',
              }
              : null,
          ]}
          image={heroImageNode}
        />

        {/* Service Cards Grid - Dynamic from ACF */}
        {serviceCards && serviceCards.length > 0 && (
          <section className="services-grid-section py-16">
            <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
              <div className="services-grid">
                {serviceCards.map((card, index) => {
                  const isLastCard = index === serviceCards.length - 1;
                  const isFourthCard = index === 3 && serviceCards.length >= 5;
                  return (
                    <div key={index} className={`service-card ${isLastCard ? 'service-card--with-pin' : ''} ${isFourthCard ? 'service-card--with-post-pin' : ''}`}>
                      {isLastCard && (
                        <Image
                          src="/images/service-cards-pin.svg"
                          alt=""
                          width={45}
                          height={66}
                          className="service-card__pin"
                        />
                      )}
                      {isFourthCard && (
                        <Image
                          src="/images/services/post-pin.svg"
                          alt=""
                          width={33}
                          height={65}
                          className="service-card__post-pin"
                          style={{
                            transform: 'rotate(-153deg)',
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            zIndex: 10
                          }}
                        />
                      )}
                      <h4 className="service-card__title">{card.title}</h4>
                      <p className="service-card__description">{card.description}</p>
                      {card.cta?.url && (
                        <Link
                          href={card.cta.url}
                          className="button-l-white"
                          target={card.cta.target || '_self'}
                        >
                          {card.cta.title || 'Find Out More'}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Service Details - Dynamic from ACF */}
        {serviceDetails && (
          <ServiceDetails serviceDetailsFields={serviceDetails} />
        )}

        {/* Client Showcase - Dynamic from ACF */}
        {clientsLogos && (
          <ClientShowcase clientsLogosFields={clientsLogos} />
        )}

        {/* Performance Section - Dynamic from ACF */}
        {performance && (
          <ChartServiceSection serviceColor={serviceColor} performanceFields={performance} />
        )}

        {/* Numbers/Stats Section - Dynamic from ACF */}
        {numbers && (
          <ServiceStatsSection numbersFields={numbers} />
        )}






        {/* Sell Online CTA - Dynamic from ACF */}
        {sellOnlineData && (
          <SellOnline sellOnlineFields={sellOnlineData} />
        )}
        {/* Approach Block */}
        {globalSelection?.enableApproach && globalData?.globalContentBlocks?.approach && (
          <ApproachBlock globalData={{
            title: globalData.globalContentBlocks.approach.title || "Our Approach",
            subtitle: globalData.globalContentBlocks.approach.subtitle || "How We Deliver Results",
            steps: globalData.globalContentBlocks.approach.steps?.map((step, index) => ({
              stepNumber: index + 1,
              title: step.title,
              description: step.description || '',
              image: step.image
            })) || []
          }} />
        )}

        {/* Featured Case Studies Section */}
        {featuredCaseStudies && featuredCaseStudies.length > 0 && (
          <section className="home-case-studies" style={{ padding: '5rem 1rem' }}>
            <div style={{ maxWidth: '1620px', margin: '0 auto' }}>
              {/* Header */}
              <div className="cs-header">
                <div className="cs-head-left">
                  <p className="cs-subtitle">Projects</p>
                  <h2 className="cs-heading">Some Of Our Outsourced CMO Case Studies</h2>
                </div>
                <a href="/case-studies" className="button-without-box cs-header-cta">
                  View All Case Studies
                </a>
              </div>

              {/* Selected Case Studies - Alternating two-up layout */}
              <div className="cs-list" style={{ marginBottom: '3rem' }}>
                {featuredCaseStudies.slice(0, 2).map((study, index) => (
                  <article key={study.id || index} className={`cs-item ${index % 2 === 1 ? 'cs-item--reverse' : ''}`}>
                    <div className="cs-media">
                      {study.featuredImage?.node?.sourceUrl && (
                        <img
                          src={safeImageUrl(study.featuredImage.node.sourceUrl)}
                          alt={sanitizeImageAlt(study.featuredImage.node.altText || study.title)}
                          className="cs-img"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="cs-content">
                      <h3 className="cs-title">{study.title}</h3>
                      <div className="cs-excerpt" dangerouslySetInnerHTML={{ __html: study.excerpt }} />
                      <a href={study.uri} className="button-l button-l--white cs-cta">Read Case Study</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* Global Case Studies Section */}
        {globalSelection?.enableCaseStudies && globalContentBlocks?.caseStudiesSection && (
          <section className="home-case-studies" style={{ padding: '5rem 1rem' }}>
            <div style={{ maxWidth: '1620px', margin: '0 auto' }}>
              {/* Header: left subtitle + title, right CTA */}
              <div className="cs-header">
                <div className="cs-head-left">
                  <p className="cda-subtitle">Our Work</p>
                  <h2 className="cda-title title-small-orange">Related Case Studies</h2>
                </div>
                <TextLinkButton href="/case-studies" className="cs-header-cta">
                  View All Case Studies
                </TextLinkButton>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">Explore our portfolio of successful projects similar to this service.</p>
                <a href="/case-studies" className="button-l">Browse Case Studies</a>
              </div>
            </div>
          </section>
        )}

        {/* News/Latest Articles Section */}
        {globalSelection?.enableLatestNews && globalData?.globalContentBlocks?.newsCarousel && (
          <NewsCarousel newsCarousel={globalData.globalContentBlocks.newsCarousel} />
        )}




        {/* Services Slider at end of service post */}
        <ServicesSlider />
      </main>

      {/* Contact Form Section
      <section id="contact-form">
        <HubspotFormEmbed slug={service.slug} />
      </section> */}

      <Footer />
    </>
  );
}
