import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import GlobalTailSections from '../../../components/GlobalBlocks/GlobalTailSections.jsx';
import { getBlogPostBySlug, getGlobalContent } from '../../../lib/graphql-queries';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const { getBlogPostSlugs } = await import('../../../lib/graphql-queries');
  try {
    const slugs = await getBlogPostSlugs();
    console.log("DEBUG: generateStaticParams found slugs:", slugs.length, slugs);
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function NewsArticlePage({ params }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || '');

  // Fetch using the central query function
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    console.error("DEBUG NEWS PAGE: Post is null for slug:", slug);
    return (
      <div style={{ padding: '50px', background: '#ffebee', color: '#c62828' }}>
        <h1>Debug: Post Not Found</h1>
        <p>Slug requested: <strong>{slug}</strong></p>
        <p>Endpoint used: <code>{process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT}</code></p>
        <p>Please check the server console for GraphQL errors.</p>
        <a href="." style={{ marginTop: '20px', padding: '10px', display: 'inline-block', backgroundColor: '#eee' }}>Reload</a>
      </div>
    );
  }

  // Extract data from new structure
  const acfData = post.blogPosts || {};
  const { hero, information, article } = acfData;

  // Fallbacks: Use ACF hero title/date if available, otherwise core WP data
  const title = hero?.title || post.title || '';
  const dateRaw = hero?.date || post.date;
  const dateStr = dateRaw ? new Date(dateRaw).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const categories = post.blogCategories?.nodes || [];
  const toggles = post.globalContentToggles || {};

  // Image priority: Hero Image -> Featured Image
  const mainImage = hero?.image?.node?.sourceUrl ? hero.image.node : post.featuredImage?.node;

  // Content priority: Article Text -> Standard Content
  const mainContent = article?.text || post.content || '';

  // Get Author info
  const authorName = hero?.author?.node?.title || 'CDA Team';

  // Fetch global blocks for tail sections
  const globalContentBlocks = await getGlobalContent();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12">
        <article className="mx-auto w-full max-w-[900px] px-[38px] md:px-6 lg:px-8">
          {categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat.slug} className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-extrabold text-black mb-3 leading-tight" dangerouslySetInnerHTML={{ __html: title }} />

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            {dateStr && <span>Published {dateStr}</span>}
            {hero?.readTime && <span>• {hero.readTime} min read</span>}
            <span>• By {authorName}</span>
          </div>

          {mainImage?.sourceUrl && (
            <img
              src={mainImage.sourceUrl}
              alt={mainImage.altText || title}
              className="w-full h-auto rounded-lg mb-8"
            />
          )}

          {/* Information Section (What/Who/Why) */}
          {information && (information.what || information.who || information.why) && (
            <div className="mb-10 p-6 bg-gray-50 rounded-lg space-y-6">
              {information.what && (
                <div>
                  <h3 className="text-lg font-bold text-black mb-2">What</h3>
                  <div className="text-black" dangerouslySetInnerHTML={{ __html: information.what }} />
                </div>
              )}
              {information.who && (
                <div>
                  <h3 className="text-lg font-bold text-black mb-2">Who</h3>
                  <div className="text-black" dangerouslySetInnerHTML={{ __html: information.who }} />
                </div>
              )}
              {information.why && (
                <div>
                  <h3 className="text-lg font-bold text-black mb-2">Why</h3>
                  <div className="text-black" dangerouslySetInnerHTML={{ __html: information.why }} />
                </div>
              )}
              {information.points && information.points.length > 0 && (
                <ul className="list-disc pl-5 mt-4 space-y-1">
                  {information.points.map((pt, idx) => (
                    pt.text && <li key={idx} className="text-black">{pt.text}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Article Title if different */}
          {article?.title && article.title !== title && (
            <h2 className="text-2xl font-bold text-black mb-4">{article.title}</h2>
          )}

          {/* Main Content Area */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-p:text-black prose-li:text-black prose-strong:text-black prose-em:text-black prose-blockquote:text-black prose-h1:text-black prose-h2:text-black prose-h3:text-black prose-h4:text-black prose-h5:text-black prose-h6:text-black prose-figcaption:text-black prose-lead:text-black prose-th:text-black prose-td:text-black"
            dangerouslySetInnerHTML={{ __html: mainContent }}
          />

          {/* Relevant Services */}
          {hero?.relevantServices?.nodes && hero.relevantServices.nodes.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-black">Related Services</h3>
              <div className="flex flex-wrap gap-3">
                {hero.relevantServices.nodes.map(service => (
                  <a key={service.id} href={service.uri || `/services/${service.slug}`} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                    {service.title}
                  </a>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>

      <GlobalTailSections
        globalData={globalContentBlocks}
        enableApproach={!!toggles.showApproach}

        enableStats={!!toggles.showStatsAndNumbers}
        enableImageFrame={!!toggles.showImageFrame}
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
        enableCultureGallerySlider={!!toggles.showCultureGallerySlider}
      />

      <Footer />
    </div>
  );
}


