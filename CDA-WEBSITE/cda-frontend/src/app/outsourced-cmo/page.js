// src/app/outsourced-cmo/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_OUTSOURCED_CMO_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function OutsourcedCMOPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_OUTSOURCED_CMO_CONTENT,
          errorPolicy: 'all'
        });
        
        if (response.errors) {
          setError(response.errors[0]);
        } else {
          setPageData(response.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-red-600 text-lg font-semibold mb-4">Error Loading Page</h2>
          <pre className="text-xs text-red-600 overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!pageData?.page?.outsourcedCmoContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const cmoContent = pageData.page.outsourcedCmoContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {cmoContent.headerSection && (cmoContent.headerSection.title || cmoContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-red-50 to-orange-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {cmoContent.headerSection.title && (
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    {stripHTML(cmoContent.headerSection.title)}
                  </h1>
                )}
                
                {cmoContent.headerSection.subtitle && (
                  <p className="text-xl text-gray-600 mb-8">
                    {cmoContent.headerSection.subtitle}
                  </p>
                )}
              </div>
              
              {cmoContent.headerSection.desktopImage && (
                <div className="hidden lg:block">
                  <img 
                    src={cmoContent.headerSection.desktopImage.node.sourceUrl}
                    alt={cmoContent.headerSection.desktopImage.node.altText || ''}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Intro Section */}
      {cmoContent.introSection && (cmoContent.introSection.title || cmoContent.introSection.content) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {cmoContent.introSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                {stripHTML(cmoContent.introSection.title)}
              </h2>
            )}
            
            {cmoContent.introSection.content && (
              <div className="text-lg text-gray-600 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: cmoContent.introSection.content }} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Services Section */}
      {cmoContent.servicesSection && (cmoContent.servicesSection.title || cmoContent.servicesSection.servicesItems?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {cmoContent.servicesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(cmoContent.servicesSection.title)}
              </h2>
            )}
            
            {cmoContent.servicesSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: cmoContent.servicesSection.content }} />
              </div>
            )}
            
            {cmoContent.servicesSection.servicesItems && cmoContent.servicesSection.servicesItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cmoContent.servicesSection.servicesItems.map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                    {service.icon && (
                      <div className="w-12 h-12 mb-4">
                        <img 
                          src={service.icon.node.sourceUrl}
                          alt={service.icon.node.altText || ''}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    {service.title && (
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {stripHTML(service.title)}
                      </h3>
                    )}
                    {service.description && (
                      <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: service.description }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {cmoContent.benefitsSection && (cmoContent.benefitsSection.title || cmoContent.benefitsSection.benefitsItems?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {cmoContent.benefitsSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(cmoContent.benefitsSection.title)}
              </h2>
            )}
            
            {cmoContent.benefitsSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: cmoContent.benefitsSection.content }} />
              </div>
            )}
            
            {cmoContent.benefitsSection.benefitsItems && cmoContent.benefitsSection.benefitsItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cmoContent.benefitsSection.benefitsItems.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    {benefit.number && (
                      <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                        {benefit.number}
                      </div>
                    )}
                    <div>
                      {benefit.title && (
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {stripHTML(benefit.title)}
                        </h3>
                      )}
                      {benefit.description && (
                        <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: benefit.description }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Process Section */}
      {cmoContent.processSection && (cmoContent.processSection.title || cmoContent.processSection.processSteps?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {cmoContent.processSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(cmoContent.processSection.title)}
              </h2>
            )}
            
            {cmoContent.processSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: cmoContent.processSection.content }} />
              </div>
            )}
            
            {cmoContent.processSection.processSteps && cmoContent.processSection.processSteps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cmoContent.processSection.processSteps.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                      {step.stepNumber && (
                        <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                          {step.stepNumber}
                        </span>
                      )}
                      {step.title && (
                        <h3 className="text-xl font-semibold text-gray-900">
                          {stripHTML(step.title)}
                        </h3>
                      )}
                    </div>
                    {step.description && (
                      <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: step.description }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {cmoContent.testimonialsSection?.testimonialsItems && cmoContent.testimonialsSection.testimonialsItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {cmoContent.testimonialsSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(cmoContent.testimonialsSection.title)}
              </h2>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cmoContent.testimonialsSection.testimonialsItems.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  {testimonial.content && (
                    <div className="text-gray-600 mb-4 italic">
                      "{testimonial.content}"
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 flex items-center space-x-4">
                    {testimonial.photo && (
                      <img 
                        src={testimonial.photo.node.sourceUrl}
                        alt={testimonial.photo.node.altText || ''}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      {testimonial.author && (
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      )}
                      {testimonial.position && (
                        <p className="text-sm text-gray-600">{testimonial.position}</p>
                      )}
                      {testimonial.company && (
                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {cmoContent.ctaSection && (cmoContent.ctaSection.title || cmoContent.ctaSection.content) && (
        <section className="py-16 bg-red-600">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {cmoContent.ctaSection.title && (
              <h2 className="text-3xl font-bold text-white mb-4">
                {stripHTML(cmoContent.ctaSection.title)}
              </h2>
            )}
            {cmoContent.ctaSection.content && (
              <div className="text-xl text-red-100 mb-8">
                <div dangerouslySetInnerHTML={{ __html: cmoContent.ctaSection.content }} />
              </div>
            )}
            
            {cmoContent.ctaSection.button && (
              <a 
                href={cmoContent.ctaSection.button.url}
                target={cmoContent.ctaSection.button.target || '_self'}
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                {cmoContent.ctaSection.button.title}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}