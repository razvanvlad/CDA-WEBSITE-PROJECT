'use client';

import React from 'react';
import SectionBand from '@/components/SectionBand';
import TextLinkButton from '../ui/TextLinkButton';

const Showreel = ({ globalData }) => {
  if (!globalData) return null;

  const title = globalData.title;
  const subtitle = globalData.subtitle;
  const button = globalData.button; // { url, title, target }
  const largeImage = globalData.largeImage || globalData.videoThumbnail;

  // Support both shapes for logos
  const logos = (() => {
    if (Array.isArray(globalData.logos)) {
      return globalData.logos.map(i => i?.logo?.node).filter(n => n?.sourceUrl);
    }
    if (Array.isArray(globalData.clientLogos)) {
      return globalData.clientLogos.map(i => i?.logo?.node).filter(n => n?.sourceUrl);
    }
    return [];
  })();

  // Duplicate for seamless mobile ticker (50% translate if doubled)
  const tickerLogos = [...logos, ...logos];

  return (
    <SectionBand
      position="top"
      color="bg-[#F4F4F4]"
      height="h-[300px] md:h-[850px]"
      className="bg-white pt-12 pb-0 md:py-16 lg:py-20"
    >
      {/* Header: mobile stacked/centered; desktop split */}
      {(subtitle || title || button) && (
        <div className="mx-auto w-full max-w-[1620px] px-[38px] md:px-6 lg:px-8">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
            <div className="text-left">
              {subtitle && <p className="cda-subtitle">{subtitle}</p>}
              {title && <h2 className="section-title">{title}</h2>}
            </div>

            {button?.url && (
              <TextLinkButton
                href={button.url}
                target={button.target === '_blank' ? '_blank' : '_self'}
                className="self-start"
              >
                {button.title || 'View Our Work'}
              </TextLinkButton>
            )}
          </div>
        </div>
      )}

      {/* Hero image - Full width on mobile, contained on desktop */}
      {largeImage?.node?.sourceUrl && (
        <div className="md:mx-auto md:w-full md:max-w-[1620px] md:px-6 lg:px-8">
          <div className="showreel-image-container relative md:rounded-xl overflow-hidden border-y md:border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
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
        </div>
      )}

      {/* Logos: mobile = ticker; desktop = grid */}
      {logos.length > 0 && (
        <>
          {/* MOBILE ticker (auto scrolling) - Full width */}
          <div className="md:hidden mt-4">
            <div className="overflow-hidden">
              <div className="sr-ticker-track flex items-center">
                {tickerLogos.map((logo, i) => (
                  <div key={`tl-${i}`} className="px-8 py-3 shrink-0">
                    <img
                      src={logo.sourceUrl}
                      alt={logo.altText || 'Client logo'}
                      className="h-9 object-contain grayscale"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DESKTOP grid */}
          <div className="hidden md:flex mt-12 mx-auto w-full max-w-[1620px] px-6 lg:px-8 flex-wrap justify-between items-center gap-6">
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center justify-center" style={{ maxWidth: '220px', flex: '0 1 auto' }}>
                <img
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Client logo'}
                  className="h-8 sm:h-9 md:h-10 lg:h-12 w-full object-contain grayscale hover:grayscale-0 transition"
                  style={{ maxWidth: '220px' }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Inline styles for the mobile ticker animation */}
      <style jsx>{`
        @keyframes sr-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .sr-ticker-track {
          animation: sr-scroll 22s linear infinite;
          will-change: transform;
        }
      `}</style>
    </SectionBand>
  );
};

export default Showreel;
