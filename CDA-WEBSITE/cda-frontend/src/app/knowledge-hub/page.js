import { executeGraphQLQuery, GET_ALL_CASE_STUDIES } from '@/lib/graphql-queries.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Knowledge Hub - CDA Resources & Insights',
  description: 'Explore our comprehensive knowledge hub featuring case studies, industry insights, and expert resources to help your business grow.',
  keywords: ['knowledge hub', 'case studies', 'business insights', 'industry resources', 'expert advice'],
  openGraph: {
    title: 'Knowledge Hub - CDA Resources & Insights',
    description: 'Explore our comprehensive knowledge hub featuring case studies, industry insights, and expert resources.',
    type: 'website',
  },
}

// Simple GraphQL query for posts
const GET_ALL_POSTS = `
  query GetAllPosts {
    posts(first: 50) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`

export const revalidate = 300

export default async function KnowledgeHubPage() {
  try {
    // Fetch case studies and posts separately
    const [caseStudiesResponse, postsResponse] = await Promise.all([
      executeGraphQLQuery(GET_ALL_CASE_STUDIES),
      executeGraphQLQuery(GET_ALL_POSTS)
    ])
    
    if (caseStudiesResponse.errors) {
      console.error('Case Studies GraphQL errors:', caseStudiesResponse.errors)
    }
    
    if (postsResponse.errors) {
      console.error('Posts GraphQL errors:', postsResponse.errors)
    }
    
    const caseStudies = caseStudiesResponse.data?.caseStudies?.nodes || []
    const posts = postsResponse.data?.posts?.nodes || []
    
    return (
      <>
        <Header />
        
        <main className="knowledge-hub-page">
          {/* Hero Section */}
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Knowledge Hub
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Explore our comprehensive collection of case studies, insights, and expert resources
                </p>
              </div>
            </div>
          </section>

          {/* Case Studies Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Case Studies</h2>
                <p className="text-xl text-gray-600">Real projects, real results</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((caseStudy) => (
                  <article key={caseStudy.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    {caseStudy.featuredImage?.node?.sourceUrl && (
                      <div className="relative h-48">
                        <Image
                          src={caseStudy.featuredImage.node.sourceUrl}
                          alt={caseStudy.featuredImage.node.altText || caseStudy.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Case Study
                        </span>
                        
                        {caseStudy.projectTypes?.nodes?.[0]?.name && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            {caseStudy.projectTypes.nodes[0].name}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {caseStudy.title}
                      </h3>
                      
                      {caseStudy.excerpt && (
                        <div 
                          className="text-gray-600 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: caseStudy.excerpt }}
                        />
                      )}
                      
                      {caseStudy.caseStudyFields?.projectOverview?.clientName && (
                        <p className="text-sm text-gray-500 mb-4">
                          Client: {caseStudy.caseStudyFields.projectOverview.clientName}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/case-studies/${caseStudy.slug}`}
                          className="button-without-box"
                        >
                          Read More
                        </Link>
                        
                        <time className="text-sm text-gray-500">
                          {new Date(caseStudy.date).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {caseStudies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No case studies available at the moment.</p>
                </div>
              )}
            </div>
          </section>

          {/* News & Insights Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">News & Insights</h2>
                <p className="text-xl text-gray-600">Latest updates and industry insights</p>
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
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          News
                        </span>
                        
                        {post.categories?.nodes?.[0]?.name && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            {post.categories.nodes[0].name}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <div 
                          className="text-gray-600 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/news/${post.slug}`}
                          className="button-without-box"
                        >
                          Read More
                        </Link>
                        
                        <time className="text-sm text-gray-500">
                          {new Date(post.date).toLocaleDateString()}
                        </time>
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
          </section>

        </main>
        
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Failed to load Knowledge Hub:', error)
    
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Knowledge Hub</h1>
            <p className="text-gray-600">Unable to load content. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}