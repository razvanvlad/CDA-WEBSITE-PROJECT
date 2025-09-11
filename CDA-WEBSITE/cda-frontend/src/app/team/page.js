import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export const revalidate = 300

export const metadata = {
  title: 'Meet Our Team - CDA Agency',
  description: 'Discover the talented team behind CDA Agency. Meet our designers, developers, strategists, and marketing experts dedicated to delivering exceptional results.',
  keywords: ['CDA team', 'digital agency team', 'meet the team', 'web development team', 'marketing experts', 'design team'],
  openGraph: {
    title: 'Meet Our Team - CDA Agency',
    description: 'Get to know the people behind our success — a passionate team delivering outstanding digital experiences.',
    type: 'website',
    images: [
      { url: '/images/team-og.jpg', width: 1200, height: 630, alt: 'CDA Team' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Our Team - CDA Agency',
    description: 'Discover our expert team of designers, developers, and strategists.',
    images: ['/images/team-twitter.jpg'],
  },
  alternates: { canonical: '/team' },
}

export default async function TeamPage() {
  try {

    // Fetch Team page specific content via DB ID (386 by default)
    const GRAPHQL_URL =
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
      'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
    const TEAM_ID = parseInt(process.env.NEXT_PUBLIC_TEAM_PAGE_ID || '386', 10);

    const teamQuery = `{
      page(id: ${TEAM_ID}, idType: DATABASE_ID) {
        id
        title
        databaseId
        uri
        template { __typename templateName }
        teamPageContent {
          __typename
          teamContentSections {
            teamListing {
              sectionTitle
              description
              cta { url title target }
            }
            teamMembers {
              selectedMembers {
                nodes {
                  ... on TeamMember {
                    id
                    title
                    uri
                    featuredImage { node { sourceUrl altText } }
                    teamMemberFields { jobTitle shortBio }
                  }
                }
              }
            }
            meetTheFounder {
              founderImage { node { sourceUrl altText } }
              founderContent {
                name
                title
                bio
                cta { url title target }
              }
            }
            joinOurTeam {
              title
              description
              cta { url title target }
              backgroundImage { node { sourceUrl altText } }
            }
            videoSection {
              videoTitle
              video
              customThumbnail { node { sourceUrl altText } }
            }
          }
        }
      }
    }`;

    const teamResponse = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: teamQuery })
    });
    const teamResult = await teamResponse.json();

    if (teamResult.errors) {
      console.log('Team GraphQL errors:', teamResult.errors);
    }

    const pageData = teamResult?.data?.page || {};
    const sections = pageData?.teamPageContent?.teamContentSections
      || pageData?.teamPageContent?.contentSections
      || {};

    // Fallback if wrapper is not used
    const contentRoot = Object.keys(sections).length > 0
      ? sections
      : (pageData?.teamPageContent || {});

    const teamListing = contentRoot?.teamListing || null;
    const curatedMembers = (contentRoot?.teamMembers?.selectedMembers?.nodes)
      || (contentRoot?.teamMembers?.selectedMembers)
      || [];
    const founder = contentRoot?.meetTheFounder || null;
    const join = contentRoot?.joinOurTeam || null;
    const videoSec = contentRoot?.videoSection || null;

    const listMembers = Array.isArray(curatedMembers) ? curatedMembers : [];

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Team Listing Header (from ACF) */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {teamListing?.sectionTitle || 'Meet Our Team'}
            </h1>
            {teamListing?.description ? (
              <div className="text-xl text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: teamListing.description }} />
            ) : (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The people behind our success — a diverse group of experts dedicated to building meaningful digital experiences.
              </p>
            )}
            {teamListing?.cta?.url && teamListing?.cta?.title && (
              <a
                href={teamListing.cta.url}
                target={teamListing.cta.target || '_self'}
                className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {teamListing.cta.title}
              </a>
            )}
          </div>


          {/* Team members grid (curated or fallback) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
                {member.featuredImage?.node?.sourceUrl && (
                  <div className="relative h-56 w-full">
                    <Image src={member.featuredImage.node.sourceUrl} alt={member.featuredImage.node.altText || member.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{member.title}</h3>
                  {member.teamMemberFields?.jobTitle && (
                    <p className="text-blue-600 text-sm">{member.teamMemberFields.jobTitle}</p>
                  )}
                  {member.teamMemberFields?.shortBio && (
                    <div className="text-gray-600 text-sm mt-2" dangerouslySetInnerHTML={{ __html: member.teamMemberFields.shortBio }} />
                  )}
                </div>
              </div>
            ))}
          </div>


          {/* Meet the Founder */}
          {founder && (founder.founderImage?.node || founder.founderContent?.name) && (
            <section className="mt-20 bg-white rounded-lg shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {founder.founderImage?.node?.sourceUrl && (
                  <div className="relative w-full h-64 md:h-72 rounded-lg overflow-hidden">
                    <Image src={founder.founderImage.node.sourceUrl} alt={founder.founderImage.node.altText || founder.founderContent?.name || 'Founder'} fill className="object-cover" />
                  </div>
                )}
                <div className="md:col-span-2">
                  {founder.founderContent?.name && (
                    <h2 className="text-2xl font-bold text-gray-900">{founder.founderContent.name}</h2>
                  )}
                  {founder.founderContent?.title && (
                    <p className="text-blue-600 font-medium">{founder.founderContent.title}</p>
                  )}
                  {founder.founderContent?.bio && (
                    <div className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: founder.founderContent.bio }} />
                  )}
                  {founder.founderContent?.cta?.url && founder.founderContent?.cta?.title && (
                    <a href={founder.founderContent.cta.url} target={founder.founderContent.cta.target || '_self'} className="inline-block mt-4 px-5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">
                      {founder.founderContent.cta.title}
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Join Our Team */}
          {join && (join.title || join.description || join.cta?.url) && (
            <section className="mt-20 rounded-lg overflow-hidden">
              <div className="relative">
                {join.backgroundImage?.node?.sourceUrl && (
                  <div className="absolute inset-0">
                    <Image src={join.backgroundImage.node.sourceUrl} alt={join.backgroundImage.node.altText || 'Join our team background'} fill className="object-cover" />
                    <div className="absolute inset-0 bg-blue-900/70" />
                  </div>
                )}
                <div className="relative z-10 py-16 text-center text-white bg-blue-900/80">
                  {join.title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{join.title}</h2>}
                  {join.description && <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: join.description }} />}
                  {join.cta?.url && join.cta?.title && (
                    <a href={join.cta.url} target={join.cta.target || '_self'} className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                      {join.cta.title}
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Video Section */}
          {videoSec && (videoSec.video || videoSec.videoTitle) && (
            <section className="mt-20 bg-white rounded-lg shadow-sm p-8">
              {videoSec.videoTitle && (
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{videoSec.videoTitle}</h2>
              )}
              {videoSec.video && (
                <div className="relative max-w-4xl mx-auto">
                  {/(youtube|vimeo)\.com/.test(String(videoSec.video)) ? (
                    <div className="relative pt-[56.25%]">
                      <iframe
                        src={videoSec.video}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={videoSec.videoTitle || 'Team video'}
                      />
                    </div>
                  ) : (
                    <video
                      className="w-full rounded-lg"
                      controls
                      poster={videoSec.customThumbnail?.node?.sourceUrl || undefined}
                    >
                      <source src={videoSec.video} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Team Page Content Status */}
          <div className="mt-20 p-6 bg-blue-50 border border-blue-100 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Team Page Content Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{
                name: 'Team Listing',
                hasData: !!(teamListing?.sectionTitle || teamListing?.description)
              }, {
                name: 'Team Members (Selected)',
                hasData: (curatedMembers?.length || 0) > 0
              }, {
                name: 'Meet the Founder',
                hasData: !!(founder?.founderImage?.node || founder?.founderContent?.name)
              }, {
                name: 'Join Our Team',
                hasData: !!(join?.title || join?.description || join?.cta?.url)
              }, {
                name: 'Video Section',
                hasData: !!(videoSec?.video || videoSec?.videoTitle)
              }].map((item) => (
                <div key={item.name} className={`p-4 rounded-lg border ${item.hasData ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  <div className="text-sm font-medium text-gray-800">{item.name}</div>
                  <div className="text-sm mt-1">Data: {item.hasData ? '✅ Yes' : '❌ No'}</div>
                </div>
              ))}
            </div>
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-blue-900">Debug: Raw Team Page GraphQL payload</summary>
              <pre className="mt-3 text-xs bg-white rounded p-3 overflow-auto border border-blue-100">
                {JSON.stringify({
                  pageId: pageData?.databaseId,
                  uri: pageData?.uri,
                  template: pageData?.template,
                  teamPageContentType: pageData?.teamPageContent?.__typename,
                  contentKeys: Object.keys(contentRoot || {})
                }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error('Error rendering team page:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load Team page.</p>
      </div>
    )
  }
}
