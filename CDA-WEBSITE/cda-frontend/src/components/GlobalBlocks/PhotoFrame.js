// src/components/GlobalBlocks/PhotoFrame.js
import React from 'react';

/*
  Pixel-perfect pass for Image Frame Block (desktop + mobile)
  - Left: decorative frame with inner image masked and centered
  - Right: subtitle, title, copy, CTA
  - Arrow/decoration positioned relative to content on desktop, stacked on mobile
*/
const PhotoFrame = ({ globalData, contentOverride }) => {
  if (!globalData) return null;

  const { frameImage, contentImage, subtitle, title, text, button, arrowImage } = globalData;

  const copy = contentOverride || { subtitle, title, text, button };
  const innerImage = contentImage || globalData.innerImage;
  const arrowIllustration = arrowImage || globalData.arrowIllustration;

  return (
    <section className="relative bg-white">
<div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-12 gap-y-10 gap-x-8 items-center">
          {/* Left: Frame */}
          <div className="col-span-12 lg:col-span-6 order-1 lg:order-none">
            <div className="relative mx-auto w-full max-w-[353px] lg:max-w-[822px] aspect-[353/278] lg:aspect-[822/646]">
              {/* Frame */}
              {frameImage?.node?.sourceUrl && (
                <img
                  src={frameImage.node.sourceUrl}
                  alt={frameImage.node.altText || 'Frame'}
                  className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none select-none"
                  draggable={false}
                />
              )}

              {/* Inner visual (exact proportional sizing inside frame) */}
              {innerImage?.node?.sourceUrl && (
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                  <img
                    src={innerImage.node.sourceUrl}
                    alt={innerImage.node.altText || title || 'Visual'}
                    className="w-[87.5%] h-[87.5%] object-cover rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Copy */}
          <div className="col-span-12 lg:col-span-6">
            <div className="relative">
              {copy.subtitle && (
                <p className="text-[12px] tracking-[0.18em] font-semibold uppercase text-black mb-3">{copy.subtitle}</p>
              )}
              {copy.title && (
                <h2 className="text-[32px] leading-[1.15] md:text-[40px] font-bold text-black mb-5">{copy.title}</h2>
              )}
              {copy.text && (
                <div className="text-[16px] md:text-[18px] leading-[1.7] text-[#4B5563] space-y-4 mb-6">
                  {String(copy.text).split('\n').map((p, i) => p.trim() && (
                    <p key={i}>{p.trim()}</p>
                  ))}
                </div>
              )}
              {copy.button?.url && copy.button?.title && (
                <a
                  href={copy.button.url}
                  target={copy.button.target === '_blank' ? '_blank' : '_self'}
                  rel={copy.button.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="button-without-box text-black"
                >
                  {copy.button.title}
                </a>
              )}

              {/* Arrow decoration (desktop only) */}
              {arrowIllustration?.node?.sourceUrl && (
                <img
                  src={arrowIllustration.node.sourceUrl}
                  alt={arrowIllustration.node.altText || 'Arrow'}
className="hidden lg:block absolute -bottom-[300px] right-12 w-[90px] h-auto pointer-events-none select-none z-20"
                  draggable={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile arrow (stacked under content) */}
      {arrowIllustration?.node?.sourceUrl && (
        <div className="lg:hidden flex justify-center">
          <img
            src={arrowIllustration.node.sourceUrl}
            alt={arrowIllustration.node.altText || 'Arrow'}
            className="mt-4 w-[120px] h-auto pointer-events-none select-none"
            draggable={false}
          />
        </div>
      )}
    </section>
  );
};

export default PhotoFrame;
