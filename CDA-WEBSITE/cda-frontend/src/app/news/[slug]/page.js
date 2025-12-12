import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import GlobalTailSections from '../../../components/GlobalBlocks/GlobalTailSections.jsx';
import { getBlogPostBySlug, getGlobalContent } from '../../../lib/graphql-queries';
import ResponsiveUnderlinedTitle from '../../../components/ResponsiveUnderlinedTitle';

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
        {/* Full width container for sections to manage their own max-width */}
        <div className="w-full">

          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Col: Text Content */}
              <div>
                <ResponsiveUnderlinedTitle
                  as="h1"
                  className="text-4xl lg:text-5xl font-extrabold text-black mb-6 leading-tight"
                  underlineColor="#ff6a00"
                >
                  {title}
                </ResponsiveUnderlinedTitle>

                {/* Relevant Services - Pills */}
                {hero?.relevantServices?.nodes && hero.relevantServices.nodes.length > 0 && (
                  <div className="mb-8">
                    <p className="text-sm font-bold text-black mb-3">Relevant Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {hero.relevantServices.nodes.map(service => (
                        <a
                          key={service.id}
                          href={service.uri || `/services/${service.slug}`}
                          className="inline-block px-4 py-2 bg-[#fff0e6] text-[#ff6a00] rounded-full text-sm font-semibold hover:bg-[#ffe0cc] transition-colors"
                        >
                          {service.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Data */}
                <div className="space-y-2 mb-8 text-black text-sm">
                  {dateStr && <div>{dateStr}</div>}
                  {hero?.readTime && <div>{hero.readTime} Minutes To Read</div>}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={hero?.author?.node?.teamMemberFields?.featuredImage?.node?.sourceUrl || hero?.author?.node?.featuredImage?.node?.sourceUrl || "/images/Shannon Team Page.png"}
                      alt={authorName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-black">{authorName}</div>
                    <a href="/team" className="text-xs font-bold text-black border-b border-black pb-0.5 hover:opacity-75">View All {authorName.split(' ')[0]}'s Articles ↘</a>
                  </div>
                </div>
              </div>

              {/* Right Col: Hero Image */}
              <div className="relative">
                {mainImage?.sourceUrl && (
                  <img
                    src={mainImage.sourceUrl}
                    alt={mainImage.altText || title}
                    className="w-full h-auto rounded-lg object-cover shadow-lg"
                  />
                )}
              </div>
            </div>
          </section>


          {/* Information Section (What/Who/Why) */}
          {information && (information.what || information.who || information.why) && (
            <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">

                {/* Left Col: What Will You Learn */}
                <div>
                  {information.what && (
                    <div className="mb-0">
                      <h3 className="text-xl font-extrabold text-black mb-6">What Will You Learn?</h3>

                      {/* Render 'What' text or if points exist use them. Assuming 'points' is the list. */}
                      {information.points && information.points.length > 0 ? (
                        <ul className="space-y-4">
                          {information.points.map((pt, idx) => (
                            pt.text && (
                              <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                                <span className="text-[#ff6a00] text-xl mt-[-4px]">•</span>
                                <span>{pt.text}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: information.what }} />
                      )}
                    </div>
                  )}
                </div>

                {/* Right Col: Who & Why */}
                <div className="relative">
                  {information.who && (
                    <div className="mb-10">
                      <h3 className="text-xl font-extrabold text-black mb-4">Who Should Read This Article?</h3>
                      <div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: information.who }} />
                    </div>
                  )}

                  {information.why && (
                    <div className="relative z-10">
                      <h3 className="text-xl font-extrabold text-black mb-4">Why Should You Read This Article?</h3>
                      <div className="text-gray-700 text-sm leading-relaxed max-w-[80%]" dangerouslySetInnerHTML={{ __html: information.why }} />
                    </div>
                  )}

                  {/* Lightbulb Icon absolute positioning */}
                  <div className="absolute bottom-[-20px] right-[-20px] w-32 md:w-40 z-0 pointer-events-none opacity-100">
                    <img src="/images/lightbulb.svg" alt="Idea" className="w-full h-auto" />
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* Article Title if different + Main Content */}
          <section className="max-w-4xl mx-auto px-4 lg:px-8">
            {article?.title && article.title !== title && (
              <h2 className="text-3xl font-bold text-black mb-8">{article.title}</h2>
            )}

            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-p:text-black prose-li:text-black prose-strong:text-black prose-em:text-black prose-blockquote:text-black prose-h1:text-black prose-h2:text-black prose-h3:text-black prose-h4:text-black prose-h5:text-black prose-h6:text-black prose-figcaption:text-black prose-lead:text-black prose-th:text-black prose-td:text-black"
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />

            {/* Relevant Services Footer Link */}
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
          </section>

        </div>
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


