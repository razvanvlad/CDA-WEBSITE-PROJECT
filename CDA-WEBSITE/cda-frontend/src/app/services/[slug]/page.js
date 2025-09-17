'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { sanitizeTitleHtml } from '../../../lib/sanitizeTitleHtml';
import { executeGraphQLQuery, GET_SERVICE_BY_SLUG } from '../../../lib/graphql-queries';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import HubspotFormEmbed from '../../../components/HubspotFormEmbed';
import ApproachBlock from '../../../components/GlobalBlocks/ApproachBlock';
import NewsCarousel from '../../../components/GlobalBlocks/NewsCarousel';
import ServicesSlider from '../../../components/GlobalBlocks/ServicesSlider.jsx';
import { useRef, useEffect, useState } from 'react';

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

// Note: Metadata generation removed since this is now a client component
// For SEO, consider using Next.js Head component or converting back to server component

export default function ServicePage({ params }) {
  const [service, setService] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const newsListRef = useRef(null);
  
  const scrollNews = (dir) => {
    if (!newsListRef.current) return;
    const el = newsListRef.current;
    const firstCard = el.querySelector('.news-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.86;
    const delta = dir === 'next' ? cardWidth + 16 : -(cardWidth + 16);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchServiceData() {
      try {
        const slug = await params.then(p => p.slug);
        const result = await executeGraphQLQuery(GET_SERVICE_BY_SLUG, { slug });
        
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          setError('Failed to fetch service data');
          return;
        }
        
        const serviceData = result.data?.service;
        const globalData = result.data?.globalOptions;
        
        if (!serviceData) {
          setError('Service not found');
          return;
        }
        
        setService(serviceData);
        setGlobalData(globalData);
      } catch (err) {
        console.error('Service fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchServiceData();
  }, [params]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading service...</p>
        </div>
      </div>
    );
  }
  
  if (error || !service) {
    notFound();
  }

  const serviceFields = service.serviceFields || {};
  const heroSection = serviceFields.heroSection || {};
  const serviceBulletPoints = serviceFields.serviceBulletPoints || {};
  const valueDescription = serviceFields.valueDescription || {};
  const featuredCaseStudies = serviceFields.caseStudies?.nodes || [];
  const serviceColor = getServiceColor(service.slug);
  
  // Global content blocks
  const globalContentBlocks = globalData?.globalContentBlocks || {};
  // Enable all sections by default since globalContentSelection field doesn't exist in schema
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
      <Header />
      
      <main className="service-detail-page">
        {/* Hero Section */}
        <section className="service-hero">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="service-hero-content">
                <h1 
                  className="service-hero-title text-4xl lg:text-5xl font-bold mb-6"
                  style={{
                    textDecoration: 'underline',
                    textDecorationColor: serviceColor,
                    textDecorationThickness: '11px'
                  }}
                >
                  {sanitizeTitleHtml(service.title)}
                </h1>
                {heroSection.description && (
                  <div 
                    className="service-hero-description text-lg text-gray-600 mb-8"
                    dangerouslySetInnerHTML={{ __html: heroSection.description }}
                  />
                )}
                {heroSection.cta?.title && (
                  <a 
                    href="#contact-form"
                    className="button-l"
                  >
                    {heroSection.cta.title}
                  </a>
                )}
              </div>
              
              <div className="service-hero-image">
                 {heroSection.heroImage?.node?.sourceUrl ? (
                    <Image
                      src={heroSection.heroImage.node.sourceUrl}
                      alt={heroSection.heroImage.node.altText || service.title}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-lg"
                      style={{ maxHeight: '600px', objectFit: 'contain' }}
                      priority
                    />
                 ) : service.featuredImage?.node?.sourceUrl && (
                   <Image
                     src={service.featuredImage.node.sourceUrl}
                     alt={service.featuredImage.node.altText || service.title}
                     width={600}
                     height={400}
                     className="w-full h-auto rounded-lg"
                     style={{ maxHeight: '600px', objectFit: 'contain' }}
                     priority
                   />
                 )}
               </div>
            </div>
          </div>
        </section>













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
           <section className={`home-case-studies ${nextBg()}`} style={{padding: '5rem 1rem'}}>
             <div style={{maxWidth: '1620px', margin: '0 auto'}}>
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
               <div className="cs-list" style={{marginBottom: '3rem'}}>
                 {featuredCaseStudies.slice(0, 2).map((study, index) => (
                   <article key={study.id || index} className={`cs-item ${index % 2 === 1 ? 'cs-item--reverse' : ''}`}>
                     <div className="cs-media">
                       {study.featuredImage?.node?.sourceUrl && (
                         <img 
                           src={study.featuredImage.node.sourceUrl}
                           alt={study.featuredImage.node.altText || study.title}
                           className="cs-img"
                           loading="lazy"
                         />
                       )}
                     </div>
                     <div className="cs-content">
                       <h3 className="cs-title">{study.title}</h3>
                       <div className="cs-excerpt" dangerouslySetInnerHTML={{__html: study.excerpt}} />
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

        {/* Global Case Studies Section */}
        {globalSelection?.enableCaseStudies && globalContentBlocks?.caseStudiesSection && (
          <section className="home-case-studies" style={{padding: '5rem 1rem'}}>
            <div style={{maxWidth: '1620px', margin: '0 auto'}}>
              {/* Header: left subtitle + title, right CTA */}
              <div className="cs-header">
                <div className="cs-head-left">
                  <p className="cda-subtitle">Our Work</p>
                  <h2 className="cda-title title-small-orange">Related Case Studies</h2>
                </div>
                <a href="/case-studies" className="button-without-box cs-header-cta">
                  View All Case Studies
                </a>
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
      <section id="contact-form" className={`py-16 ${nextBg()}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Started with {service.title}
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 hubspot-form-wrapper">
            {/* Robust client embed to ensure consistent loading */}
            <HubspotFormEmbed slug={service.slug} />
           </div>

          {/* Force form colors: text black, fields white; override submit button colors */}
          <style>{`
            .hubspot-form-wrapper, .hubspot-form-wrapper * { color: #000; }
            .hubspot-form-wrapper label { color: #000 !important; }
            .hubspot-form-wrapper input[type="text"],
            .hubspot-form-wrapper input[type="email"],
            .hubspot-form-wrapper input[type="tel"],
            .hubspot-form-wrapper input[type="number"],
            .hubspot-form-wrapper input[type="url"],
            .hubspot-form-wrapper input[type="password"],
            .hubspot-form-wrapper select,
            .hubspot-form-wrapper textarea {
              background-color: #fff !important;
              color: #000 !important;
              border: 1px solid #e5e7eb !important;
              border-radius: 0 !important;
              padding: 0.75rem 1rem !important;
            }
            .hubspot-form-wrapper .hs-error-msg, .hubspot-form-wrapper .hs-form-required {
              color: #b91c1c !important;
            }
            /* Submit button (proxy and native) — white text on black; invert on hover */
            .hubspot-form-wrapper .hs-custom-submit.button-l,
            .hubspot-form-wrapper .hs-submit .hs-button {
              background-color: #000 !important;
              color: #fff !important;
              box-shadow: none !important;
            }
            .hubspot-form-wrapper .hs-custom-submit.button-l:hover,
            .hubspot-form-wrapper .hs-submit .hs-button:hover {
              background-color: #fff !important;
              color: #000 !important;
              box-shadow: inset 0 0 0 1px #000 !important;
            }
            .hubspot-form-wrapper .button-l,
            .hubspot-form-wrapper .hs-button.button-l {
              /* Ensure our styled submit stands out if HubSpot overwrites */
              background-image: none !important;
            }
            .hubspot-form-wrapper .hs-hidden { display: none !important; }
          `}</style>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
