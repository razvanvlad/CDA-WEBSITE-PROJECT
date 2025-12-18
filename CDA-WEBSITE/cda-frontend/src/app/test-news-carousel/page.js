import Header from '../../components/Header'
import Footer from '../../components/Footer'
import HeroSection from '../../components/GlobalBlocks/HeroSection'
import ResponsiveUnderlinedTitle from '../../components/ResponsiveUnderlinedTitle'
import NewsCarousel from '../../components/GlobalBlocks/NewsCarousel'
import NewsCarouselClient from '../../components/GlobalBlocks/NewsCarouselClient'
import { executeGraphQLQuery, getBlogPostsForCarousel } from '../../lib/graphql-queries'

// ISR revalidation every 5 minutes
export const revalidate = 300

// GraphQL query for global news carousel configuration
const GET_NEWS_CAROUSEL_CONFIG = `
  query GetNewsCarouselConfig {
    globalOptions {
      globalContentBlocks {
        newsCarousel {
          title
          subtitle
          manualArticles {
            nodes {
              ... on BlogPost {
                id
                title
                slug
                uri
                excerpt
                date
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Fetch global news carousel configuration from WordPress
async function fetchNewsCarouselConfig() {
  try {
    const res = await executeGraphQLQuery(GET_NEWS_CAROUSEL_CONFIG)
    return res?.data?.globalOptions?.globalContentBlocks?.newsCarousel || null
  } catch (error) {
    console.error('Error fetching news carousel config:', error)
    return null
  }
}

// Transform blog posts from GraphQL format to NewsCarouselClient format
function transformArticlesForClient(posts) {
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    uri: post.uri,
    date: post.date,
    imageUrl: post.featuredImage?.node?.sourceUrl || '',
    imageAlt: post.featuredImage?.node?.altText || post.title
  }))
}

export default async function TestNewsCarouselPage() {
  // Fetch data in parallel for optimal performance
  const [newsCarouselConfig, recentPosts] = await Promise.all([
    fetchNewsCarouselConfig(),
    getBlogPostsForCarousel(6)
  ])

  // Transform data for NewsCarouselClient component
  const clientArticles = transformArticlesForClient(recentPosts)

  return (
    <>
      <Header />

      {/* Hero Section */}
      <HeroSection
        sectionClassName="bg-white"
        title={
          <ResponsiveUnderlinedTitle
            as="h1"
            className="cda-title"
            underlineColor="#FF60DF"
          >
            NewsCarousel Component Test
          </ResponsiveUnderlinedTitle>
        }
        description="Testing both NewsCarousel.js and NewsCarouselClient.jsx components with live data from WordPress."
        descriptionClassName="text-lg text-gray-600"
        ctas={[
          {
            label: 'View News Page',
            href: '/news',
            className: 'button-l',
          },
          {
            label: 'View Documentation',
            href: '#documentation',
            className: 'button-secondary',
          },
        ]}
        image={
          <img
            src="/images/news-hero.svg"
            alt="News Carousel Test"
            width={600}
            height={400}
            className="cda-hero__image-media"
          />
        }
      />

      <main className="bg-gray-50">
        {/* Section 1: NewsCarousel.js (Global Block Pattern) */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Test 1: NewsCarousel.js (Global Block Pattern)
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Component Details:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>File:</strong> src/components/GlobalBlocks/NewsCarousel.js</li>
                <li>• <strong>Type:</strong> Client Component ('use client')</li>
                <li>• <strong>Data Source:</strong> Global Options → News Carousel Block</li>
                <li>• <strong>Expected Prop:</strong> newsCarousel object with manualArticles.nodes</li>
                <li>• <strong>Features:</strong> Horizontal scroll, navigation buttons, responsive cards</li>
              </ul>
            </div>
          </div>

          {newsCarouselConfig ? (
            <NewsCarousel newsCarousel={newsCarouselConfig} />
          ) : (
            <div className="container mx-auto px-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-800">
                  <strong>Warning:</strong> Global news carousel configuration not found.
                  Please configure it in WordPress Admin → Global Options → News Carousel Block.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-300 my-8"></div>

        {/* Section 2: NewsCarouselClient.jsx (Client Component Pattern) */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Test 2: NewsCarouselClient.jsx (Client Component Pattern)
            </h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Component Details:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>File:</strong> src/components/GlobalBlocks/NewsCarouselClient.jsx</li>
                <li>• <strong>Type:</strong> Client Component ("use client")</li>
                <li>• <strong>Data Source:</strong> Recent blog posts via getBlogPostsForCarousel()</li>
                <li>• <strong>Expected Props:</strong> title, subtitle strings + articles array</li>
                <li>• <strong>Features:</strong> Simplified API, horizontal scroll, prev/next navigation</li>
              </ul>
            </div>
          </div>

          {clientArticles.length > 0 ? (
            <NewsCarouselClient
              title="Latest News & Updates"
              subtitle="Recent Articles"
              articles={clientArticles}
            />
          ) : (
            <div className="container mx-auto px-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-800">
                  <strong>Warning:</strong> No recent blog posts found.
                  Please add some blog posts in WordPress Admin → Blog Posts.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-300 my-8"></div>

        {/* Documentation Section */}
        <section id="documentation" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Component Documentation
            </h2>

            {/* Component Comparison Table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Feature</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">NewsCarousel.js</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">NewsCarouselClient.jsx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Component Type</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Client Component</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Client Component</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Data Structure</td>
                    <td className="px-6 py-4 text-sm text-gray-700">newsCarousel.manualArticles.nodes</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Flat articles array</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Image Property</td>
                    <td className="px-6 py-4 text-sm text-gray-700">featuredImage.node.sourceUrl</td>
                    <td className="px-6 py-4 text-sm text-gray-700">imageUrl (flat)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Navigation</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Left/Right buttons</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Prev/Next buttons</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Use Case</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Global blocks with WordPress ACF</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Dynamic pages with fetched data</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Usage Examples */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">NewsCarousel.js Usage</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-x-auto">{`// Import
import NewsCarousel from '@/components/GlobalBlocks/NewsCarousel'

// Fetch data
const newsCarousel = await fetchNewsCarouselConfig()

// Use component
<NewsCarousel newsCarousel={newsCarousel} />`}</pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">NewsCarouselClient.jsx Usage</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-x-auto">{`// Import
import NewsCarouselClient from '@/components/GlobalBlocks/NewsCarouselClient'

// Fetch and transform data
const posts = await getBlogPostsForCarousel(6)
const articles = transformArticlesForClient(posts)

// Use component
<NewsCarouselClient
  title="Latest News"
  subtitle="Recent"
  articles={articles}
/>`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Debug Information */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Debug Information</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Global News Carousel Configuration
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={newsCarouselConfig ? 'text-green-600' : 'text-red-600'}>
                      {newsCarouselConfig ? '✓ Loaded' : '✗ Not Found'}
                    </span>
                  </p>
                  {newsCarouselConfig && (
                    <>
                      <p><strong>Title:</strong> {newsCarouselConfig.title || 'N/A'}</p>
                      <p><strong>Subtitle:</strong> {newsCarouselConfig.subtitle || 'N/A'}</p>
                      <p><strong>Articles:</strong> {newsCarouselConfig.manualArticles?.nodes?.length || 0}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Blog Posts</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={recentPosts.length > 0 ? 'text-green-600' : 'text-red-600'}>
                      {recentPosts.length > 0 ? '✓ Loaded' : '✗ No Posts'}
                    </span>
                  </p>
                  <p><strong>Posts Count:</strong> {recentPosts.length}</p>
                  <p><strong>Transformed:</strong> {clientArticles.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
