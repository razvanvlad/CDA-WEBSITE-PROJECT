// src/app/booking-systems/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_BOOKING_SYSTEMS_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function BookingSystemsPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_BOOKING_SYSTEMS_CONTENT,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
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

  if (!pageData?.page?.bookingSystemsContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const bookingContent = pageData.page.bookingSystemsContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {bookingContent.headerSection && (bookingContent.headerSection.title || bookingContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-blue-50 to-cyan-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {bookingContent.headerSection.title && (
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    {stripHTML(bookingContent.headerSection.title)}
                  </h1>
                )}
                
                {bookingContent.headerSection.subtitle && (
                  <p className="text-xl text-gray-600 mb-8">
                    {bookingContent.headerSection.subtitle}
                  </p>
                )}
              </div>
              
              {bookingContent.headerSection.desktopImage && (
                <div className="hidden lg:block">
                  <img 
                    src={bookingContent.headerSection.desktopImage.node.sourceUrl}
                    alt={bookingContent.headerSection.desktopImage.node.altText || ''}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {bookingContent.featuresSection?.featuresItems && bookingContent.featuresSection.featuresItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {bookingContent.featuresSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(bookingContent.featuresSection.title)}
              </h2>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookingContent.featuresSection.featuresItems.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                  {feature.icon && (
                    <div className="w-12 h-12 mb-4">
                      <img 
                        src={feature.icon.node.sourceUrl}
                        alt={feature.icon.node.altText || ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {feature.title && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {stripHTML(feature.title)}
                    </h3>
                  )}
                  {feature.description && (
                    <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: feature.description }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Integrations Section */}
      {bookingContent.integrationsSection && (bookingContent.integrationsSection.title || bookingContent.integrationsSection.integrationsLogos?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {bookingContent.integrationsSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(bookingContent.integrationsSection.title)}
              </h2>
            )}
            
            {bookingContent.integrationsSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: bookingContent.integrationsSection.content }} />
              </div>
            )}
            
            {bookingContent.integrationsSection.integrationsLogos && bookingContent.integrationsSection.integrationsLogos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                {bookingContent.integrationsSection.integrationsLogos.map((integration, index) => (
                  <div key={index} className="text-center">
                    {integration.logo && (
                      <img 
                        src={integration.logo.node.sourceUrl}
                        alt={integration.logo.node.altText || integration.name || ''}
                        className="h-12 mx-auto mb-2 grayscale hover:grayscale-0 transition-all"
                      />
                    )}
                    {integration.name && (
                      <p className="text-sm text-gray-600">{integration.name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Demo Section */}
      {bookingContent.demoSection && (bookingContent.demoSection.title || bookingContent.demoSection.content) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {bookingContent.demoSection.title && (
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {stripHTML(bookingContent.demoSection.title)}
              </h2>
            )}
            
            {bookingContent.demoSection.content && (
              <div className="text-lg text-gray-600 mb-8">
                <div dangerouslySetInnerHTML={{ __html: bookingContent.demoSection.content }} />
              </div>
            )}
            
            {bookingContent.demoSection.demoVideo && (
              <div className="mb-8 aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Demo Video: {bookingContent.demoSection.demoVideo}</p>
              </div>
            )}
            
            {bookingContent.demoSection.demoButton && (
              <a 
                href={bookingContent.demoSection.demoButton.url}
                target={bookingContent.demoSection.demoButton.target || '_self'}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                {bookingContent.demoSection.demoButton.title}
              </a>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {bookingContent.ctaSection && (bookingContent.ctaSection.title || bookingContent.ctaSection.content) && (
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {bookingContent.ctaSection.title && (
              <h2 className="text-3xl font-bold text-white mb-4">
                {stripHTML(bookingContent.ctaSection.title)}
              </h2>
            )}
            {bookingContent.ctaSection.content && (
              <div className="text-xl text-blue-100 mb-8">
                <div dangerouslySetInnerHTML={{ __html: bookingContent.ctaSection.content }} />
              </div>
            )}
            
            {bookingContent.ctaSection.button && (
              <a 
                href={bookingContent.ctaSection.button.url}
                target={bookingContent.ctaSection.button.target || '_self'}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                {bookingContent.ctaSection.button.title}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}