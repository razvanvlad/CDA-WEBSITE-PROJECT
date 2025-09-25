import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import GlobalTailSections from '../../../components/GlobalBlocks/GlobalTailSections.jsx';
import { getGlobalContent } from '../../../lib/graphql-queries';

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
  (process?.env?.NEXT_PUBLIC_WORDPRESS_URL
    ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, '')}/graphql`
    : 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql');

async function fetchBlogPostBySlug(slug) {
  const query = `
    query GetBlogPostBySlug($slug: ID!) {
      blogPost(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content
        excerpt
        featuredImage { node { sourceUrl altText } }
        blogCategories { nodes { name slug } }
        globalContentToggles {
          showApproach
          showCaseStudies
          showImageFrame
          showNewsCarousel
          showThreeColumns
          showValues
          showWhyCda
          showServicesAccordion
          showTechnologiesSlider
          showShowreel
          showLocationsImage
          showNewsletterSignup
          showContactFormLeftImageRight
          showJoinOurTeam
          showFullVideo
          showStatsAndNumbers
        }
      }
    }
  `;

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors:', json.errors);
  }
  return json.data?.blogPost || null;
}


export default async function NewsArticlePage({ params }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || '');
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const dateStr = post.date ? new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const categories = post.blogCategories?.nodes || [];
  const toggles = post.globalContentToggles || {};

  // Fetch global blocks for tail sections
  const globalContentBlocks = await getGlobalContent();

  return (
    <div className="min-h-screen bg-white">

      <main className="py-12">
        <article className="mx-auto w-full max-w-[900px] px-4 md:px-6 lg:px-8">
          {categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat.slug} className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-extrabold text-black mb-3 leading-tight" dangerouslySetInnerHTML={{ __html: post.title || '' }} />

          {dateStr && <div className="text-sm text-gray-500 mb-6">Published {dateStr}</div>}

          {post.featuredImage?.node?.sourceUrl && (
            <img src={post.featuredImage.node.sourceUrl} alt={post.featuredImage.node.altText || post.title || ''} className="w-full h-auto rounded-lg mb-8" />
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-p:text-black prose-li:text-black prose-strong:text-black prose-em:text-black prose-blockquote:text-black prose-h1:text-black prose-h2:text-black prose-h3:text-black prose-h4:text-black prose-h5:text-black prose-h6:text-black prose-figcaption:text-black prose-lead:text-black prose-th:text-black prose-td:text-black"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>
      </main>

      <GlobalTailSections
        globalData={globalContentBlocks}
        enableApproach={!!toggles.showApproach}
        enableStats={!!toggles.showStatsAndNumbers}
        enableImageFrame={!!toggles.showImageFrame}
        enableNewsCarousel={!!toggles.showNewsCarousel}
        enableColumnsWithIcons3X={!!toggles.showThreeColumns}
        enableValues={!!toggles.showValues}
        enableWhyCda={!!toggles.showWhyCda}
        enableServicesAccordion={!!toggles.showServicesAccordion}
        enableTechnologiesSlider={!!toggles.showTechnologiesSlider}
        enableShowreel={!!toggles.showShowreel}
        enableLocationsImage={!!toggles.showLocationsImage}
        enableNewsletterSignup={!!toggles.showNewsletterSignup}
        enableContactFormLeftImageRight={!!toggles.showContactFormLeftImageRight}
        enableJoinOurTeam={!!toggles.showJoinOurTeam}
        enableFullVideo={!!toggles.showFullVideo}
      />

      <Footer />
    </div>
  );
}

