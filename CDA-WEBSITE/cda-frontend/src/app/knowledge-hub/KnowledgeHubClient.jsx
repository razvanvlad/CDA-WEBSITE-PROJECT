"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '') || '';
}

export default function KnowledgeHubClient({ initialCaseStudies = [], initialPosts = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedType = searchParams.get('service_type') || null;

  const norm = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

  const filterPostsByCategory = (items) => {
    if (!selectedType) return items;
    return items.filter((p) => {
      const cats = (p?.blogCategories?.nodes || []).map((n) => [n.slug, n.name].map(norm)).flat();
      return cats.includes(norm(selectedType));
    });
  };

  // Build a single combined list based on selection
  let items = [];
  if (!selectedType) {
    items = [
      ...initialCaseStudies.map((cs) => ({ kind: 'case-study', id: cs.id, data: cs })),
      ...initialPosts.map((p) => ({ kind: 'post', id: p.id, data: p })),
    ];
  } else if (selectedType === 'case-studies') {
    items = initialCaseStudies.map((cs) => ({ kind: 'case-study', id: cs.id, data: cs }));
  } else {
    items = filterPostsByCategory(initialPosts).map((p) => ({ kind: 'post', id: p.id, data: p }));
  }

  // Sorting and pagination
  const sort = (searchParams.get('sort') || 'newest').toLowerCase(); // 'newest' | 'oldest'
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1);
  const perPage = 12; // 4 rows x 3 columns

  items.sort((a, b) => {
    const ad = new Date(a.data?.date || 0).getTime();
    const bd = new Date(b.data?.date || 0).getTime();
    return sort === 'oldest' ? ad - bd : bd - ad;
  });

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const pagedItems = items.slice(start, start + perPage);

  const updateParam = (updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') next.delete(k);
      else next.set(k, String(v));
    });
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleSortChange = (e) => {
    updateParam({ sort: e.target.value, page: 1 });
  };

  const goto = (p) => updateParam({ page: p });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Controls row */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">{items.length} results</div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Sort by:</label>
            <select value={sort} onChange={handleSortChange} className="border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pagedItems.map((item) => {
            if (item.kind === 'case-study') {
              const cs = item.data;
              return (
                <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200">
                  {cs.featuredImage?.node?.sourceUrl && (
                    <div className="relative h-48">
                      <Image src={cs.featuredImage.node.sourceUrl} alt={cs.featuredImage.node.altText || cs.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Case Study</span>
                      {cs.projectTypes?.nodes?.[0]?.name && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{cs.projectTypes.nodes[0].name}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{cs.title}</h3>
                    {cs.excerpt && (
                      <div className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: cs.excerpt }} />
                    )}
                    {cs.caseStudyFields?.projectOverview?.clientName && (
                      <p className="text-sm text-gray-500 mb-4">Client: {cs.caseStudyFields.projectOverview.clientName}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Link href={`/case-studies/${cs.slug}`} className="button-without-box">Read More</Link>
                      <time className="text-sm text-gray-500">{new Date(cs.date).toLocaleDateString()}</time>
                    </div>
                  </div>
                </article>
              );
            }

            const p = item.data;
            return (
              <article key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {p.featuredImage?.node?.sourceUrl && (
                  <div className="relative h-48">
                    <Image src={p.featuredImage.node.sourceUrl} alt={p.featuredImage.node.altText || p.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">News</span>
                    {p.blogCategories?.nodes?.[0]?.name && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{p.blogCategories.nodes[0].name}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{p.title}</h3>
                  {p.excerpt && (
                    <div className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: p.excerpt }} />
                  )}
                  <div className="flex items-center justify-between">
                    <Link href={`/news/${p.slug}`} className="button-without-box">Read More</Link>
                    <time className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</time>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No content matches the selected filter.</p>
          </div>
        )}

        {/* Pagination */}
        {items.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => goto(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-2 border border-gray-300 bg-white text-sm disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goto(p)}
                className={`px-3 py-2 border text-sm ${p === currentPage ? 'bg-black text-white border-black' : 'bg-white border-gray-300'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => goto(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 border border-gray-300 bg-white text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
