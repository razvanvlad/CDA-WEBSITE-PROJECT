'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getServiceColor, getServiceTitle } from '@/lib/serviceColors';
import TextLinkButton from '@/components/ui/TextLinkButton';

// Badge component with SVG underline (matching Knowledge Hub)
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
    <span className="news-card__badge-wrapper">
      <span ref={textRef} className="news-card__badge">
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

export default function NewsCarousel({ newsCarousel }) {
  // Support both data structures
  const items = newsCarousel?.manualArticles?.nodes || newsCarousel?.articles || [];

  const [isMobile, setIsMobile] = useState(false);
  // Start at index 1 on mobile so there's always a partial card visible on the left
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const totalItems = items.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  // Rotating colors for underlines
  const colors = ['#3CBEEB', '#01E486', '#FD8721', '#FF60DF', '#AD80F9'];

  const toHref = (uri) => {
    try {
      const parts = (uri || '').split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || '';
      return slug ? `/news/${slug}` : (uri || '#');
    } catch {
      return uri || '#';
    }
  };

  if (!items?.length) return null;

  // Render a single card
  const renderCard = (post, colorIndex, size = 'big') => {
    // Priority: Hero Image -> Featured Image
    const imageUrl = post.blogPosts?.hero?.image?.node?.sourceUrl ||
      post.imageUrl ||
      post.featuredImage?.node?.sourceUrl || '';
    const imageAlt = post.blogPosts?.hero?.image?.node?.altText ||
      post.imageAlt ||
      post.featuredImage?.node?.altText ||
      post.title;

    // Get category and color
    const category = post.blogCategories?.nodes?.[0];
    const categorySlug = category?.slug || '';
    const categoryName = category?.name || getServiceTitle(categorySlug);
    const underlineColor = getServiceColor(categorySlug);

    // Size classes based on card type
    let sizeClasses = '';
    if (size === 'big') {
      sizeClasses = 'w-[1064px] h-[632px]';
    } else if (size === 'small') {
      sizeClasses = 'w-[512px] h-[632px]';
    } else if (size === 'edge') {
      sizeClasses = 'w-[512px] h-[296px]';
    }

    return (
      <Link href={toHref(post.uri)} className="block w-full h-full">
        <article className={`${sizeClasses} relative overflow-hidden rounded-lg shadow-lg group cursor-pointer transition-all duration-500 hover:shadow-xl`}>
          {/* Image wrapper */}
          <div className="absolute inset-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700" />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 group-hover:from-black/40 group-hover:to-black/80 transition-colors duration-300" />
          </div>

          {/* Top section: News badge (left) + Date (right) */}
          <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
            <BadgeWithUnderline color={underlineColor}>
              News
            </BadgeWithUnderline>
            {post.date && (
              <time className="text-white font-bold font-poppins text-lg opacity-90">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            )}
          </div>

          {/* Bottom section: Categories and Title */}
          <div className="absolute bottom-6 left-6 right-6 z-10 transition-transform duration-500 group-hover:-translate-y-2">
            {/* Categories as plain text */}
            {post.blogCategories?.nodes && post.blogCategories.nodes.length > 0 && (
              <p className="text-white text-[14px] md:text-[18px] font-normal font-inter mb-2 opacity-90">
                {post.blogCategories.nodes.map(cat => cat.name).join(', ')}
              </p>
            )}

            {/* Title */}
            <h3
              className={`text-white font-bold font-poppins leading-tight line-clamp-3 ${size === 'big' ? 'text-3xl' : 'text-xl'}`}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />

            {/* Read More Button (simulated TextLinkButton structure for valid HTML inside Link) */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="button-without-box button-without-box-white inline-flex">
                <span className="button-text">Read More</span>
                <span className="button-icon-wrapper">
                  <img
                    src="/images/arrow-icons/diagonal-right-arrow-white.svg"
                    alt=""
                    className="button-icon button-icon-default"
                    aria-hidden="true"
                  />
                  <img
                    src="/images/arrow-icons/right-arrow-white.svg"
                    alt=""
                    className="button-icon button-icon-hover"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  };

  // --- Mobile Slider ---
  const renderMobile = () => (
    <div className="relative overflow-hidden w-full pb-4">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(calc(-${activeIndex * 353}px + calc(50% - 176.5px)))`
        }}
      >
        {items.map((post, i) => (
          <div
            key={post.id || i}
            className="flex-shrink-0 w-[353px] h-[448px] px-[10px]"
          >
            <Link href={toHref(post.uri)} className="block w-full h-full">
              <article className="w-full h-full relative overflow-hidden rounded-lg shadow-lg group cursor-pointer">
                <div className="absolute inset-0">
                  {(post.blogPosts?.hero?.image?.node?.sourceUrl || post.imageUrl || post.featuredImage?.node?.sourceUrl) ? (
                    <img
                      src={post.blogPosts?.hero?.image?.node?.sourceUrl || post.imageUrl || post.featuredImage?.node?.sourceUrl}
                      alt={post.blogPosts?.hero?.image?.node?.altText || post.imageAlt || post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
                </div>

                {/* Top section: News badge (left) + Date (right) */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                  <BadgeWithUnderline color={getServiceColor(post.blogCategories?.nodes?.[0]?.slug || '')}>
                    News
                  </BadgeWithUnderline>
                  {post.date && (
                    <time className="text-white font-bold font-poppins text-sm opacity-90">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  )}
                </div>

                {/* Bottom section: Categories + Title */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  {/* Categories as plain text */}
                  {post.blogCategories?.nodes && post.blogCategories.nodes.length > 0 && (
                    <p className="text-white text-[14px] font-normal font-inter mb-2 opacity-90">
                      {post.blogCategories.nodes.map(cat => cat.name).join(', ')}
                    </p>
                  )}

                  {/* Title */}
                  <h3 className="text-white font-bold font-poppins text-xl leading-tight line-clamp-3" dangerouslySetInnerHTML={{ __html: post.title }} />
                </div>
              </article>
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button onClick={handlePrev} aria-label="Previous" className="p-0 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
          <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
        </button>
        <button onClick={handleNext} aria-label="Next" className="p-0 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
          <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
        </button>
      </div>
    </div>
  );

  // --- Desktop Layout: Big + Small + Edge cards (2 rows on each edge) ---
  const renderDesktop = () => {
    // Calculate indices for circular buffer - need 6 items for edges
    const idxLeftTop = (activeIndex - 2 + totalItems) % totalItems; // Left Edge Top
    const idxLeftBottom = (activeIndex - 1 + totalItems) % totalItems; // Left Edge Bottom
    const idxBig = activeIndex; // BIG (main focus)
    const idxSmall = (activeIndex + 1) % totalItems; // Small (right of big)
    const idxRightTop = (activeIndex + 2) % totalItems; // Right Edge Top
    const idxRightBottom = (activeIndex + 3) % totalItems; // Right Edge Bottom

    return (
      <div className="relative w-full overflow-hidden" style={{ height: '700px' }}>
        {/* Container for all cards - centered */}
        <div className="absolute inset-0 flex items-center justify-center">

          {/* Left Edge Cards - 2 stacked, partially visible */}
          <div
            className="absolute flex flex-col opacity-60 transition-all duration-500"
            style={{
              left: '-400px',
              top: '50%',
              transform: 'translateY(-50%)',
              gap: '40px'
            }}
          >
            {renderCard(items[idxLeftTop], idxLeftTop, 'edge')}
            {renderCard(items[idxLeftBottom], idxLeftBottom, 'edge')}
          </div>

          {/* Main cards container - Big + Small with 40px gap */}
          <div className="flex items-center" style={{ gap: '40px' }}>
            {/* BIG Card - 1064x658 */}
            <div className="flex-shrink-0 transition-all duration-500">
              {renderCard(items[idxBig], idxBig, 'big')}
            </div>

            {/* Small Card - 512x657 */}
            <div className="flex-shrink-0 transition-all duration-500">
              {renderCard(items[idxSmall], idxSmall, 'small')}
            </div>
          </div>

          {/* Right Edge Cards - 2 stacked, partially visible */}
          <div
            className="absolute flex flex-col opacity-60 transition-all duration-500"
            style={{
              right: '-400px',
              top: '50%',
              transform: 'translateY(-50%)',
              gap: '40px'
            }}
          >
            {renderCard(items[idxRightTop], idxRightTop, 'edge')}
            {renderCard(items[idxRightBottom], idxRightBottom, 'edge')}
          </div>

        </div>
      </div>
    );
  };


  return (
    <section className="news-carousel py-16 bg-white overflow-hidden">
      {/* Header with container */}
      <div className="cda-container mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-left">
            <p className="cda-subtitle">
              {newsCarousel?.subtitle || 'Latest News'}
            </p>
            <h2 className="cda-title">
              {newsCarousel?.title || 'News & Insights'}
            </h2>
            {/* Mobile: All News button under title */}
            <div className="mt-4 md:hidden">
              <TextLinkButton href="/news">
                All News
              </TextLinkButton>
            </div>
          </div>

          {/* Desktop: Arrows + All News */}
          <div className="hidden md:flex items-center gap-6 whitespace-nowrap">
            <div className="flex items-center gap-2 mr-5">
              <button
                onClick={handlePrev}
                aria-label="Previous"
                className="p-0 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next"
                className="p-0 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
              </button>
            </div>
            <TextLinkButton href="/news">
              All News
            </TextLinkButton>
          </div>
        </div>
      </div>

      {/* Carousel - full width for edge-to-edge effect */}
      <div className="w-full">
        {isMobile ? renderMobile() : renderDesktop()}
      </div>
    </section>
  );
}
