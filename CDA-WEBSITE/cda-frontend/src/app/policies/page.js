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
          <div className="cda-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
              {/* Mobile: Title first, Desktop: Title in left column */}
              <div className="lg:order-1 order-1">
                <ResponsiveUnderlinedTitle
                  as="h1"
                  className="cda-title pb-2 mb-0 lg:mb-10 text-center lg:text-left"
                  underlineColor="#FD8721"
                >
                  Our Policies
                </ResponsiveUnderlinedTitle>
                {/* Desktop: Description in left column */}
                <p className="hidden lg:block text-lg text-[#4B5563] leading-relaxed max-w-2xl">
                  Browse our company policies, terms of service, privacy policy, and other important legal documents.
                  Browse our company policies, terms of service, privacy policy, and other important legal documents.
                </p>
              </div>
              {/* Mobile: Image second, Desktop: Image in right column */}
              <div className="flex justify-center lg:justify-end lg:order-2 order-2 mt-[50px] lg:mt-0">
                <img
                  src="/images/policies.svg"
                  alt="Policies illustration"
                  className="w-[120px] h-[167px] lg:w-full lg:max-w-[600px] lg:max-h-[350px] lg:h-auto object-contain"
                />
              </div>
              {/* Mobile: Description third (full width) */}
              <div className="lg:hidden order-3 col-span-1 mt-[50px]">
                <p className="text-lg text-[#4B5563] leading-relaxed text-center px-5">
                  Browse our company policies, terms of service, privacy policy, and other important legal documents.
                  Browse our company policies, terms of service, privacy policy, and other important legal documents.
                </p>
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
            <div className="cda-container">


              {/* Policies Grid */}
              <div className="policies-grid grid grid-cols-1 gap-6">
                {policies.map((policy) => (
                  <article key={policy.id} className="bg-transparent border-t border-gray-300 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 pl-5 lg:pl-0">
                    <h3 className="text-2xl font-bold text-black text-left">{policy.title}</h3>
                    <a href={`/policies/${policy.slug}`} className="button-l-transparent self-start lg:self-auto">Find Out More</a>
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
          <div className="cda-container">
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

