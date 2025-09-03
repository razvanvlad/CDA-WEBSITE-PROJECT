'use client';

import { useEffect, useState } from 'react';
import client from '../lib/graphql/client';
import { GET_TEAM_PAGE_CONTENT, GET_ALL_TEAM_MEMBERS } from '../lib/graphql/queries';

export default function TeamListing() {
  const [teamData, setTeamData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch team page content and team members in parallel
        const [pageResponse, membersResponse] = await Promise.all([
          client.query({
            query: GET_TEAM_PAGE_CONTENT,
            variables: { uri: "team" },
            errorPolicy: 'all'
          }),
          client.query({
            query: GET_ALL_TEAM_MEMBERS,
            errorPolicy: 'all'
          })
        ]);
        
        if (pageResponse.errors) {
          console.warn('Team page errors:', pageResponse.errors);
        }
        
        if (membersResponse.errors) {
          console.warn('Team members errors:', membersResponse.errors);
        }
        
        setTeamData(pageResponse.data);
        setTeamMembers(membersResponse.data?.teamMembers?.nodes || []);
      } catch (err) {
        setError(err);
        console.error('Error fetching team data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Team Data</h2>
          <pre className="text-red-600 text-sm overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  const teamContent = teamData?.page?.teamPageContent;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Content Page Header */}
      {teamContent?.contentPageHeader && (
        <section className="py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {teamContent.contentPageHeader.title}
              </h1>
              <div 
                className="text-gray-600 mb-8 prose"
                dangerouslySetInnerHTML={{ __html: teamContent.contentPageHeader.text }}
              />
              {teamContent.contentPageHeader.cta && (
                <a 
                  href={teamContent.contentPageHeader.cta.url} 
                  className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  {teamContent.contentPageHeader.cta.title}
                </a>
              )}
            </div>
            <div className="lg:w-1/2">
              {teamContent.contentPageHeader.imageWithFrame && (
                <div className="relative">
                  <img 
                    src="/images/Photo-Frame.png" 
                    alt="Frame" 
                    className="absolute inset-0 z-10 w-full h-full object-contain"
                  />
                  <img 
                    src={teamContent.contentPageHeader.imageWithFrame.sourceUrl} 
                    alt={teamContent.contentPageHeader.imageWithFrame.altText || ''}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Meet the Founder Section */}
      {teamContent?.founderSection && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                {teamContent.founderSection.founderImage && (
                  <div className="relative">
                    <img 
                      src={teamContent.founderSection.founderImage.sourceUrl} 
                      alt={teamContent.founderSection.founderImage.altText || 'Founder'}
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {teamContent.founderSection.sectionTitle}
                </h2>
                <div 
                  className="prose text-gray-600 mb-6"
                  dangerouslySetInnerHTML={{ __html: teamContent.founderSection.sectionText }}
                />
                {teamContent.founderSection.cta && (
                  <a 
                    href={teamContent.founderSection.cta.url} 
                    className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    {teamContent.founderSection.cta.title}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Meet the Team Section - Dynamic Team Profiles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Meet the Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {member.featuredImage?.node?.sourceUrl && (
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={member.featuredImage.node.sourceUrl}
                        alt={member.featuredImage.node.altText || member.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 text-xl mb-2">
                      {member.title}
                    </h3>
                    
                    {member.teamMemberData?.jobTitle && (
                      <p className="text-gray-600 font-medium mb-3">
                        {member.teamMemberData.jobTitle}
                      </p>
                    )}
                    
                    {member.teamMemberData?.bio && (
                      <div 
                        className="text-gray-600 text-sm mb-4"
                        dangerouslySetInnerHTML={{ __html: member.teamMemberData.bio }}
                      />
                    )}
                    
                    {/* Social Links */}
                    <div className="flex space-x-3">
                      {member.teamMemberData?.linkedinUrl && (
                        <a 
                          href={member.teamMemberData.linkedinUrl} 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      
                      {member.teamMemberData?.twitterUrl && (
                        <a 
                          href={member.teamMemberData.twitterUrl} 
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      )}
                      
                      {member.teamMemberData?.email && (
                        <a 
                          href={`mailto:${member.teamMemberData.email}`} 
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No team members found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      {teamContent?.joinTeamSection && (
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              {teamContent.joinTeamSection.sectionTitle}
            </h2>
            <div 
              className="prose prose-lg prose-invert mx-auto mb-8"
              dangerouslySetInnerHTML={{ __html: teamContent.joinTeamSection.sectionText }}
            />
            {teamContent.joinTeamSection.cta && (
              <a 
                href={teamContent.joinTeamSection.cta.url} 
                className="px-8 py-4 bg-white text-black rounded hover:bg-gray-200 transition-colors font-semibold"
              >
                {teamContent.joinTeamSection.cta.title}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Video Section */}
      {teamContent?.videoSection && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {teamContent.videoSection.title}
            </h2>
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              {teamContent.videoSection.videoUrl ? (
                <iframe 
                  src={teamContent.videoSection.videoUrl} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : teamContent.videoSection.videoEmbed ? (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: teamContent.videoSection.videoEmbed }}
                />
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* Debug Panel (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 bg-gray-100 p-4 rounded">
          <summary className="cursor-pointer font-bold mb-2">
            Debug Data (Development Only)
          </summary>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Team Page Data:</h4>
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
                {JSON.stringify(teamData, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Team Members Data:</h4>
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
                {JSON.stringify(teamMembers, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      )}

    </div>
  );
}