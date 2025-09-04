// src/app/b2b/page.js - CLEAN VERSION - WordPress Content Only
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_B2B_LEAD_GENERATION_CONTENT } from '../../lib/graphql/queries';

// Helper function to strip HTML tags for plain text display
const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function B2BLeadGenerationPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_B2B_LEAD_GENERATION_CONTENT,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
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

  if (!pageData?.page?.b2bLeadGenerationContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const b2bContent = pageData.page.b2bLeadGenerationContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {b2bContent.headerSection && (b2bContent.headerSection.title || b2bContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-purple-50 to-indigo-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {b2bContent.headerSection.title && (
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    {stripHTML(b2bContent.headerSection.title)}
                  </h1>
                )}
                
                {b2bContent.headerSection.subtitle && (
                  <p className="text-xl text-gray-600 mb-8">
                    {b2bContent.headerSection.subtitle}
                  </p>
                )}
              </div>
              
              {b2bContent.headerSection.desktopImage && (
                <div className="hidden lg:block">
                  <img 
                    src={b2bContent.headerSection.desktopImage.node.sourceUrl}
                    alt={b2bContent.headerSection.desktopImage.node.altText || ''}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {b2bContent.servicesSection?.servicesItems && b2bContent.servicesSection.servicesItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {b2bContent.servicesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(b2bContent.servicesSection.title)}
              </h2>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {b2bContent.servicesSection.servicesItems.map((service, index) => (
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
          </div>
        </section>
      )}

      {/* Strategy Section */}
      {b2bContent.strategySection && (b2bContent.strategySection.title || b2bContent.strategySection.strategySteps?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {b2bContent.strategySection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(b2bContent.strategySection.title)}
              </h2>
            )}
            
            {b2bContent.strategySection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: b2bContent.strategySection.content }} />
              </div>
            )}
            
            {b2bContent.strategySection.strategySteps && b2bContent.strategySection.strategySteps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {b2bContent.strategySection.strategySteps.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                      {step.stepNumber && (
                        <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
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
      {b2bContent.testimonialsSection?.testimonialsItems && b2bContent.testimonialsSection.testimonialsItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {b2bContent.testimonialsSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(b2bContent.testimonialsSection.title)}
              </h2>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {b2bContent.testimonialsSection.testimonialsItems.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  {testimonial.content && (
                    <div className="text-gray-600 mb-4 italic">
                      "{testimonial.content}"
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {b2bContent.ctaSection && (b2bContent.ctaSection.title || b2bContent.ctaSection.content) && (
        <section className="py-16 bg-purple-600">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {b2bContent.ctaSection.title && (
              <h2 className="text-3xl font-bold text-white mb-4">
                {stripHTML(b2bContent.ctaSection.title)}
              </h2>
            )}
            {b2bContent.ctaSection.content && (
              <div className="text-xl text-purple-100 mb-8">
                <div dangerouslySetInnerHTML={{ __html: b2bContent.ctaSection.content }} />
              </div>
            )}
            
            {b2bContent.ctaSection.button && (
              <a 
                href={b2bContent.ctaSection.button.url}
                target={b2bContent.ctaSection.button.target || '_self'}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                {b2bContent.ctaSection.button.title}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}