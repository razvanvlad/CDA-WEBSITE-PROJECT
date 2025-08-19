// CDA-WEBSITE-PROJECT/CDA-FRONTEND/src/app/page.js
import { useEffect, useState } from 'react';
import graphqlClient from '../lib/graphql/client';
import { GET_PAGE_CONTENT } from '../lib/graphql/queries';

export default function Home() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await graphqlClient.request(GET_PAGE_CONTENT, { id: "68" });
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{pageData.title}</h1>
          <time className="text-gray-600 text-sm">
            Published on {new Date(pageData.date).toLocaleDateString()}
          </time>
        </header>

        {pageData.testContentFields && (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Test Content</h2>
            
            {pageData.testContentFields.testText && (
              <div className="mb-4">
                <strong className="text-gray-700">Test Text:</strong>
                <p className="text-gray-600 ml-2">{pageData.testContentFields.testText}</p>
              </div>
            )}
            
            {pageData.testContentFields.testNumber && (
              <div className="mb-4">
                <strong className="text-gray-700">Test Number:</strong>
                <span className="text-gray-600 ml-2">{pageData.testContentFields.testNumber}</span>
              </div>
            )}
            
            {pageData.testContentFields.testToggle && (
              <div className="mb-4">
                <strong className="text-gray-700">Test Toggle:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  pageData.testContentFields.testToggle 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pageData.testContentFields.testToggle ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}