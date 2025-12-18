'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const [activeIndex, setActiveIndex] = useState(0);

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
    const imageUrl = post.imageUrl || post.featuredImage?.node?.sourceUrl || '';
    const imageAlt = post.imageAlt || post.featuredImage?.node?.altText || post.title;
    const underlineColor = colors[colorIndex % colors.length];

    // Size classes based on card type
    let sizeClasses = '';
    if (size === 'big') {
      sizeClasses = 'w-[1064px] h-[658px]';
    } else if (size === 'small') {
      sizeClasses = 'w-[512px] h-[657px]';
    } else if (size === 'edge') {
      sizeClasses = 'w-[512px] h-[296px]';
    }

    return (
      <Link href={toHref(post.uri)} className="block w-full h-full">
        <article className={`${sizeClasses} relative overflow-hidden rounded-lg shadow-lg group cursor-pointer transition-all duration-500 hover:shadow-xl`}>
          {/* Image wrapper */}
          <div className="absolute inset-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700" />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 group-hover:from-black/40 group-hover:to-black/80 transition-colors duration-300" />
          </div>

          {/* Top section: Badge and Date */}
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

          {/* Bottom section: Title */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <h3
              className={`text-white font-bold font-poppins leading-tight line-clamp-3 ${size === 'big' ? 'text-3xl' : 'text-xl'}`}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
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
                  {(post.imageUrl || post.featuredImage?.node?.sourceUrl) ? (
                    <Image
                      src={post.imageUrl || post.featuredImage?.node?.sourceUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
                </div>
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                  <BadgeWithUnderline color={colors[i % colors.length]}>News</BadgeWithUnderline>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
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

  // --- Desktop Layout: Big + Small + Edge cards ---
  const renderDesktop = () => {
    // Calculate indices for circular buffer
    const idx0 = (activeIndex - 1 + totalItems) % totalItems; // Left Edge (partial)
    const idx1 = activeIndex; // BIG (main focus)
    const idx2 = (activeIndex + 1) % totalItems; // Small (right of big)
    const idx3 = (activeIndex + 2) % totalItems; // Right Edge (partial)

    return (
      <div className="relative w-full overflow-hidden" style={{ height: '700px' }}>
        {/* Container for all cards - centered */}
        <div className="absolute inset-0 flex items-center justify-center">

          {/* Left Edge Card - partially visible off-screen */}
          <div
            className="absolute flex-shrink-0 opacity-60 transition-all duration-500"
            style={{ left: '-400px', top: '50%', transform: 'translateY(-50%)' }}
          >
            {renderCard(items[idx0], idx0, 'edge')}
          </div>

          {/* Main cards container */}
          <div className="flex items-center gap-6">
            {/* BIG Card - 1064x658 */}
            <div className="flex-shrink-0 transition-all duration-500">
              {renderCard(items[idx1], idx1, 'big')}
            </div>

            {/* Small Card - 512x657 */}
            <div className="flex-shrink-0 transition-all duration-500">
              {renderCard(items[idx2], idx2, 'small')}
            </div>
          </div>

          {/* Right Edge Card - partially visible off-screen */}
          <div
            className="absolute flex-shrink-0 opacity-60 transition-all duration-500"
            style={{ right: '-400px', top: '50%', transform: 'translateY(-50%)' }}
          >
            {renderCard(items[idx3], idx3, 'edge')}
          </div>

        </div>

        {/* Navigation Arrows - at edges */}
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-0 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next"
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-0 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
        </button>
      </div>
    );
  };

  return (
    <section className="news-carousel py-16 bg-[#F4F4F4] overflow-hidden">
      {/* Header with container */}
      <div className="mx-auto w-full max-w-[1620px] px-[38px] md:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="text-center md:text-left">
            <p className="cda-subtitle">
              {newsCarousel?.subtitle || 'Latest News'}
            </p>
            <h2 className="cda-title">
              {newsCarousel?.title || 'News & Insights'}
            </h2>
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

      {/* Mobile All News button */}
      <div className="mt-8 text-center md:hidden">
        <Link href="/news" className="button-l inline-block">
          All News
        </Link>
      </div>
    </section>
  );
}
