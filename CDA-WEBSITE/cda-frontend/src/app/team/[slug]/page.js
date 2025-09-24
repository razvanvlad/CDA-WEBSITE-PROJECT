import { getTeamMemberBySlug, getTeamMemberSlugs, getTeamMemberDetailsByDbId } from '@/lib/graphql-queries.js'
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
  const { slug } = await params
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
  const { slug } = await params
  try {
    const core = await getTeamMemberBySlug(slug)
    if (!core) notFound()

    // Fetch full details by DB ID using the working query
    const details = core?.databaseId ? await getTeamMemberDetailsByDbId(core.databaseId) : null
    const member = details || core

    // Derive fields
    const jobTitle = member?.teamMemberFields?.jobTitle || null
    const shortBio = member?.teamMemberFields?.shortBio || null
    const contactDetails = member?.teamMemberFields?.contactDetails || []
    const profileImage = member?.teamMemberFields?.featuredImage?.node?.sourceUrl || member?.featuredImage?.node?.sourceUrl || null
    const profileAlt = member?.teamMemberFields?.featuredImage?.node?.altText || member?.featuredImage?.node?.altText || member?.title || 'Team member photo'

    return (
      <>
        <Header />
        <article className="min-h-screen bg-white py-20 md:py-24">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <nav className="mb-8">
              <Link href="/team" className="inline-flex items-center gap-2 text-[#111827] hover:text-black">
                <span aria-hidden>←</span> Back To Team Listing
              </Link>
            </nav>

            <div className="grid grid-cols-12 gap-y-10 gap-x-10 items-start md:items-center">
              {/* Left: Profile Image */}
              <div className="col-span-12 md:col-span-5">
                {profileImage && (
                  <Image
                    src={profileImage}
                    alt={profileAlt}
                    width={788}
                    height={770}
                    className="w-[353px] h-[393px] md:w-[788px] md:h-[770px] object-cover object-center rounded-lg"
                  />
                )}
              </div>

              {/* Right: Name, Title, Bio, Contacts */}
              <div className="col-span-12 md:col-span-7">
                <h1
                  className="service-hero-title text-4xl lg:text-5xl font-bold mb-6"
                  style={{ textDecoration: 'underline', textDecorationColor: '#FF5C8A', textDecorationThickness: '11px' }}
                >
                  {member.title} {jobTitle ? (<span className="block lg:inline">{jobTitle}</span>) : null}
                </h1>
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
            {Number(core?.databaseId) === 884 && (
              <div className="mt-16">
                <HubspotMeetingsScheduler ownerSlug="stuart-alldis" defaultProvider="zoom" memberName={member.title} jobTitle={jobTitle || ''} />
              </div>
            )}
            
          </div> 
        </article>

        {/* Team Members Slider (below booking form) */}
        {member && (
          <div className="bg-white">
            {(() => { const TeamMembersSlider = require('../../../components/GlobalBlocks/TeamMembersSlider.jsx').default; return (
              <TeamMembersSlider title="Meet More of the Team" subtitle="Our Team" />
            ); })()}
          </div>
        )}

        {/* Services Slider at end of team member post */}
        {member && (
          <div className="bg-white">
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
    // Show global custom 404 instead of local fallback
    notFound()
  }
}

