import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { sanitizeTitleHtml } from '@/lib/sanitizeTitleHtml'
import { executeGraphQLQuery, getGlobalContent, getPageGlobalTogglesByUri, getPageGlobalTogglesBySlug, getTeamMembersWithPagination, getTeamMembersCoreWithPagination } from '@/lib/graphql-queries'

export const metadata = {
  title: 'Team - CDA Systems',
  description: 'Meet the founder and our team at CDA.',
  alternates: { canonical: '/team' },
}

export const revalidate = 300

export default async function TeamPage() {
  // Resolve Team page ID from env or default
  const TEAM_PAGE_ID = String(process.env.NEXT_PUBLIC_TEAM_PAGE_ID || '386')

  // Fetch global blocks (for Join Our Team + Full Video)
  const globalData = await getGlobalContent()

  // Per-page Global Toggles for Team page (URI then slug)
  let toggles = await getPageGlobalTogglesByUri('/index.php/team/')
  if (!toggles) toggles = await getPageGlobalTogglesByUri('/team/')
  if (!toggles) toggles = await getPageGlobalTogglesBySlug('team')
  const knownKeys = [
    'showApproach','showCaseStudies','showImageFrame','showNewsCarousel','showThreeColumns','showValues','showWhyCda','showServicesAccordion','showTechnologiesSlider','showShowreel','showLocationsImage','showNewsletterSignup','showContactFormLeftImageRight','showJoinOurTeam','showFullVideo','showStatsAndNumbers','showCultureGallerySlider'
  ]
  const hasAny = toggles && typeof toggles === 'object' && knownKeys.some(k => Object.prototype.hasOwnProperty.call(toggles, k))
  const t = hasAny ? toggles : Object.fromEntries(knownKeys.map(k => [k, true]))

  // Fetch Team page content via provided working query
  const GET_TEAM_PAGE = `
    query GetTeamPageContent($id: ID!) {
      page(id: $id, idType: DATABASE_ID) {
        id
        title
        date
        ... on NodeWithFeaturedImage {
          featuredImage { node { sourceUrl altText } }
        }
        ... on Page {
          team {
            teamPageHeader {
              title
              description
              cta { url title target }
              image { node { sourceUrl altText } }
            }
            meetTheFounder {
              image { node { sourceUrl altText } }
              subtitle
              title
              description
              cta { url title target }
            }
            meetTheTeam {
              subtitle
              title
              teamListing {
                nodes {
                  ... on TeamMember {
                    id
                    title
                    slug
                    teamMemberFields {
                      jobTitle
                      shortBio
                      featuredImage { node { sourceUrl altText } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  const teamRes = await executeGraphQLQuery(GET_TEAM_PAGE, { id: TEAM_PAGE_ID })
  let teamData = teamRes?.data?.page?.team || null
  const teamResErrors = teamRes?.errors || null

  // Fallback: fetch by URI if DB ID query didn’t return team data
  if (!teamData) {
    const GET_TEAM_BY_URI = `
      query GetTeamByUri($uri: ID!) {
        page(id: $uri, idType: URI) {
          ... on Page {
            team {
              teamPageHeader { title description cta { url title target } image { node { sourceUrl altText } } }
              meetTheFounder { image { node { sourceUrl altText } } subtitle title description cta { url title target } }
              meetTheTeam {
                subtitle
                title
                teamListing {
                  nodes {
                    ... on TeamMember {
                      id
                      title
                      slug
                      teamMemberFields { jobTitle shortBio featuredImage { node { sourceUrl altText } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    const URIS = ['/index.php/team/', '/team/']
    var fallbackErrors = []
    for (const uri of URIS) {
      try {
        const byUri = await executeGraphQLQuery(GET_TEAM_BY_URI, { uri })
        if (byUri?.errors) fallbackErrors.push(byUri.errors)
        const cand = byUri?.data?.page?.team || null
        if (cand) { teamData = cand; break }
      } catch (e) { /* continue */ }
    }
  }

  teamData = teamData || {}

  const header = teamData?.teamPageHeader || null
  const founder = teamData?.meetTheFounder || null
  const meet = teamData?.meetTheTeam || null
  // Fetch ALL team members (standalone) to render a full grid
  let allTeam = []
  try {
    const { nodes } = await getTeamMembersWithPagination({ first: 100 })
    if (nodes?.length) allTeam = nodes
    else {
      const core = await getTeamMembersCoreWithPagination({ first: 100 })
      allTeam = core?.nodes || []
    }
  } catch (_) { /* ignore */ }
  // Oldest first (ascending by date)
  allTeam = [...allTeam].sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0))

  const debug = { hasHeader: !!header, hasFounder: !!founder, teamCount: allTeam.length, gqlErrors: teamResErrors || null, fallbackErrors: (typeof fallbackErrors !== 'undefined' ? fallbackErrors : null) }

  return (
    <>
      <Header />

      {/* 1) Hero Individual (reuse homepage hero classes) */}
      {header && (
        <section className="home-hero-section bg-white">
          <div className="home-header-grid mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="home-header-text text-center md:text-left">
              <h1 className="cda-page-title title-large-light-blue" dangerouslySetInnerHTML={{ __html: sanitizeTitleHtml(header.title || 'Team') }} />
              {header.description && (
                <div className="home-hero-subtitle" dangerouslySetInnerHTML={{ __html: header.description }} />
              )}
              {header.cta?.url && (
                <div className="home-header-cta home-hero-cta">
                  <a href={header.cta.url} className="button-l" target={header.cta.target || '_self'}>
                    {header.cta.title || 'Contact Us'}
                  </a>
                </div>
              )}
            </div>
            <div className="home-header-illustration-wrap">
              {header.image?.node?.sourceUrl ? (
                <img src={header.image.node.sourceUrl} alt={header.image.node.altText || 'Team illustration'} width={700} height={520} className="home-header-illustration" />
              ) : (
                <div className="home-hero-illustration-placeholder"><p>Upload illustration in WP → Team → Header Section</p></div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2) Meet the founder */}
      {founder && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-center">
              <div className="col-span-12 md:col-span-6">
                {founder.image?.node?.sourceUrl && (
                  <img src={founder.image.node.sourceUrl} alt={founder.image.node.altText || 'Founder'} width={485} height={586} className="w-[485px] h-[586px] object-contain rounded" />
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                {founder.subtitle && (<p className="cda-subtitle mb-2">{founder.subtitle}</p>)}
                {founder.title && (<h2 className="cda-title mb-4" style={{ textDecoration: 'none' }}>{founder.title}</h2>)}
                {founder.description && (
                  <div className="wysiwyg-content text-[16px] md:text-[18px] leading-[1.7] text-[#4B5563] mb-6" dangerouslySetInnerHTML={{ __html: founder.description }} />
                )}
                {founder.cta?.url && (
                  <a href={founder.cta.url} target={founder.cta.target || '_self'} className="button-without-box">{founder.cta.title || 'Learn More'}</a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3) Meet the team */}
      {meet && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="mb-8">
              {meet.subtitle && (<p className="cda-subtitle">{meet.subtitle}</p>)}
              {meet.title && (<h2 className="cda-title title-small-purple">{meet.title}</h2>)}
            </div>
            {allTeam && allTeam.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allTeam.map((m) => {
                  const img = m?.featuredImage?.node || m?.teamMemberFields?.featuredImage?.node
                  const alt = img?.altText || m?.title
                  const job = m?.teamMemberFields?.jobTitle || m?.jobTitle || ''
                  return (
                    <div key={m.id} className="w-full flex-shrink-0">
                      <div className="block group text-center">
                        <Link href={`/team/${m.slug}`} className="block">
                          <div className="relative w-full pb-[100%] bg-gray-100 overflow-hidden rounded-md">
                            {img?.sourceUrl && (
                              <Image src={img.sourceUrl} alt={alt} fill className="object-cover" />
                            )}
                          </div>
                          <div className="mt-3">
                            <div className="font-semibold text-black leading-tight group-hover:underline">{m.title}</div>
                            {job && <div className="text-sm text-gray-600">{job}</div>}
                          </div>
                        </Link>
                        <div className="mt-3">
                          <Link href={`/team/${m.slug}`} className="inline-flex items-center gap-2 font-semibold text-black hover:underline">
                            <span>View Profile</span>
                            <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No team members found</h3>
                <p className="text-gray-600">Add team members in WP → Team Members.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4) [Global] Join Our Team (toggle-controlled) */}
      {t.showJoinOurTeam && globalData?.joinOurTeam && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {globalData.joinOurTeam.title && (
                <h2 className="text-3xl font-bold text-black mb-4">{globalData.joinOurTeam.title}</h2>
              )}
              {globalData.joinOurTeam.text && (
                <div className="prose prose-sm max-w-none text-black" dangerouslySetInnerHTML={{ __html: globalData.joinOurTeam.text }} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {globalData.joinOurTeam.leftImage?.node?.sourceUrl && (
                <img src={globalData.joinOurTeam.leftImage.node.sourceUrl} alt={globalData.joinOurTeam.leftImage.node.altText || ''} className="w-full h-auto rounded" />
              )}
              {globalData.joinOurTeam.rightImage?.node?.sourceUrl && (
                <img src={globalData.joinOurTeam.rightImage.node.sourceUrl} alt={globalData.joinOurTeam.rightImage.node.altText || ''} className="w-full h-auto rounded" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5) [Global] Video (toggle-controlled) */}
      {t.showFullVideo && globalData?.fullVideo && (
        <section className="py-16 bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-4">
            {(() => {
              const raw = globalData.fullVideo.file?.node?.sourceUrl || globalData.fullVideo.url
              if (!raw) return null
              const isVimeo = /vimeo\.com/.test(raw)
              const isYouTube = /youtube\.com|youtu\.be/.test(raw)
              if (isVimeo || isYouTube) {
                let embedUrl = raw
                if (isVimeo) {
                  const m = raw.match(/vimeo\.com\/(?:video\/)?(?:.+\/)?(\d+)/)
                  const id = m && m[1]
                  if (id) embedUrl = `https://player.vimeo.com/video/${id}`
                }
                return (
                  <div className="aspect-video w-full rounded overflow-hidden">
                    <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                  </div>
                )
              }
              return (
                <video className="w-full rounded-lg" controls>
                  <source src={raw} />
                </video>
              )
            })()}
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}

