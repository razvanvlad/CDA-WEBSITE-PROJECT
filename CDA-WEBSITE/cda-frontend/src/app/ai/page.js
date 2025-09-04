// src/app/ai/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_AI_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function AIPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_AI_CONTENT,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
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

  if (!pageData?.page?.aiContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const aiContent = pageData.page.aiContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {aiContent.headerSection && (aiContent.headerSection.title || aiContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-cyan-50 to-blue-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {aiContent.headerSection.title && (
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    {stripHTML(aiContent.headerSection.title)}
                  </h1>
                )}
                
                {aiContent.headerSection.subtitle && (
                  <p className="text-xl text-gray-600 mb-8">
                    {aiContent.headerSection.subtitle}
                  </p>
                )}
              </div>
              
              {aiContent.headerSection.desktopImage && (
                <div className="hidden lg:block">
                  <img 
                    src={aiContent.headerSection.desktopImage.node.sourceUrl}
                    alt={aiContent.headerSection.desktopImage.node.altText || ''}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {aiContent.servicesSection && (aiContent.servicesSection.title || aiContent.servicesSection.servicesItems?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {aiContent.servicesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(aiContent.servicesSection.title)}
              </h2>
            )}
            
            {aiContent.servicesSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: aiContent.servicesSection.content }} />
              </div>
            )}
            
            {aiContent.servicesSection.servicesItems && aiContent.servicesSection.servicesItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aiContent.servicesSection.servicesItems.map((service, index) => (
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

      {/* Technologies Section */}
      {aiContent.technologiesSection && (aiContent.technologiesSection.title || aiContent.technologiesSection.technologies?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {aiContent.technologiesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(aiContent.technologiesSection.title)}
              </h2>
            )}
            
            {aiContent.technologiesSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: aiContent.technologiesSection.content }} />
              </div>
            )}
            
            {aiContent.technologiesSection.technologies && aiContent.technologiesSection.technologies.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aiContent.technologiesSection.technologies.map((tech, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    {tech.logo && (
                      <div className="w-16 h-16 mb-4 mx-auto">
                        <img 
                          src={tech.logo.node.sourceUrl}
                          alt={tech.logo.node.altText || tech.name || ''}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    {tech.name && (
                      <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                        {tech.name}
                      </h3>
                    )}
                    {tech.description && (
                      <div className="text-gray-600 text-center" dangerouslySetInnerHTML={{ __html: tech.description }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      {aiContent.useCasesSection && (aiContent.useCasesSection.title || aiContent.useCasesSection.useCases?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {aiContent.useCasesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(aiContent.useCasesSection.title)}
              </h2>
            )}
            
            {aiContent.useCasesSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: aiContent.useCasesSection.content }} />
              </div>
            )}
            
            {aiContent.useCasesSection.useCases && aiContent.useCasesSection.useCases.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aiContent.useCasesSection.useCases.map((useCase, index) => (
                  <div key={index} className="bg-gray-50 p-8 rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                      <div>
                        {useCase.title && (
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {stripHTML(useCase.title)}
                          </h3>
                        )}
                        {useCase.description && (
                          <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: useCase.description }} />
                        )}
                      </div>
                      {useCase.image && (
                        <div>
                          <img 
                            src={useCase.image.node.sourceUrl}
                            alt={useCase.image.node.altText || ''}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {aiContent.ctaSection && (aiContent.ctaSection.title || aiContent.ctaSection.content) && (
        <section className="py-16 bg-cyan-600">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {aiContent.ctaSection.title && (
              <h2 className="text-3xl font-bold text-white mb-4">
                {stripHTML(aiContent.ctaSection.title)}
              </h2>
            )}
            {aiContent.ctaSection.content && (
              <div className="text-xl text-cyan-100 mb-8">
                <div dangerouslySetInnerHTML={{ __html: aiContent.ctaSection.content }} />
              </div>
            )}
            
            {aiContent.ctaSection.button && (
              <a 
                href={aiContent.ctaSection.button.url}
                target={aiContent.ctaSection.button.target || '_self'}
                className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                {aiContent.ctaSection.button.title}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}