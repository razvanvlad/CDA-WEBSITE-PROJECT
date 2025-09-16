// src/components/GlobalBlocks/PhotoFrame.js
import React from 'react';
import Image from 'next/image';

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
    <section className="relative bg-white overflow-visible">
      {/* Gray background for bottom half of the section */}
      <div className="absolute left-0 right-0 bottom-0 h-1/2 w-full z-0" style={{backgroundColor: '#f4f4f4'}}></div>
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-12 gap-y-10 gap-x-8 items-center">
          {/* Left: Frame */}
          <div className="col-span-12 lg:col-span-6 order-1 lg:order-none">
            <div className="relative mx-auto w-full max-w-[353px] lg:max-w-[822px] aspect-[353/278] lg:aspect-[822/646]">
              {/* Frame */}
              {frameImage?.node?.sourceUrl && (
                <Image
                  src={frameImage.node.sourceUrl}
                  alt={frameImage.node.altText || 'Frame'}
                  fill
                  sizes="(max-width: 768px) 353px, 822px"
                  className="absolute inset-0 object-contain z-10 pointer-events-none select-none"
                  draggable={false}
                />
              )}

              {/* Inner visual (exact proportional sizing inside frame) */}
              {innerImage?.node?.sourceUrl && (
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                  <div className="relative w-[87.5%] h-[87.5%]">
                    <Image
                      src={innerImage.node.sourceUrl}
                      alt={innerImage.node.altText || title || 'Visual'}
                      fill
                      sizes="(max-width: 768px) 300px, 720px"
                      className="object-cover rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Copy */}
          <div className="col-span-12 lg:col-span-6">
            <div className="relative">
              {copy.subtitle && (
                <p className="cda-subtitle">{copy.subtitle}</p>
              )}
              {copy.title && (
                <h2 className="cda-title">{copy.title}</h2>
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

              {/* Arrow decoration (desktop only) - positioned to extend into next section */}
              {arrowIllustration?.node?.sourceUrl && (
                <Image
                  src={arrowIllustration.node.sourceUrl}
                  alt={arrowIllustration.node.altText || 'Arrow'}
                  width={100}
                  height={100}
                  className="hidden lg:block absolute -bottom-[150px] left-[50px] w-[100px] h-auto pointer-events-none select-none z-30"
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
          <Image
            src={arrowIllustration.node.sourceUrl}
            alt={arrowIllustration.node.altText || 'Arrow'}
            width={120}
            height={120}
            className="mt-4 w-[120px] h-auto pointer-events-none select-none"
            draggable={false}
          />
        </div>
      )}
    </section>
  );
};

export default PhotoFrame;
