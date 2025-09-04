// src/app/404/page.js OR src/app/not-found.js (Next.js convention)
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_404_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function Error404Page() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_404_CONTENT,
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to search results or homepage with search parameter
      window.location.href = `/?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // If loading or error, show minimal 404
  if (loading || error || !pageData?.page?.error404Content) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <a 
            href="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const errorContent = pageData.page.error404Content;

  return (
    <div className="min-h-screen bg-white">
      {/* Main 404 Section */}
      {errorContent.mainSection && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            
            {/* 404 Number Display */}
            <div className="text-8xl lg:text-9xl font-bold text-gray-200 mb-6">404</div>
            
            {errorContent.mainSection.title && (
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {stripHTML(errorContent.mainSection.title)}
              </h1>
            )}
            
            {errorContent.mainSection.subtitle && (
              <p className="text-xl text-gray-600 mb-4">
                {errorContent.mainSection.subtitle}
              </p>
            )}
            
            {errorContent.mainSection.message && (
              <div className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: errorContent.mainSection.message }} />
              </div>
            )}
            
            {errorContent.mainSection.image && (
              <div className="mb-8">
                <img 
                  src={errorContent.mainSection.image.node.sourceUrl}
                  alt={errorContent.mainSection.image.node.altText || ''}
                  className="mx-auto h-64 w-auto"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Action Buttons Section */}
      {errorContent.actionsSection && (errorContent.actionsSection.homeButton || errorContent.actionsSection.contactButton) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {errorContent.actionsSection.title && (
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                {stripHTML(errorContent.actionsSection.title)}
              </h2>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {errorContent.actionsSection.homeButton && (
                <a 
                  href={errorContent.actionsSection.homeButton.url || '/'}
                  target={errorContent.actionsSection.homeButton.target || '_self'}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  {errorContent.actionsSection.homeButton.title || 'Go Home'}
                </a>
              )}
              
              {errorContent.actionsSection.contactButton && (
                <a 
                  href={errorContent.actionsSection.contactButton.url || '/contact'}
                  target={errorContent.actionsSection.contactButton.target || '_self'}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors text-center"
                >
                  {errorContent.actionsSection.contactButton.title || 'Contact Us'}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      {errorContent.searchSection && (errorContent.searchSection.title || errorContent.searchSection.searchPlaceholder) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            {errorContent.searchSection.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {stripHTML(errorContent.searchSection.title)}
              </h2>
            )}
            
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={errorContent.searchSection.searchPlaceholder || 'Search our site...'}
                className="flex-1 px-6 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Suggestions Section */}
      {errorContent.suggestionsSection && (errorContent.suggestionsSection.title || errorContent.suggestionsSection.suggestionsItems?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {errorContent.suggestionsSection.title && (
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(errorContent.suggestionsSection.title)}
              </h2>
            )}
            
            {errorContent.suggestionsSection.suggestionsItems && errorContent.suggestionsSection.suggestionsItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {errorContent.suggestionsSection.suggestionsItems.map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                    {suggestion.title && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {stripHTML(suggestion.title)}
                      </h3>
                    )}
                    
                    {suggestion.description && (
                      <p className="text-gray-600 mb-4">
                        {suggestion.description}
                      </p>
                    )}
                    
                    {suggestion.link && (
                      <a 
                        href={suggestion.link.url}
                        target={suggestion.link.target || '_self'}
                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
                      >
                        {suggestion.link.title} →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still can't find what you're looking for?
          </h2>
          <p className="text-gray-300 mb-8">
            Our team is here to help you find the information you need.
          </p>
          <a 
            href="/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}