// Create this file: src/app/test-pages/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { gql } from '@apollo/client';

// Test specific page IDs
const PAGE_IDS = [
  { id: 289, name: 'Homepage' },
  { id: 775, name: 'B2B Lead Generation' },
  { id: 777, name: 'Software Development' },
  { id: 779, name: 'Booking Systems' },
  { id: 781, name: 'Digital Marketing' },
  { id: 783, name: 'Outsourced CMO' },
  { id: 785, name: 'AI' },
  { id: 317, name: 'About Us' }
];

// Test query for specific pages
const TEST_SPECIFIC_PAGES = gql`
  query TestSpecificPages {
    # Homepage
    homepage: page(id: "289", idType: DATABASE_ID) {
      id
      title
      databaseId
      homepageContent {
        headerSection {
          title
        }
      }
    }
    
    # B2B Lead Generation
    b2bPage: page(id: "775", idType: DATABASE_ID) {
      id
      title
      databaseId
      b2bLeadGenerationContent {
        headerSection {
          title
        }
      }
    }
    
    # Software Development
    softwarePage: page(id: "777", idType: DATABASE_ID) {
      id
      title
      databaseId
      softwareDevelopmentContent {
        headerSection {
          title
        }
      }
    }
    
    # Digital Marketing
    digitalPage: page(id: "781", idType: DATABASE_ID) {
      id
      title
      databaseId
      digitalMarketingContent {
        headerSection {
          title
        }
      }
    }
    
    # About Us
    aboutPage: page(id: "317", idType: DATABASE_ID) {
      id
      title
      databaseId
      aboutUsContent {
        headerSection {
          title
        }
      }
    }
  }
`;

// Simple page existence test
const TEST_PAGE_EXISTS = (pageId) => gql`
  query TestPageExists {
    page(id: "${pageId}", idType: DATABASE_ID) {
      id
      title
      databaseId
      __typename
    }
  }
`;

export default function TestPagesPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAllPages = async () => {
      setLoading(true);
      setError(null);
      const testResults = {};
      
      try {
        // Test comprehensive query first
        console.log('Testing comprehensive page query...');
        
        const comprehensiveResponse = await client.query({
          query: TEST_SPECIFIC_PAGES,
          errorPolicy: 'all'
        });
        
        console.log('Comprehensive response:', comprehensiveResponse);
        testResults.comprehensive = comprehensiveResponse;

        // Test individual pages
        for (const pageInfo of PAGE_IDS) {
          try {
            console.log(`Testing page ${pageInfo.id} (${pageInfo.name})...`);
            
            const response = await client.query({
              query: TEST_PAGE_EXISTS(pageInfo.id),
              errorPolicy: 'all'
            });
            
            testResults[pageInfo.id] = {
              name: pageInfo.name,
              response: response,
              exists: !!response.data?.page,
              error: response.errors
            };
          } catch (err) {
            testResults[pageInfo.id] = {
              name: pageInfo.name,
              exists: false,
              error: err
            };
          }
        }
        
        setResults(testResults);
      } catch (err) {
        console.error('Test error:', err);
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
          <h1 className="text-3xl font-bold mb-8">Testing Specific Pages...</h1>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Checking all pages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Specific Pages Test Results
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <h2 className="font-semibold text-red-800 mb-2">❌ Test Error</h2>
            <pre className="text-sm text-red-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Individual Page Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {PAGE_IDS.map((pageInfo) => {
            const result = results[pageInfo.id];
            
            return (
              <div key={pageInfo.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{pageInfo.name}</h3>
                  <span className="text-sm text-gray-500">ID: {pageInfo.id}</span>
                </div>
                
                {result ? (
                  <div>
                    {result.exists ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">✅</span>
                          <span className="text-green-700 font-medium">Page Exists</span>
                        </div>
                        {result.response?.data?.page?.title && (
                          <p className="text-sm text-gray-600">
                            Title: {result.response.data.page.title}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">❌</span>
                          <span className="text-red-700 font-medium">Page Not Found</span>
                        </div>
                        {result.error && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer">View Error</summary>
                            <pre className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded">
                              {JSON.stringify(result.error, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">Testing...</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comprehensive Query Results */}
        {results.comprehensive && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Comprehensive Query Results</h2>
            
            {results.comprehensive.data && (
              <div className="space-y-4">
                {Object.entries(results.comprehensive.data).map(([key, pageData]) => (
                  <div key={key} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium capitalize">{key.replace('Page', ' Page')}</h3>
                    {pageData ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>✅ Found: {pageData.title} (ID: {pageData.databaseId})</p>
                        {/* Check for specific content fields */}
                        {pageData.homepageContent && (
                          <p className="text-green-600">✅ Homepage content field available</p>
                        )}
                        {pageData.b2bLeadGenerationContent && (
                          <p className="text-green-600">✅ B2B content field available</p>
                        )}
                        {pageData.softwareDevelopmentContent && (
                          <p className="text-green-600">✅ Software Development content field available</p>
                        )}
                        {pageData.digitalMarketingContent && (
                          <p className="text-green-600">✅ Digital Marketing content field available</p>
                        )}
                        {pageData.aboutUsContent && (
                          <p className="text-green-600">✅ About Us content field available</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">❌ Page not found</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {results.comprehensive.errors && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800 mb-2">GraphQL Errors:</h3>
                {results.comprehensive.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 mb-2">
                    <p><strong>Error {index + 1}:</strong> {error.message}</p>
                    {error.path && (
                      <p className="text-xs">Path: {error.path.join(' → ')}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Full Response Data */}
            <details className="mt-6">
              <summary className="cursor-pointer font-medium text-gray-700">
                View Full Response Data
              </summary>
              <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-4 rounded max-h-96">
                {JSON.stringify(results.comprehensive, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}