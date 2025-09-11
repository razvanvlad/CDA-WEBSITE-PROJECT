'use client';

import React from 'react';

/*
  Showreel Block
  - Renders hero image with optional Play badge
  - Displays client logos under the image in a responsive row
  - Compatible with both new (globalContentBlocks.showreel.logos) and legacy (showreelBlock.clientLogos) shapes
*/
const Showreel = ({ globalData }) => {
  if (!globalData) return null;

  const title = globalData.title;
  const subtitle = globalData.subtitle;
  const button = globalData.button; // { url, title, target }
  const largeImage = globalData.largeImage || globalData.videoThumbnail;

  // Normalize logos list across possible schemas
  const logos = (() => {
    // New clean schema: logos: [{ logo: { node: { sourceUrl, altText } } }]
    if (Array.isArray(globalData.logos)) {
      return globalData.logos
        .map((item) => item?.logo?.node)
        .filter((n) => n && n.sourceUrl);
    }
    // Legacy schema: clientLogos: [{ logo: { node }, name, url }]
    if (Array.isArray(globalData.clientLogos)) {
      return globalData.clientLogos
        .map((item) => item?.logo?.node)
        .filter((n) => n && n.sourceUrl);
    }
    return [];
  })();

  return (
    <section className="bg-white text-black py-12 md:py-16 lg:py-20">
<div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        {(subtitle || title || button) && (
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              {subtitle && (
                <p className="text-[12px] tracking-[0.18em] font-semibold uppercase text-black mb-1">{subtitle}</p>
              )}
              {title && (
                <h2 className="text-black font-bold" style={{ fontFamily: 'Poppins, sans-serif', fontSize: 38, lineHeight: 1.1 }}>
                  {title}
                </h2>
              )}
            </div>
            {button?.url && (
              <div className="hidden md:block pt-1">
                <a
                  href={button.url}
                  target={button.target === '_blank' ? '_blank' : '_self'}
                  rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="button-without-box text-black"
                >
                  {button.title || 'View Our Work'}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Hero image with optional play badge */}
        {largeImage?.node?.sourceUrl && (
          <div className="relative rounded-[12px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <img
              src={largeImage.node.sourceUrl}
              alt={largeImage.node.altText || title || 'Showreel'}
              className="w-full h-auto object-cover"
            />
            {/* Play badge (decorative) */}
            <div className="absolute top-4 right-4">
              <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-md">
                <span className="text-[11px] font-bold tracking-wider text-[#111827]">PLAY</span>
              </div>
            </div>
          </div>
        )}

        {/* Logos row */}
        {logos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-6 items-center">
            {logos.map((logo, idx) => (
              <div key={idx} className="flex items-center justify-center">
                <img
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Client logo'}
                  className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile button (if provided) */}
        {button?.url && (
          <div className="md:hidden mt-6 text-center">
            <a
              href={button.url}
              target={button.target === '_blank' ? '_blank' : '_self'}
              rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
              className="button-without-box inline-flex text-black"
            >
              {button.title || 'View Our Work'}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Showreel;
