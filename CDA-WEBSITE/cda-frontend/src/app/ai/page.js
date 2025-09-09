// src/app/ai/page.js 
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_AI_CONTENT } from '../../lib/graphql/queries';
import { gql } from '@apollo/client';

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
        
        console.log('Fetching AI content...');
        
        const response = await client.query({
          query: GET_AI_CONTENT,
          errorPolicy: 'all'
        });
        
        console.log('AI Response:', response);
        
        if (response.errors) {
          console.error("AI GraphQL errors:", response.errors);
          setError(response.errors[0]);
        } else {
          setPageData(response.data);
          console.log("AI page data loaded successfully:", response.data);
        }
      } catch (err) {
        console.error("AI fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-gray-600">Loading AI page...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-red-600 text-lg font-semibold mb-4">Error Loading AI Page</h2>
          <pre className="text-xs text-red-600 overflow-auto bg-red-50 p-3 rounded max-h-64">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  // Check if page data exists
  if (!pageData || !pageData.page) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page data not found</h1>
          <p className="text-gray-500 mt-2">pageData: {pageData ? 'exists' : 'null'}</p>
        </div>
      </div>
    );
  }

  // Check if AI content exists
  if (!pageData.page.aiContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">AI content not found</h1>
          <p className="text-gray-500 mt-2">Page exists but aiContent is missing</p>
        </div>
      </div>
    );
  }

  const page = pageData.page;
  const aiContent = page.aiContent;

  console.log('Rendering AI page with content:', aiContent);

  return (
    <div className="min-h-screen bg-white">
      {/* Success Message */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-green-400 text-xl">✅</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700 font-medium">
              AI page loaded successfully with content!
            </p>
            <p className="text-sm text-green-600">
              Page ID: {page.databaseId} | Title: {page.title}
            </p>
          </div>
        </div>
      </div>

      {/* Header Section */}
      {aiContent.headerSection && (
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
                    alt={aiContent.headerSection.desktopImage.node.altText || 'AI Services'}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Intro Section */}
      {aiContent.introSection && (aiContent.introSection.title || aiContent.introSection.content) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {aiContent.introSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                {stripHTML(aiContent.introSection.title)}
              </h2>
            )}
            
            {aiContent.introSection.content && (
              <div className="text-lg text-gray-600 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: aiContent.introSection.content }} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Services Section */}
      {aiContent.servicesSection && (aiContent.servicesSection.title || aiContent.servicesSection.content) && (
        <section className="py-16 bg-gray-50">
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
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {aiContent.benefitsSection && (aiContent.benefitsSection.title || aiContent.benefitsSection.content) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {aiContent.benefitsSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {stripHTML(aiContent.benefitsSection.title)}
              </h2>
            )}
            
            {aiContent.benefitsSection.content && (
              <div className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: aiContent.benefitsSection.content }} />
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
            {aiContent.ctaSection.button?.url && (
              <div>
                <a
                  href={aiContent.ctaSection.button.url}
                  target={aiContent.ctaSection.button.target && aiContent.ctaSection.button.target !== '' ? aiContent.ctaSection.button.target : '_self'}
                  rel={aiContent.ctaSection.button.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-cyan-700 font-semibold rounded-lg hover:bg-cyan-50 transition-colors"
                >
                  {aiContent.ctaSection.button.title || 'Learn More'}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Debug Info */}
      <details className="m-4 p-4 bg-gray-100 rounded">
        <summary className="cursor-pointer font-bold text-sm">
          Debug: AI Content Data
        </summary>
        <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded max-h-64">
          {JSON.stringify(aiContent, null, 2)}
        </pre>
      </details>
    </div>
  );
}