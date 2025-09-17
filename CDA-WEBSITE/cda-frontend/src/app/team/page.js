import { getTeamMembersCoreWithPagination } from '@/lib/graphql-queries.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Our Team - CDA Systems',
  description: 'Meet the CDA team members.',
  alternates: { canonical: '/team' },
}

export const revalidate = 300

export default async function TeamMembersPage() {
  try {
    const { nodes: team } = await getTeamMembersCoreWithPagination({ first: 100 })

    return (
      <>
        <Header />
        <div className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-black mb-6">Our Team</h1>
            <p className="text-[#4B5563] mb-8 max-w-3xl">
              The people who make digital, human.
            </p>

            {team && team.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map(member => (
                  <Link key={member.id} href={`/team/${member.slug}`} className="block group">
                    <div className="bg-gray-50 p-6 border border-gray-200">
                      {member.featuredImage?.node?.sourceUrl && (
                        <div className="relative w-full h-56 mb-4 overflow-hidden">
                          <Image
                            src={member.featuredImage.node.sourceUrl}
                            alt={member.featuredImage.node.altText || member.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-black group-hover:underline">{member.title}</h3>
                      {member.excerpt && (
                        <div className="text-sm text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: member.excerpt }} />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Team Members Found</h2>
                <p className="text-gray-600 mb-4">Once team members are published in WordPress, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error loading team members:', error)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-black mb-6">Our Team</h1>
            <div className="bg-red-50 p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Team Members</h2>
              <p className="text-red-600">Please try again later.</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

