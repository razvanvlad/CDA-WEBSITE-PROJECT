import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { sanitizeTitleHtml } from '../../../lib/sanitizeTitleHtml';
import PhotoFrame from '../../../components/GlobalBlocks/PhotoFrame';

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
      }
    }
  `;

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    // Ensure SSR fetch is not cached forever in dev
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

// Fetch minimal global content blocks needed for article tail sections
async function fetchGlobalBlocks() {
  const globalQuery = `
    query GetGlobalContentBlocksForArticle {
      globalOptions {
        globalContentBlocks {
          imageFrameBlock {
            title
            subtitle
            text
            button { url title target }
            contentImage { node { sourceUrl altText } }
            frameImage { node { sourceUrl altText } }
            arrowImage { node { sourceUrl altText } }
          }
          newsCarousel {
            title
            subtitle
            articleSelection
            category { nodes { name slug } }
            manualArticles {
              nodes {
                ... on Post {
                  id
                  title
                  excerpt
                  uri
                  featuredImage { node { sourceUrl altText } }
                }
              }
            }
          }
          columnsWithIcons3X {
            title
            subtitle
            columns { iconClass title description }
          }
        }
      }
    }
  `;

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: globalQuery }),
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const rawBlocks = json?.data?.globalOptions?.globalContentBlocks || {};

  // Compute News Carousel articles based on selection (manual/latest/category)
  let normalizedBlocks = { ...rawBlocks };
  try {
    const newsConfig = rawBlocks?.newsCarousel;
    if (newsConfig) {
      let computedArticles = [];
      const selection = newsConfig.articleSelection;

      if (selection === 'manual') {
        computedArticles = (newsConfig.manualArticles?.nodes || [])
          .map((n) => ({
            id: n?.id,
            title: n?.title,
            excerpt: n?.excerpt,
            uri: n?.uri,
            imageUrl: n?.featuredImage?.node?.sourceUrl || '',
            imageAlt: n?.featuredImage?.node?.altText || n?.title || 'Article image',
          }));
      } else {
        const selectedSlug = newsConfig?.category?.nodes?.[0]?.slug;
        const firstCount = selection === 'category' ? 12 : 6;
        const blogQuery = `{
          blogPosts(first: ${firstCount}, where: { orderby: {field: DATE, order: DESC} }) {
            nodes {
              id
              title
              excerpt
              uri
              date
              featuredImage { node { sourceUrl altText } }
              blogCategories { nodes { name slug } }
            }
          }
        }`;
        const blogRes = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: blogQuery })
        });
        const blogJson = await blogRes.json();
        const blogNodes = (blogJson?.data?.blogPosts?.nodes || []);
        const filteredNodes = (selection === 'category' && selectedSlug)
          ? blogNodes.filter((n) => (n?.blogCategories?.nodes || []).some((c) => c?.slug === selectedSlug))
          : blogNodes;

        computedArticles = filteredNodes.map((n) => ({
          id: n?.id,
          title: n?.title,
          excerpt: n?.excerpt,
          uri: n?.uri,
          date: n?.date,
          imageUrl: n?.featuredImage?.node?.sourceUrl || '',
          imageAlt: n?.featuredImage?.node?.altText || n?.title || 'Article image',
          categories: (n?.blogCategories?.nodes || []).map((c) => c?.name).filter(Boolean),
        }));
      }

      normalizedBlocks = {
        ...normalizedBlocks,
        newsCarousel: newsConfig ? { ...newsConfig, computedArticles } : undefined,
      };
    }
  } catch (e) {
    console.warn('News Carousel posts fetch failed, falling back to config only.', e);
  }

  return normalizedBlocks;
}

export default async function NewsArticlePage({ params }) {
  const slug = decodeURIComponent(params?.slug || '');
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const dateStr = post.date ? new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const categories = post.blogCategories?.nodes || [];

  // Fetch global blocks for tail sections
  const globalContentBlocks = await fetchGlobalBlocks();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12">
        <article className="mx-auto w-full max-w-[900px] px-4 md:px-6 lg:px-8">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat.slug} className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-4xl font-extrabold text-black mb-3 leading-tight"
            dangerouslySetInnerHTML={{ __html: sanitizeTitleHtml(post.title || '') }}
          />

          {/* Meta */}
          {dateStr && <div className="text-sm text-gray-500 mb-6">Published {dateStr}</div>}

          {/* Featured Image */}
          {post.featuredImage?.node?.sourceUrl && (
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title || ''}
              className="w-full h-auto rounded-lg mb-8"
            />)
          }

          {/* Content - force black text */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-p:text-black prose-li:text-black prose-strong:text-black prose-em:text-black prose-blockquote:text-black prose-h1:text-black prose-h2:text-black prose-h3:text-black prose-h4:text-black prose-h5:text-black prose-h6:text-black prose-figcaption:text-black prose-lead:text-black prose-th:text-black prose-td:text-black"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>

        {/* Image Frame Block */}
        {globalContentBlocks?.imageFrameBlock && (
          <PhotoFrame globalData={globalContentBlocks.imageFrameBlock} />
        )}

        {/* News Carousel Block */}
        {globalContentBlocks?.newsCarousel && (
          <section className="news-carousel-section">
            <div className="news-carousel-container">
              <div className="news-carousel-header">
                <p className="news-carousel-subtitle">{globalContentBlocks.newsCarousel.subtitle}</p>
                <h2 className="news-carousel-title">{globalContentBlocks.newsCarousel.title}</h2>
              </div>

              {(globalContentBlocks.newsCarousel.computedArticles?.length || 0) > 0 ? (
                <div className="news-carousel-list">
                  {globalContentBlocks.newsCarousel.computedArticles.map((article) => {
                    const parts = (article.uri || '').split('/').filter(Boolean);
                    const slugFromUri = parts[parts.length - 1] || '';
                    const nextHref = slugFromUri ? `/news-article/${slugFromUri}` : (article.uri || '#');
                    return (
                      <article key={article.id || article.uri} className="news-card">
                        {article.imageUrl ? (
                          <a href={nextHref} className="news-card-image" aria-label={article.title}>
                            <img src={article.imageUrl} alt={article.imageAlt || article.title} />
                          </a>
                        ) : null}
                        <div className="news-card-content">
                          <h3 className="news-card-title" dangerouslySetInnerHTML={{ __html: article.title }} />
                          {article.excerpt ? (
                            <div className="news-card-excerpt" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                          ) : null}
                          <a href={nextHref} className="news-card-link">Read more →</a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="news-carousel-placeholder">
                  <p>No articles found. Add posts in WordPress or adjust the News Carousel settings.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3 x Columns With Icons */}
        {globalContentBlocks?.columnsWithIcons3X && (
          <section className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                {globalContentBlocks.columnsWithIcons3X.subtitle && (
                  <p className="text-xs tracking-[0.18em] font-semibold uppercase text-black mb-3">
                    {globalContentBlocks.columnsWithIcons3X.subtitle}
                  </p>
                )}
                {globalContentBlocks.columnsWithIcons3X.title && (
                  <h2 className="text-[32px] md:text-[40px] font-bold text-black">
                    {globalContentBlocks.columnsWithIcons3X.title}
                  </h2>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(globalContentBlocks.columnsWithIcons3X.columns || []).map((col, idx) => (
                  <div key={idx} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                    {col.iconClass && (
                      <div className="text-3xl mb-4">
                        <i className={col.iconClass} aria-hidden="true"></i>
                      </div>
                    )}
                    {col.title && (
                      <h3 className="text-xl font-bold text-black mb-2">{col.title}</h3>
                    )}
                    {col.description && (
                      <p className="text-[16px] leading-[1.7] text-black">{col.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}