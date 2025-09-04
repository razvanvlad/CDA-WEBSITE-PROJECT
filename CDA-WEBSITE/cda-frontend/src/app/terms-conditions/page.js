'use client';
import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_TERMS_CONDITIONS_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => html ? html.replace(/<[^>]*>/g, '').trim() : '';

export default function TermsConditionsPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const response = await client.query({
          query: GET_TERMS_CONDITIONS_CONTENT,
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div><p className="text-gray-600">Loading...</p></div></div>;

  if (error || !pageData?.page || !pageData.page.termsConditionsContent) {
    const page = pageData?.page;
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{page?.title || 'Terms & Conditions'}</h1>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚧 Content Configuration Required</h2>
            <p className="text-gray-700 mb-4">This page exists in WordPress but the content fields are not yet available through GraphQL.</p>
            {page && (
              <div className="text-left bg-white p-4 rounded border text-sm">
                <p className="font-medium text-gray-800 mb-2">Page Information:</p>
                <p><strong>ID:</strong> {page.id}</p>
                <p><strong>Title:</strong> {page.title}</p>
                <p><strong>Slug:</strong> {page.slug}</p>
                <p><strong>URI:</strong> {page.uri}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const termsContent = pageData.page.termsConditionsContent;
  return (
    <div className="min-h-screen bg-white">
      {termsContent.headerSection && (termsContent.headerSection.title || termsContent.headerSection.lastUpdated) && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {termsContent.headerSection.title && <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{stripHTML(termsContent.headerSection.title)}</h1>}
            {termsContent.headerSection.lastUpdated && <p className="text-lg text-gray-600">Last updated: {termsContent.headerSection.lastUpdated}</p>}
          </div>
        </section>
      )}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
        <div className="flex"><div className="flex-shrink-0"><span className="text-green-400 text-xl">✅</span></div><div className="ml-3"><p className="text-sm text-green-700 font-medium">Terms & Conditions page loaded successfully!</p></div></div>
      </div>
    </div>
  );
}