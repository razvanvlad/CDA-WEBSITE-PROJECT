// Test script to check available GraphQL fields for JobListing
// Using built-in fetch (Node 18+)

const GRAPHQL_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

// Introspection query to get all fields on JobListing type
const introspectionQuery = `
  query IntrospectJobListing {
    __type(name: "JobListing") {
      name
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
        description
      }
    }
  }
`;

// Test query with a real job slug
const testJobQuery = `
  query TestJobFields {
    jobListing(id: "test-1", idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      # Try different possible field names for ACF
      jobListingFields {
        jobStatus
      }
      acfJobListingFields {
        jobStatus
      }
      jobFields {
        jobStatus
      }
    }
  }
`;

async function testGraphQL() {
  console.log('🔍 Testing GraphQL endpoint...\n');
  
  // First, get all available fields
  console.log('1. Getting all available fields on JobListing type:');
  console.log('=' .repeat(50));
  
  try {
    const introspectionResponse = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery })
    });
    
    const introspectionData = await introspectionResponse.json();
    
    if (introspectionData.data && introspectionData.data.__type) {
      const fields = introspectionData.data.__type.fields;
      console.log(`\nFound ${fields.length} fields on JobListing:\n`);
      
      // Look for ACF-related fields
      const acfFields = fields.filter(f => 
        f.name.toLowerCase().includes('field') || 
        f.name.toLowerCase().includes('acf') ||
        f.name.toLowerCase().includes('job')
      );
      
      console.log('ACF/Job-related fields:');
      acfFields.forEach(field => {
        console.log(`  - ${field.name} (${field.type.name || field.type.kind})`);
      });
      
      console.log('\nAll available fields:');
      fields.forEach(field => {
        console.log(`  - ${field.name} (${field.type.name || field.type.kind})`);
      });
    }
  } catch (error) {
    console.error('Introspection failed:', error.message);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('2. Testing actual job query with possible field names:');
  console.log('=' .repeat(50));
  
  // Now test with actual job data
  try {
    const testResponse = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: testJobQuery })
    });
    
    const testData = await testResponse.json();
    
    if (testData.errors) {
      console.log('\nGraphQL Errors:');
      testData.errors.forEach(err => {
        console.log(`  - ${err.message}`);
      });
    }
    
    if (testData.data && testData.data.jobListing) {
      console.log('\nSuccessful fields retrieved:');
      console.log(JSON.stringify(testData.data.jobListing, null, 2));
    }
  } catch (error) {
    console.error('Test query failed:', error.message);
  }
}

testGraphQL();
