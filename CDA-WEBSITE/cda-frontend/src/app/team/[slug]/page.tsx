import { getTeamMemberBySlug, getTeamMemberSlugs } from '@/lib/graphql-queries.js'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface TeamMemberPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all team members
export async function generateStaticParams() {
  try {
    const slugs = await getTeamMemberSlugs()
    return slugs.map((slug: string) => ({ slug }))
  } catch (error) {
    console.error('Failed to generate team member params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TeamMemberPageProps) {
  try {
    const { slug } = await params
    const teamMember = await getTeamMemberBySlug(slug)
    
    if (!teamMember) {
      return {
        title: 'Team Member Not Found - CDA',
        description: 'The requested team member could not be found.',
      }
    }

    const jobTitle = teamMember.teamMemberFields?.jobTitle
    const title = jobTitle ? `${teamMember.title} - ${jobTitle}` : teamMember.title

    return {
      title: teamMember.seo?.title || `${title} - CDA Team`,
      description: teamMember.seo?.metaDesc || teamMember.teamMemberFields?.shortBio || `Meet ${teamMember.title}, ${jobTitle || 'team member'} at CDA`,
      openGraph: {
        title,
        description: teamMember.teamMemberFields?.shortBio,
        images: teamMember.seo?.opengraphImage?.sourceUrl ? [teamMember.seo.opengraphImage.sourceUrl] : [],
      },
    }
  } catch (error) {
    console.error('Failed to generate team member metadata:', error)
    return {
      title: 'Team Member - CDA',
      description: 'CDA Team Member Profile',
    }
  }
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  try {
    const { slug } = await params
    const teamMember = await getTeamMemberBySlug(slug)

    if (!teamMember) {
      notFound()
    }

    const { jobTitle, shortBio, fullBio, email, linkedinUrl, skills, featured } = teamMember.teamMemberFields || {}

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                {featured && (
                  <div className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold mb-4">
                    FEATURED TEAM MEMBER
                  </div>
                )}

                {teamMember.departments?.nodes && teamMember.departments.nodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
                    {teamMember.departments.nodes.map((dept: any) => (
                      <span
                        key={dept.id}
                        className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                      >
                        {dept.name}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {teamMember.title}
                </h1>

                {jobTitle && (
                  <p className="text-2xl text-blue-200 font-semibold mb-6">
                    {jobTitle}
                  </p>
                )}

                {shortBio && (
                  <p className="text-lg text-gray-200 mb-8 max-w-2xl">
                    {shortBio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {email && (
                    <Link
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Me
                    </Link>
                  )}

                  {linkedinUrl && (
                    <Link
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </Link>
                  )}
                </div>
              </div>

              {teamMember.featuredImage?.node?.sourceUrl && (
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                    <Image
                      src={teamMember.featuredImage.node.sourceUrl}
                      alt={teamMember.featuredImage.node.altText || teamMember.title}
                      fill
                      className="object-cover rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Skills & Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill: any, index: number) => {
                  const getSkillColor = (level: string) => {
                    switch (level.toLowerCase()) {
                      case 'expert': return 'bg-green-500'
                      case 'advanced': return 'bg-blue-500'
                      case 'intermediate': return 'bg-yellow-500'
                      case 'beginner': return 'bg-gray-400'
                      default: return 'bg-blue-500'
                    }
                  }

                  const getSkillWidth = (level: string) => {
                    switch (level.toLowerCase()) {
                      case 'expert': return 'w-full'
                      case 'advanced': return 'w-4/5'
                      case 'intermediate': return 'w-3/5'
                      case 'beginner': return 'w-2/5'
                      default: return 'w-3/5'
                    }
                  }

                  return (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {skill.name}
                        </h3>
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getSkillColor(skill.level)} ${getSkillWidth(skill.level)}`}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Full Biography */}
        {fullBio && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                About {teamMember.title.split(' ')[0]}
              </h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: fullBio }}
              />
            </div>
          </section>
        )}

        {/* Department Information */}
        {teamMember.departments?.nodes && teamMember.departments.nodes.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Department{teamMember.departments.nodes.length > 1 ? 's' : ''}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMember.departments.nodes.map((dept: any) => (
                  <div key={dept.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {dept.name}
                    </h3>
                    {dept.description && (
                      <p className="text-gray-600">
                        {dept.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6">
              Want to Work with {teamMember.title.split(' ')[0]}?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get in touch to discuss your project and see how {teamMember.title.split(' ')[0]} can help bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {email ? (
                <Link
                  href={`mailto:${email}`}
                  className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Email {teamMember.title.split(' ')[0]}
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Contact Our Team
                </Link>
              )}
              <Link
                href="/team"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        {teamMember.content && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: teamMember.content }}
              />
            </div>
          </section>
        )}
      </div>
    )
  } catch (error) {
    console.error('Failed to load team member:', error)
    notFound()
  }
}