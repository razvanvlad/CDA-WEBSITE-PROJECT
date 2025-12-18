'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SocialIcons from '../SocialIcons';

const CultureGallerySlider = ({ globalData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Extract data from props
  const title = globalData?.title || 'Our Culture';
  const subtitle = globalData?.subtitle || 'See life at CDA';
  const rawImages = globalData?.images;
  const images = Array.isArray(rawImages)
    ? rawImages
    : Array.isArray(rawImages?.nodes)
      ? rawImages.nodes
      : Array.isArray(rawImages?.edges)
        ? (rawImages.edges || []).map((e) => e?.node).filter(Boolean)
        : [];
  const useGlobalSocialLinks = globalData?.useGlobalSocialLinks || false;

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate slides per view and max slides
  const slidesPerView = isMobile ? 2 : 4;
  const maxSlides = Math.max(0, (Array.isArray(images) ? images.length : 0) - slidesPerView);

  // Handle slide navigation for multi-image carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev >= maxSlides ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev <= 0 ? maxSlides : prev - 1
    );
  };

  if (!Array.isArray(images) || images.length === 0) {
    return null; // Don't render if no images
  }

  return (
    <section className="culture-gallery-slider py-16" style={{ backgroundColor: '#ffffffff' }}>
      <div className="cda-container">
        {/* Header */}
        <div className="mb-12">
          {/* First Row: Subtitle - centered on mobile, left on desktop */}
          {subtitle && (
            <div className="mb-4 text-center md:text-left">
              <p className="cda-subtitle">
                {subtitle}
              </p>
            </div>
          )}

          {/* Second Row: Title on left, Social icons on right */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-black text-center md:text-left">
              {title}
            </h2>
            {useGlobalSocialLinks && (
              <SocialIcons variant="black" className="justify-center md:justify-end" />
            )}
          </div>
        </div>

        {/* Multi-Image Slider Container */}
        <div className="relative">
          {/* Images Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`
              }}
            >
              {images.map((image, index) => (
                <div
                  key={image.id || index}
                  className="flex-shrink-0 w-1/2 md:w-1/4 px-2"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
                    <Image
                      src={image.sourceUrl}
                      alt={image.altText || `Culture image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
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

          {/* Navigation Arrows */}
          {images.length > slidesPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10"
                aria-label="Previous images"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10"
                aria-label="Next images"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CultureGallerySlider;
