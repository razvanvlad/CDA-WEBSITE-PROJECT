import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import HeroSection from '../../../components/GlobalBlocks/HeroSection';
import ResponsiveUnderlinedTitle from '../../../components/ResponsiveUnderlinedTitle';
import TextLinkButton from '../../../components/ui/TextLinkButton';
import { notFound } from 'next/navigation';
import { sanitizeTitleHtml, sanitizeImageAlt } from '../../../lib/sanitizeTitleHtml';
import { executeGraphQLQuery, GET_SERVICE_BY_SLUG } from '../../../lib/graphql-queries';
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
  const featuredCaseStudies = serviceFields.caseStudies?.nodes || [];
  const serviceColor = getServiceColor(service.slug);
  const heroImageNode = heroSection.heroImage?.node?.sourceUrl
    ? (
      <Image
        src={heroSection.heroImage.node.sourceUrl}
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
          src={service.featuredImage.node.sourceUrl}
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

  // Alternate backgrounds for sections after hero: gray -> white -> gray -> ...
  let sectionIndex = 0;
  const nextBg = () => (sectionIndex++ % 2 === 0 ? 'bg-gray-50' : 'bg-white');

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

        {/* SECTION 1: Services Grid (3x3 Cards) */}
        <section className={`services-grid-section py-16 ${nextBg()}`}>
          <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
            {/* Services Grid - 3x3 */}
            <div className="services-grid">
              {/* Card 1: Ecommerce Website Development */}
              <div className="service-card">
                <h3 className="service-card__title">Ecommerce Website Development</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/ecommerce-website-development" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 2: Ecommerce UI & UX */}
              <div className="service-card">
                <h3 className="service-card__title">Ecommerce UI & UX</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/ecommerce-ui-ux" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 3: Ecommerce Marketing */}
              <div className="service-card">
                <h3 className="service-card__title">Ecommerce Marketing</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/ecommerce-marketing" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 4: Conversion Rate Optimisation */}
              <div className="service-card">
                <h3 className="service-card__title">Conversion Rate Optimisation</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/conversion-rate-optimisation" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 5: Ecommerce Platforms */}
              <div className="service-card">
                <h3 className="service-card__title">Ecommerce Platforms</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/ecommerce-platforms" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 6: Ecommerce Automations */}
              <div className="service-card">
                <h3 className="service-card__title">Ecommerce Automations</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/ecommerce-automations" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 7: Ecommerce Consultancy */}
              <div className="service-card">
                <h3 className="service-card__title">Ecommerce Consultancy</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/ecommerce-consultancy" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 8: Ecommerce And AI */}
              <div className="service-card">
                <h3 className="service-card__title">Ecommerce And AI</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/ecommerce-ai" className="button-l-white">
                  Find Out More
                </Link>
              </div>

              {/* Card 9: Headless Ecommerce */}
              <div className="service-card service-card--with-pin">
                <Image
                  src="/images/service-cards-pin.svg"
                  alt=""
                  width={45}
                  height={66}
                  className="service-card__pin"
                />
                <h3 className="service-card__title">Headless Ecommerce</h3>
                <p className="service-card__description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/headless-ecommerce" className="button-l-white">
                  Find Out More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Stats Image + Content with Bullets */}
        <ChartServiceSection serviceColor={serviceColor} />

        {/* SECTION 5: Stats with Underlines */}
        <ServiceStatsSection />

        {/* SECTION 3: Client Showcase */}
        <ClientShowcase />











        {/* Service Bullet Points */}
        {serviceBulletPoints && (serviceBulletPoints.title || serviceBulletPoints.bullets) && (
          <section className={`service-bullet-points py-16 ${nextBg()}`}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                {serviceBulletPoints.title && (
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{serviceBulletPoints.title}</h2>
                )}
              </div>
              {serviceBulletPoints.bullets && serviceBulletPoints.bullets.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceBulletPoints.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                        <div
                          className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                          style={{ backgroundColor: serviceColor }}
                        ></div>
                        <span className="text-gray-700">{bullet.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Value Description */}
        {valueDescription && (valueDescription.title || valueDescription.description) && (
          <section className={`value-description py-16 ${nextBg()}`}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                {valueDescription.title && (
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{valueDescription.title}</h2>
                )}
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg">
                  {valueDescription.description && (
                    <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
                      {valueDescription.description}
                    </p>
                  )}
                  {valueDescription.cta?.url && valueDescription.cta?.title && (
                    <div className="text-center">
                      <Link
                        href={valueDescription.cta.url}
                        className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        {valueDescription.cta.title}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Case Studies Section */}
        {featuredCaseStudies && featuredCaseStudies.length > 0 && (
          <section className={`home-case-studies ${nextBg()}`} style={{ padding: '5rem 1rem' }}>
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
                          src={study.featuredImage.node.sourceUrl}
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

        {/* Main Content */}
        {service.content && (
          <section className={`service-content py-16 ${nextBg()}`}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              </div>
            </div>
          </section>
        )}
        <SellOnline />
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

        {/* Sell Online CTA */}


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

      {/* Contact Form Section */}
      <section id="contact-form">
        <HubspotFormEmbed slug={service.slug} />
      </section>

      <Footer />
    </>
  );
}
