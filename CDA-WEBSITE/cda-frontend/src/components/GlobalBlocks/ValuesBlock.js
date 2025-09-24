'use client';
// src/components/GlobalBlocks/ValuesBlock.js
import React from 'react';

export default function ValuesBlock({ globalData, pageData, useOverride = false }) {
  const data = useOverride && pageData ? pageData : globalData;
  const items = data?.values || data?.cards || [];
  if (!items || items.length === 0) return null;

  const fishSrc = data?.illustration?.node?.sourceUrl || '';
  const fishAlt = data?.illustration?.node?.altText || 'Values illustration';

  return (
    <section className="relative bg-white py-16 md:py-20 lg:py-24 overflow-visible">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          {data?.subtitle && (
            <p className="text-[12px] tracking-[0.18em] font-semibold uppercase text-black mb-2">
              {data.subtitle}
            </p>
          )}
          {data?.title && (
            <h2
              className="mb-6 font-bold text-black"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 38, lineHeight: 1.1 }}
            >
              <span className="relative inline-block align-baseline">{data.title}</span>
            </h2>
          )}
        </div>

        {/* Desktop fish (floated) so text wraps around it */}
        {fishSrc && (
          <img
            src={fishSrc}
            alt={fishAlt}
            className="values-fish hidden md:block"
            style={{
              // CSS Shapes: wrap text around the transparent contour of the image
              shapeOutside: `url(${fishSrc})`,
              WebkitShapeOutside: `url(${fishSrc})`,
            }}
            draggable={false}
          />
        )}

        {/* Two-column list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="value-badge-l">{String(index + 1).padStart(2, '0')}</div>
              <div>
                <h3 className="text-[18px] md:text-[20px] font-semibold text-black mb-2">
                  {item.title}
                </h3>
                {(item.description || item.text) && (
                  <p className="text-[15px] md:text-[16px] leading-[1.7] text-[#4B5563]">
                    {item.description || item.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile fish (simple, centered image after the list) */}
        {fishSrc && (
          <div className="md:hidden mt-8 flex justify-center">
            <img
              src={fishSrc}
              alt={fishAlt}
              className="w-[220px] max-w-[70%] h-auto pointer-events-none select-none"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Optional: cross-section arrow (keep if you use it elsewhere) */}
      <div className="cross-section-arrow" aria-hidden="true"></div>

      {/* Page-scoped styles for the desktop fish wrapping */}
      <style jsx>{`
        .values-fish {
          float: right;
          width: clamp(220px, 24vw, 420px); /* adjust size */
          height: auto;

          /* how much space text keeps from the fish outline */
          shape-margin: 18px;
          -webkit-shape-margin: 18px;

          /* position tweaks (top, right, bottom, left) */
          margin: 24px -16px -48px 24px;

          pointer-events: none;
          user-select: none;
        }

        /* Fallback if CSS Shapes not supported: treat fish as a rectangle */
        @supports not (shape-outside: circle(50%)) {
          .values-fish {
            shape-outside: inset(0);
            -webkit-shape-outside: inset(0);
          }
        }

       
      `}</style>
    </section>
  );
}
