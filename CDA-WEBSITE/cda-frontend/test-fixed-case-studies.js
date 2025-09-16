// Test the fixed case studies query
async function testFixedCaseStudies() {
  const GRAPHQL_ENDPOINT = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
  
  console.log('🔍 Testing fixed case studies query...');
  
  try {
    const fixedQuery = `
      query GetCaseStudiesWithPagination($first: Int = 12, $after: String, $search: String) {
        caseStudies(first: $first, after: $after, where: { search: $search }) {
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
        query: fixedQuery,
        variables: { first: 100 }
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Fixed query failed:', result.errors);
    } else {
      const caseStudies = result.data?.caseStudies?.nodes || [];
      console.log(`✅ Fixed query successful: ${caseStudies.length} case studies`);
      
      if (caseStudies.length > 0) {
        console.log('Case studies found:');
        caseStudies.forEach((cs, index) => {
          console.log(`  ${index + 1}. ${cs.title} (${cs.slug})`);
          console.log(`     - Has excerpt: ${!!cs.excerpt}`);
          console.log(`     - Has image: ${!!cs.featuredImage?.node?.sourceUrl}`);
          console.log(`     - Project types: ${cs.projectTypes?.nodes?.length || 0}`);
        });
      }
    }
  } catch (error) {
    console.log('❌ Fixed query failed:', error.message);
  }
}

testFixedCaseStudies();
