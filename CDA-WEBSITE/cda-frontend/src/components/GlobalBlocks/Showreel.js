'use client';

import React from 'react';
import SectionBand from '@/components/SectionBand';

const Showreel = ({ globalData }) => {
  if (!globalData) return null;

  const title = globalData.title;
  const subtitle = globalData.subtitle;
  const button = globalData.button; // { url, title, target }
  const largeImage = globalData.largeImage || globalData.videoThumbnail;

  // logos: support both shapes
  const logos = (() => {
    if (Array.isArray(globalData.logos)) return globalData.logos.map(i => i?.logo?.node).filter(n => n?.sourceUrl);
    if (Array.isArray(globalData.clientLogos)) return globalData.clientLogos.map(i => i?.logo?.node).filter(n => n?.sourceUrl);
    return [];
  })();

  return (
    <SectionBand position="top" color="bg-[#F4F4F4]" height="h-[300px] md:h-[850px]" className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        {(subtitle || title || button) && (
          <div className="mb-6 md:mb-8 flex items-start justify-between gap-6">
            <div>
              {subtitle && <p className="cda-subtitle">{subtitle}</p>}
              {title && <h2 className="cda-title">{title}</h2>}
            </div>
            {button?.url && (
              <a
                href={button.url}
                target={button.target === '_blank' ? '_blank' : '_self'}
                rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="button-without-box"
              >
                {button.title || 'View Our Work'} 
              </a>
            )}
          </div>
        )}

        {/* Hero image */}
        {largeImage?.node?.sourceUrl && (
          <div className="relative rounded-xl overflow-hidden border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <img
              src={largeImage.node.sourceUrl}
              alt={largeImage.node.altText || title || 'Showreel'}
              className="w-full h-auto object-cover"
            />
            {/* Play badge */}
            <button
              type="button"
              className="absolute top-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-white/95 rounded-full flex items-center justify-center shadow-md"
              aria-label="Play showreel"
            >
              <span className="text-[11px] md:text-[12px] font-bold tracking-wider text-[#111827]">PLAY</span>
            </button>
          </div>
        )}

        {/* Logos row */}
        {logos.length > 0 && (
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-10 gap-y-6 items-center">
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center justify-center">
                <img
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Client logo'}
                  className="h-8 sm:h-9 md:h-10 lg:h-12 object-contain grayscale hover:grayscale-0 transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile button */}
        {button?.url && (
          <div className="md:hidden mt-6 text-center">
            <a
              href={button.url}
              target={button.target === '_blank' ? '_blank' : '_self'}
              rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
              className="button-without-box"
            >
              {button.title || 'View Our Work'} 
            </a>
          </div>
        )}
      </div>
    </SectionBand>
  );
};

export default Showreel;
