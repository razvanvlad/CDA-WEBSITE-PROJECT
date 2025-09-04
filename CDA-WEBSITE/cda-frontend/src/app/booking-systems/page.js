'use client';
import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_BOOKING_SYSTEMS_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => html ? html.replace(/<[^>]*>/g, '').trim() : '';

export default function BookingSystemsPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const response = await client.query({
          query: GET_BOOKING_SYSTEMS_CONTENT,
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div><p className="text-gray-600">Loading...</p></div></div>;

  if (error || !pageData?.page || !pageData.page.bookingSystemsContent) {
    const page = pageData?.page;
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{page?.title || 'Booking Systems'}</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">🚧 Content Configuration Required</h2>
            <p className="text-blue-700 mb-4">This page exists in WordPress but the content fields are not yet available through GraphQL.</p>
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

  const bookingContent = pageData.page.bookingSystemsContent;
  return (
    <div className="min-h-screen bg-white">
      {bookingContent.headerSection && (bookingContent.headerSection.title || bookingContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-blue-50 to-cyan-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            {bookingContent.headerSection.title && <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">{stripHTML(bookingContent.headerSection.title)}</h1>}
            {bookingContent.headerSection.subtitle && <p className="text-xl text-gray-600 mb-8">{bookingContent.headerSection.subtitle}</p>}
          </div>
        </section>
      )}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
        <div className="flex"><div className="flex-shrink-0"><span className="text-green-400 text-xl">✅</span></div><div className="ml-3"><p className="text-sm text-green-700 font-medium">Booking Systems page loaded successfully!</p></div></div>
      </div>
    </div>
  );
}
