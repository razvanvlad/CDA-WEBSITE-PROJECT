// src/app/contact/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_CONTACT_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function ContactPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_CONTACT_CONTENT,
          errorPolicy: 'all'
        });
        
        if (response.errors) {
          setError(response.errors[0]);
        } else {
          setPageData(response.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-red-600 text-lg font-semibold mb-4">Error Loading Page</h2>
          <pre className="text-xs text-red-600 overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!pageData?.page?.contactContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const contactContent = pageData.page.contactContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {contactContent.headerSection && (contactContent.headerSection.title || contactContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {contactContent.headerSection.title && (
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                {stripHTML(contactContent.headerSection.title)}
              </h1>
            )}
            
            {contactContent.headerSection.subtitle && (
              <p className="text-xl text-gray-600 mb-8">
                {contactContent.headerSection.subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Contact Info & Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            {contactContent.contactInfo && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  {contactContent.contactInfo.phone && (
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Phone</h3>
                        <a href={`tel:${contactContent.contactInfo.phone}`} className="text-gray-600 hover:text-blue-600">
                          {contactContent.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contactContent.contactInfo.email && (
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <a href={`mailto:${contactContent.contactInfo.email}`} className="text-gray-600 hover:text-blue-600">
                          {contactContent.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contactContent.contactInfo.address && (
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Address</h3>
                        <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: contactContent.contactInfo.address }} />
                      </div>
                    </div>
                  )}
                  
                  {contactContent.contactInfo.workingHours && (
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Working Hours</h3>
                        <p className="text-gray-600">{contactContent.contactInfo.workingHours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Contact Form */}
            {contactContent.contactForm && (
              <div className="bg-gray-50 p-8 rounded-lg">
                {contactContent.contactForm.title && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {stripHTML(contactContent.contactForm.title)}
                  </h2>
                )}
                
                {contactContent.contactForm.description && (
                  <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: contactContent.contactForm.description }} />
                )}
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows="5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {contactContent.contactForm.submitButtonText || 'Send Message'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location Section */}
      {contactContent.locationSection && (contactContent.locationSection.title || contactContent.locationSection.mapEmbedCode) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {contactContent.locationSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                {stripHTML(contactContent.locationSection.title)}
              </h2>
            )}
            
            {contactContent.locationSection.address && (
              <p className="text-center text-lg text-gray-600 mb-8">
                {contactContent.locationSection.address}
              </p>
            )}
            
            {contactContent.locationSection.mapEmbedCode && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div dangerouslySetInnerHTML={{ __html: contactContent.locationSection.mapEmbedCode }} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {contactContent.ctaSection && (contactContent.ctaSection.title || contactContent.ctaSection.content) && (
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {contactContent.ctaSection.title && (
              <h2 className="text-3xl font-bold text-white mb-4">
                {stripHTML(contactContent.ctaSection.title)}
              </h2>
            )}
            {contactContent.ctaSection.content && (
              <div className="text-xl text-blue-100">
                <div dangerouslySetInnerHTML={{ __html: contactContent.ctaSection.content }} />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}