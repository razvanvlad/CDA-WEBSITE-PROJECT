// src/app/page.js
'use client'

import { useEffect, useState } from 'react';
import client from '../lib/graphql/client';
import { GET_HOMEPAGE_CONTENT } from '../lib/graphql/queries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/global.css';

export default function Home() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await client.query({
          query: GET_HOMEPAGE_CONTENT,
          variables: { id: "289" }, // Your homepage ID
          errorPolicy: 'all'
        });
        
        if (response.errors) {
          console.log("GraphQL errors:", response.errors);
          setError(response.errors[0]);
          return;
        }
        
        console.log("Full response:", response);
        setPageData(response.data);
        console.log("Response data:", response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading content from WordPress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-red-600 text-lg font-semibold mb-2">Error Loading Content</h2>
          <p className="text-gray-600 text-sm mb-4">Failed to fetch data from WordPress GraphQL endpoint.</p>
          
          {/* Debug error details */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!pageData?.page) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-yellow-600 text-lg font-semibold mb-2">Page Not Found</h2>
          <p className="text-gray-600 text-sm">Homepage data not found. Check page ID: 289</p>
          
          {/* Debug data */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">Debug Data</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(pageData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const page = pageData.page;
  const homepageContent = page.homepageContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Debug Section - Remove in production */}
      {/* <details className="m-4 p-4 bg-gray-100 rounded">
        <summary className="cursor-pointer font-bold text-sm">
           Debug Data (Click to expand)
        </summary>
        <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded max-h-96">
          {JSON.stringify(pageData, null, 2)}
        </pre>
      </details> */}

      {/* Header Section */}
      {homepageContent?.headerSection && (
        <section className="hero-section py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2">
                {/* FIXED: Use dangerouslySetInnerHTML for WYSIWYG title field */}
                <h1 
                  className="title-large-purple"
                  dangerouslySetInnerHTML={{ __html: homepageContent.headerSection.title }}
                />
                {homepageContent.headerSection.subtitle && (
                  <p className="text-xl text-gray-600 mb-8">
                    {homepageContent.headerSection.subtitle}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {homepageContent.headerSection.primaryCta && (
                    <a 
                      href={homepageContent.headerSection.primaryCta.url}
                      target={homepageContent.headerSection.primaryCta.target || '_self'}
                      className="button-l"
                    >
                      {homepageContent.headerSection.primaryCta.title}
                    </a>
                  )}
                  
                  {homepageContent.headerSection.secondaryCta && (
                    <a 
                      href={homepageContent.headerSection.secondaryCta.url}
                      target={homepageContent.headerSection.secondaryCta.target || '_self'}
                      className="button-without-box"
                    >
                      {homepageContent.headerSection.secondaryCta.title}
                    </a>
                  )}
                </div>
              </div>
              
              {homepageContent.headerSection.desktopImage && (
                <div className="hidden lg:block lg:col-span-1">
                  <img 
                    src={homepageContent.headerSection.desktopImage.node.sourceUrl}
                    alt={homepageContent.headerSection.desktopImage.node.altText}
                    className="w-full h-auto max-w-sm ml-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services Accordion Section */}
      {homepageContent?.servicesAccordion && homepageContent.servicesAccordion.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="title-small-purple">
              Our Services
            </h2>
            
            <div className="space-y-4">
              {homepageContent.servicesAccordion.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {service.title}
                      </h3>
                      <span className="text-2xl text-gray-400">+</span>
                    </div>
                    
                    {service.description && (
                      <div className="mt-4 text-gray-600">
                        <div dangerouslySetInnerHTML={{ __html: service.description }} />
                      </div>
                    )}
                    
                    {service.link && (
                      <div className="mt-4">
                        <a 
                          href={service.link.url}
                          target={service.link.target || '_self'}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {service.link.title} →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {homepageContent?.valuesSection && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {homepageContent.valuesSection.title}
            </h2>
            
            {homepageContent.valuesSection.valueItems && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {homepageContent.valuesSection.valueItems.map((value, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Who We Are Section */}
      {homepageContent?.whoWeAreSection && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {homepageContent.whoWeAreSection.title}
                </h2>
                {homepageContent.whoWeAreSection.subtitle && (
                  <p className="text-lg text-gray-600 mb-8">
                    {homepageContent.whoWeAreSection.subtitle}
                  </p>
                )}
                
                {homepageContent.whoWeAreSection.button && (
                  <a 
                    href={homepageContent.whoWeAreSection.button.url}
                    target={homepageContent.whoWeAreSection.button.target || '_self'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                  >
                    {homepageContent.whoWeAreSection.button.title}
                  </a>
                )}
              </div>
              
              {homepageContent.whoWeAreSection.image && (
                <div>
                  <img 
                    src={homepageContent.whoWeAreSection.image.node.sourceUrl}
                    alt={homepageContent.whoWeAreSection.image.node.altText}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {homepageContent?.newsletterSection && (
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {homepageContent.newsletterSection.title}
            </h2>
            {homepageContent.newsletterSection.subtitle && (
              <p className="text-xl text-blue-100 mb-8">
                {homepageContent.newsletterSection.subtitle}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}