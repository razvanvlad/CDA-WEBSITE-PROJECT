// Create this file: src/app/test-schema/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { gql } from '@apollo/client';

// Schema introspection query to see what fields are actually available
const INTROSPECT_PAGE_FIELDS = gql`
  query IntrospectPageFields {
    __type(name: "Page") {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

// Test what fields are available for specific pages
const TEST_PAGE_FIELDS = (pageId) => gql`
  query TestPageFields {
    page(id: "${pageId}", idType: DATABASE_ID) {
      id
      title
      databaseId
      # Test for common ACF field patterns
      homepageContent {
        __typename
      }
      b2bLeadGenerationContent {
        __typename
      }
      aboutUsContent {
        __typename
      }
      # These might be the actual field names
      softwareDevelopmentContent {
        __typename
      }
      digitalMarketingContent {
        __typename
      }
    }
  }
`;

// Test About Us specific fields that were suggested in the error
const TEST_ABOUT_US_FIELDS = gql`
  query TestAboutUsFields {
    page(id: "317", idType: DATABASE_ID) {
      id
      title
      aboutUsContent {
        __typename
        # Test the suggested field names from the error
        videoSection {
          __typename
        }
        leadershipSection {
          __typename
        }
        statsSection {
          __typename
        }
        whoWeAreSection {
          __typename
        }
        whyCdaSection {
          __typename
        }
      }
    }
  }
`;

// Test B2B fields to see what's actually available
const TEST_B2B_FIELDS = gql`
  query TestB2BFields {
    page(id: "775", idType: DATABASE_ID) {
      id
      title
      b2bLeadGenerationContent {
        __typename
        # Test various possible field names
        headerSection {
          __typename
          title
          subtitle
        }
        heroSection {
          __typename
        }
        servicesSection {
          __typename
        }
        contentSections {
          __typename
        }
      }
    }
  }
