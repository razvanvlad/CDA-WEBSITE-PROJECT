import { getTeamMemberBySlug, getTeamMemberSlugs, getTeamMemberDetailsByDbId, getTeamMembersWithPagination, getTeamMembersCoreWithPagination } from '@/lib/graphql-queries.js'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ResponsiveUnderlinedTitle from '../../../components/ResponsiveUnderlinedTitle'
import HeroSection from '../../../components/GlobalBlocks/HeroSection'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import TeamMemberBookingSection from '../../../components/TeamMemberBookingSection'
import TeamMembers from '../../../components/TeamMembers'
import ServicesSlider from '../../../components/GlobalBlocks/ServicesSlider'

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

    // Fetch ALL team members for TeamMembers component
    let allTeam = []
    try {
      const { nodes } = await getTeamMembersWithPagination({ first: 100 })
      if (nodes?.length) allTeam = nodes
      else {
        const coreMembers = await getTeamMembersCoreWithPagination({ first: 100 })
        allTeam = coreMembers?.nodes || []
      }
    } catch (_) { /* ignore */ }
    // Oldest first (ascending by date)
    allTeam = [...allTeam].sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0))

    return (
      <>
        <Header backButton={{ href: '/team', label: 'Back To Team' }} />



        <HeroSection
          reverseLayout={true}
          mobileOrder={{
            title: 1,
            text: 2,
            cta: 3,
            image: 4
          }}
          sectionClassName="bg-white py-10 md:py-12 cda-hero--50-50"
          eyebrow={jobTitle}
          eyebrowClassName="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-2"
          title={
            <ResponsiveUnderlinedTitle
              as="h1"
              className="cda-title"
              underlineColor="#FF5C8A"
            >
              {member.title}
            </ResponsiveUnderlinedTitle>
          }
          description={
            <div>
              {shortBio && (
                <div className="prose prose-p:mb-4 max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: shortBio }} />
              )}
              {Array.isArray(contactDetails) && contactDetails.length > 0 && (
                <ul className="flex flex-wrap gap-4 mt-6">
                  {contactDetails.map((cd, i) => {
                    const iconUrl = cd?.icon?.node?.sourceUrl || null
                    const iconAlt = cd?.icon?.node?.altText || ''
                    const text = cd?.text || ''
                    const url = cd?.url || ''
                    const content = (
                      <span className="inline-flex items-center gap-2">
                        {iconUrl && <img src={iconUrl} alt={iconAlt} className="w-5 h-5 inline-block" />}
                        <span className="text-[#111827]">{text}</span>
                      </span>
                    )
                    return (
                      <li key={i}>
                        {url ? (
                          <a href={url} className="hover:underline" target="_blank" rel="noopener noreferrer">{content}</a>
                        ) : content}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          }
          image={profileImage && (
            <Image
              src={profileImage}
              alt={profileAlt}
              width={788}
              height={770}
              className="w-full h-auto object-cover object-center rounded-lg"
            />
          )}
        />

        {/* Booking Section with Modal (only for Stuart Alldis - DB ID 884) */}
        {Number(core?.databaseId) === 884 && (
          <TeamMemberBookingSection ownerSlug="stuart-alldis" defaultProvider="zoom" />
        )}

        {/* Team Members Section (below booking form) */}
        <TeamMembers
          subtitle="Our Team"
          title="Meet More of the Team"
          teamMembers={allTeam}
        />

        {/* Services Slider at end of team member post */}
        <ServicesSlider
          title="You May Also Be Interested In"
          subtitle="Our Services"
        />
        <Footer />
      </>
    )
  } catch (e) {
    console.error('Error loading team member:', e)
    // Show global custom 404 instead of local fallback
    notFound()
  }
}

