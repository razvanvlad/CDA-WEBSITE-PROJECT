import { executeGraphQLQuery, GET_CASE_STUDIES_WITH_PAGINATION } from '@/lib/graphql-queries.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import KnowledgeHubClient from './KnowledgeHubClient'
import ServicesFilters from '../services/ServicesFilters'

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

// Simple GraphQL query for Blog Posts (custom post type)
const GET_ALL_BLOGPOSTS = `
  query GetAllBlogPosts {
    blogPosts(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
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
        blogCategories {
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
// Fetch case studies (core fields) and blog posts separately
    const [caseStudiesResponse, blogPostsResponse] = await Promise.all([
      executeGraphQLQuery(GET_CASE_STUDIES_WITH_PAGINATION),
      executeGraphQLQuery(GET_ALL_BLOGPOSTS)
    ])
    
    if (caseStudiesResponse.errors) {
      console.error('Case Studies GraphQL errors:', caseStudiesResponse.errors)
    }
    
if (blogPostsResponse.errors) {
      console.error('BlogPosts GraphQL errors:', blogPostsResponse.errors)
    }
    
const caseStudies = caseStudiesResponse.data?.caseStudies?.nodes || []
    const posts = blogPostsResponse.data?.blogPosts?.nodes || []
    
    return (
      <>
        <Header />
        
        <main className="knowledge-hub-page">
          {/* Standard Hero */}
          <section className="bg-white py-16">
            <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h1
                    className="text-4xl md:text-5xl font-bold text-black mb-6"
                    style={{ textDecoration: 'underline', textDecorationColor: '#01E486', textDecorationThickness: '11px' }}
                  >
                    Knowledge Hub
                  </h1>
                  <p className="text-lg text-[#4B5563] leading-relaxed max-w-2xl">Read more news and articles from CDA, here you can also read our case studies.</p>
                </div>
                <div className="flex justify-center lg:justify-end">
<img src="/images/owl.svg" alt="Knowledge Hub illustration" className="w-full max-h-[300px] md:max-w-[520px] lg:max-w-[600px] h-auto object-contain" />
                </div>
              </div>
            </div>
          </section>

          {/* Filter chips (single-select, reuse ServicesFilters) */}
          <ServicesFilters
            theme="light"
            options={[
              { label: 'Case Studies', slug: 'case-studies' },
              { label: 'Company News', slug: 'company-news' },
              { label: 'Digital Marketing', slug: 'digital-marketing' },
              { label: 'Industry Insights', slug: 'industry-insights' },
              { label: 'Technology', slug: 'technology' },
              { label: 'Tutorials & Guides', slug: 'tutorials-guides' },
              { label: 'Web Development', slug: 'web-development' },
            ]}
          />

          {/* Listings (Case Studies + News) with filtering */}
          <KnowledgeHubClient initialCaseStudies={caseStudies} initialPosts={posts} />


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