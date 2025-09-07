'use client';

import { useState } from 'react';

const GRAPHQL_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

export default function GraphQLTestPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const makeGraphQLRequest = async (query, testName) => {
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const runTest = async (testName, query) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    const result = await makeGraphQLRequest(query, testName);
    setResults(prev => ({ ...prev, [testName]: result }));
    setLoading(prev => ({ ...prev, [testName]: false }));
  };

  const TestSection = ({ title, testName, query, description }) => (
    <div style={{
      margin: '20px 0', 
      padding: '15px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>{description}</p>
      <button 
        onClick={() => runTest(testName, query)}
        disabled={loading[testName]}
        style={{
          padding: '8px 16px',
          backgroundColor: loading[testName] ? '#ccc' : '#007cba',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading[testName] ? 'not-allowed' : 'pointer'
        }}
      >
        {loading[testName] ? 'Testing...' : `Run ${title}`}
      </button>
      
      {results[testName] && (
        <div style={{ marginTop: '15px' }}>
          <div style={{ 
            color: results[testName].success && !results[testName].data?.errors ? 'green' : 'red',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            {results[testName].success && !results[testName].data?.errors ? '✅ SUCCESS' : '❌ FAILED'}
          </div>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            overflow: 'auto',
            fontSize: '0.8rem',
            maxHeight: '400px'
          }}>
            {JSON.stringify(results[testName], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  const tests = [
    {
      title: "Test 1: Basic GraphQL Connection",
      testName: "basic",
      description: "Test if GraphQL endpoint is working",
      query: `
        query {
          generalSettings {
            title
            description
          }
        }
      `
    },
    {
      title: "Test 2: Global Options Structure",
      testName: "globalOptions", 
      description: "Test if globalOptions field exists",
      query: `
        query {
          globalOptions {
            __typename
          }
        }
      `
    },
    {
      title: "Test 3: Current Global Content Blocks Query",
      testName: "currentQuery",
      description: "Test our current query structure that's failing",
      query: `
        query {
          globalOptions {
            globalContentBlocks {
              valuesBlock {
                title
                subtitle
                values {
                  title
                  text
                }
              }
              locationsImage {
                title
                subtitle
                countries {
                  countryName
                  offices {
                    name
                    address
                    email
                    phone
                  }
                }
              }
            }
          }
        }
      `
    },
    {
      title: "Test 4: Alternative Global Content Query",
      testName: "alternative",
      description: "Test alternative field names",
      query: `
        query {
          globalOptions {
            globalContentBlocksComplete {
              valuesBlock {
                title
                subtitle
                values {
                  title
                  text
                }
              }
              locationsImage {
                title
                subtitle
                countries {
                  countryName
                  offices {
                    name
                    address
                    email
                    phone
                  }
                }
              }
            }
          }
        }
      `
    },
    {
      title: "Test 5: Schema Introspection - GlobalOptions",
      testName: "schemaGlobal",
      description: "Check what fields are available in GlobalOptions",
      query: `
        query {
          __type(name: "GlobalOptions") {
            fields {
              name
              type {
                name
                kind
                ofType {
                  name
                }
              }
            }
          }
        }
      `
    },
    {
      title: "Test 6: Homepage Page Query",
      testName: "homepage",
      description: "Test homepage page structure",
      query: `
        query {
          page(id: "289", idType: DATABASE_ID) {
            id
            title
            homepageContentClean {
              globalContentSelection {
                enableValues
                enableLocationsImage
                enableImageFrame
                enableServicesAccordion
                enableTechnologiesSlider
                enableShowreel
                enableStatsImage
                enableNewsCarousel
                enableNewsletterSignup
              }
            }
          }
        }
      `
    },
    {
      title: "Test 7: ACF Fields Direct Query", 
      testName: "acfDirect",
      description: "Test direct ACF field access",
      query: `
        query {
          globalOptions {
            acfGlobalContentBlocksComplete {
              valuesBlock {
                title
                subtitle
              }
            }
          }
        }
      `
    },
    {
      title: "Test 8: Check All Available Global Fields",
      testName: "allGlobalFields",
      description: "See all fields available on globalOptions",
      query: `
        query {
          globalOptions {
            __typename
          }
          __type(name: "GlobalOptions") {
            fields {
              name
              description
              type {
                name
                kind
              }
            }
          }
        }
      `
    },
    {
      title: "Test 9: Values Block Only",
      testName: "valuesOnly", 
      description: "Test just the values block",
      query: `
        query {
          globalOptions {
            globalContentBlocks {
              valuesBlock {
                __typename
                title
                subtitle
              }
            }
          }
        }
      `
    },
    {
      title: "Test 10: Locations Block Only",
      testName: "locationsOnly",
      description: "Test just the locations block", 
      query: `
        query {
          globalOptions {
            globalContentBlocks {
              locationsImage {
                __typename
                title
                subtitle
              }
            }
          }
        }
      `
    }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 GraphQL Schema Debug Test</h1>
      <p style={{ 
        backgroundColor: '#e1f5fe', 
        padding: '15px', 
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        This page will help us identify exactly what's wrong with our GraphQL queries and fix the field structure mismatch.
        <br /><br />
        <strong>Instructions:</strong> Run tests in order. Start with Test 1 to verify GraphQL is working, then run the others to identify the issue.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            tests.forEach((test, index) => {
              setTimeout(() => runTest(test.testName, test.query), index * 1000);
            });
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          🚀 Run All Tests (Auto)
        </button>
      </div>

      {tests.map((test) => (
        <TestSection
          key={test.testName}
          title={test.title}
          testName={test.testName}
          query={test.query}
          description={test.description}
        />
      ))}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h2>🎯 What We're Looking For:</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>Test 1</strong> should pass (basic GraphQL working)</li>
          <li><strong>Tests 2-4</strong> will show us which field names are correct</li>
          <li><strong>Tests 5 & 8</strong> will show us exactly what fields exist</li>
          <li><strong>Test 6</strong> will confirm homepage structure</li>
          <li><strong>Tests 9-10</strong> will isolate the problem blocks</li>
        </ul>
        <p><strong>Once we see the results, I'll immediately fix the GraphQL queries!</strong></p>
      </div>
    </div>
  );
}
