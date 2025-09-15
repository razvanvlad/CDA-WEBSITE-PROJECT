// Test to check exact fields available on JobListing
const GRAPHQL_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

// Direct introspection of JobListing type
const jobListingTypeQuery = `
  {
    __type(name: "JobListing") {
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

async function main() {
  console.log('🔍 Getting exact fields available on JobListing type\n');
  console.log('=' .repeat(60));
  
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: jobListingTypeQuery })
    });
    
    const data = await response.json();
    
    if (data.data && data.data.__type) {
      const fields = data.data.__type.fields;
      console.log(`\nJobListing type has ${fields.length} fields:\n`);
      
      // Group fields by category
      const standardFields = [];
      const acfRelatedFields = [];
      const taxonomyFields = [];
      const otherFields = [];
      
      fields.forEach(field => {
        const name = field.name.toLowerCase();
        if (name.includes('acf') || name.includes('field') || name.includes('job') && !['jobListingId', 'jobTypes'].includes(field.name)) {
          acfRelatedFields.push(field);
        } else if (name.includes('type') || name.includes('categories') || name.includes('tags')) {
          taxonomyFields.push(field);
        } else if (['id', 'title', 'slug', 'date', 'content', 'excerpt', 'status', 'featuredImage', 'uri'].includes(field.name)) {
          standardFields.push(field);
        } else {
          otherFields.push(field);
        }
      });
      
      console.log('STANDARD WORDPRESS FIELDS:');
      standardFields.forEach(f => console.log(`  - ${f.name} (${f.type.name || f.type.kind})`));
      
      if (acfRelatedFields.length > 0) {
        console.log('\nACF/JOB RELATED FIELDS:');
        acfRelatedFields.forEach(f => console.log(`  - ${f.name} (${f.type.name || f.type.kind})`));
      }
      
      if (taxonomyFields.length > 0) {
        console.log('\nTAXONOMY FIELDS:');
        taxonomyFields.forEach(f => console.log(`  - ${f.name} (${f.type.name || f.type.kind})`));
      }
      
      if (otherFields.length > 0) {
        console.log('\nOTHER FIELDS:');
        otherFields.forEach(f => console.log(`  - ${f.name} (${f.type.name || f.type.kind})`));
      }
      
      // Now test if any of these fields have subfields
      console.log('\n' + '=' .repeat(60));
      console.log('Testing potential ACF fields for subfields...\n');
      
      const potentialACFFields = fields.filter(f => 
        f.name.toLowerCase().includes('job') || 
        f.name.toLowerCase().includes('field') ||
        f.name.toLowerCase().includes('acf')
      ).map(f => f.name);
      
      if (potentialACFFields.length > 0) {
        for (const fieldName of potentialACFFields) {
          const testQuery = `
            {
              jobListing(id: "test-1", idType: SLUG) {
                ${fieldName}
              }
            }
          `;
          
          try {
            const testResponse = await fetch(GRAPHQL_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: testQuery })
            });
            
            const testData = await testResponse.json();
            
            if (!testData.errors) {
              console.log(`✅ ${fieldName}: ${JSON.stringify(testData.data.jobListing[fieldName])}`);
            } else {
              console.log(`❌ ${fieldName}: ${testData.errors[0].message}`);
            }
          } catch (err) {
            console.log(`❌ ${fieldName}: Failed to test`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed:', error.message);
  }
}

main();
