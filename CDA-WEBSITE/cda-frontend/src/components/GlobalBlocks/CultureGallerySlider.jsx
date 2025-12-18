'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SocialIcons from '../SocialIcons';

const CultureGallerySlider = ({ globalData }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Drag handling state
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [draggingOffset, setDraggingOffset] = useState(0);
  const sliderRef = useRef(null);

  // Extract data from props
  const title = globalData?.title || 'Our Culture';
  const subtitle = globalData?.subtitle || 'See life at CDA';
  const rawImages = globalData?.images;
  const originalImages = Array.isArray(rawImages)
    ? rawImages
    : Array.isArray(rawImages?.nodes)
      ? rawImages.nodes
      : Array.isArray(rawImages?.edges)
        ? (rawImages.edges || []).map((e) => e?.node).filter(Boolean)
        : [];
  const useGlobalSocialLinks = globalData?.useGlobalSocialLinks || false;

  // Clones setup: Increase clone count for smoother infinite loop
  const CLONE_COUNT = Math.max(5, originalImages.length);
  const images = React.useMemo(() => {
    if (originalImages.length === 0) return [];
    const repeats = Math.ceil(CLONE_COUNT / originalImages.length);
    const startClones = Array(repeats).fill(originalImages).flat().slice(-CLONE_COUNT);
    const endClones = Array(repeats).fill(originalImages).flat().slice(0, CLONE_COUNT);
    return [...startClones, ...originalImages, ...endClones];
  }, [originalImages]);

  // Start at CLONE_COUNT (first real image)
  const [currentSlide, setCurrentSlide] = useState(CLONE_COUNT);
  const [useTransition, setUseTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Configuration
  const slideWidth = isMobile ? 75 : 22;
  const visibleCount = isMobile ? 1 : 4;
  const centerOffset = (100 - (visibleCount * slideWidth)) / 2;

  // --- Infinite Loop Logic ---

  const moveSlide = (dir) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUseTransition(true);
    setCurrentSlide(prev => prev + dir);
  };

  const nextSlide = () => moveSlide(1);
  const prevSlide = () => moveSlide(-1);

  const handleTransitionEnd = () => {
    // Check clone status
    const totalLen = images.length;
    if (currentSlide < CLONE_COUNT) {
      // At the beginning clones, jump to the end section
      setUseTransition(false);
      setCurrentSlide(currentSlide + originalImages.length);
      // Use requestAnimationFrame for smoother re-enable
      requestAnimationFrame(() => {
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
          setUseTransition(true);
        }, 20);
      });
    } else if (currentSlide >= totalLen - CLONE_COUNT) {
      // At the ending clones, jump to the beginning section
      setUseTransition(false);
      setCurrentSlide(currentSlide - originalImages.length);
      requestAnimationFrame(() => {
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
          setUseTransition(true);
        }, 20);
      });
    } else {
      setIsTransitioning(false);
    }
  };

  // Drag Event Handlers
  const handleDragStart = (e) => {
    // Clear any pending transitions
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    if (isTransitioning) return;
    setIsDragging(true);
    setUseTransition(false);
    const clientX = e.pageX || e.touches?.[0]?.pageX;
    setStartPos(clientX);
    setDraggingOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default scrolling behavior
    const clientX = e.pageX || e.touches?.[0]?.pageX;
    if (clientX === undefined) return;
    const diff = clientX - startPos;
    setDraggingOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    const slideWidthPx = sliderRef.current ? sliderRef.current.offsetWidth * (slideWidth / 100) : 300;
    const effectiveThreshold = Math.min(threshold, slideWidthPx * 0.3);

    // Enable transition for smooth snap
    setUseTransition(true);

    if (draggingOffset < -effectiveThreshold) {
      // Dragged left (swipe left), go to previous
      setIsTransitioning(true);
      setCurrentSlide(prev => prev - 1);
    } else if (draggingOffset > effectiveThreshold) {
      // Dragged right (swipe right), go to next
      setIsTransitioning(true);
      setCurrentSlide(prev => prev + 1);
    }
    // else: snap back to current position

    setDraggingOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };


  if (!originalImages || originalImages.length === 0) {
    return null;
  }

  return (
    <section className="culture-gallery-slider py-16" style={{ backgroundColor: '#ffffffff' }}>
      <div className="cda-container mb-12">
        {subtitle && (
          <div className="mb-4 text-center md:text-left">
            <p className="cda-subtitle">{subtitle}</p>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center md:text-left">
            {title}
          </h2>
          {useGlobalSocialLinks && (
            <SocialIcons variant="black" className="justify-center md:justify-end" />
          )}
        </div>
      </div>

      <div
        className="w-full relative select-none"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y pinch-zoom'
        }}
      >
        <div className="overflow-hidden">
          <div
            ref={sliderRef}
            className="flex"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transition: useTransition ? 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              transform: `translateX(calc(-${currentSlide * slideWidth}% + ${centerOffset}% + ${draggingOffset}px))`,
              willChange: isDragging ? 'transform' : 'auto'
            }}
          >
            {images.map((image, index) => (
              <div
                key={`${image.id || 'clone'}-${index}`}
                className="flex-shrink-0 px-2"
                style={{ width: `${slideWidth}%` }}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-lg pointer-events-none">
                  <Image
                    src={image.sourceUrl}
                    alt={image.altText || `Culture image`}
                    fill
                    className="object-cover"
                    draggable={false}
                    sizes="(max-width: 768px) 80vw, 25vw"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                      <p className="text-xs text-center truncate">{image.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 md:px-8">
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="pointer-events-auto bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10 cursor-pointer"
            aria-label="Previous images"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="pointer-events-auto bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10 cursor-pointer"
            aria-label="Next images"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CultureGallerySlider;
