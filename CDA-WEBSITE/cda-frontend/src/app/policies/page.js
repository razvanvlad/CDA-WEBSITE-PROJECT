import { getPoliciesWithPagination } from '@/lib/graphql-queries.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import ResponsiveUnderlinedTitle from '@/components/ResponsiveUnderlinedTitle'

export const metadata = {
  title: 'Policies - CDA Systems',
  description: 'Browse our company policies, terms of service, privacy policy, and other legal documents.',
  keywords: ['policies', 'legal documents', 'privacy policy', 'terms of service', 'company policies'],
  openGraph: {
    title: 'Policies - CDA Systems',
    description: 'Browse our company policies, terms of service, privacy policy, and other legal documents.',
    type: 'website',
  },
  alternates: { canonical: '/policies' },
}

export const revalidate = 300

export default async function PoliciesLandingPage() {
  try {
    const { nodes: policies } = await getPoliciesWithPagination({ first: 100 })

    return (
      <>
        <Header />
        <div className="bg-white py-16">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <ResponsiveUnderlinedTitle
                  as="h1"
                  className="cda-title pb-10 mb-10"
                  underlineColor="#FD8721"
                >
                  Our Policies
                </ResponsiveUnderlinedTitle>
                <p className="text-lg text-[#4B5563] leading-relaxed max-w-2xl">
                  Browse our company policies, terms of service, privacy policy, and other important legal documents.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img src="/images/policies.svg" alt="Policies illustration" className="w-full max-w-[600px] max-h-[350px] h-auto object-contain" />
              </div>
            </div>

            {policies && policies.length > 0 ? (
              <></>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Policies Found</h2>
                <p className="text-gray-600 mb-4">
                  Policies haven't been added yet. Check back later or contact us if you need specific policy information.
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Policies Listing Section with Full-Width Gray Background */}
        {policies && policies.length > 0 && (
          <div className="policies-section w-full bg-[#F4F4F4] py-16">
            <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">


              {/* Policies Grid */}
              <div className="policies-grid grid grid-cols-1 gap-6">
                {policies.map((policy) => (
                  <article key={policy.id} className="bg-transparent border-t border-gray-300 py-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-black">{policy.title}</h3>
                    <a href={`/policies/${policy.slug}`} className="button-l-transparent">Find Out More</a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error loading policies:', error)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-black mb-6">Policies</h1>
            <div className="bg-red-50 p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Policies</h2>
              <p className="text-red-600 mb-4">
                We're having trouble loading our policies right now. Please try again later.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

