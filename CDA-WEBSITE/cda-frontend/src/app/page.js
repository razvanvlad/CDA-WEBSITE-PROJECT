// src/app/page.js
'use client'

import { useEffect, useState } from 'react';
import client from '../lib/graphql/client';
import { GET_HOMEPAGE_CONTENT } from '../lib/graphql/queries';

export default function Home() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await client.query({
          query: GET_HOMEPAGE_CONTENT,
          variables: { id: "289" }
        });
        
        console.log('GraphQL Response:', response);
        
        if (response.errors) {
          console.error('GraphQL Errors:', response.errors);
          setError(response.errors[0].message);
          return;
        }
        
        setPageData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        
        if (err.message.includes('Unexpected token <')) {
          setError('WordPress GraphQL endpoint is returning HTML instead of JSON. Check WordPress configuration.');
        } else {
          setError(err.message);
        }
        
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

  // Render Components
  const renderServicesAccordion = (accordionItem) => (
    <div key={accordionItem.title} className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center cursor-pointer">
        <h3 className="font-semibold text-gray-800">{accordionItem.title}</h3>
        <span className="text-gray-500">+</span>
      </div>
      <div 
        className="mt-2 text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: accordionItem.description }}
      />
      {accordionItem.link && (
        <div className="mt-3">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            {accordionItem.link.title}
          </button>
        </div>
      )}
    </div>
  );

  const renderValues = (value, index) => (
    <div key={index} className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
        {index + 1}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-1">{value.title}</h3>
        <div 
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: value.description }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {pageData?.page?.homepageContent?.headerSection?.title || 'Welcome to CDA'}
              </h1>
              <p className="text-gray-600 mb-8">
                {pageData?.page?.homepageContent?.headerSection?.subtitle || 'Our digital partner'}
              </p>
              <div className="flex flex-wrap gap-4">
                {pageData?.page?.homepageContent?.headerSection?.primaryCta && (
                  <button className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                    {pageData.page.homepageContent.headerSection.primaryCta.title}
                  </button>
                )}
                {pageData?.page?.homepageContent?.headerSection?.secondaryCta && (
                  <a 
                    href={pageData.page.homepageContent.headerSection.secondaryCta.url} 
                    className="text-blue-600 underline hover:text-blue-800 transition-colors"
                  >
                    {pageData.page.homepageContent.headerSection.secondaryCta.title}
                  </a>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src={pageData?.page?.homepageContent?.headerSection?.desktopImage?.node?.sourceUrl || '/placeholder.jpg'} 
                alt={pageData?.page?.homepageContent?.headerSection?.desktopImage?.node?.altText || 'Header'}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* About us Section */}  
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 relative">
                {/* Container for the frame and image */}
                <div className="image-container">
                  <img 
                    src="/images/Photo-Frame.png" 
                    alt="Frame" 
                    className="frame-image"
                  />
                  <img 
                    src={pageData?.page?.homepageContent?.whoWeAreSection?.image?.node?.sourceUrl || '/placeholder.jpg'} 
                    alt={pageData?.page?.homepageContent?.whoWeAreSection?.image?.node?.altText}
                    className="content-image"
                  />
                </div>
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {pageData?.page?.homepageContent?.whoWeAreSection?.title || 'Who we are'}
                </h2>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  {pageData?.page?.homepageContent?.whoWeAreSection?.subtitle || 'Your Digital Partner'}
                </h3>
                <p className="text-gray-600 mb-8">
                  {pageData?.page?.homepageContent?.whoWeAreSection?.text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.'}
                </p>
                {pageData?.page?.homepageContent?.whoWeAreSection?.button && (
                  <a 
                    href={pageData.page.homepageContent.whoWeAreSection.button.url} 
                    className="text-blue-600 underline hover:text-blue-800 transition-colors inline-flex items-center"
                  >
                    {pageData.page.homepageContent.whoWeAreSection.button.title}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                )}
                
                {/* Orange arrow */}
                <div className="mt-8">
                  <img 
                    src="/images/orange-arrow.png" 
                    alt="Arrow" 
                    className="w-24 h-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.page?.homepageContent?.servicesSection?.title || 'Our Services'}
            </h2>
            <div className="space-y-4">
              {pageData?.page?.homepageContent?.servicesAccordion?.map(renderServicesAccordion)}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.page?.homepageContent?.platformsSection?.title || 'Platforms'}
            </h2>
            <p className="text-gray-600 mb-8">
              {pageData?.page?.homepageContent?.platformsSection?.subtitle || 'A Few We Work With'}
            </p>
            <div className="flex flex-wrap gap-8 justify-center">
              {pageData?.page?.homepageContent?.platformsSection?.logos?.map((logo, index) => (
                <img 
                  key={index} 
                  src={logo.logo.node.sourceUrl} 
                  alt={logo.logo.node.altText}
                  className="w-32 h-12 object-contain"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.page?.homepageContent?.valuesSection?.title || 'Our Values'}
            </h2>
            <p className="text-gray-600 mb-8">
              {pageData?.page?.homepageContent?.valuesSection?.subtitle || 'What we stand for'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pageData?.page?.homepageContent?.valuesSection?.valueItems?.map(renderValues)}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.page?.homepageContent?.newsletterSection?.title || 'Newsletter'}
            </h2>
            <p className="text-gray-600 mb-8">
              {pageData?.page?.homepageContent?.newsletterSection?.subtitle || 'Subscribe to our newsletter'}
            </p>
            <form className="space-y-4">
              <input type="text" placeholder="First Name" className="w-full px-4 py-3 border border-gray-300 rounded" />
              <input type="text" placeholder="Last Name" className="w-full px-4 py-3 border border-gray-300 rounded" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded" />
              <div className="flex items-center">
                <input type="checkbox" id="terms" className="mr-2" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the Terms and Conditions and consent to receive email updates and newsletters
                </label>
              </div>
              <button className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                Sign Up
              </button>
            </form>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.page?.homepageContent?.ctaSection?.title || 'Get in touch'}
            </h2>
            <p className="text-gray-600 mb-8">
              {pageData?.page?.homepageContent?.ctaSection?.subtitle || 'We would love to hear from you'}
            </p>
            <button className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors">
              {pageData?.page?.homepageContent?.ctaSection?.button?.title || 'Contact Us'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}