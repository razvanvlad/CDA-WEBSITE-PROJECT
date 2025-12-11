'use client';
import React, { useState } from 'react';
import Image from 'next/image';

/**
 * TechnologiesSlider Component
 * 
 * Displays a technologies slider with:
 * - Subtitle
 * - Title
 * - Logo images in a continuous slider (desktop) or manual slider (mobile)
 * 
 * @param {Object} props - Component props
 */
const TechnologiesSlider = ({ globalData, subtitle, title, logos }) => {
  // Use globalData structure if provided, otherwise use individual props
  const data = globalData || { subtitle, title, logos };
  const [mobileIndex, setMobileIndex] = useState(0);

  // Don't render if no data
  if (!data.subtitle && !data.title && (!data.logos || data.logos.length === 0)) {
    return null;
  }

  // Mobile slider configuration
  const itemsPerViewMobile = 2;
  const maxIndex = Math.max(0, (data.logos?.length || 0) - itemsPerViewMobile);

  const next = () => setMobileIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prev = () => setMobileIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  // Helper to render a logo item
  const renderLogo = (logo, index, keyPrefix) => (
    <div key={`${keyPrefix}-${index}`} className="logo-item flex-shrink-0 relative">
      {(logo?.url || logo?.node?.sourceUrl || logo?.sourceUrl) ? (
        <Image
          src={logo.url || logo.node?.sourceUrl || logo.sourceUrl}
          alt={logo.alt || logo.node?.altText || logo.altText || logo.title || `Technology ${index + 1}`}
          width={150}
          height={55}
          className="logo-image"
          style={{ height: '55px', width: 'auto', objectFit: 'contain' }}
        />
      ) : (
        <span className="logo-fallback">{logo?.title || `Tech ${index + 1}`}</span>
      )}
    </div>
  );

  return (
    <section className="technologies-slider">
      <div className="container">
        {/* Header Section */}
        <div className="technologies-header">
          {data.subtitle && (
            <p className="cda-subtitle">{data.subtitle}</p>
          )}
          {data.title && (
            <h2 className="section-title">{data.title}</h2>
          )}
        </div>
      </div>

      {/* content wrapper - Full Width */}
      <div className="technologies-content">

        {/* DESKTOP: Infinite Scroll */}
        <div className="hidden md:flex w-full overflow-hidden whitespace-nowrap mask-gradient relative">
          <div className="inline-flex flex-none animate-slow-infinite-scroll items-center gap-16 pr-16">
            {data.logos.map((logo, index) => renderLogo(logo, index, 'd1'))}
          </div>
          <div className="inline-flex flex-none animate-slow-infinite-scroll items-center gap-16 pr-16" aria-hidden="true">
            {data.logos.map((logo, index) => renderLogo(logo, index, 'd2'))}
          </div>
        </div>

        {/* MOBILE: Manual Slider */}
        <div className="md:hidden container">
          <div className="overflow-hidden mb-8">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${mobileIndex * (100 / itemsPerViewMobile)}%)` }}
            >
              {data.logos.map((logo, index) => (
                <div
                  key={`m-${index}`}
                  className="flex-shrink-0 flex justify-center px-4"
                  style={{ width: `${100 / itemsPerViewMobile}%` }}
                >
                  <div className="logo-item w-full flex justify-center items-center">
                    {(logo?.url || logo?.node?.sourceUrl || logo?.sourceUrl) ? (
                      <Image
                        src={logo.url || logo.node?.sourceUrl || logo.sourceUrl}
                        alt={logo.alt || logo.node?.altText || logo.altText || logo.title || `Technology ${index + 1}`}
                        width={120}
                        height={55}
                        className="logo-image"
                        style={{ height: '55px', width: 'auto' }}
                      />
                    ) : (
                      <span className="logo-fallback">{logo?.title || `Tech ${index + 1}`}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              aria-label="Previous"
              onClick={prev}
              className={`p-0 flex-shrink-0 transition-opacity ${mobileIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-100 active:opacity-100 cursor-pointer'}`}
              disabled={mobileIndex === 0}
            >
              <img alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" src="/images/arrow-icons/left-arrow.svg" />
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className={`p-0 flex-shrink-0 transition-opacity ${mobileIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-100 active:opacity-100 cursor-pointer'}`}
              disabled={mobileIndex >= maxIndex}
            >
              <img alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" src="/images/arrow-icons/right-arrow.svg" />
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`
        .logo-fallback {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }
      `}</style>
      <style jsx>{`
        .technologies-slider {
          padding: 80px 0;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .technologies-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .logo-item:hover {
          transform: translateY(-2px);
        }

        .logo-image {
          height: 55px;
          width: auto;
          object-fit: contain;
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }

        .logo-item:hover .logo-image {
          filter: grayscale(0%);
        }

        .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        @media (max-width: 768px) {
          .technologies-slider {
            padding: 60px 0;
          }
          .technologies-header {
            margin-bottom: 40px;
          }
          .logo-item {
            min-height: 80px;
            padding: 5px;
          }
        }
      `}</style>
    </section>
  );
};

export default TechnologiesSlider;