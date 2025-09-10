import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { sanitizeTitleHtml } from '../../../lib/sanitizeTitleHtml';
import { getServiceBySlug } from '../../../lib/graphql-queries';
import Image from 'next/image';
import Link from 'next/link';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const service = await getServiceBySlug(params.slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    };
  }

  return {
    title: service.title,
    description: service.excerpt || service.serviceFields?.heroSection?.description || `Learn more about our ${service.title} service.`,
    openGraph: {
      title: service.title,
      description: service.excerpt || service.serviceFields?.heroSection?.description,
      type: 'article',
      images: service.featuredImage?.node?.sourceUrl ? [{
        url: service.featuredImage.node.sourceUrl,
        width: 1200,
        height: 630,
        alt: service.featuredImage.node.altText || service.title
      }] : []
    }
  };
}

export default async function ServicePage({ params }) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const serviceFields = service.serviceFields || {};
         const heroSection = serviceFields.heroSection || {};
           const serviceBulletPoints = serviceFields.serviceBulletPoints || {};
           const valueDescription = serviceFields.valueDescription || {};
           const featuredCaseStudies = serviceFields.caseStudies?.nodes || [];

  return (
    <>
      <Header />
      
      <main className="service-detail-page">
        {/* Hero Section */}
        <section className="service-hero">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="service-hero-content">
                {heroSection.subtitle && (
                  <p className="service-hero-subtitle text-purple-600 font-semibold mb-4">
                    {heroSection.subtitle}
                  </p>
                )}
                <h1 className="service-hero-title text-4xl lg:text-5xl font-bold mb-6">
                  {sanitizeTitleHtml(service.title)}
                </h1>
                {heroSection.description && (
                  <div 
                    className="service-hero-description text-lg text-gray-600 mb-8"
                    dangerouslySetInnerHTML={{ __html: heroSection.description }}
                  />
                )}
                {heroSection.cta?.title && heroSection.cta?.url && (
                  <Link 
                    href={heroSection.cta.url}
                    className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    {heroSection.cta.title}
                  </Link>
                )}
              </div>
              
              <div className="service-hero-image">
                 {heroSection.heroImage?.node?.sourceUrl ? (
                    <Image
                      src={heroSection.heroImage.node.sourceUrl}
                      alt={heroSection.heroImage.node.altText || service.title}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-lg shadow-lg"
                      priority
                    />
                 ) : service.featuredImage?.node?.sourceUrl && (
                   <Image
                     src={service.featuredImage.node.sourceUrl}
                     alt={service.featuredImage.node.altText || service.title}
                     width={600}
                     height={400}
                     className="w-full h-auto rounded-lg shadow-lg"
                     priority
                   />
                 )}
               </div>
            </div>
          </div>
        </section>













         {/* Service Bullet Points */}
         {serviceBulletPoints && (serviceBulletPoints.title || serviceBulletPoints.bullets) && (
           <section className="service-bullet-points py-16 bg-gray-50">
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
                         <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
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
           <section className="value-description py-16">
             <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                 {valueDescription.title && (
                   <h2 className="text-3xl font-bold text-gray-900 mb-4">{valueDescription.title}</h2>
                 )}
               </div>
               <div className="max-w-4xl mx-auto">
                 <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg">
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
           <section className="home-case-studies" style={{padding: '5rem 1rem'}}>
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
          <section className="service-content py-16">
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




      </main>
      
      <Footer />
    </>
  );
}