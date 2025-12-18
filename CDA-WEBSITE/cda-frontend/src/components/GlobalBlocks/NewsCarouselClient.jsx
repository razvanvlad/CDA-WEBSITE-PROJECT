"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';

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

export default function NewsCarouselClient({ title, subtitle, newsCarousel, articles = [] }) {
  // Support both props structure (direct `articles` prop or `newsCarousel` object)
  const items = articles.length > 0 ? articles : (newsCarousel?.manualArticles?.nodes || newsCarousel?.articles || []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalItems = items.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const toHref = (uri) => {
    try {
      const parts = (uri || '').split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || '';
      return slug ? `/news/${slug}` : (uri || '#');
    } catch {
      return uri || '#';
    }
  };

  // Rotating colors for underlines
  const colors = ['#3CBEEB', '#01E486', '#FD8721', '#FF60DF', '#AD80F9'];

  if (!items || items.length === 0) return null;

  // Render a single card
  const renderCard = (post, index, isBig = false) => {
    const imageUrl = post.imageUrl || post.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg';
    const underlineColor = colors[index % colors.length];

    return (
      <Link href={toHref(post.uri)} className="block w-full h-full">
        <article className={`news-card w-full ${isBig ? 'h-[448px]' : 'h-[300px]'} relative overflow-hidden rounded-lg shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
          {/* Image wrapper */}
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
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
          <div className={`absolute bottom-6 left-6 right-6 z-10 ${isBig ? 'text-left' : 'text-center'}`}>
            <h3
              className={`text-white font-bold font-poppins leading-tight ${isBig ? 'text-3xl md:text-3xl line-clamp-3' : 'text-xl md:text-xl line-clamp-3'}`}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
          </div>
        </article>
      </Link>
    );
  };

  // --- Mobile Slider Logic ---
  const renderMobile = () => (
    <div className="relative overflow-hidden w-full pb-4">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(calc(-${activeIndex * 353}px + calc(50% - 176.5px)))` // Center the active card
        }}
      >
        {items.map((post, i) => (
          <div
            key={`${post.id}-${i}`}
            className="flex-shrink-0 w-[353px] px-[10px]" // Match design width + gap
          >
            {renderCard(post, i, true)} {/* Use Big Card style for mobile logic but size constrained by container */}
          </div>
        ))}
      </div>

      {/* Mobile Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="w-12 h-12 flex items-center justify-center bg-white rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <img src="/images/arrow-icons/left-arrow.svg" alt="Previous" className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next"
          className="w-12 h-12 flex items-center justify-center bg-white rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <img src="/images/arrow-icons/right-arrow.svg" alt="Next" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // --- Desktop Grid Logic ---
  const renderDesktop = () => {
    // Calculate indices for circular buffer
    // Slot 1: Left Edge (prev)
    const idx0 = (activeIndex - 1 + totalItems) % totalItems;
    // Slot 2: BIG (current)
    const idx1 = activeIndex;
    // Slot 3: Small (next)
    const idx2 = (activeIndex + 1) % totalItems;
    // Slot 4: Right Edge (next + 1)
    const idx3 = (activeIndex + 2) % totalItems;

    // We only display these 4 specific slots
    // If totalItems < 4, we might duplicate items to fill slots.
    // For simplicity, we just use modulo.

    return (
      <div className="relative w-full h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">

          {/* Slot 1: Left Edge - partially visible */}
          <div className="absolute left-[-200px] w-[300px] h-[300px] opacity-60 scale-90 transition-all duration-500 z-0">
            {renderCard(items[idx0], idx0, false)}
          </div>

          {/* Container for Main and Small cards to center them together */}
          <div className="relative flex items-center gap-8 z-10">

            {/* Slot 2: BIG Main Card used as anchor */}
            <div className="w-[500px] h-[480px] transition-all duration-500 z-20">
              {renderCard(items[idx1], idx1, true)}
            </div>

            {/* Slot 3: Small Card to the right */}
            <div className="w-[300px] h-[300px] transition-all duration-500 z-10">
              {renderCard(items[idx2], idx2, false)}
            </div>

          </div>

          {/* Slot 4: Right Edge - partially visible */}
          <div className="absolute right-[-150px] w-[300px] h-[300px] opacity-60 scale-90 transition-all duration-500 z-0">
            {renderCard(items[idx3], idx3, false)}
          </div>

        </div>

        {/* Desktop Navigation Arrows (Absolutely positioned) */}
        <button
          onClick={handlePrev}
          className="absolute left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <img src="/images/arrow-icons/left-arrow.svg" alt="Previous" className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <img src="/images/arrow-icons/right-arrow.svg" alt="Next" className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <section className="news-carousel-section py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="cda-subtitle">{subtitle || 'Latest'}</p>
            <h2 className="cda-title">{title || 'News & Insights'}</h2>
          </div>
          <Link href="/news" className="hidden md:inline-flex items-center text-black font-semibold hover:underline">
            All News
          </Link>
        </div>

        {/* Content */}
        {isMobile ? renderMobile() : renderDesktop()}

        <div className="mt-8 text-center md:hidden">
          <Link href="/news" className="button-l inline-block">
            All News
          </Link>
        </div>

      </div>
    </section>
  );
}

