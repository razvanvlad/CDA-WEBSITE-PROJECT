// Test what fields are available on CaseStudy type
async function testCaseStudyFields() {
  const GRAPHQL_ENDPOINT = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
  
  console.log('🔍 Testing available CaseStudy fields...');
  
  // Test: Introspection query to see available fields
  try {
    const introspectionQuery = `
      query IntrospectCaseStudy {
        __type(name: "CaseStudy") {
          name
          fields {
            name
            type {
              name
              kind
            }
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
        query: introspectionQuery
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Introspection failed:', result.errors);
    } else {
      const fields = result.data?.__type?.fields || [];
      console.log(`✅ CaseStudy type has ${fields.length} available fields:`);
      fields.forEach((field, index) => {
        console.log(`  ${index + 1}. ${field.name} (${field.type.name || field.type.kind})`);
      });
    }
  } catch (error) {
    console.log('❌ Introspection failed:', error.message);
  }
  
  console.log('');
  
  // Test: Try a basic query with only core fields
  console.log('Testing basic case study query...');
  try {
    const basicQuery = `
      query BasicCaseStudies {
        caseStudies(first: 3) {
          nodes {
            id
            title
            slug
            date
            excerpt
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
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
        query: basicQuery
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Basic query failed:', result.errors);
    } else {
      const caseStudies = result.data?.caseStudies?.nodes || [];
      console.log(`✅ Basic query successful: ${caseStudies.length} case studies`);
      if (caseStudies.length > 0) {
        const sample = caseStudies[0];
        console.log('Sample case study:');
        console.log(`  Title: ${sample.title}`);
        console.log(`  Slug: ${sample.slug}`);
        console.log(`  Has Content: ${!!sample.content}`);
        console.log(`  Has Excerpt: ${!!sample.excerpt}`);
        console.log(`  Has Featured Image: ${!!sample.featuredImage?.node?.sourceUrl}`);
      }
    }
  } catch (error) {
    console.log('❌ Basic query failed:', error.message);
  }
}

testCaseStudyFields();
