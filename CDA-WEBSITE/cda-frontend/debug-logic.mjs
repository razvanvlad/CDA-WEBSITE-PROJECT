
import { getBlogPostBySlug } from './src/lib/graphql-queries.js';

async function run() {
    console.log("--- START DEBUG NEWS ---");
    const slug = 'agile-vs-waterfall-best-approach-for-system-analysis';

    try {
        console.log(`Fetching for Slug: ${slug}`);
        const data = await getBlogPostBySlug(slug);
        console.log("--- DATA RECEIVED ---");
        if (data) {
            console.log("SUCCESS: Post found");
            console.log("Title:", data.title);
            // console.log("Hero Data:", JSON.stringify(data.blogPosts?.hero, null, 2));
        } else {
            console.log("FAILURE: Post returned NULL");
        }
    } catch (error) {
        console.error("CRITICAL SCRIPT ERROR:", error);
    }
}

run();
