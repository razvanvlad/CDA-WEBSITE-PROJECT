// GraphQL Test Script for Case Studies
// Run with: node test-case-studies-graphql.js

async function testGraphQLConnection() {
  const GRAPHQL_ENDPOINT = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
  
  console.log('🔍 Testing GraphQL Connection...');
  console.log('Endpoint:', GRAPHQL_ENDPOINT);
  console.log('');

  // Test 1: Basic connection
  console.log('Test 1: Basic GraphQL connection...');
  try {
    const basicQuery = `
      query TestConnection {
        generalSettings {
          title
          url
        }
      }
    `;
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: basicQuery
      })
    });

    if (!response.ok) {
      console.log('❌ HTTP Error:', response.status, response.statusText);
      return;
    }

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ GraphQL Errors:', result.errors);
    } else {
      console.log('✅ Basic connection successful');
      console.log('Site Title:', result.data?.generalSettings?.title);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return;
  }

  console.log('');

  // Test 2: Check if CaseStudy post type exists
  console.log('Test 2: Checking CaseStudy post type...');
  try {
    const postTypeQuery = `
      query CheckPostTypes {
        __type(name: "CaseStudy") {
          name
          fields {
            name
          }
        }
      }
    `;
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: postTypeQuery
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ CaseStudy type check failed:', result.errors);
    } else if (result.data?.__type) {
      console.log('✅ CaseStudy post type exists');
    } else {
      console.log('❌ CaseStudy post type not found');
    }
  } catch (error) {
    console.log('❌ Post type check failed:', error.message);
  }

  console.log('');

  // Test 3: Simple case studies query
  console.log('Test 3: Simple case studies query...');
  try {
    const simpleQuery = `
      query SimpleTest {
        caseStudies(first: 3) {
          nodes {
            id
            title
            slug
          }
        }
      }
    `;
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: simpleQuery
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Simple query failed:', result.errors);
    } else {
      const caseStudies = result.data?.caseStudies?.nodes || [];
      console.log(`✅ Found ${caseStudies.length} case studies`);
      caseStudies.forEach((cs, index) => {
        console.log(`  ${index + 1}. ${cs.title} (${cs.slug})`);
      });
    }
  } catch (error) {
    console.log('❌ Simple query failed:', error.message);
  }

  console.log('');

  // Test 4: Full case studies query (like the app uses)
  console.log('Test 4: Full case studies query...');
  try {
    const fullQuery = `
      query GetCaseStudiesWithPagination($first: Int = 12, $after: String, $search: String) {
        caseStudies(first: $first, after: $after, where: { search: $search }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            caseStudyFields {
              projectOverview {
                clientName
                clientLogo {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
              featured
            }
            projectTypes {
              nodes {
                id
                name
                slug
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: fullQuery,
        variables: { first: 100 }
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Full query failed:', result.errors);
      result.errors.forEach(error => {
        console.log('Error details:', error.message);
        if (error.extensions) {
          console.log('Extensions:', error.extensions);
        }
      });
    } else {
      const caseStudies = result.data?.caseStudies?.nodes || [];
      console.log(`✅ Full query successful: ${caseStudies.length} case studies`);
      
      if (caseStudies.length > 0) {
        console.log('Sample case study:');
        const sample = caseStudies[0];
        console.log(`  Title: ${sample.title}`);
        console.log(`  Slug: ${sample.slug}`);
        console.log(`  Has Featured Image: ${!!sample.featuredImage?.node?.sourceUrl}`);
        console.log(`  Has Case Study Fields: ${!!sample.caseStudyFields}`);
        console.log(`  Is Featured: ${sample.caseStudyFields?.featured || false}`);
        console.log(`  Project Types: ${sample.projectTypes?.nodes?.length || 0}`);
      }
    }
  } catch (error) {
    console.log('❌ Full query failed:', error.message);
  }

  console.log('');

  // Test 5: Check project types
  console.log('Test 5: Checking project types...');
  try {
    const projectTypesQuery = `
      query GetProjectTypes {
        projectTypes { 
          nodes { 
            id 
            name 
            slug 
            count 
          } 
        }
      }
    `;
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: projectTypesQuery
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Project types query failed:', result.errors);
    } else {
      const projectTypes = result.data?.projectTypes?.nodes || [];
      console.log(`✅ Found ${projectTypes.length} project types`);
      projectTypes.forEach((type, index) => {
        console.log(`  ${index + 1}. ${type.name} (${type.slug}) - ${type.count} posts`);
      });
    }
  } catch (error) {
    console.log('❌ Project types query failed:', error.message);
  }
}

// Run the tests
testGraphQLConnection().then(() => {
  console.log('🔍 GraphQL testing completed.');
}).catch(error => {
  console.error('Test script error:', error);
});
