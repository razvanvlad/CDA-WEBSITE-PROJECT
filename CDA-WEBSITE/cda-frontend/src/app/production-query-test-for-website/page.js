'use client';

import { useEffect, useState } from 'react';
import { executeGraphQLQuery } from '../../lib/graphql-queries';

export default function ProductionQueryTestPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [schemaIntrospection, setSchemaIntrospection] = useState(null);

  // Define all our page types and their expected queries
  const pageTypes = {
    homepage: {
      name: 'Homepage',
      description: 'Main landing page with global content blocks',
      queries: {
        failing: `
          query GetHomepageFailing {
            page(id: 2, idType: DATABASE_ID) {
              id
              title
              content
              homepageContent {
                heroSection {
                  title
                  subtitle
                  description
                  cta { url title target }
                  heroImage { node { sourceUrl altText } }
                }
                globalContentSelection {
                  enableValues
                  enableImageFrame
                  enableTechnologiesSlider
                  enableServicesAccordion
                  enableStatsImage
                  enableLocationsImage
                  enableNewsCarousel
                  enableNewsletterSignup
                }
              }
            }
            globalOptions {
              globalContentBlocks {
                statsImage {
                  title
                  subtitle
                }
              }
            }
          }
        `,
        working: `
          query GetHomepageWorking {
            page(id: 2, idType: DATABASE_ID) {
              id
              title
              homepageContentClean {
                headerSection {
                  title
                  subtitle
                  description
                  cta { url title target }
                  heroImage { node { sourceUrl altText } }
                }
                globalContentSelection {
                  enableValues
                  enableImageFrame
                  enableTechnologiesSlider
                  enableServicesAccordion
                  enableStatsImage
                  enableLocationsImage
                  enableNewsCarousel
                  enableNewsletterSignup
                }
              }
            }
            globalOptions {
              globalContentBlocks {
                valuesBlock {
                  title
                  subtitle
                  values { title text }
                  illustration { node { sourceUrl altText } }
                }
                imageFrameBlock {
                  title
                  subtitle
                  text
                  button { url title target }
                  contentImage { node { sourceUrl altText } }
                  frameImage { node { sourceUrl altText } }
                  arrowImage { node { sourceUrl altText } }
                }
                technologiesSlider {
                  title
                  subtitle
                  logos { nodes { ... on Technology { id title uri featuredImage { node { sourceUrl altText } } } } }
                }
                servicesAccordion {
                  title
                  subtitle
                  illustration { node { sourceUrl altText } }
                  services { nodes { ... on Service { id title uri } } }
                }
                locationsImage {
                  title
                  subtitle
                  countries { countryName offices { name address email phone } }
                  illustration { node { sourceUrl altText } }
                }
                newsCarousel {
                  title
                  subtitle
                  articleSelection
                  category { nodes { name slug } }
                  manualArticles { nodes { ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } } } }
                }
                newsletterSignup {
                  title
                  subtitle
                  hubspotScript
                  termsText
                }
                approach {
                  title
                  subtitle
                  steps {
                    title
                    image { node { sourceUrl altText } }
                  }
                }
              }
            }
          }
        `
      }
    },
    about: {
      name: 'About Page',
      description: 'About us page with company information',
      queries: {
        failing: `
          query GetAboutPageFailing {
            page(id: 317, idType: DATABASE_ID) {
              id
              title
              content
              aboutUsContent {
                contentPageHeader {
                  title
                  text
                  headerImage { node { sourceUrl altText } }
                  cta { url title target }
                }
                leadershipSection {
                  title
                  subtitle
                  description
                  image { node { sourceUrl altText } }
                  cta { url title target }
                }
              }
            }
          }
        `,
        working: `
          query GetAboutPageWorking {
            page(id: 317, idType: DATABASE_ID) {
              id
              title
              aboutUsContent {
                contentPageHeader {
                  title
                  text
                  cta { url title target }
                }
                globalContentSelection {
                  enableImageFrame
                  enableServicesAccordion
                  enableWhyCda
                  enableShowreel
                  enableApproach
                  enableTechnologiesSlider
                  enableValues
                  enableStatsImage
                  enableLocationsImage
                  enableNewsCarousel
                  enableNewsletterSignup
                }
              }
            }
            globalOptions {
              globalContentBlocks {
                approach {
                  title
                  subtitle
                  steps {
                    title
                    image { node { sourceUrl altText } }
                  }
                }
              }
            }
          }
        `
      }
    },
    services: {
      name: 'Services (List)',
      description: 'Services archive page',
      queries: {
        main: `
          query GetServices($first: Int = 12, $after: String) {
            services(first: $first, after: $after) {
              nodes {
                id
                title
                slug
                date
                excerpt
                featuredImage { node { sourceUrl altText } }
                serviceFields {
                  heroSection {
                    subtitle
                    description
                  }
                  serviceBulletPoints {
                    title
                    bullets { text }
                  }
                }
                serviceTypes { nodes { name slug } }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        `
      }
    },
    serviceDetail: {
      name: 'Service Detail',
      description: 'Individual service page',
      queries: {
        main: `
          query GetServiceBySlug($slug: ID!) {
            service(id: $slug, idType: SLUG) {
              id
              title
              slug
              date
              content
              excerpt
              featuredImage { node { sourceUrl altText } }
              serviceFields {
                heroSection {
                  subtitle
                  description
                  heroImage { node { sourceUrl altText } }
                  cta { url title }
                }
                serviceBulletPoints {
                  title
                  bullets { text }
                }
                valueDescription {
                  title
                  description
                  cta { url title }
                }
                caseStudies {
                  nodes {
                    ... on CaseStudy {
                      id
                      title
                      uri
                      excerpt
                      featuredImage { node { sourceUrl altText } }
                    }
                  }
                }
              }
            }
            globalOptions {
              globalContentBlocks {
                approach {
                  title
                  subtitle
                  steps {
                    title
                    image { node { sourceUrl altText } }
                  }
                }
                newsCarousel {
                  title
                  subtitle
                  articleSelection
                  category { nodes { name slug } }
                  manualArticles {
                    nodes {
                      __typename
                      ... on BlogPost { id title excerpt uri featuredImage { node { sourceUrl altText } } }
                      ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } }
                    }
                  }
                }
              }
            }
          }
        `
      }
    },
    caseStudies: {
      name: 'Case Studies (List)',
      description: 'Case studies archive page',
      queries: {
        main: `
          query GetCaseStudies($first: Int = 12, $after: String) {
            caseStudies(first: $first, after: $after) {
              nodes {
                id
                title
                slug
                date
                excerpt
                featuredImage { node { sourceUrl altText } }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        `
      }
    },
    caseStudyDetail: {
      name: 'Case Study Detail',
      description: 'Individual case study page',
      queries: {
        main: `
          query GetCaseStudyBySlug($slug: ID!) {
            caseStudy(id: $slug, idType: SLUG) {
              id
              title
              slug
              date
              content
              excerpt
              featuredImage { node { sourceUrl altText } }
            }
          }
        `
      }
    },
    news: {
      name: 'News/Blog (List)',
      description: 'News articles archive page',
      queries: {
        main: `
          query GetPosts($first: Int = 12, $after: String) {
            posts(first: $first, after: $after) {
              nodes {
                id
                title
                slug
                date
                excerpt
                featuredImage { node { sourceUrl altText } }
                categories { nodes { name slug } }
                tags { nodes { name slug } }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        `
      }
    },
    newsDetail: {
      name: 'News/Blog Detail',
      description: 'Individual news article page',
      queries: {
        failing: `
          query GetPostBySlugFailing($slug: ID!) {
            post(id: $slug, idType: SLUG) {
              id
              title
              slug
              date
              content
              excerpt
              featuredImage { node { sourceUrl altText } }
              categories { nodes { name slug } }
              tags { nodes { name slug } }
            }
          }
        `,
        working: `
          query GetPostBySlugWorking($slug: ID!) {
            post(id: $slug, idType: SLUG) {
              id
              title
              slug
              date
              excerpt
              featuredImage { node { sourceUrl altText } }
              categories { nodes { name slug } }
              tags { nodes { name slug } }
              author {
                node {
                  name
                  description
                  avatar { url }
                }
              }
            }
          }
        `
      }
    },
    teamMembers: {
      name: 'Team Members (List)',
      description: 'Team members archive page',
      queries: {
        failing: `
          query GetTeamMembersFailing($first: Int = 12, $after: String) {
            teamMembers(first: $first, after: $after) {
              nodes {
                id
                title
                slug
                date
                featuredImage { node { sourceUrl altText } }
                teamMemberFields {
                  jobTitle
                  shortBio
                  featured
                }
                departments { nodes { name slug } }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        `,
        working: `
          query GetTeamMembersWorking($first: Int = 12, $after: String) {
            teamMembers(first: $first, after: $after) {
              nodes {
                id
                title
                slug
                date
                featuredImage { node { sourceUrl altText } }
                departments { nodes { name slug } }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        `
      }
    },
    globalContent: {
      name: 'Global Content Only',
      description: 'Test all global content blocks',
      queries: {
        failing: `
          query GetGlobalContentFailing {
            globalOptions {
              globalContentBlocks {
                statsImage {
                  title
                  subtitle
                }
                whyCdaBlock {
                  title
                  subtitle
                }
              }
            }
          }
        `,
        working: `
          query GetGlobalContentWorking {
            globalOptions {
              globalContentBlocks {
                valuesBlock {
                  title
                  subtitle
                  values { title text }
                  illustration { node { sourceUrl altText } }
                }
                imageFrameBlock {
                  title
                  subtitle
                  text
                  button { url title target }
                  contentImage { node { sourceUrl altText } }
                  frameImage { node { sourceUrl altText } }
                  arrowImage { node { sourceUrl altText } }
                }
                technologiesSlider {
                  title
                  subtitle
                  logos { nodes { ... on Technology { id title uri featuredImage { node { sourceUrl altText } } } } }
                }
                servicesAccordion {
                  title
                  subtitle
                  illustration { node { sourceUrl altText } }
                  services { nodes { ... on Service { id title uri } } }
                }
                locationsImage {
                  title
                  subtitle
                  countries { countryName offices { name address email phone } }
                  illustration { node { sourceUrl altText } }
                }
                newsCarousel {
                  title
                  subtitle
                  articleSelection
                  category { nodes { name slug } }
                  manualArticles { nodes { ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } } } }
                }
                newsletterSignup {
                  title
                  subtitle
                  hubspotScript
                  termsText
                }
                approach {
                  title
                  subtitle
                  steps {
                    title
                    image { node { sourceUrl altText } }
                  }
                }
                whyCda {
                  title
                  subtitle
                }
                showreel {
                  title
                  subtitle
                  button { url title target }
                  largeImage { node { sourceUrl altText } }
                  logos { logo { node { sourceUrl altText } } }
                }
              }
            }
          }
        `
      }
    }
  };

  // Test all queries
  const runAllTests = async () => {
    setLoading(true);
    const results = {};

    for (const [key, pageType] of Object.entries(pageTypes)) {
      results[key] = {
        name: pageType.name,
        description: pageType.description,
        results: {}
      };

      for (const [queryName, query] of Object.entries(pageType.queries)) {
        try {
          // Use sample variables for queries that need them
          let variables = {};
          if (key === 'serviceDetail') {
            variables = { slug: 'outsourced-cmo' };
          } else if (key === 'caseStudyDetail') {
            variables = { slug: 'sample-case-study' };
          } else if (key === 'newsDetail') {
            variables = { slug: 'sample-post' };
          } else if (key === 'services' || key === 'caseStudies' || key === 'news' || key === 'teamMembers') {
            variables = { first: 5 };
          }

          const result = await executeGraphQLQuery(query, variables);
          
          results[key].results[queryName] = {
            success: !result.errors,
            errors: result.errors || null,
            data: result.data || null,
            dataKeys: result.data ? Object.keys(result.data) : [],
            hasData: !!result.data && Object.keys(result.data).length > 0
          };
        } catch (error) {
          results[key].results[queryName] = {
            success: false,
            errors: [{ message: error.message }],
            data: null,
            dataKeys: [],
            hasData: false
          };
        }
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  // Get GraphQL schema introspection
  const introspectSchema = async () => {
    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
            fields {
              name
              type {
                name
                kind
              }
            }
          }
        }
      }
    `;

    try {
      const result = await executeGraphQLQuery(introspectionQuery);
      if (result.data?.__schema) {
        setSchemaIntrospection(result.data.__schema);
      }
    } catch (error) {
      console.error('Schema introspection failed:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'schema') {
      introspectSchema();
    }
  }, [activeTab]);

  const renderTestResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Running GraphQL tests...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {Object.entries(testResults).map(([key, pageTest]) => {
          const hasWorkingQuery = pageTest.results.working;
          const hasFailingQuery = pageTest.results.failing;
          const workingSuccess = hasWorkingQuery && pageTest.results.working.success;
          const failingFails = hasFailingQuery && !pageTest.results.failing.success;
          const isCorrectlyFixed = workingSuccess && failingFails;
          
          return (
            <div key={key} className={`bg-white rounded-lg shadow-md p-6 border-2 ${
              isCorrectlyFixed 
                ? 'border-green-300' 
                : hasWorkingQuery && workingSuccess 
                  ? 'border-yellow-300'
                  : 'border-red-300'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1 text-gray-800">{pageTest.name}</h3>
                  <p className="text-gray-600">{pageTest.description}</p>
                </div>
                <div className="text-right">
                  {isCorrectlyFixed && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                      ✅ Fixed & Working
                    </div>
                  )}
                  {!isCorrectlyFixed && hasWorkingQuery && workingSuccess && (
                    <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                      ⚠️ Has Working Solution
                    </div>
                  )}
                  {!hasWorkingQuery && (
                    <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
                      ❌ Needs Fixing
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Failing Query */}
                {hasFailingQuery && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-red-800">❌ Failing Query</h4>
                      <span className="text-sm text-red-600">Current issues in codebase</span>
                    </div>
                    
                    {pageTest.results.failing.errors && (
                      <div className="mb-3">
                        <h5 className="font-medium text-red-800 mb-2">Errors found:</h5>
                        <div className="space-y-1">
                          {pageTest.results.failing.errors.map((error, index) => (
                            <div key={index} className="text-sm text-red-700 bg-white p-2 rounded border-l-4 border-red-400">
                              • {error.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <details className="mt-3">
                      <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">View failing query</summary>
                      <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-x-auto">
                        <code>{pageTypes[key].queries.failing.trim()}</code>
                      </pre>
                    </details>
                  </div>
                )}
                
                {/* Working Query */}
                {hasWorkingQuery && (
                  <div className={`border rounded-lg p-4 ${
                    pageTest.results.working.success 
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-semibold text-lg ${
                        pageTest.results.working.success ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {pageTest.results.working.success ? '✅ Working Query' : '⚠️ Proposed Fix'}
                      </h4>
                      <span className={`text-sm ${
                        pageTest.results.working.success ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {pageTest.results.working.success ? 'Tested & confirmed' : 'Needs testing'}
                      </span>
                    </div>
                    
                    {pageTest.results.working.success && pageTest.results.working.hasData && (
                      <div className="mb-3">
                        <h5 className="font-medium text-green-800 mb-2">Data returned:</h5>
                        <div className="text-sm text-green-700 bg-white p-2 rounded border-l-4 border-green-400">
                          Top-level keys: {pageTest.results.working.dataKeys.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {pageTest.results.working.errors && (
                      <div className="mb-3">
                        <h5 className="font-medium text-yellow-800 mb-2">Remaining issues:</h5>
                        <div className="space-y-1">
                          {pageTest.results.working.errors.map((error, index) => (
                            <div key={index} className="text-sm text-yellow-700 bg-white p-2 rounded border-l-4 border-yellow-400">
                              • {error.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <details className="mt-3">
                      <summary className={`text-sm cursor-pointer ${
                        pageTest.results.working.success ? 'text-green-600 hover:text-green-800' : 'text-yellow-600 hover:text-yellow-800'
                      }`}>
                        View working query
                      </summary>
                      <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-x-auto">
                        <code>{pageTypes[key].queries.working.trim()}</code>
                      </pre>
                    </details>
                  </div>
                )}
                
                {/* Single query (no comparison) */}
                {!hasWorkingQuery && !hasFailingQuery && Object.entries(pageTest.results).map(([queryName, result]) => (
                  <div key={queryName} className="col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">Query: {queryName}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? '✅ Success' : '❌ Failed'}
                      </span>
                    </div>
                    
                    {result.errors && (
                      <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                        <h5 className="font-medium text-red-800 mb-2">Errors:</h5>
                        {result.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700 mb-1">
                            • {error.message}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {result.success && result.hasData && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <h5 className="font-medium text-green-800 mb-2">Data Found:</h5>
                        <div className="text-sm text-green-700">
                          Top-level keys: {result.dataKeys.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {result.success && !result.hasData && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm text-yellow-700">Query succeeded but returned no data</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Action Recommendations */}
              {isCorrectlyFixed && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">✅ Action: Update your codebase</h5>
                  <p className="text-sm text-green-700">
                    Replace the failing query in your {pageTest.name.toLowerCase()} with the working query shown above.
                  </p>
                </div>
              )}
              
              {!isCorrectlyFixed && hasWorkingQuery && workingSuccess && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">⚠️ Action: Query is working</h5>
                  <p className="text-sm text-yellow-700">
                    This query works correctly. Use it in your {pageTest.name.toLowerCase()} implementation.
                  </p>
                </div>
              )}
              
              {!hasWorkingQuery && hasFailingQuery && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h5 className="font-medium text-red-800 mb-2">❌ Action: Needs investigation</h5>
                  <p className="text-sm text-red-700">
                    Review the GraphQL schema and fix the field errors shown above.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSchemaInfo = () => {
    if (!schemaIntrospection) {
      return <div className="text-center py-8">Loading schema information...</div>;
    }

    const relevantTypes = schemaIntrospection.types.filter(type => 
      ['Service', 'CaseStudy', 'Post', 'TeamMember', 'Page', 'GlobalOptions'].some(relevantType => 
        type.name.includes(relevantType)
      )
    );

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">GraphQL Schema Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantTypes.map(type => (
              <div key={type.name} className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">{type.name}</h4>
                <p className="text-sm text-gray-600 mb-2">Type: {type.kind}</p>
                {type.fields && type.fields.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Fields:</p>
                    <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                      {type.fields.slice(0, 10).map(field => (
                        <div key={field.name} className="mb-1">
                          • {field.name}: {field.type?.name || field.type?.kind || 'Complex'}
                        </div>
                      ))}
                      {type.fields.length > 10 && (
                        <div className="text-gray-500">...and {type.fields.length - 10} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">GraphQL Production Query Testing</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive testing and debugging tool for all website GraphQL queries and schemas
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Test Overview' },
              { id: 'results', label: 'Query Results' },
              { id: 'schema', label: 'Schema Info' },
              { id: 'debug', label: 'Debug Tools' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Query Testing Overview</h2>
              <p className="text-gray-600 mb-6">
                This tool tests all GraphQL queries used throughout the website to ensure they work correctly 
                and return the expected data structures.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {Object.entries(pageTypes).map(([key, pageType]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{pageType.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pageType.description}</p>
                    <div className="text-xs text-gray-500">
                      {Object.keys(pageType.queries).length} query(ies) to test
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={runAllTests}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running Tests...' : 'Run All Query Tests'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Query Test Results</h2>
              <p className="text-gray-600 mb-4">
                Comparison between failing queries (current issues) and working queries (solutions).
              </p>
              
              {Object.keys(testResults).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {(() => {
                    const stats = Object.values(testResults).reduce((acc, pageTest) => {
                      const hasWorking = pageTest.results.working;
                      const hasFailing = pageTest.results.failing;
                      const workingSuccess = hasWorking && pageTest.results.working.success;
                      const failingFails = hasFailing && !pageTest.results.failing.success;
                      
                      if (workingSuccess && failingFails) acc.fixed++;
                      else if (workingSuccess) acc.working++;
                      else if (hasFailing || hasWorking) acc.failing++;
                      else acc.unknown++;
                      
                      acc.total++;
                      return acc;
                    }, { fixed: 0, working: 0, failing: 0, unknown: 0, total: 0 });
                    
                    return [
                      { label: 'Fixed & Working', count: stats.fixed, color: 'bg-green-100 text-green-800 border-green-200' },
                      { label: 'Has Solution', count: stats.working, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                      { label: 'Needs Fixing', count: stats.failing, color: 'bg-red-100 text-red-800 border-red-200' },
                      { label: 'Total Pages', count: stats.total, color: 'bg-blue-100 text-blue-800 border-blue-200' }
                    ].map(stat => (
                      <div key={stat.label} className={`p-4 rounded-lg border-2 ${stat.color} text-center`}>
                        <div className="text-2xl font-bold">{stat.count}</div>
                        <div className="text-sm">{stat.label}</div>
                      </div>
                    ));
                  })()
                }
                </div>
              )}
              
              {Object.keys(testResults).length === 0 && (
                <div className="mt-4">
                  <button
                    onClick={runAllTests}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                  >
                    Run Tests First
                  </button>
                </div>
              )}
            </div>
            {renderTestResults()}
          </div>
        )}

        {activeTab === 'schema' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">GraphQL Schema Information</h2>
            {renderSchemaInfo()}
          </div>
        )}

        {activeTab === 'debug' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Debug Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Environment Info</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>GraphQL Endpoint:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 'Not set'}</div>
                    <div><strong>WordPress URL:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_URL || 'Not set'}</div>
                    <div><strong>Site URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}</div>
                    <div><strong>Homepage ID:</strong> {process.env.NEXT_PUBLIC_HOMEPAGE_ID || 'Not set'}</div>
                    <div><strong>About Page ID:</strong> {process.env.NEXT_PUBLIC_ABOUT_PAGE_ID || 'Not set'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Common Issues & Solutions</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <strong>Field not found:</strong> Check if the ACF field exists and is properly configured in WordPress
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <strong>No data returned:</strong> Verify that content exists for that page/post in WordPress
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <strong>Query failed:</strong> Check GraphQL syntax and field names against the WordPress schema
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
