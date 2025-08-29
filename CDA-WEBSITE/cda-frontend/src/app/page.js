// src/app/page.js
'use client'

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
        const response = await graphqlClient.request(GET_HOMEPAGE_CONTENT, { id: "289" });
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

  // Render Components
  const renderServicesAccordion = (accordionItem) => {
    if (!accordionItem) return null;
    
    return (
      <div key={accordionItem.title} className="border-b border-gray-200 py-4">
        <div className="flex justify-between items-center cursor-pointer">
          <h3 className="font-semibold text-gray-800">{accordionItem.title}</h3>
          <span className="text-gray-500">+</span>
        </div>
        <div className="mt-2 text-gray-600 leading-relaxed">
          {accordionItem.description}
        </div>
        {accordionItem.link && (
          <div className="mt-3">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
              {accordionItem.link.title}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderStats = (stat) => {
    if (!stat) return null;
    
    return (
      <div key={stat.label} className="text-center">
        <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
        <div className="text-gray-600">{stat.label}</div>
      </div>
    );
  };

  const renderCaseStudy = (study) => {
    if (!study) return null;
    
    return (
      <div key={study.title} className="mb-8">
        <img 
          src={study.image?.node?.sourceUrl} 
          alt={study.image?.node?.altText || study.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{study.title}</h3>
        <p className="text-gray-600 mb-4">{study.excerpt}</p>
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
          View Project
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">CDA</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">eCommerce</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">B2B Lead Generation</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Software Development</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Booking Systems</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Digital Marketing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Outsourced CMO</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">AI</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {pageData?.homepageContent?.headerSection?.title || 'Welcome to CDA'}
              </h1>
              <p className="text-gray-600 mb-8">
                {pageData?.homepageContent?.headerSection?.subtitle || 'Our digital partner'}
              </p>
              <div className="flex flex-wrap gap-4">
                {pageData?.homepageContent?.headerSection?.primaryCta && (
                  <button className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                    {pageData.homepageContent.headerSection.primaryCta.title}
                  </button>
                )}
                {pageData?.homepageContent?.headerSection?.secondaryCta && (
                  <a 
                    href={pageData.homepageContent.headerSection.secondaryCta.url} 
                    className="text-blue-600 underline hover:text-blue-800 transition-colors"
                  >
                    {pageData.homepageContent.headerSection.secondaryCta.title}
                  </a>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src={pageData?.homepageContent?.headerSection?.desktopImage?.node?.sourceUrl || 'images/Crab@300x.png'} 
                alt={pageData?.homepageContent?.headerSection?.desktopImage?.node?.altText || 'Header'}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.homepageContent?.servicesSection?.title || 'Our Services'}
            </h2>
            <div className="space-y-4">
              {pageData?.homepageContent?.servicesAccordion?.map(renderServicesAccordion)}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.homepageContent?.valuesSection?.title || 'Our Values'}
            </h2>
            <p className="text-gray-600 mb-8">
              {pageData?.homepageContent?.valuesSection?.subtitle || 'What we stand for'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pageData?.homepageContent?.valuesSection?.valueItems?.map((value, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              {pageData?.homepageContent?.newsletterSection?.title || 'Newsletter'}
            </h2>
            <p className="text-gray-600 mb-8">
              {pageData?.homepageContent?.newsletterSection?.subtitle || 'Subscribe to our newsletter'}
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
              {pageData?.homepageContent?.ctaSection?.title || 'Get in touch'}
            </h2>
            <p className="text-gray-600 mb-8">
              {pageData?.homepageContent?.ctaSection?.subtitle || 'We would love to hear from you'}
            </p>
            <button className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors">
              {pageData?.homepageContent?.ctaSection?.button?.title || 'Contact Us'}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">CDA</h3>
              <p className="text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Work</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Policies</a>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">YouTube</a>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>Contact Us • 0203 780 0808</p>
          </div>
        </div>
      </footer>
    </div>
  );
}