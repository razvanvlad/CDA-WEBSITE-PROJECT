"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

function stripHTML(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function CaseStudiesClient({ initialItems = [], projectTypes = [] }) {
  // Read filters from URL on the client
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const searchQuery = params.get('search') || '';
  const featuredOnly = params.get('featured') === 'true';
  const selectedTypes = params.getAll('project_type');

  const { featuredCaseStudies, regularCaseStudies, total } = useMemo(() => {
    let items = Array.isArray(initialItems) ? initialItems : [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((cs) => {
        const title = (cs.title || '').toLowerCase();
        const excerpt = stripHTML(cs.excerpt || '').toLowerCase();
        return title.includes(q) || excerpt.includes(q);
      });
    }

    if (selectedTypes.length > 0) {
      items = items.filter((cs) => {
        const types = cs?.projectTypes?.nodes || [];
        const slugs = types.map((t) => t.slug);
        return selectedTypes.some((sel) => slugs.includes(sel));
      });
    }

    // Since ACF fields aren't available, we'll treat all as regular case studies for now
    // TODO: Configure ACF fields to be exposed to GraphQL
    const allFeatured = []; // items.filter((cs) => !!cs?.caseStudyFields?.featured);
    const allRegular = items; // items.filter((cs) => !cs?.caseStudyFields?.featured);
    const effectiveRegular = featuredOnly ? [] : allRegular;

    return {
      featuredCaseStudies: featuredOnly ? items : allFeatured,
      regularCaseStudies: effectiveRegular,
      total: items.length,
    };
  }, [initialItems, searchQuery, featuredOnly, selectedTypes]);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Studies</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how we&apos;ve helped businesses transform and grow through our innovative solutions and strategic partnerships.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {searchQuery || selectedTypes.length > 0 || featuredOnly ? (
              <>
                Showing {featuredCaseStudies.length + regularCaseStudies.length} of {total} case studies
                {searchQuery && <span> matching "{searchQuery}"</span>}
                {selectedTypes.length > 0 && <span> in {selectedTypes.length} selected categories</span>}
                {featuredOnly && <span> (featured only)</span>}
              </>
            ) : (
              `Showing all ${total} case studies`
            )}
          </p>
        </div>

        {/* Featured Section */}
        {!featuredOnly && featuredCaseStudies.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Success Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {featuredCaseStudies.slice(0, 2).map((caseStudy) => (
                <Link key={caseStudy.id} href={`/case-studies/${caseStudy.slug}`} className="group block">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {caseStudy.featuredImage?.node?.sourceUrl && (
                      <div className="relative h-64 w-full">
                        <Image
                          src={caseStudy.featuredImage.node.sourceUrl}
                          alt={caseStudy.featuredImage.node.altText || caseStudy.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">FEATURED</span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      {/* Client logo temporarily removed - requires ACF GraphQL configuration */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{caseStudy.title}</h3>
                      <p className="text-gray-600 mb-4">{stripHTML(caseStudy.excerpt) || 'Read about this successful project and its impact.'}</p>
                      <div className="flex items-center text-blue-600 font-semibold">
                        Read Case Study
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Regular grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularCaseStudies.map((caseStudy) => (
            <Link key={caseStudy.id} href={`/case-studies/${caseStudy.slug}`} className="group block bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
              {caseStudy.featuredImage?.node?.sourceUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={caseStudy.featuredImage.node.sourceUrl}
                    alt={caseStudy.featuredImage.node.altText || caseStudy.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseStudy.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{stripHTML(caseStudy.excerpt) || 'Learn more about this project.'}</p>
                <div className="text-blue-600 font-medium flex items-center">Read More <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></div>
              </div>
            </Link>
          ))}
        </div>

        {total === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No case studies match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
