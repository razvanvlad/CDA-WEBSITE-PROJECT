'use client';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LocationsImage from '../../components/GlobalBlocks/LocationsImage';
import ContactForm from '@/components/Sections/ContactForm';
import NewsletterSignup from '../../components/GlobalBlocks/NewsletterSignup';

const stripHTML = (html) => html ? html.replace(/<[^>]*>/g, '').trim() : '';

export default function ContactPage() {
  const [globalData, setGlobalData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';
        const CONTACT_ID = parseInt(process.env.NEXT_PUBLIC_CONTACT_PAGE_ID || '791', 10);

        const globalQuery = `{
          globalOptions {
            globalContentBlocks {
              locationsImage {
                title
                subtitle
                countries { countryName offices { name address email phone } }
                illustration { node { sourceUrl altText } }
              }
              newsletterSignup {
                title
                subtitle
                hubspotScript
                termsText
              }
            }
          }
        }`;

        const contactQuery = `{
          page(id: ${CONTACT_ID}, idType: DATABASE_ID) {
            id
            title
            contactContent {
              formSection {
                title
                description
                formShortcode
              }
            }
          }
        }`;

        const [globalRes, contactRes] = await Promise.all([
          fetch(GRAPHQL_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: globalQuery }) }),
          fetch(GRAPHQL_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: contactQuery }) })
        ]);

        const globalJson = await globalRes.json();
        const contactJson = await contactRes.json();

        if (globalJson.errors || contactJson.errors) {
          console.log('GraphQL errors:', globalJson.errors || contactJson.errors);
          setError(globalJson.errors?.[0] || contactJson.errors?.[0]);
          setLoading(false);
          return;
        }

        setGlobalData(globalJson.data);
        setContactData(contactJson.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-left">
            <h2 className="text-2xl font-semibold text-red-800 mb-4">Error Loading Content</h2>
            <pre className="text-xs bg-white rounded p-3 overflow-auto border border-red-100">{JSON.stringify(error, null, 2)}</pre>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const globalBlocks = globalData?.globalOptions?.globalContentBlocks || {};
  const formSection = contactData?.page?.contactContent?.formSection || null;

  // Decide how to render form: embed vs simple form component
  const formEmbed = formSection?.formShortcode && /<\/?(form|script|div|iframe)/i.test(String(formSection.formShortcode));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Contact Form Section */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-header">
              <h1 className="contact-title" style={{textDecoration:'underline', textDecorationColor:'#FF6A00', textDecorationThickness:'11px'}}>Send Us A Message</h1>
            </div>

            <div className="contact-form-wrapper">
              {formEmbed ? (
                <div dangerouslySetInnerHTML={{ __html: formSection.formShortcode }} />
              ) : (
                <ContactForm />
              )}
              
              {/* Contact Information */}
              <div className="contact-info">
                <div className="contact-phone">
                  <strong>Telephone:</strong> <a href="tel:02037800808">0203 780 0808</a>
                </div>
                <div className="contact-social">
                  <strong>Social Media:</strong>
                  <div className="social-links">
                    <a href="https://www.facebook.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.41V9.41c0-2.38 1.42-3.7 3.6-3.7 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.47v1.77h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z"/>
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM17.8 6.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/company/cdagroup/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.94 6.94A2.44 2.44 0 1 1 2.06 6.94a2.44 2.44 0 0 1 4.88 0zM2.4 8.8h4.8V22H2.4V8.8zm7.2 0h4.6v1.81h.06c.64-1.21 2.2-2.49 4.52-2.49 4.84 0 5.73 3.19 5.73 7.33V22h-4.8v-6.15c0-1.47-.03-3.36-2.05-3.36-2.06 0-2.38 1.6-2.38 3.26V22H9.6V8.8z"/>
                      </svg>
                    </a>
                    <a href="https://www.youtube.com/@CDAGroupUK" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.8 8.2a3 3 0 0 0-2.1-2.1C17.7 5.5 12 5.5 12 5.5s-5.7 0-7.7.6A3 3 0 0 0 2.2 8.2 31.4 31.4 0 0 0 1.8 12a31.4 31.4 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c2 .6 7.7.6 7.7.6s5.7 0 7.7-.6a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8 0-1.3-.1-2.6-.4-3.8zM10 14.7V9.3l4.8 2.7L10 14.7z"/>
                      </svg>
                    </a>
                    <a href="https://www.tiktok.com/@cdagroupuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 8.5a7 7 0 0 1-4-1.3v7.1a6.3 6.3 0 1 1-5.4-6.3v3a3.3 3.3 0 1 0 2.3 3.1V2h3a4 4 0 0 0 4 4v2.5z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-illustration">
            <img className="contact-illustration-img" src="/images/contact-birds.svg" alt="Contact illustration with birds and envelopes" />
          </div>
        </div>
      </section>

      {/* Locations (Global Content) */}
      {globalBlocks?.locationsImage && (
        <LocationsImage globalData={globalBlocks.locationsImage} />
      )}

      {/* Newsletter (Global) */}
      {globalBlocks?.newsletterSignup && (
        <NewsletterSignup globalData={globalBlocks.newsletterSignup} />
      )}



      <Footer />
    </div>
  );
}
