'use client';
import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_KNOWLEDGE_HUB_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => html ? html.replace(/<[^>]*>/g, '').trim() : '';

export default function KnowledgeHubPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const response = await client.query({
          query: GET_KNOWLEDGE_HUB_CONTENT,
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div><p className="text-gray-600">Loading...</p></div></div>;

  if (error || !pageData?.page || !pageData.page.knowledgeHubContent) {
    const page = pageData?.page;
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{page?.title || 'Knowledge Hub'}</h1>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">🚧 Content Configuration Required</h2>
            <p className="text-indigo-700 mb-4">This page exists in WordPress but the content fields are not yet available through GraphQL.</p>
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

  const hubContent = pageData.page.knowledgeHubContent;
  return (
    <div className="min-h-screen bg-white">
      {hubContent.headerSection && (hubContent.headerSection.title || hubContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-indigo-50 to-purple-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            {hubContent.headerSection.title && <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">{stripHTML(hubContent.headerSection.title)}</h1>}
            {hubContent.headerSection.subtitle && <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{hubContent.headerSection.subtitle}</p>}
          </div>
        </section>
      )}

      {/* Listing/Grid (safe placeholder) */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...(hubContent?.items || []), ...(hubContent?.posts || [])].slice(0, 6).map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="text-lg font-semibold text-black mb-2">{item?.title || 'Article Title'}</div>
                <div className="text-sm text-gray-600">{item?.excerpt ? item.excerpt.replace(/<[^>]*>/g,'') : 'Summary coming soon.'}</div>
              </div>
            ))}
            {(!hubContent?.items && !hubContent?.posts) && (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="text-lg font-semibold text-black mb-2">Article Title</div>
                  <div className="text-sm text-gray-600">Summary coming soon.</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
        <div className="flex"><div className="flex-shrink-0"><span className="text-green-400 text-xl">✅</span></div><div className="ml-3"><p className="text-sm text-green-700 font-medium">Knowledge Hub page loaded successfully!</p></div></div>
      </div>
    </div>
  );
}