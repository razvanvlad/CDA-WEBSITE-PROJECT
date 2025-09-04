// src/app/digital-marketing/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_DIGITAL_MARKETING_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function DigitalMarketingPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_DIGITAL_MARKETING_CONTENT,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
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

  if (!pageData?.page?.digitalMarketingContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const digitalContent = pageData.page.digitalMarketingContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {digitalContent.headerSection && (digitalContent.headerSection.title || digitalContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-pink-50 to-rose-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {digitalContent.headerSection.title && (
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    {stripHTML(digitalContent.headerSection.title)}
                  </h1>
                )}
                
                {digitalContent.headerSection.subtitle && (
                  <p className="text-xl text-gray-600 mb-8">
                    {digitalContent.headerSection.subtitle}
                  </p>
                )}
              </div>
              
              {digitalContent.headerSection.desktopImage && (
                <div className="hidden lg:block">
                  <img 
                    src={digitalContent.headerSection.desktopImage.node.sourceUrl}
                    alt={digitalContent.headerSection.desktopImage.node.altText || ''}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {digitalContent.servicesSection && (digitalContent.servicesSection.title || digitalContent.servicesSection.servicesItems?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {digitalContent.servicesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(digitalContent.servicesSection.title)}
              </h2>
            )}
            
            {digitalContent.servicesSection.intro && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: digitalContent.servicesSection.intro }} />
              </div>
            )}
            
            {digitalContent.servicesSection.servicesItems && digitalContent.servicesSection.servicesItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {digitalContent.servicesSection.servicesItems.map((service, index) => (
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
                      <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: service.description }} />
                    )}
                    {service.features && service.features.length > 0 && (
                      <ul className="text-sm text-gray-500 space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Strategy Section */}
      {digitalContent.strategySection && (digitalContent.strategySection.title || digitalContent.strategySection.strategySteps?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {digitalContent.strategySection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(digitalContent.strategySection.title)}
              </h2>
            )}
            
            {digitalContent.strategySection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: digitalContent.strategySection.content }} />
              </div>
            )}
            
            {digitalContent.strategySection.strategySteps && digitalContent.strategySection.strategySteps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {digitalContent.strategySection.strategySteps.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                      {step.stepNumber && (
                        <span className="bg-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
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

      {/* Tools Section */}
      {digitalContent.toolsSection && (digitalContent.toolsSection.title || digitalContent.toolsSection.toolsLogos?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {digitalContent.toolsSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(digitalContent.toolsSection.title)}
              </h2>
            )}
            
            {digitalContent.toolsSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: digitalContent.toolsSection.content }} />
              </div>
            )}
            
            {digitalContent.toolsSection.toolsLogos && digitalContent.toolsSection.toolsLogos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                {digitalContent.toolsSection.toolsLogos.map((tool, index) => (
                  <div key={index} className="text-center">
                    {tool.logo && (
                      <img 
                        src={tool.logo.node.sourceUrl}
                        alt={tool.logo.node.altText || tool.name || ''}
                        className="h-12 mx-auto mb-2 grayscale hover:grayscale-0 transition-all"
                      />
                    )}
                    {tool.name && (
                      <p className="text-sm text-gray-600">{tool.name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results Section */}
      {digitalContent.resultsSection && (digitalContent.resultsSection.title || digitalContent.resultsSection.stats?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {digitalContent.resultsSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(digitalContent.resultsSection.title)}
              </h2>
            )}
            
            {digitalContent.resultsSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: digitalContent.resultsSection.content }} />
              </div>
            )}
            
            {digitalContent.resultsSection.stats && digitalContent.resultsSection.stats.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {digitalContent.resultsSection.stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
                    {stat.number && (
                      <div className="text-3xl font-bold text-pink-600 mb-2">
                        {stat.number}
                      </div>
                    )}
                    {stat.label && (
                      <p className="text-gray-700 font-medium">{stat.label}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {digitalContent.ctaSection && (digitalContent.ctaSection.title || digitalContent.ctaSection.content) && (
        <section className="py-16 bg-pink-600">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {digitalContent.ctaSection.title && (
              <h2 className="text-3xl font-bold text-white mb-4">
                {stripHTML(digitalContent.ctaSection.title)}
              </h2>
            )}
            {digitalContent.ctaSection.content && (
              <div className="text-xl text-pink-100 mb-8">
                <div dangerouslySetInnerHTML={{ __html: digitalContent.ctaSection.content }} />
              </div>
            )}
            
            {digitalContent.ctaSection.button && (
              <a 
                href={digitalContent.ctaSection.button.url}
                target={digitalContent.ctaSection.button.target || '_self'}
                className="bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                {digitalContent.ctaSection.button.title}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}