// src/app/about/page.js
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import client from '../../lib/graphql/client';
import { GET_ABOUT_US_CONTENT } from '../../lib/graphql/queries';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await client.query({
          query: GET_ABOUT_US_CONTENT,
          variables: { uri: "about-us" },
          errorPolicy: 'all'
        });
        
        if (response.errors) {
            console.log("GraphQL errors:", response.errors);
          setError(response.errors[0]);
          return;
        }
        console.log("Full response:", response); // Add this line
        setData(response.data);
        console.log("Response data:", response.data); // Add this line
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading About Us content...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
            <h2 className="text-red-600 text-lg font-semibold mb-2">Error Loading Content</h2>
            <p className="text-gray-600 text-sm mb-4">Failed to fetch About Us data.</p>
            
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </>
    );
  }

  if (!data?.page) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-yellow-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
            <h2 className="text-yellow-600 text-lg font-semibold mb-2">Page Not Found</h2>
            <p className="text-gray-600 text-sm">The About Us page could not be found.</p>
          </div>
        </div>
      </>
    );
  }

  const page = data.page;
  const aboutContent = page.aboutUsContent;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-blue-200">CDA</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              We're a team of passionate digital experts dedicated to transforming businesses through innovative technology solutions.
            </p>
          </div>
        </section>

        {/* Video Section */}
        {aboutContent?.videoSection && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {aboutContent.videoSection.title || "Our Story"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {aboutContent.videoSection.subtitle || "Watch our journey and discover what drives us to deliver exceptional results."}
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                {aboutContent.videoSection.videoUrl ? (
                  <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    {aboutContent.videoSection.thumbnailImage?.node ? (
                      <div className="relative w-full h-full group cursor-pointer">
                        <Image
                          src={aboutContent.videoSection.thumbnailImage.node.sourceUrl}
                          alt={aboutContent.videoSection.thumbnailImage.node.altText || "Video thumbnail"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
                          <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <a 
                          href={aboutContent.videoSection.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                          </svg>
                          Watch Our Story
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Video content coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Leadership Section */}
        {aboutContent?.leadershipSection && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Meet the experienced professionals guiding CDA's vision and strategy.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aboutContent.leadershipSection.leaders?.map((leader, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {leader.photo?.node && (
                      <div className="mb-6">
                        <div className="relative w-32 h-32 mx-auto">
                          <Image
                            src={leader.photo.node.sourceUrl}
                            alt={leader.photo.node.altText || leader.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-4">
                      {leader.position}
                    </p>
                    {leader.bio && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {leader.bio}
                      </p>
                    )}
                  </div>
                )) || (
                  // Single leader fallback
                  <div className="col-span-full max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg p-8 text-center shadow-lg">
                      {aboutContent.leadershipSection.photo?.node && (
                        <div className="mb-6">
                          <div className="relative w-40 h-40 mx-auto">
                            <Image
                              src={aboutContent.leadershipSection.photo.node.sourceUrl}
                              alt={aboutContent.leadershipSection.photo.node.altText || aboutContent.leadershipSection.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                        </div>
                      )}
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {aboutContent.leadershipSection.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-6 text-lg">
                        {aboutContent.leadershipSection.position}
                      </p>
                      {aboutContent.leadershipSection.bio && (
                        <div 
                          className="text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: aboutContent.leadershipSection.bio }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        {aboutContent?.statsSection && (
          <section className="py-16 bg-blue-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {aboutContent.statsSection.title || "Our Impact"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {aboutContent.statsSection.subtitle || "Numbers that reflect our commitment to excellence and client success."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aboutContent.statsSection.stats?.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">
                      {stat.number}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-gray-600">
                      {stat.description}
                    </p>
                  </div>
                )) || (
                  // Single stat fallback
                  <div className="col-span-full text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-4">
                      {aboutContent.statsSection.number}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {aboutContent.statsSection.label}
                    </h3>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      {aboutContent.statsSection.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Who We Are Section */}
        {aboutContent?.whoWeAreSection && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {aboutContent.whoWeAreSection.title || "Who We Are"}
                  </h2>
                  <div className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {aboutContent.whoWeAreSection.subtitle && (
                      <p className="mb-4 text-blue-600 font-medium">
                        {aboutContent.whoWeAreSection.subtitle}
                      </p>
                    )}
                    <p>
                      We're more than just a digital agency. We're your strategic partner in navigating the complex digital landscape, helping you transform challenges into opportunities and ideas into impact.
                    </p>
                  </div>
                  {aboutContent.whoWeAreSection.button && (
                    <a 
                      href={aboutContent.whoWeAreSection.button.url}
                      target={aboutContent.whoWeAreSection.button.target || "_self"}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {aboutContent.whoWeAreSection.button.title}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  )}
                </div>
                
                {aboutContent.whoWeAreSection.image?.node && (
                  <div className="relative">
                    <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                      <Image
                        src={aboutContent.whoWeAreSection.image.node.sourceUrl}
                        alt={aboutContent.whoWeAreSection.image.node.altText || "Who we are"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Why CDA Section */}
        {aboutContent?.whyCdaSection && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {aboutContent.whyCdaSection.title || "Why Choose CDA"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {aboutContent.whyCdaSection.content || "Discover what sets us apart and makes us the right choice for your digital transformation journey."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aboutContent.whyCdaSection.reasons?.map((reason, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {reason.icon?.node && (
                      <div className="mb-6">
                        <div className="relative w-16 h-16 mx-auto">
                          <Image
                            src={reason.icon.node.sourceUrl}
                            alt={reason.icon.node.altText || reason.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how CDA can help you achieve your digital goals and drive meaningful results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get in Touch
              </a>
              <a 
                href="/services" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                View Our Services
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}