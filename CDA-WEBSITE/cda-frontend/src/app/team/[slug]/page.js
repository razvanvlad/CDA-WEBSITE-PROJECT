import { getTeamMemberBySlug, getTeamMemberSlugs } from '@/lib/graphql-queries.js'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import HubspotMeetingsScheduler from '@/components/Embeds/HubspotMeetingsScheduler.jsx'

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

    // Derive core fields
    const jobTitle = member?.teamMemberFields?.jobTitle || null
    const shortBio = member?.teamMemberFields?.shortBio || null
    const contactDetails = member?.teamMemberFields?.contactDetails || []
    const profileImage = member?.teamMemberFields?.featuredImage?.node?.sourceUrl || member?.featuredImage?.node?.sourceUrl || null
    const profileAlt = member?.teamMemberFields?.featuredImage?.node?.altText || member?.featuredImage?.node?.altText || member?.title || 'Team member photo'

    return (
      <>
        <Header />
        <article className="min-h-screen bg-white py-16">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <nav className="mb-8">
              <Link href="/team" className="inline-flex items-center gap-2 text-[#111827] hover:text-black">
                <span aria-hidden>←</span> Back To Team Listing
              </Link>
            </nav>

            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Left: Profile Image */}
              <div className="col-span-12 md:col-span-5">
                {profileImage && (
                  <Image
                    src={profileImage}
                    alt={profileAlt}
                    width={600}
                    height={720}
                    className="w-full h-auto rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                  />
                )}
              </div>

              {/* Right: Name, Title, Bio, Contacts */}
              <div className="col-span-12 md:col-span-7">
                {jobTitle && (
                  <p className="text-sm md:text-base font-semibold tracking-wide uppercase text-[#111827] mb-2">{jobTitle}</p>
                )}
                <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">{member.title}</h1>
                {shortBio && (
                  <div className="prose prose-p:mb-4 max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: shortBio }} />
                )}

                {Array.isArray(contactDetails) && contactDetails.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {contactDetails.map((cd, i) => {
                      const iconUrl = cd?.icon?.node?.sourceUrl || null
                      const iconAlt = cd?.icon?.node?.altText || ''
                      const text = cd?.text || ''
                      const url = cd?.url || ''
                      const content = (
                        <span className="inline-flex items-center gap-2">
                          {iconUrl && (<img src={iconUrl} alt={iconAlt} className="w-5 h-5 inline-block" />)}
                          <span>{text}</span>
                        </span>
                      )
                      return (
                        <li key={i} className="text-[#111827]">
                          {url ? (
                            <a href={url} className="hover:underline" target="_blank" rel="noopener noreferrer">{content}</a>
                          ) : content}
                        </li>
                      )
                    })}
                  </ul>
                )}

                {/* Meetings Scheduler moved to full-width section below */}
              </div>
            </div>

            {/* Full-width Booking Form (only for Stuart Alldis - DB ID 884) */}
            {Number(member?.databaseId) === 884 && (
              <section className="relative mt-16">
                <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
                  <div className="relative">
                    <img
                      src="http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/wp-content/uploads/2025/09/Group-9161.svg"
                      alt=""
                      className="hidden md:block absolute -top-6 right-0 w-[200px] h-auto pointer-events-none select-none z-10"
                    />
                    <div className="relative z-0">
                      <HubspotMeetingsScheduler ownerSlug="stuart-alldis" defaultProvider="zoom" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Full content (optional additional information) */}
            {member.content && (
              <div className="max-w-none text-gray-800 leading-relaxed mt-12">
                <div dangerouslySetInnerHTML={{ __html: member.content }} className="team-member-content" />
              </div>
            )}

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

