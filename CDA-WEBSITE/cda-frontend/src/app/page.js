'use client'

// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/app/page.js
import { useEffect, useState } from 'react';
import graphqlClient from '../lib/graphql/client';
import { GET_HOMEPAGE_CONTENT } from '../lib/graphql/queries';

export default function Home() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await graphqlClient.request(GET_HOMEPAGE_CONTENT, { id: "68" });
        setPageData(response.page);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading content from WordPress...</p>
    </div>
  </div>;

  if (error) return <div className="flex items-center justify-center min-h-screen bg-red-50">
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-red-600 text-lg font-semibold mb-2">Error Loading Content</h2>
      <p className="text-gray-600 text-sm mb-4">Failed to fetch data from WordPress GraphQL endpoint.</p>
      <p className="text-red-500 text-xs">Error: {error}</p>
    </div>
  </div>;

  return (
    <div className="min-h-screen">
      {/* Homepage Header */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {pageData.homepageFields?.headerTitle || 'Digital Solutions That Drive Results'}
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                {pageData.homepageFields?.headerSubtitle || 'We help businesses transform their digital presence and achieve measurable growth through innovative technology solutions.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
                  {pageData.homepageFields?.primaryCta?.title || 'Book a Consultation'}
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-colors duration-300">
                  {pageData.homepageFields?.secondaryCta?.title || 'View Our Services'}
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={pageData.homepageFields?.headerImage?.node?.sourceUrl || 'https://placehold.co/600x400/3B82F6/FFFFFF?text=Digital+Innovation'}
                alt={pageData.homepageFields?.headerImage?.node?.altText || 'Digital Innovation'}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Accordion */}
      {pageData.homepageFields?.servicesAccordion && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {pageData.homepageFields.servicesAccordion.title || 'Our Services'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {pageData.homepageFields.servicesAccordion.subtitle || 'Comprehensive digital solutions tailored to your business needs'}
              </p>
            </div>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {pageData.homepageFields.servicesAccordion.services?.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button className="flex justify-between items-center w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200">
                    <span className="text-xl font-semibold text-gray-800">{service.title}</span>
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <a 
                      href={service.link?.url}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {service.link?.title || 'Learn More'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Slider */}
      {pageData.homepageFields?.technologies && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {pageData.homepageFields.technologies.title || 'Technologies We Use'}
              </h2>
              <p className="text-xl text-gray-600">
                {pageData.homepageFields.technologies.subtitle || 'Cutting-edge tools and platforms for exceptional results'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {pageData.homepageFields.technologies.logos?.map((logo, index) => (
                <div key={index} className="flex justify-center">
                  <img 
                    src={logo.node?.sourceUrl || 'https://placehold.co/120x60/6B7280/FFFFFF?text=Tech'}
                    alt={logo.node?.altText || 'Technology'}
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {pageData.homepageFields?.values && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  {pageData.homepageFields.values.title || 'Our Core Values'}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {pageData.homepageFields.values.subtitle || 'What drives our success'}
                </p>
                
                <div className="space-y-6">
                  {pageData.homepageFields.values.valueItems?.map((value, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-600 rounded-full p-3 mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={pageData.homepageFields.values.image?.node?.sourceUrl || 'https://placehold.co/600x500/3B82F6/FFFFFF?text=Our+Team'}
                  alt={pageData.homepageFields.values.image?.node?.altText || 'Our Team'}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      {pageData.homepageFields?.caseStudies && (
        <section className="py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {pageData.homepageFields.caseStudies.title || 'Case Studies'}
              </h2>
              <p className="text-xl text-gray-600">
                {pageData.homepageFields.caseStudies.subtitle || 'Real results for our clients'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pageData.homepageFields.caseStudies.studies?.map((study, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img 
                    src={study.image?.node?.sourceUrl || 'https://placehold.co/400x250/3B82F6/FFFFFF?text=Case+Study'}
                    alt={study.image?.node?.altText || 'Case Study'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{study.title}</h3>
                    <p className="text-gray-600 mb-4">{study.excerpt}</p>
                    <a 
                      href={study.link?.url}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      {study.link?.title || 'Read Case Study'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Locations with Image */}
      {pageData.homepageFields?.locations && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  {pageData.homepageFields.locations.title || 'Global Presence'}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {pageData.homepageFields.locations.subtitle || 'Offices around the world'}
                </p>
                
                <div className="space-y-6">
                  {pageData.homepageFields.locations.countries?.map((country, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">{country.countryName}</h3>
                      <div className="space-y-2">
                        {country.offices?.map((office, officeIndex) => (
                          <div key={officeIndex} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800">{office.name}</h4>
                            <p className="text-gray-600 text-sm">{office.address}</p>
                            {office.email && (
                              <p className="text-gray-600 text-sm">Email: {office.email}</p>
                            )}
                            {office.phone && (
                              <p className="text-gray-600 text-sm">Phone: {office.phone}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <img 
                  src={pageData.homepageFields.locations.image?.node?.sourceUrl || 'https://placehold.co/600x500/3B82F6/FFFFFF?text=Global+Map'}
                  alt={pageData.homepageFields.locations.image?.node?.altText || 'Global Map'}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Carousel */}
      {pageData.homepageFields?.news && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {pageData.homepageFields.news.title || 'Latest News'}
              </h2>
              <p className="text-xl text-gray-600">
                {pageData.homepageFields.news.subtitle || 'Stay updated with our latest insights and announcements'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pageData.homepageFields.news.articles?.map((article, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={article.image?.node?.sourceUrl || 'https://placehold.co/400x250/6B7280/FFFFFF?text=News'}
                    alt={article.image?.node?.altText || 'News Article'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                      {article.category || 'News'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <a 
                      href={article.link?.url}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      {article.link?.title || 'Read More'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {pageData.homepageFields?.newsletter?.title || 'Stay Informed'}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {pageData.homepageFields?.newsletter?.subtitle || 'Subscribe to our newsletter for the latest updates and insights'}
          </p>
          
          <div className="max-w-md mx-auto bg-white rounded-lg p-6">
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="Your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                {pageData.homepageFields?.newsletter?.buttonText || 'Subscribe'}
              </button>
            </form>
            <p className="text-gray-600 text-sm mt-4">
              {pageData.homepageFields?.newsletter?.privacyText || 'We respect your privacy. Unsubscribe at any time.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}