const ENDPOINT = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

const QUERY = `
query GetBlogPostBySlug($slug: ID!) {
  blogPost(id: $slug, idType: SLUG) {
    id
    title
    slug
  }
}
`;

const SLUG = 'b2b-lead-generation-strategies-best-practices-for-high-quality-leads';

async function testQuery() {
    try {
        console.log(`Querying for slug: ${SLUG}`);
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: QUERY, variables: { slug: SLUG } })
        });

        const json = await res.json();
        console.log('Response:', JSON.stringify(json, null, 2));

        if (json.data && json.data.blogPost) {
            console.log("SUCCESS: Post found.");
        } else {
            console.log("FAILURE: Post not found.");
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

testQuery();
