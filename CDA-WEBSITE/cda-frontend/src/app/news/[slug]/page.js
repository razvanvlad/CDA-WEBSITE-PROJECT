import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import GlobalTailSections from '../../../components/GlobalBlocks/GlobalTailSections.jsx';
import { getBlogPostBySlug, getGlobalContent, getAdjacentBlogPosts } from '../../../lib/graphql-queries';
import ResponsiveUnderlinedTitle from '../../../components/ResponsiveUnderlinedTitle';
import { getServiceColor, getServiceTitle } from '../../../lib/serviceColors';

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
  const toggles = post.gLOBALCONTENTBLOCKSTOGGLE?.globalContentToggles || {};

  // Image priority: Hero Image -> Featured Image
  const mainImage = hero?.image?.node?.sourceUrl ? hero.image.node : post.featuredImage?.node;

  // Content priority: Article Text -> Standard Content
  const mainContent = article?.text || post.content || '';

  // Get Author info
  const authorName = hero?.author?.node?.title || 'CDA Team';

  // Get category and service color
  const category = categories[0];
  const categorySlug = category?.slug || '';
  const categoryName = category?.name || getServiceTitle(categorySlug);
  const serviceColor = getServiceColor(categorySlug); // This will be used for underlines and bullets

  // Fetch global blocks for tail sections
  const globalContentBlocks = await getGlobalContent();

  // Fetch adjacent posts for navigation
  const adjacentPosts = await getAdjacentBlogPosts(slug, post.date);

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
                  underlineColor={serviceColor}
                >
                  {title}
                </ResponsiveUnderlinedTitle>

                {/* Relevant Services - Pills (Careers style) */}
                {hero?.relevantServices?.nodes && hero.relevantServices.nodes.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-6">
                    {hero.relevantServices.nodes.map(service => (
                      <a
                        key={service.id}
                        href={service.uri || `/services/${service.slug}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 force-rounded hover:bg-gray-200 transition-colors"
                      >
                        {service.title}
                      </a>
                    ))}
                  </div>
                )}

                {/* Meta Data with border lines */}
                <div className="border-t border-b border-gray-300 py-4 mb-6">
                  <div className="flex flex-col gap-2 text-black text-sm font-medium">
                    {dateStr && <span>{dateStr}</span>}
                    {hero?.readTime && <span>{hero.readTime} Minutes To Read</span>}
                  </div>
                </div>

                {/* CTA Button */}
                {/* {hero?.cta?.url && (
                  <div className="mb-8">
                    <a
                      href={hero.cta.url}
                      target={hero.cta.target || "_self"}
                      className="button-without-box"
                    >
                      <span className="button-text">{hero.cta.title || "Read More"}</span>
                      <span className="button-icon-wrapper">
                        <img src="/images/arrow-icons/diagonal-right-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                        <img src="/images/arrow-icons/right-arrow.svg" alt="" className="button-icon button-icon-hover" aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                )} */}

                {/* Author - 100x100px circular */}
                <div className="flex items-center gap-4">
                  <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={hero?.author?.node?.teamMemberFields?.featuredImage?.node?.sourceUrl || hero?.author?.node?.featuredImage?.node?.sourceUrl || "/images/Shannon Team Page.png"}
                      alt={authorName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-black text-lg">{authorName}</div>
                    <a href="/team" className="button-without-box text-sm">
                      <span className="button-text">View All {authorName.split(' ')[0]}'s Articles</span>
                      <span className="button-icon-wrapper">
                        <img src="/images/arrow-icons/diagonal-right-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                        <img src="/images/arrow-icons/right-arrow.svg" alt="" className="button-icon button-icon-hover" aria-hidden="true" />
                      </span>
                    </a>
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


          {/* Information Section (What/Who/Why) - Gray background edge-to-edge */}
          {information && (information.what || information.who || information.why) && (
            <section className="bg-[#F4F4F4] py-16 mb-24">
              <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative items-start">

                  {/* Left Col: What Will You Learn */}
                  <div>
                    <h3 className="text-xl font-extrabold text-black mb-6">What Will You Learn?</h3>
                    {information.what && (
                      <div>
                        {/* Render 'What' text or if points exist use them. Assuming 'points' is the list. */}
                        {information.points && information.points.length > 0 ? (
                          <ul className="space-y-4">
                            {information.points.map((pt, idx) => (
                              pt.text && (
                                <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                                  <span style={{ color: serviceColor }} className="text-xl mt-[-4px]">•</span>
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
                    <h3 className="text-xl font-extrabold text-black mb-6">Who Should Read This Article?</h3>
                    {information.who && (
                      <div className="mb-10">
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
              </div>
            </section>
          )}

          {/* Article Section - Two Column Layout 70/30 */}
          <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
              {/* Left Column - Article Content */}
              <div>
                {article?.title && article.title !== title && (
                  <h2 className="text-3xl font-bold text-black mb-8">{article.title}</h2>
                )}

                <div
                  className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-p:text-black prose-li:text-black prose-strong:text-black prose-em:text-black prose-blockquote:text-black prose-h1:text-black prose-h2:text-black prose-h3:text-black prose-h4:text-black prose-h5:text-black prose-h6:text-black prose-figcaption:text-black prose-lead:text-black prose-th:text-black prose-td:text-black"
                  dangerouslySetInnerHTML={{ __html: mainContent }}
                />

                {/* Article Image from ACF */}
                {article?.image?.node?.sourceUrl && (
                  <div className="mt-8">
                    <img
                      src={article.image.node.sourceUrl}
                      alt={article.image.node.altText || "Article image"}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Right Column - Newsletter Widget */}
              <div className="lg:pl-4">
                <div className="sticky top-8">
                  {/* Newsletter Widget - 512x555px gray box */}
                  <div className="bg-[#F4F4F4] p-8 relative" style={{ maxWidth: '512px', minHeight: '555px' }}>
                    <h3 className="text-2xl font-bold text-black mb-6">Sign Up To Our Newsletter</h3>

                    <form className="space-y-4">
                      {/* First Name - 422x50 */}
                      <input
                        type="text"
                        placeholder="First Name"
                        className="w-full h-[50px] px-4 bg-white border border-gray-200 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                        style={{ maxWidth: '422px' }}
                      />

                      {/* Last Name - 422x50 */}
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full h-[50px] px-4 bg-white border border-gray-200 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                        style={{ maxWidth: '422px' }}
                      />

                      {/* Email Address - 422x50 */}
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full h-[50px] px-4 bg-white border border-gray-200 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                        style={{ maxWidth: '422px' }}
                      />

                      {/* Terms checkbox */}
                      <div className="flex items-start gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="newsletter-terms"
                          className="w-5 h-5 mt-1 flex-shrink-0 accent-black"
                        />
                        <label htmlFor="newsletter-terms" className="text-sm text-black leading-relaxed">
                          I agree to the <a href="/terms" className="underline font-semibold">Terms and Conditions</a> and consent to receive email updates and newsletters
                        </label>
                      </div>

                      {/* Submit Button - button-l class */}
                      <div className="pt-4 relative">
                        <button type="submit" className="button-l">
                          Sign Up
                        </button>

                        {/* Paper Plane SVG */}
                        <img
                          src="/images/small-papper-plane.svg"
                          alt=""
                          className="absolute bottom-[-60px] right-[-20px] w-[180px] h-auto pointer-events-none"
                          aria-hidden="true"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Article Footer Navigation Band */}
          <section className="bg-[#F4F4F4] h-[112px] flex items-center">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
              <div className="flex items-center justify-between">
                {/* Previous Article */}
                {adjacentPosts.previous ? (
                  <a href={`/news/${adjacentPosts.previous.slug}`} className="button-without-box">
                    <span className="button-icon-wrapper mr-2">
                      <img src="/images/arrow-icons/diagonal-left-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                      <img src="/images/arrow-icons/left-arrow.svg" alt="" className="button-icon button-icon-hover" aria-hidden="true" />
                    </span>
                    <span className="button-text font-bold text-black">Previous Article</span>
                  </a>
                ) : (
                  <div className="opacity-30 pointer-events-none button-without-box">
                    <span className="button-icon-wrapper mr-2">
                      <img src="/images/arrow-icons/diagonal-left-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                    </span>
                    <span className="button-text font-bold text-black">Previous Article</span>
                  </div>
                )}

                {/* Share Icons - Centered */}
                <div className="flex items-center gap-4">
                  <span className="font-bold text-black">Share Article:</span>
                  <div className="flex items-center gap-3">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Share on Facebook">
                      <img src="/images/share-icons/facebook-share.svg" alt="Facebook" className="w-6 h-6" />
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Share on Twitter">
                      <img src="/images/share-icons/twitter-share.svg" alt="Twitter" className="w-6 h-6" />
                    </a>
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Share on LinkedIn">
                      <img src="/images/share-icons/linkedin-share.svg" alt="LinkedIn" className="w-6 h-6" />
                    </a>
                    <button className="hover:opacity-70 transition-opacity" aria-label="More sharing options">
                      <img src="/images/share-icons/plus-icon-share.svg" alt="More" className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Next Article */}
                {adjacentPosts.next ? (
                  <a href={`/news/${adjacentPosts.next.slug}`} className="button-without-box">
                    <span className="button-text font-bold text-black">Next Article</span>
                    <span className="button-icon-wrapper">
                      <img src="/images/arrow-icons/diagonal-right-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                      <img src="/images/arrow-icons/right-arrow.svg" alt="" className="button-icon button-icon-hover" aria-hidden="true" />
                    </span>
                  </a>
                ) : (
                  <div className="opacity-30 pointer-events-none button-without-box">
                    <span className="button-text font-bold text-black">Next Article</span>
                    <span className="button-icon-wrapper">
                      <img src="/images/arrow-icons/diagonal-right-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>

      <GlobalTailSections
        globalData={globalContentBlocks}
        enableCaseStudies={true}
        enableCaseStudiesFallback={true}
        enableNewsCarousel={true}
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
        enableNewsletterSignup={false}
        enableContactFormLeftImageRight={!!toggles.showContactFormLeftImageRight}
        enableJoinOurTeam={!!toggles.showJoinOurTeam}
        enableFullVideo={!!toggles.showFullVideo}
        enableCultureGallerySlider={!!toggles.showCultureGallerySlider}
      />

      <Footer />
    </div>
  );
}


