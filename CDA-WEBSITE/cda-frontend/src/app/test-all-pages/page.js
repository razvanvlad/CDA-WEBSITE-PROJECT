// Create this file: src/app/test-all-pages/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { gql } from '@apollo/client';

// Test query to check which content fields actually exist
const TEST_ALL_PAGES = gql`
  query TestAllPagesContent {
    # Test basic page existence
    bookingSystems: page(id: "779", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      bookingSystemsContent {
        __typename
      }
    }
    
    ai: page(id: "785", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      aiContent {
        __typename
      }
    }
    
    knowledgeHub: page(id: "787", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      knowledgeHubContent {
        __typename
      }
    }
    
    caseStudy: page(id: "789", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      caseStudyOakleighContent {
        __typename
      }
    }
    
    contact: page(id: "791", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      contactContent {
        __typename
      }
    }
    
    termsConditions: page(id: "793", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      termsConditionsContent {
        __typename
      }
    }
    
    # Test working ones for comparison
    outsourcedCmo: page(id: "783", idType: DATABASE_ID) {
      id
      title
      slug
      uri
      outsourcedCmoContent {
        __typename
      }
    }
    
    softwareDev: page(id: "777", idType: DATABASE_ID) {
      id
      title
      slug
      uri
    }
  }
`;

export default function TestAllPagesPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAllPages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Testing all pages...');
        
        const response = await client.query({
          query: TEST_ALL_PAGES,
          errorPolicy: 'all'
        });
        
        console.log('All pages test response:', response);
        setResults(response);
      } catch (err) {
        console.error('All pages test error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    testAllPages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Testing All Pages...</h1>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Checking page configurations...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          All Pages Diagnostic Test
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <h2 className="font-semibold text-red-800 mb-2">❌ Test Error</h2>
            <pre className="text-sm text-red-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* GraphQL Errors */}
            {results.errors && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h2 className="font-semibold text-red-800 mb-4">GraphQL Errors Found:</h2>
                {results.errors.map((err, index) => (
                  <div key={index} className="mb-4 p-3 border border-red-300 rounded bg-white">
                    <p className="text-sm font-medium text-red-800">Error {index + 1}:</p>
                    <p className="text-sm text-red-600">{err.message}</p>
                    {err.path && (
                      <p className="text-xs text-red-500 mt-1">Path: {err.path.join(' → ')}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Page Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(results.data || {}).map(([pageKey, pageData]) => {
                const pageNames = {
                  'bookingSystems': { name: 'Booking Systems', id: '779', field: 'bookingSystemsContent' },
                  'ai': { name: 'AI', id: '785', field: 'aiContent' },
                  'knowledgeHub': { name: 'Knowledge Hub', id: '787', field: 'knowledgeHubContent' },
                  'caseStudy': { name: 'Case Study', id: '789', field: 'caseStudyOakleighContent' },
                  'contact': { name: 'Contact', id: '791', field: 'contactContent' },
                  'termsConditions': { name: 'Terms & Conditions', id: '793', field: 'termsConditionsContent' },
                  'outsourcedCmo': { name: 'Outsourced CMO', id: '783', field: 'outsourcedCmoContent' },
                  'softwareDev': { name: 'Software Development', id: '777', field: 'softwareDevelopmentContent' }
                };

                const pageInfo = pageNames[pageKey];
                if (!pageInfo) return null;

                return (
                  <div key={pageKey} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{pageInfo.name}</h3>
                      <span className="text-sm text-gray-500">ID: {pageInfo.id}</span>
                    </div>
                    
                    {pageData ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">✅</span>
                          <span className="text-green-700 font-medium">Page Exists</span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Title:</strong> {pageData.title}</p>
                          <p><strong>Slug:</strong> {pageData.slug}</p>
                          <p><strong>URI:</strong> {pageData.uri}</p>
                        </div>
                        
                        {/* Check if content field exists */}
                        {pageInfo.field !== 'softwareDevelopmentContent' && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            {pageData[pageInfo.field] ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-green-600">✅</span>
                                <span className="text-green-700 text-sm">Content field available</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-red-600">❌</span>
                                <span className="text-red-700 text-sm">Content field missing</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {pageInfo.field === 'softwareDevelopmentContent' && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-600">⚠️</span>
                              <span className="text-yellow-700 text-sm">ACF field not in GraphQL</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">❌</span>
                          <span className="text-red-700 font-medium">Page Not Found</span>
                        </div>
                        <p className="text-sm text-red-600">Page doesn't exist in WordPress</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Raw Data */}
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="cursor-pointer font-medium text-gray-700">
                View Raw Response Data
              </summary>
              <pre className="mt-4 text-xs overflow-auto bg-gray-100 p-4 rounded max-h-96">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}