import { getTeamMemberBySlug, getTeamMemberSlugs } from '@/lib/graphql-queries.js'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const slugs = await getTeamMemberSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch (e) {
    console.error('Error generating static params for team members:', e)
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params
  try {
    const member = await getTeamMemberBySlug(slug)
    if (!member) return { title: 'Team Member - CDA Systems' }

    const title = member.title || 'Team Member'
    const description = member.excerpt || 'Meet our team member.'

    return {
      title: `${title} - CDA Systems`,
      description,
      openGraph: {
        title: `${title} - CDA Systems`,
        description,
        type: 'profile',
        ...(member.featuredImage?.node?.sourceUrl && {
          images: [{ url: member.featuredImage.node.sourceUrl, width: 1200, height: 630, alt: member.featuredImage.node.altText || title }]
        })
      },
      alternates: { canonical: `/team/${slug}` }
    }
  } catch (e) {
    console.error('Error generating metadata for team member:', e)
    return { title: 'Team Member - CDA Systems' }
  }
}

export default async function TeamMemberDetailPage({ params }) {
  const { slug } = params
  try {
    const member = await getTeamMemberBySlug(slug)
    if (!member) notFound()

    return (
      <>
        <Header />
        <article className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[900px] px-4 md:px-6 lg:px-8">
            <nav className="mb-8">
              <Link href="/team" className="text-blue-600 hover:text-blue-800">← Back to Team</Link>
            </nav>

            <header className="mb-8">
              <h1 className="text-4xl font-bold text-black mb-4">{member.title}</h1>
              {member.featuredImage?.node?.sourceUrl && (
                <div className="mb-8">
                  <Image
                    src={member.featuredImage.node.sourceUrl}
                    alt={member.featuredImage.node.altText || member.title}
                    width={900}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </header>

            <div className="max-w-none text-gray-800 leading-relaxed">
              {member.content && (
                <div dangerouslySetInnerHTML={{ __html: member.content }} className="team-member-content" />)
              }
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link href="/team" className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200">← All Team Members</Link>
                <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">Work With Us</Link>
              </div>
            </div>
          </div>
        </article>
        {/* Services Slider at end of team member post */}
        {member && (
          <div className="mt-12">
            {(() => { const ServicesSlider = require('../../../components/GlobalBlocks/ServicesSlider.jsx').default; return (
              <ServicesSlider title="You May Also Be Interested In" subtitle="Our Services" />
            ); })()}
          </div>
        )}
        <Footer />
      </>
    )
  } catch (e) {
    console.error('Error loading team member:', e)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[900px] px-4 md:px-6 lg:px-8">
            <div className="bg-red-50 p-8 rounded-lg text-center">
              <h1 className="text-2xl font-bold text-red-700 mb-4">Error Loading Team Member</h1>
              <div className="flex gap-4 justify-center">
                <Link href="/team" className="px-6 py-3 bg-gray-600 text-white hover:bg-gray-700">Back to Team</Link>
                <Link href="/contact" className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

