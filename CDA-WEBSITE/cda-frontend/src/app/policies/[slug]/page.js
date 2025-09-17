import { getPolicyBySlug, getPolicySlugs } from '@/lib/graphql-queries.js'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 300

// Generate static params for all policy slugs
export async function generateStaticParams() {
  try {
    const slugs = await getPolicySlugs()
    return slugs.map((slug) => ({ slug }))
  } catch (error) {
    console.error('Error generating static params for policies:', error)
    return []
  }
}

// Generate metadata for individual policy
export async function generateMetadata({ params }) {
  const { slug } = params
  
  try {
    const policy = await getPolicyBySlug(slug)
    
    if (!policy) {
      return {
        title: 'Policy Not Found',
        description: 'The requested policy could not be found.'
      }
    }

    const title = policy.title || 'Policy'
    const description = policy.excerpt || 'Company policy document'
    
    return {
      title: `${title} - CDA Systems`,
      description,
      keywords: ['policy', 'legal document', 'company policy', title.toLowerCase()],
      openGraph: {
        title: `${title} - CDA Systems`,
        description,
        type: 'article',
        ...(policy.featuredImage?.node?.sourceUrl && {
          images: [{
            url: policy.featuredImage.node.sourceUrl,
            width: 1200,
            height: 630,
            alt: policy.featuredImage.node.altText || title
          }]
        })
      },
      alternates: { canonical: `/policies/${slug}` }
    }
  } catch (error) {
    console.error('Error generating metadata for policy:', error)
    return {
      title: 'Policy - CDA Systems',
      description: 'Company policy document'
    }
  }
}

export default async function PolicyDetailPage({ params }) {
  const { slug } = params
  
  try {
    const policy = await getPolicyBySlug(slug)
    
    if (!policy) {
      notFound()
    }

    const policyTitle = policy.title
    const policyDescription = policy.content
    const lastUpdated = null
    const effectiveDate = null

    return (
      <>
        <Header />
        <article className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[900px] px-4 md:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link href="/policies" className="text-blue-600 hover:text-blue-800">
                ← Back to Policies
              </Link>
            </nav>

            {/* Policy Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-black mb-4">{policyTitle}</h1>
              
              {/* Policy Dates */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                {effectiveDate && (
                  <div>
                    <span className="font-semibold">Effective Date:</span>{' '}
                    {new Date(effectiveDate).toLocaleDateString()}
                  </div>
                )}
                {lastUpdated && (
                  <div>
                    <span className="font-semibold">Last Updated:</span>{' '}
                    {new Date(lastUpdated).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Featured Image */}
              {policy.featuredImage?.node?.sourceUrl && (
                <div className="mb-8">
                  <Image
                    src={policy.featuredImage.node.sourceUrl}
                    alt={policy.featuredImage.node.altText || policyTitle}
                    width={900}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </header>

            {/* Policy Content */}
            <div className="max-w-none">
              {policyDescription && (
                <div 
                  dangerouslySetInnerHTML={{ __html: policyDescription }}
                  className="policy-content text-gray-800 leading-relaxed"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link 
                  href="/policies"
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ← All Policies
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Questions? Contact Us
                </Link>
              </div>
            </div>
          </div>
        </article>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error loading policy:', error)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[900px] px-4 md:px-6 lg:px-8">
            <div className="bg-red-50 p-8 rounded-lg text-center">
              <h1 className="text-2xl font-bold text-red-700 mb-4">Error Loading Policy</h1>
              <p className="text-red-600 mb-6">
                We're having trouble loading this policy right now. Please try again later.
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/policies"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Policies
                </Link>
                <Link 
                  href="/contact"
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

