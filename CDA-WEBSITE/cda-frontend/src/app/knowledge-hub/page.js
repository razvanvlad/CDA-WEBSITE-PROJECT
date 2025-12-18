import { executeGraphQLQuery, GET_CASE_STUDIES_WITH_PAGINATION } from '@/lib/graphql-queries.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import HeroSection from '../../components/GlobalBlocks/HeroSection'
import Link from 'next/link'
import Image from 'next/image'
import KnowledgeHubClient from './KnowledgeHubClient'
import ResponsiveUnderlinedTitle from '@/components/ResponsiveUnderlinedTitle'
import ServicesFilters from '../services/ServicesFilters'
import GlobalTailSections from '@/components/GlobalBlocks/GlobalTailSections.jsx'
import NewsletterSignup from '@/components/GlobalBlocks/NewsletterSignup.js'
import { getGlobalContent } from '@/lib/graphql-queries'
import { Suspense } from 'react'

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
    const [caseStudiesResponse, blogPostsResponse, globalData] = await Promise.all([
      executeGraphQLQuery(GET_CASE_STUDIES_WITH_PAGINATION),
      executeGraphQLQuery(GET_ALL_BLOGPOSTS),
      getGlobalContent()
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
          {/* Hero Section */}
          <HeroSection
            sectionClassName="bg-white"
            title={
              <ResponsiveUnderlinedTitle
                as="h1"
                className="cda-title"
                underlineColor="#01E486"
              >
                Knowledge Hub
              </ResponsiveUnderlinedTitle>
            }
            description="Read more news and articles from CDA. Explore our case studies, industry insights, and expert resources to help your business grow."
            descriptionClassName="text-lg text-gray-600"
            // ctas={[
            //   {
            //     label: 'View Case Studies',
            //     href: '/case-studies',
            //     className: 'button-l',
            //   },
            //   {
            //     label: 'Contact Us',
            //     href: '/contact',
            //     className: 'button-secondary',
            //   },
            // ]}
            image={
              <img
                src="/images/owl.svg"
                alt="Knowledge Hub illustration"
                width={600}
                height={400}
                className="cda-hero__image-media"
              />
            }
          />

          {/* Filter chips (single-select, reuse ServicesFilters) */}
          <Suspense fallback={<div className="max-w-7xl mx-auto px-4 mt-2 mb-8 text-gray-500">Loading filters…</div>}>
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
          </Suspense>

          {/* Listings (Case Studies + News) with filtering */}
          <Suspense fallback={<div className="cda-container py-12 text-gray-500">Loading content…</div>}>
            <KnowledgeHubClient initialCaseStudies={caseStudies} initialPosts={posts} />
          </Suspense>

          {/* Global Tail: keep Showreel via global content */}
          <GlobalTailSections
            globalData={globalData}
            enableApproach={false}
            enableStats={false}
            enableImageFrame={false}
            enableNewsCarousel={false}
            enableColumnsWithIcons3X={false}
            enableValues={false}
            enableWhyCda={false}
            enableServicesAccordion={false}
            enableTechnologiesSlider={false}
            enableShowreel={!!globalData?.showreel}
            enableLocationsImage={false}
            enableNewsletterSignup={false}
            enableContactFormLeftImageRight={false}
            enableJoinOurTeam={false}
            enableFullVideo={false}
          />

          {/* Newsletter Section - Reusable Component */}
          <NewsletterSignup
            globalData={{
              subtitle: 'Stay In The Loop',
              title: 'Sign Up To Our Newsletter'
            }}
            useHubspot={false}
          />


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