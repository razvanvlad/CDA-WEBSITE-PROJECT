// src/app/page.js
'use client'

import { useEffect, useState } from 'react';
import client from '../lib/graphql/client';
import { GET_GLOBAL_CONTENT_BLOCKS, GET_HOMEPAGE_CONTENT_CLEAN } from '../lib/graphql/queries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhyCdaBlock from '../components/GlobalBlocks/WhyCdaBlock';
import TechnologiesSlider from '../components/GlobalBlocks/TechnologiesSlider';
import PhotoFrame from '../components/GlobalBlocks/PhotoFrame';
import ApproachBlock from '../components/GlobalBlocks/ApproachBlock';
import ValuesBlock from '../components/GlobalBlocks/ValuesBlock';
import '../styles/global.css';

export default function Home() {
  const [globalData, setGlobalData] = useState(null);
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch both global content blocks and homepage content
        const [globalResponse, homepageResponse] = await Promise.all([
          client.query({
            query: GET_GLOBAL_CONTENT_BLOCKS,
            errorPolicy: 'all',
            fetchPolicy: 'no-cache'
          }),
          client.query({
            query: GET_HOMEPAGE_CONTENT_CLEAN,
            errorPolicy: 'all',
            fetchPolicy: 'no-cache'
          })
        ]);
        
        if (globalResponse.errors || homepageResponse.errors) {
          console.log("GraphQL errors:", globalResponse.errors || homepageResponse.errors);
          setError(globalResponse.errors?.[0] || homepageResponse.errors?.[0]);
          return;
        }
        
        console.log("Global response:", globalResponse.data);
        console.log("Homepage response:", homepageResponse.data);
        
        setGlobalData(globalResponse.data);
        setHomepageData(homepageResponse.data);
        
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

  if (!globalData?.globalOptions?.globalContentBlocks || !homepageData?.page) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-yellow-600 text-lg font-semibold mb-2">Content Not Found</h2>
          <p className="text-gray-600 text-sm">Global content blocks or homepage data not found. Please check WordPress configuration.</p>
          
          {/* Debug data */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">Debug Data</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              Global: {JSON.stringify(globalData, null, 2)}
              Homepage: {JSON.stringify(homepageData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const globalContentBlocks = globalData.globalOptions.globalContentBlocks;
  const homepageContent = homepageData.page.homepageContentClean;
  const globalSelection = homepageContent?.globalContentSelection;

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Menu */}
      <Header />
      
      {/* Homepage Header Section (Individual) */}
      {homepageContent?.headerSection && (
        <section className="hero-section py-20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h1 className="title-large-purple mb-8">
              {homepageContent.headerSection.title || 'Welcome to CDA Website'}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {homepageContent.headerSection.text || 'Digital solutions that drive results.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {homepageContent.headerSection.button1 && (
                <a 
                  href={homepageContent.headerSection.button1.url || '#'} 
                  className="button-l"
                  target={homepageContent.headerSection.button1.target || '_self'}
                >
                  {homepageContent.headerSection.button1.title || 'Get Started'}
                </a>
              )}
              {homepageContent.headerSection.button2 && (
                <a 
                  href={homepageContent.headerSection.button2.url || '#'} 
                  className="button-without-box"
                  target={homepageContent.headerSection.button2.target || '_self'}
                >
                  {homepageContent.headerSection.button2.title || 'Learn More'}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Global Content Blocks - Only show if toggles are enabled */}
      
      {/* Image & Frame Block */}
      {globalSelection?.enableImageFrame && globalContentBlocks?.imageFrameBlock && (
        <PhotoFrame 
          globalData={globalContentBlocks.imageFrameBlock}
        />
      )}
      
      {/* Services Accordion Block */}
      {globalSelection?.enableServicesAccordion && globalContentBlocks?.servicesAccordion && (
        <div className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">{globalContentBlocks.servicesAccordion.title}</h2>
            <p className="mb-8">{globalContentBlocks.servicesAccordion.subtitle}</p>
            {/* Services accordion component would go here */}
          </div>
        </div>
      )}
      
      {/* Technologies Slider Block */}
      {globalSelection?.enableTechnologiesSlider && globalContentBlocks?.technologiesSlider && (
        <TechnologiesSlider 
          globalData={globalContentBlocks.technologiesSlider}
        />
      )}
      
      {/* Values Block */}
      {globalSelection?.enableValues && globalContentBlocks?.valuesBlock && (
        <ValuesBlock 
          globalData={globalContentBlocks.valuesBlock}
        />
      )}
      
      {/* Showreel Block */}
      {globalSelection?.enableShowreel && globalContentBlocks?.showreel && (
        <div className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">{globalContentBlocks.showreel.title}</h2>
            <p className="mb-8">{globalContentBlocks.showreel.subtitle}</p>
            {/* Showreel component would go here */}
          </div>
        </div>
      )}
      
      {/* Stats & Image Block */}
      {globalSelection?.enableStatsImage && globalContentBlocks?.statsImage && (
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Our Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {globalContentBlocks.statsImage.stats?.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-4xl font-bold text-purple-600">{stat.number}</h3>
                  <p className="text-gray-600">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Section (Individual) */}
      {homepageContent?.projectsSection && (
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-4">{homepageContent.projectsSection.title}</h2>
            <p className="text-xl text-gray-600 mb-8">{homepageContent.projectsSection.subtitle}</p>
            {homepageContent.projectsSection.link && (
              <a 
                href={homepageContent.projectsSection.link.url}
                className="button-l"
                target={homepageContent.projectsSection.link.target || '_self'}
              >
                {homepageContent.projectsSection.link.title}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Case Studies Section (Individual) */}
      {homepageContent?.caseStudiesSection && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <p className="text-purple-600 mb-4">{homepageContent.caseStudiesSection.subtitle}</p>
            <h2 className="text-3xl font-bold mb-8">{homepageContent.caseStudiesSection.title}</h2>
            {homepageContent.caseStudiesSection.knowledgeHubLink && (
              <a 
                href={homepageContent.caseStudiesSection.knowledgeHubLink.url}
                className="button-without-box"
                target={homepageContent.caseStudiesSection.knowledgeHubLink.target || '_self'}
              >
                {homepageContent.caseStudiesSection.knowledgeHubLink.title}
              </a>
            )}
          </div>
        </section>
      )}
      
      {/* Locations Block */}
      {globalSelection?.enableLocationsImage && globalContentBlocks?.locationsImage && (
        <div className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">{globalContentBlocks.locationsImage.title}</h2>
            <p className="mb-8">{globalContentBlocks.locationsImage.subtitle}</p>
            {/* Locations component would go here */}
          </div>
        </div>
      )}
      
      {/* Newsletter Signup Block */}
      {globalSelection?.enableNewsletterSignup && globalContentBlocks?.newsletterSignup && (
        <div className="py-20 bg-purple-600 text-white">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <p className="text-purple-200 mb-2">{globalContentBlocks.newsletterSignup.subtitle}</p>
            <h2 className="text-3xl font-bold mb-8">{globalContentBlocks.newsletterSignup.title}</h2>
            {/* Newsletter form would go here - HubSpot integration */}
            <div className="max-w-md mx-auto" dangerouslySetInnerHTML={{ __html: globalContentBlocks.newsletterSignup.hubspotScript }} />
            {globalContentBlocks.newsletterSignup.termsText && (
              <p className="text-sm mt-4">{globalContentBlocks.newsletterSignup.termsText}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer globalOptions={globalData.globalOptions} />
    </div>
  );
}