`;

export default function TestSchemaPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testSchema = async () => {
      setLoading(true);
      const testResults = {};
      
      try {
        // Test 1: Page type introspection
        console.log('Testing Page type introspection...');
        try {
          const introspectionResponse = await client.query({
            query: INTROSPECT_PAGE_FIELDS,
            errorPolicy: 'all'
          });
          testResults.introspection = introspectionResponse;
        } catch (err) {
          testResults.introspection = { error: err };
        }

        // Test 2: About Us fields (we know this one has issues)
        console.log('Testing About Us specific fields...');
        try {
          const aboutResponse = await client.query({
            query: TEST_ABOUT_US_FIELDS,
            errorPolicy: 'all'
          });
          testResults.aboutUs = aboutResponse;
        } catch (err) {
          testResults.aboutUs = { error: err };
        }

        // Test 3: B2B fields 
        console.log('Testing B2B specific fields...');
        try {
          const b2bResponse = await client.query({
            query: TEST_B2B_FIELDS,
            errorPolicy: 'all'
          });
          testResults.b2b = b2bResponse;
        } catch (err) {
          testResults.b2b = { error: err };
        }

        // Test 4: Individual page field tests
        const pageIds = [289, 775, 777, 781, 317]; // Homepage, B2B, Software, Digital, About
        for (const pageId of pageIds) {
          console.log(`Testing fields for page ${pageId}...`);
          try {
            const response = await client.query({
              query: TEST_PAGE_FIELDS(pageId),
              errorPolicy: 'all'
            });
            testResults[`page_${pageId}`] = response;
          } catch (err) {
            testResults[`page_${pageId}`] = { error: err };
          }
        }

        setResults(testResults);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    testSchema();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Testing GraphQL Schema...</h1>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Introspecting available fields...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          GraphQL Schema Analysis
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h2 className="font-semibold text-red-800 mb-2">❌ Schema Test Error</h2>
            <pre className="text-sm text-red-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Page Type Introspection */}
        {results.introspection && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Page Type Available Fields</h2>
            
            {results.introspection.data ? (
              <div>
                <p className="text-green-600 mb-4">✅ Successfully introspected Page type</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.introspection.data.__type.fields
                    .filter(field => field.name.includes('Content') || field.name.includes('content'))
                    .map((field) => (
                      <div key={field.name} className="bg-blue-50 p-3 rounded border">
                        <h3 className="font-medium text-blue-800">{field.name}</h3>
                        <p className="text-sm text-blue-600">
                          Type: {field.type.name || field.type.ofType?.name || 'Unknown'}
                        </p>
                      </div>
                    ))}
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">All Page Fields</summary>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                    {results.introspection.data.__type.fields.map((field) => (
                      <div key={field.name} className="bg-gray-100 p-2 rounded">
                        {field.name}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Failed to introspect Page type
                {results.introspection.error && (
                  <pre className="text-xs mt-2 p-2 bg-red-50 rounded overflow-auto">
                    {JSON.stringify(results.introspection.error, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* About Us Fields Test */}
        {results.aboutUs && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">About Us Content Fields</h2>
            
            {results.aboutUs.data ? (
              <div className="space-y-3">
                <p className="text-green-600">✅ About Us content available with these sections:</p>
                
                {results.aboutUs.data.page.aboutUsContent && Object.keys(results.aboutUs.data.page.aboutUsContent).map(key => (
                  <div key={key} className="bg-green-50 p-3 rounded border">
                    <span className="font-medium text-green-800">✅ {key}</span>
                    <span className="text-sm text-green-600 ml-2">
                      (Type: {results.aboutUs.data.page.aboutUsContent[key]?.__typename || 'Available'})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-red-600">
                ❌ About Us field test failed
                {results.aboutUs.error && (
                  <pre className="text-xs mt-2 p-2 bg-red-50 rounded overflow-auto">
                    {JSON.stringify(results.aboutUs.error, null, 2)}
                  </pre>
                )}
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer text-sm">View Raw Data</summary>
              <pre className="text-xs mt-2 bg-gray-100 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(results.aboutUs, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* B2B Fields Test */}
        {results.b2b && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">B2B Content Fields</h2>
            
            {results.b2b.data ? (
              <div className="space-y-3">
                <p className="text-green-600">✅ B2B content available with these sections:</p>
                
                {results.b2b.data.page.b2bLeadGenerationContent && Object.keys(results.b2b.data.page.b2bLeadGenerationContent).map(key => (
                  <div key={key} className="bg-green-50 p-3 rounded border">
                    <span className="font-medium text-green-800">✅ {key}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-red-600">
                ❌ B2B field test failed
                {results.b2b.error && (
                  <pre className="text-xs mt-2 p-2 bg-red-50 rounded overflow-auto">
                    {JSON.stringify(results.b2b.error, null, 2)}
                  </pre>
                )}
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer text-sm">View Raw Data</summary>
              <pre className="text-xs mt-2 bg-gray-100 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(results.b2b, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Individual Page Tests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Individual Page Field Tests</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(results).filter(([key]) => key.startsWith('page_')).map(([key, result]) => {
              const pageId = key.replace('page_', '');
              const pageName = {
                '289': 'Homepage',
                '775': 'B2B Lead Generation',
                '777': 'Software Development', 
                '781': 'Digital Marketing',
                '317': 'About Us'
              }[pageId] || `Page ${pageId}`;
              
              return (
                <div key={key} className="border border-gray-200 rounded p-4">
                  <h3 className="font-medium mb-3">{pageName} (ID: {pageId})</h3>
                  
                  {result.data ? (
                    <div className="space-y-2 text-sm">
                      {Object.entries(result.data.page).map(([fieldName, fieldValue]) => {
                        if (fieldName === 'id' || fieldName === 'title' || fieldName === 'databaseId') return null;
                        
                        return (
                          <div key={fieldName}>
                            {fieldValue ? (
                              <span className="text-green-600">✅ {fieldName}</span>
                            ) : (
                              <span className="text-gray-400">❌ {fieldName}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm">
                      ❌ Test failed
                      {result.error && (
                        <details className="mt-2">
                          <summary className="cursor-pointer">View Error</summary>
                          <pre className="text-xs mt-1 p-2 bg-red-50 rounded">
                            {JSON.stringify(result.error, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}