// src/app/software-development/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_SOFTWARE_DEVELOPMENT_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function SoftwareDevelopmentPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_SOFTWARE_DEVELOPMENT_CONTENT,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-red-600 text-lg font-semibold mb-4">Configuration Required</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <h3 className="font-semibold text-yellow-800">⚠️ Software Development ACF Fields Not Available</h3>
            <p className="text-sm text-yellow-700 mt-2">
              The <code>softwareDevelopmentContent</code> field is not exposed to GraphQL.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Please configure the ACF field group in WordPress admin:
            </p>
            <ol className="text-xs text-yellow-600 mt-2 ml-4 space-y-1">
              <li>1. Go to WordPress Admin → Custom Fields → Field Groups</li>
              <li>2. Find "Software Development" field group</li>
              <li>3. Enable "Show in GraphQL"</li>
              <li>4. Set GraphQL Field Name to "softwareDevelopmentContent"</li>
              <li>5. Save the field group</li>
            </ol>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">View Error Details</summary>
            <pre className="text-xs text-red-600 mt-2 overflow-auto bg-red-50 p-2 rounded">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!pageData?.page) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  // Since softwareDevelopmentContent field is not available, show basic page info
  const page = pageData.page;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {page.title || 'Software Development'}
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            🚧 Content Configuration Required
          </h2>
          <p className="text-blue-700 mb-4">
            This page exists in WordPress but the content fields are not yet available through GraphQL.
          </p>
          <div className="text-left bg-white p-4 rounded border text-sm">
            <p className="font-medium text-gray-800 mb-2">Page Information:</p>
            <p><strong>ID:</strong> {page.id}</p>
            <p><strong>Title:</strong> {page.title}</p>
            <p><strong>Slug:</strong> {page.slug}</p>
            <p><strong>URI:</strong> {page.uri}</p>
          </div>
        </div>
      </div>
    </div>
  );
}