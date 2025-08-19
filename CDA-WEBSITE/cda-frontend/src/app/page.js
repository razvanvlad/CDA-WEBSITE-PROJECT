// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/app/page.js
'use client'

import { useEffect, useState } from 'react';
import graphqlClient from '../lib/graphql/client';
import { GET_HOMEPAGE_CONTENT } from '../lib/graphql/queries';

export default function Home() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await graphqlClient.request(GET_HOMEPAGE_CONTENT, { id: "68" });
        setPageData(response.page);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading content from WordPress...</p>
    </div>
  </div>;

  if (error) return <div className="flex items-center justify-center min-h-screen bg-red-50">
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-red-600 text-lg font-semibold mb-2">Error Loading Content</h2>
      <p className="text-gray-600 text-sm mb-4">Failed to fetch data from WordPress GraphQL endpoint.</p>
      <p className="text-red-500 text-xs">Error: {error}</p>
    </div>
  </div>;

  // Render Flexible Content Layouts
  const renderFlexibleContent = (layout) => {
    switch (layout.__typename) {
      case 'TestContentFieldsTestFlexibleContentCtaSectionLayout':
        return (
          <div key={layout.title} className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-lg text-white text-center mb-6">
            <h3 className="text-2xl font-bold mb-4">{layout.title}</h3>
            <a 
              href={layout.buttonLink?.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {layout.buttonText}
            </a>
          </div>
        );

      case 'TestContentFieldsTestFlexibleContentTextBlockLayout':
        return (
          <div key={layout.title} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{layout.title}</h3>
            <div 
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: layout.content }}
            />
          </div>
        );

      case 'TestContentFieldsTestFlexibleContentImageSectionLayout':
        const image = layout.image?.node;
        return (
          <div key={image?.title} className="bg-white p-6 rounded-lg shadow-md mb-6">
            {image && (
              <div className="mb-4">
                <img 
                  src={image.sourceUrl} 
                  alt={image.altText || image.title}
                  className="w-full h-auto rounded-lg"
                  width={image.mediaDetails?.width}
                  height={image.mediaDetails?.height}
                />
              </div>
            )}
            {layout.caption && (
              <p className="text-gray-600 text-sm italic">{layout.caption}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const featuredImage = pageData.testContentFields?.testImage?.node;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">CDA</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{pageData.title}</h1>
          <p className="text-gray-600 mb-6">Published on {new Date(pageData.date).toLocaleDateString()}</p>
          
          {/* Featured Image */}
          {featuredImage && (
            <div className="mb-6">
              <img 
                src={featuredImage.sourceUrl}
                alt={featuredImage.altText || featuredImage.title}
                className="w-full h-auto rounded-lg"
                width={featuredImage.mediaDetails?.width}
                height={featuredImage.mediaDetails?.height}
              />
            </div>
          )}

          {/* Test Fields Display */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Test Text:</h3>
              <p className="text-gray-600">{pageData.testContentFields.testText}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Test Textarea:</h3>
              <p className="text-gray-600">{pageData.testContentFields.testTextarea}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Test Number:</h3>
              <p className="text-gray-600">{pageData.testContentFields.testNumber}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Test Toggle:</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                pageData.testContentFields.testToggle 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {pageData.testContentFields.testToggle ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Flexible Content Sections */}
        {pageData.testContentFields.testFlexibleContent && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Flexible Content Sections</h2>
            {pageData.testContentFields.testFlexibleContent.map((layout, index) => (
              <div key={index}>
                {renderFlexibleContent(layout)}
              </div>
            ))}
          </div>
        )}

        {/* Gallery Section */}
        {pageData.testContentFields.testGallery?.nodes?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Image Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pageData.testContentFields.testGallery.nodes.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={image.sourceUrl}
                    alt={image.altText || image.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-300">© {new Date().getFullYear()} CDA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}