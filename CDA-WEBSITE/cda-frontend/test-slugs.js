// Native fetch used in Node 18+

const ENDPOINT = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

const QUERY = `
    query GetAllBlogPostSlugs {
      blogPosts(first: 100) {
        nodes {
          slug
        }
      }
    }
  `;

async function testSlugs() {
    try {
        console.log(`Querying slugs from: ${ENDPOINT}`);
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: QUERY })
        });

        const json = await res.json();
        const slugs = json.data?.blogPosts?.nodes?.map(n => n.slug) || [];

        console.log('Found Slugs:', slugs);

        if (slugs.includes('b2b-lead-generation-strategies-best-practices-for-high-quality-leads')) {
            console.log("SUCCESS: Target slug found in list.");
        } else {
            console.log("FAILURE: Target slug NOT found in list.");
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

testSlugs();
