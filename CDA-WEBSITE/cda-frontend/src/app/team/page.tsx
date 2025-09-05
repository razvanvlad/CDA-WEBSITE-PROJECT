import { getTeamMembersWithPagination, executeGraphQLQuery } from '@/lib/graphql-queries'
import { getPaginationFromSearchParams } from '@/lib/pagination-utils'
import Pagination from '@/components/Pagination'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Our Team - Meet the CDA Experts',
  description: 'Meet our talented team of experienced developers, creative designers, digital marketing experts, and business consultants. Get to know the professionals behind our successful projects and innovative solutions.',
  keywords: ['team members', 'web developers', 'digital marketing experts', 'business consultants', 'design team', 'about our team', 'company professionals'],
  openGraph: {
    title: 'Our Team - Meet the CDA Experts',
    description: 'Meet our talented team of experienced developers, designers, digital marketing experts, and business consultants behind our successful projects.',
    type: 'website',
    images: [
      {
        url: '/images/team-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CDA Team - Professional Developers and Consultants'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Team - Meet the CDA Experts',
    description: 'Meet our talented team of developers, designers, and digital marketing experts.',
    images: ['/images/team-twitter.jpg']
  },
  alternates: {
    canonical: '/team'
  }
}

interface TeamPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Get all departments for filtering
async function getDepartments() {
  const query = `
    query GetDepartments {
      departments {
        nodes {
          id
          name
          slug
          count
          description
        }
      }
    }
  `
  
  try {
    const response = await executeGraphQLQuery(query)
    return response.data?.departments?.nodes || []
  } catch (error) {
    console.error('Failed to fetch departments:', error)
    return []
  }
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  try {
    // Await search parameters for Next.js 15+
    const awaitedSearchParams = await searchParams
    
    // Parse search parameters
    const searchParamsObj = new URLSearchParams()
    Object.entries(awaitedSearchParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParamsObj.append(key, v))
        } else {
          searchParamsObj.set(key, value)
        }
      }
    })

    // Get pagination info
    const { currentPage, itemsPerPage, offset } = getPaginationFromSearchParams(searchParamsObj, 12)
    
    // Get filters
    const searchQuery = searchParamsObj.get('search') || ''
    const departmentFilter = searchParamsObj.getAll('department')
    const featuredOnly = searchParamsObj.get('featured') === 'true'
    
    // Fetch team members with pagination
    const { nodes: teamMembers, pageInfo } = await getTeamMembersWithPagination({
      first: itemsPerPage,
      search: searchQuery || undefined
    })
    
    const total = teamMembers.length // Simplified total count

    // Fetch departments for filtering
    const departments = await getDepartments()

    // Calculate pagination
    const totalPages = Math.ceil(total / itemsPerPage)

    // Separate featured and regular team members for display
    const featuredMembers = teamMembers.filter((member: any) => member.teamMemberFields?.featured && !featuredOnly)
    const regularMembers = featuredOnly ? teamMembers : teamMembers.filter((member: any) => !member.teamMemberFields?.featured)

    // Group team members by department for organized display
    const membersByDepartment: { [key: string]: any[] } = {}
    
    if (!featuredOnly && !searchQuery && departmentFilter.length === 0) {
      // Only group by department when no filters are applied
      regularMembers.forEach((member: any) => {
        const memberDepartments = member.departments?.nodes || []
        if (memberDepartments.length === 0) {
          if (!membersByDepartment['Other']) membersByDepartment['Other'] = []
          membersByDepartment['Other'].push(member)
        } else {
          memberDepartments.forEach((dept: any) => {
            if (!membersByDepartment[dept.name]) membersByDepartment[dept.name] = []
            membersByDepartment[dept.name].push(member)
          })
        }
      })
    }

    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our talented team of experts is passionate about delivering exceptional results and helping businesses thrive in the digital world.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form method="GET" className="space-y-4">
              {/* Search Bar */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Team Members
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search by name, role, or expertise..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Filter */}
                {departments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Department
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept: any) => (
                        <label key={dept.id} className="flex items-center">
                          <input
                            type="checkbox"
                            name="department"
                            value={dept.id}
                            defaultChecked={departmentFilter.includes(dept.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {dept.name} ({dept.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Options
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      value="true"
                      defaultChecked={featuredOnly}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Show only featured team members
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Apply Filters
                </button>
                <Link
                  href="/team"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            </form>
          </div>

          {/* Results Summary */}
          {total > 0 && (
            <div className="mb-6">
              <p className="text-gray-600">
                {searchQuery || departmentFilter.length > 0 || featuredOnly ? (
                  <>
                    Showing {teamMembers.length} of {total} team members
                    {searchQuery && <span> matching "{searchQuery}"</span>}
                    {departmentFilter.length > 0 && (
                      <span> in {departmentFilter.length} selected departments</span>
                    )}
                    {featuredOnly && <span> (featured only)</span>}
                  </>
                ) : (
                  `Meet all ${total} team members`
                )}
              </p>
            </div>
          )}

          {/* Featured Team Members (only if not filtered) */}
          {!featuredOnly && featuredMembers.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredMembers.map((member: any) => (
                  <Link 
                    key={member.id}
                    href={`/team/${member.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                          FEATURED
                        </span>
                      </div>

                      {member.featuredImage?.node?.sourceUrl && (
                        <div className="relative h-80 w-full">
                          <Image
                            src={member.featuredImage.node.sourceUrl}
                            alt={member.featuredImage.node.altText || member.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {member.departments?.nodes?.map((dept: any) => (
                            <span 
                              key={dept.id}
                              className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                            >
                              {dept.name}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {member.title}
                        </h2>

                        {member.teamMemberFields?.jobTitle && (
                          <p className="text-blue-600 font-medium mb-3">
                            {member.teamMemberFields.jobTitle}
                          </p>
                        )}

                        {member.teamMemberFields?.shortBio && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {member.teamMemberFields.shortBio}
                          </p>
                        )}

                        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-800">
                          View profile
                          <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Team Members Display */}
          {teamMembers.length > 0 ? (
            <>
              {/* Organized by Department (when no filters) */}
              {Object.keys(membersByDepartment).length > 0 ? (
                <div className="space-y-12 mb-12">
                  {Object.entries(membersByDepartment).map(([deptName, members]) => (
                    <div key={deptName}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {deptName} Team
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map((member: any) => (
                          <Link 
                            key={member.id}
                            href={`/team/${member.slug}`}
                            className="group block"
                          >
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                              {member.featuredImage?.node?.sourceUrl && (
                                <div className="relative h-64 w-full">
                                  <Image
                                    src={member.featuredImage.node.sourceUrl}
                                    alt={member.featuredImage.node.altText || member.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              
                              <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                  {member.title}
                                </h3>

                                {member.teamMemberFields?.jobTitle && (
                                  <p className="text-blue-600 font-medium text-sm mb-2">
                                    {member.teamMemberFields.jobTitle}
                                  </p>
                                )}

                                {member.teamMemberFields?.shortBio && (
                                  <p className="text-gray-600 text-sm line-clamp-2">
                                    {member.teamMemberFields.shortBio}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Grid Layout (when filters applied) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {(featuredOnly ? teamMembers : regularMembers).map((member: any) => (
                    <Link 
                      key={member.id}
                      href={`/team/${member.slug}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative">
                        {member.teamMemberFields?.featured && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="inline-block px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                              FEATURED
                            </span>
                          </div>
                        )}

                        {member.featuredImage?.node?.sourceUrl && (
                          <div className="relative h-64 w-full">
                            <Image
                              src={member.featuredImage.node.sourceUrl}
                              alt={member.featuredImage.node.altText || member.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-2">
                            {member.departments?.nodes?.slice(0, 2).map((dept: any) => (
                              <span 
                                key={dept.id}
                                className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded"
                              >
                                {dept.name}
                              </span>
                            ))}
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {member.title}
                          </h3>

                          {member.teamMemberFields?.jobTitle && (
                            <p className="text-blue-600 font-medium text-sm mb-2">
                              {member.teamMemberFields.jobTitle}
                            </p>
                          )}

                          {member.teamMemberFields?.shortBio && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {member.teamMemberFields.shortBio}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={total}
                    itemsPerPage={itemsPerPage}
                    basePath="/team"
                    searchParams={searchParamsObj}
                  />
                </div>
              )}
            </>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No team members found</h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery || departmentFilter.length > 0 || featuredOnly
                    ? "Try adjusting your search criteria or clearing filters."
                    : "Team member profiles will be available soon."
                  }
                </p>
                {(searchQuery || departmentFilter.length > 0 || featuredOnly) && (
                  <Link
                    href="/team"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Team Members
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <section className="mt-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Join Our Team?</h2>
            <p className="text-xl text-purple-100 mb-8">
              We're always looking for talented individuals to join our growing team and help us deliver exceptional results for our clients.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/services"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors"
              >
                See Our Work
              </Link>
            </div>
          </section>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load team members:', error)
    notFound()
  }
}