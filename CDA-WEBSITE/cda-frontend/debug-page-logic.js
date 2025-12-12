const { getCaseStudyByAny } = require('./src/lib/graphql-queries.js');

// Mock environment variables if needed
process.env.NEXT_PUBLIC_WORDPRESS_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend';

async function run() {
    console.log("Testing getCaseStudyByAny with 'oakleigh-watches-2'...");

    const slug = 'oakleigh-watches-2';
    const uri = `/case-studies/${slug}/`;

    try {
        const data = await getCaseStudyByAny({ uri, slug });
        console.log("Result:", JSON.stringify(data, null, 2));

        if (data?.caseStudyProjects?.hero?.title) {
            console.log("SUCCESS: Hero title found.");
        } else {
            console.log("FAILURE: Hero title missing.");
        }
    } catch (error) {
        console.error("Error running test:", error);
    }
}

run();
