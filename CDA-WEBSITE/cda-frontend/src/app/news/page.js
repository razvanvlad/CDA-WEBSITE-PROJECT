import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
  (process?.env?.NEXT_PUBLIC_WORDPRESS_URL
    ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, '')}/graphql`
    : 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql')

const GET_ALL_BLOGPOSTS = `
  query GetAllBlogPosts($first: Int = 50) {
    blogPosts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
        blogCategories { nodes { name slug } }
      }
    }
  }
`

export const revalidate = 300

async function fetchAllPosts(limit = 50) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_ALL_BLOGPOSTS, variables: { first: limit } }),
    next: { revalidate }
  })
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${res.statusText}`)
  const json = await res.json()
  if (json.errors) console.error('GraphQL errors:', json.errors)
  return json.data?.blogPosts?.nodes || []
}

export default async function NewsArchivePage() {
  const posts = await fetchAllPosts()
  return (
    <>
      <Header />
      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">News & Insights</h1>
            <p className="text-lg text-gray-600">Latest updates and industry insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="relative h-48">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">News</span>
                    {post.blogCategories?.nodes?.[0]?.name && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {post.blogCategories.nodes[0].name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                  {post.excerpt && (
                    <div className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  )}
                  <div className="flex items-center justify-between">
                    <Link href={`/news/${post.slug}`} className="button-without-box">Read More</Link>
                    <time className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No news articles available at the moment.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

