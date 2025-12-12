
async function debugCaseStudy() {
    const query = `
    query GetCaseStudyBySlug($slug: ID!) {
      caseStudy(id: $slug, idType: SLUG) {
        id
        title
        slug
        caseStudyProjects {
          hero {
            title
            text
            image {
              node {
                sourceUrl
              }
            }
          }
          customerDetails {
            company
          }
        }
      }
    }
  `;

    const variables = { slug: "oakleigh-watches-2" };

    try {
        const response = await fetch('http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });

        const result = await response.json();
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

debugCaseStudy();
