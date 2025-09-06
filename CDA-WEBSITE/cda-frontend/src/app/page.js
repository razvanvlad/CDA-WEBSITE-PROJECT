// src/app/page.js
'use client'

import { useEffect, useState } from 'react';
import client from '../lib/graphql/client';
import { GET_GLOBAL_CONTENT } from '../lib/graphql/queries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhyCdaBlock from '../components/GlobalBlocks/WhyCdaBlock';
import ApproachBlock from '../components/GlobalBlocks/ApproachBlock';
import TechnologiesSlider from '../components/GlobalBlocks/TechnologiesSlider';
import PhotoFrame from '../components/GlobalBlocks/PhotoFrame';
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
          query: GET_GLOBAL_CONTENT,
          errorPolicy: 'all',
          fetchPolicy: 'no-cache'
        });
        
        if (response.errors) {
          console.log("GraphQL errors:", response.errors);
          setError(response.errors[0]);
          return;
        }
        
        console.log("Full response:", response);
        setPageData(response.data);
        console.log("Response data:", response.data);
        console.log("Global options:", response.data?.globalOptions);
        console.log("Global shared content:", response.data?.globalOptions?.globalSharedContent);
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

  if (!pageData?.globalOptions?.globalSharedContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-yellow-600 text-lg font-semibold mb-2">Global Content Not Found</h2>
          <p className="text-gray-600 text-sm">Global content blocks not found. Please check WordPress configuration.</p>
          
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

  const globalOptions = pageData.globalOptions;
  const globalSharedContent = globalOptions.globalSharedContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Menu */}
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="title-large-purple mb-8">
            Welcome to <span className="text-purple-600">CDA Website</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Digital solutions that drive results. We create custom web experiences, 
            develop software solutions, and provide digital marketing services that help businesses grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="button-l">
              Get Started
            </a>
            <a href="/services" className="button-without-box">
              View Our Services
            </a>
          </div>
        </div>
      </section>

      {/* Global Content Blocks */}
      <WhyCdaBlock 
        globalData={globalSharedContent?.whyCdaBlock}
      />
      <PhotoFrame 
        globalData={globalSharedContent?.photoFrameBlock}
      />
      <ApproachBlock 
        globalData={globalSharedContent?.approachBlock}
      />
      <TechnologiesSlider 
        globalData={globalSharedContent?.technologiesSliderBlock}
      />
      
      {/* Footer */}
      <Footer globalOptions={globalOptions} />
    </div>
  );
}