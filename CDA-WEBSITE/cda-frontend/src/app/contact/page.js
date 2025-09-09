'use client';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LocationsImage from '../../components/GlobalBlocks/LocationsImage';
import ContactForm from '@/components/Sections/ContactForm';

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
      <section className="py-16 bg-gray-50">
        <div className="mx-auto w-full max-w-[800px] px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">{stripHTML(formSection?.title) || 'Contact Us'}</h1>
            {formSection?.description && (
              <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: formSection.description }} />
            )}
          </div>

          {formEmbed ? (
            <div dangerouslySetInnerHTML={{ __html: formSection.formShortcode }} />
          ) : (
            <ContactForm />
          )}
        </div>
      </section>

      {/* Locations (Global) */}
      {globalBlocks?.locationsImage && (
        <LocationsImage globalData={globalBlocks.locationsImage} />
      )}

      {/* Newsletter (Global) */}
      {globalBlocks?.newsletterSignup && (
        <section className="py-16">
          <div className="max-w-[600px] mx-auto text-center px-4">
            {globalBlocks.newsletterSignup.subtitle && (
              <p className="text-sm font-semibold text-purple-600 mb-2">{globalBlocks.newsletterSignup.subtitle}</p>
            )}
            {globalBlocks.newsletterSignup.title && (
              <h2 className="text-2xl font-bold mb-6">{globalBlocks.newsletterSignup.title}</h2>
            )}
            <div className="bg-gray-50 p-6 rounded-lg mb-3">
              {globalBlocks.newsletterSignup.hubspotScript ? (
                <div dangerouslySetInnerHTML={{ __html: globalBlocks.newsletterSignup.hubspotScript }} />
              ) : (
                <p className="text-gray-600">Newsletter form not configured yet.</p>
              )}
            </div>
            {globalBlocks.newsletterSignup.termsText && (
              <p className="text-xs text-gray-500">{globalBlocks.newsletterSignup.termsText}</p>
            )}
          </div>
        </section>
      )}

      {/* Debug panel */}
      <div className="p-6 bg-blue-50 border-t border-blue-100">
        <div className="max-w-[900px] mx-auto text-sm">
          <h3 className="font-semibold text-blue-900 mb-2">Contact Page Debug</h3>
          <pre className="bg-white border rounded p-3 overflow-auto text-xs">
            {JSON.stringify({
              pageId: contactData?.page?.id,
              formSectionKeys: Object.keys(formSection || {}),
              globals: {
                hasLocations: !!globalBlocks?.locationsImage,
                hasNewsletter: !!globalBlocks?.newsletterSignup
              }
            }, null, 2)}
          </pre>
        </div>
      </div>

      <Footer />
    </div>
  );
}
