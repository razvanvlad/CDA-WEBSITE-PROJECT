"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { getServiceColor, getServiceTitle } from '@/lib/serviceColors';

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '') || '';
}

// Badge component with SVG underline
function BadgeWithUnderline({ children, color }) {
  const textRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.offsetWidth);
    }
  }, [children]);

  const curveIntensity = 0.01;
  const strokeWidth = 5;
  const underlineOffset = 16;

  const curveDepth = width * curveIntensity;
  const svgHeight = Math.max(curveDepth + strokeWidth * 2, strokeWidth * 2);
  const startY = curveDepth + strokeWidth;
  const controlY = strokeWidth;
  const endY = curveDepth + strokeWidth;
  const path = `M 0 ${startY} Q ${width / 2} ${controlY} ${width} ${endY}`;

  return (
    <span className="knowledge-hub-card__badge-wrapper">
      <span ref={textRef} className="knowledge-hub-card__badge">
        {children}
      </span>
      {width > 0 && (
        <svg
          width={width}
          height={svgHeight}
          style={{
            position: 'absolute',
            top: `${underlineOffset}px`,
            left: 0,
          }}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={path}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </span>
  );
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
  const sortDate = searchParams.get('sortDate') || 'newest'; // 'newest' | 'oldest'
  const sortType = searchParams.get('sortType') || 'all'; // 'all' | 'case-study' | 'news'
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1);
  const perPage = 15; // 6 rows (2+3+2+3+2+3 = 15 articles)

  // Filter by type first
  if (sortType === 'case-study') {
    items = items.filter(item => item.kind === 'case-study');
  } else if (sortType === 'news') {
    items = items.filter(item => item.kind === 'post');
  }

  // Sort by date
  items.sort((a, b) => {
    const ad = new Date(a.data?.date || 0).getTime();
    const bd = new Date(b.data?.date || 0).getTime();
    return sortDate === 'oldest' ? ad - bd : bd - ad;
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

  const handleSortDateChange = (e) => {
    updateParam({ sortDate: e.target.value, page: 1 });
  };

  const handleSortTypeChange = (e) => {
    updateParam({ sortType: e.target.value, page: 1 });
  };

  const goto = (p) => updateParam({ page: p });

  // Sorting controls component - reusable for top and bottom
  const SortingControls = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 whitespace-nowrap">Sort by Date:</label>
          <select
            value={sortDate}
            onChange={handleSortDateChange}
            className="sort-dropdown"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 whitespace-nowrap">Article Type:</label>
          <select
            value={sortType}
            onChange={handleSortTypeChange}
            className="sort-dropdown"
          >
            <option value="all">All Types</option>
            <option value="case-study">Case Studies</option>
            <option value="news">News</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Pagination component - reusable for top and bottom
  const PaginationControls = () => {
    const renderPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible + 2) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => goto(i)}
              className={i === currentPage ? 'pagination-btn pagination-btn--active' : 'pagination-btn'}
            >
              {i}
            </button>
          );
        }
      } else {
        // Always show first page
        pages.push(
          <button
            key={1}
            onClick={() => goto(1)}
            className={1 === currentPage ? 'pagination-btn pagination-btn--active' : 'pagination-btn'}
          >
            1
          </button>
        );

        // Show ellipsis or pages around current
        if (currentPage > 3) {
          pages.push(
            <span key="ellipsis-start" className="pagination-ellipsis">
              ...
            </span>
          );
        }

        // Show pages around current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => goto(i)}
              className={i === currentPage ? 'pagination-btn pagination-btn--active' : 'pagination-btn'}
            >
              {i}
            </button>
          );
        }

        // Show ellipsis before last page
        if (currentPage < totalPages - 2) {
          pages.push(
            <span key="ellipsis-end" className="pagination-ellipsis">
              ...
            </span>
          );
        }

        // Always show last page
        pages.push(
          <button
            key={totalPages}
            onClick={() => goto(totalPages)}
            className={totalPages === currentPage ? 'pagination-btn pagination-btn--active' : 'pagination-btn'}
          >
            {totalPages}
          </button>
        );
      }

      return pages;
    };

    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => goto(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="pagination-btn pagination-btn--arrow"
          aria-label="Previous page"
        >
          <img src="/images/arrow-icons/left-arrow.svg" alt="Previous" className="pagination-arrow-icon" />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => goto(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="pagination-btn pagination-btn--arrow"
          aria-label="Next page"
        >
          <img src="/images/arrow-icons/right-arrow.svg" alt="Next" className="pagination-arrow-icon" />
        </button>
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Controls row - Sorting LEFT, Pagination RIGHT */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* LEFT: Top Sorting Controls */}
          <SortingControls />

          {/* RIGHT: Top Pagination - ALWAYS SHOW */}
          <div className="self-end md:self-auto">
            <PaginationControls />
          </div>
        </div>

        {/* Masonry Grid Layout - 2-3-2-3-2-3 pattern */}
        <div className="knowledge-hub-masonry-grid">
          {pagedItems.map((item, index) => {
            if (item.kind === 'case-study') {
              const cs = item.data;
              const imageUrl = cs.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg';
              // Rotate colors for underline
              const colors = ['#3CBEEB', '#01E486', '#FD8721', '#FF60DF', '#AD80F9'];
              const underlineColor = colors[index % colors.length];

              return (
                <Link href={`/case-studies/${cs.slug}`} key={item.id}>
                  <article className="knowledge-hub-card knowledge-hub-card--case-study">
                    <div className="knowledge-hub-card__image-wrapper">
                      <Image
                        src={imageUrl}
                        alt={cs.featuredImage?.node?.altText || cs.title}
                        fill
                        className="knowledge-hub-card__image"
                      />
                      <div className="knowledge-hub-card__overlay"></div>
                    </div>
                    {/* Top left: Tag */}
                    <div className="knowledge-hub-card__top">
                      <BadgeWithUnderline color={underlineColor}>
                        Case Study
                      </BadgeWithUnderline>
                    </div>
                    {/* Bottom left: Title */}
                    <div className="knowledge-hub-card__bottom knowledge-hub-card__bottom--left">
                      <h3 className="knowledge-hub-card__title">{cs.title}</h3>
                    </div>
                  </article>
                </Link>
              );
            }

            const p = item.data;
            const imageUrl = p.blogPosts?.hero?.image?.node?.sourceUrl || p.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg';

            // Get category and color
            const category = p.blogCategories?.nodes?.[0];
            const categorySlug = category?.slug || '';
            const underlineColor = getServiceColor(categorySlug);

            // Get all categories as comma-separated string
            const categoriesText = p.blogCategories?.nodes?.map(cat => cat.name).join(', ') || '';

            return (
              <Link href={`/news/${p.slug}`} key={item.id}>
                <article className="knowledge-hub-card knowledge-hub-card--news">
                  <div className="knowledge-hub-card__image-wrapper">
                    <Image
                      src={imageUrl}
                      alt={p.blogPosts?.hero?.image?.node?.altText || p.featuredImage?.node?.altText || p.title}
                      fill
                      className="knowledge-hub-card__image"
                    />
                    <div className="knowledge-hub-card__overlay"></div>
                  </div>
                  {/* Top: News badge (left) + Date (right) */}
                  <div className="knowledge-hub-card__top knowledge-hub-card__top--spread">
                    <BadgeWithUnderline color={underlineColor}>
                      News
                    </BadgeWithUnderline>
                    <time className="knowledge-hub-card__date">
                      {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>
                  {/* Bottom center: Categories + Title */}
                  <div className="knowledge-hub-card__bottom knowledge-hub-card__bottom--center">
                    {/* Categories as plain text */}
                    {categoriesText && (
                      <p className="text-white text-[14px] md:text-[18px] font-normal font-inter mb-2 opacity-90">
                        {categoriesText}
                      </p>
                    )}

                    {/* Title */}
                    <h3 className="knowledge-hub-card__title">{p.title}</h3>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No content matches the selected filter.</p>
          </div>
        )}

        {/* Bottom Controls - Sorting LEFT, Pagination RIGHT */}
        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* LEFT: Bottom Sorting Controls */}
          <SortingControls />

          {/* RIGHT: Bottom Pagination */}
          <div className="self-end md:self-auto">
            <PaginationControls />
          </div>
        </div>
      </div>
    </section>
  );
}
