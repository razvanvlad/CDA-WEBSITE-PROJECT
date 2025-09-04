// src/app/terms-conditions/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_TERMS_CONDITIONS_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function TermsConditionsPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_TERMS_CONDITIONS_CONTENT,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
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

  if (!pageData?.page?.termsConditionsContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const termsContent = pageData.page.termsConditionsContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {termsContent.headerSection && (termsContent.headerSection.title || termsContent.headerSection.lastUpdated) && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {termsContent.headerSection.title && (
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {stripHTML(termsContent.headerSection.title)}
              </h1>
            )}
            
            {termsContent.headerSection.lastUpdated && (
              <p className="text-lg text-gray-600">
                Last updated: {termsContent.headerSection.lastUpdated}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Terms Content Sections */}
      {termsContent.sections && termsContent.sections.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            
            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-lg p-6 mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                {termsContent.sections.map((section, index) => (
                  section.title && (
                    <a
                      key={index}
                      href={`#section-${index}`}
                      className="block text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {index + 1}. {stripHTML(section.title)}
                    </a>
                  )
                ))}
              </nav>
            </div>
            
            {/* Terms Sections */}
            <div className="prose prose-lg max-w-none">
              {termsContent.sections.map((section, index) => (
                <div key={index} id={`section-${index}`} className="mb-12">
                  {section.title && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                      {index + 1}. {stripHTML(section.title)}
                    </h2>
                  )}
                  
                  {section.content && (
                    <div 
                      className="text-gray-700 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* Back to Top */}
            <div className="text-center mt-12">
              <a 
                href="#top"
                className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ↑ Back to Top
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Footer Contact */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-gray-300 mb-8">
            If you have any questions about these Terms & Conditions, please contact us.
          </p>
          <a 
            href="/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}