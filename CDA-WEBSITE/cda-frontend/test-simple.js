// Simple test to check what fields actually work
const GRAPHQL_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

// Try to get a job with basic fields only
const simpleQuery = `
  query SimpleJobTest {
    jobListing(id: "test-1", idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
    }
  }
`;

// Try to discover ACF fields through different approaches
const acfDiscoveryQuery = `
  query DiscoverACF {
    jobListings(first: 1) {
      nodes {
        id
        title
        # Try common ACF field naming patterns
        acf {
          jobStatus
        }
        acfFields {
          jobStatus
        }
        jobDetails {
          location
        }
        jobStatus
      }
    }
  }
`;

async function runQuery(query, description) {
  console.log(`\n${description}`);
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    if (data.errors) {
      console.log('Errors:');
      data.errors.forEach(err => {
        // Extract field name suggestions from error messages
        const match = err.message.match(/Did you mean "([^"]+)"/);
        if (match) {
          console.log(`  ❌ ${err.message}`);
          console.log(`  💡 Suggestion: Try using "${match[1]}"`);
        } else {
          console.log(`  ❌ ${err.message}`);
        }
      });
    }
    
    if (data.data) {
      console.log('Success! Data received:');
      console.log(JSON.stringify(data.data, null, 2));
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

async function main() {
  console.log('🔍 Testing GraphQL queries for Job Listings\n');
  
  await runQuery(simpleQuery, '1. Testing basic fields (should work)');
  await runQuery(acfDiscoveryQuery, '2. Trying to discover ACF field names');
  
  // Test the introspection to see what's available
  const introspectionQuery = `
    {
      __schema {
        types {
          name
          fields {
            name
          }
        }
      }
    }
  `;
  
  console.log('\n3. Getting all types and fields in schema (filtered for job-related)');
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery })
    });
    
    const data = await response.json();
    
    if (data.data && data.data.__schema) {
      const jobRelatedTypes = data.data.__schema.types.filter(t => 
        t.name && (
          t.name.toLowerCase().includes('job') || 
          t.name.toLowerCase().includes('listing') ||
          t.name.toLowerCase().includes('acf')
        )
      );
      
      console.log('Job/ACF related types found:');
      jobRelatedTypes.forEach(type => {
        console.log(`\n  Type: ${type.name}`);
        if (type.fields && type.fields.length > 0) {
          console.log('  Fields:');
          type.fields.forEach(field => {
            console.log(`    - ${field.name}`);
          });
        }
      });
    }
  } catch (error) {
    console.error('Introspection failed:', error.message);
  }
}

main();
