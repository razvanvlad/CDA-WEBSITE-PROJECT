'use client';
// src/components/GlobalBlocks/ValuesBlock.js
import React from 'react';

/*
  Values Block — design alignment
  - Left-aligned section header with SVG underline
  - Two-column list (1–3 left, 4–6 right) with number badges
  - Decorative illustration bottom-right
*/
const ValuesBlock = ({ globalData, pageData, useOverride = false }) => {
  const data = useOverride && pageData ? pageData : globalData;
  const items = data?.values || data?.cards || [];
  if (!items || items.length === 0) return null;

  const sortedItems = [...items];

  return (
    <section className="relative bg-white py-16 md:py-20 lg:py-24 overflow-hidden">
<div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          {data.subtitle && (
            <p className="text-[12px] tracking-[0.18em] font-semibold uppercase text-[#111827] mb-2">{data.subtitle}</p>
          )}
          {data.title && (
            <h2 className="mb-6 font-bold text-[#111827]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: 38, lineHeight: 1.1 }}>
              <span className="relative inline-block align-baseline">
                {data.title}
                <img src="/images/underlines/Path%20304.svg" alt="" className="underline-svg" />
              </span>
            </h2>
          )}
        </div>

        {/* Two-column list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {sortedItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="value-badge">{String(index + 1).padStart(2, '0')}</div>
              <div>
                <h3 className="text-[18px] md:text-[20px] font-semibold text-[#111827] mb-2">{item.title}</h3>
                {(item.description || item.text) && (
                  <p className="text-[15px] md:text-[16px] leading-[1.7] text-[#4B5563]">{item.description || item.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative bottom-right illustration */}
      {data?.illustration?.node?.sourceUrl && (
        <img
          src={data.illustration.node.sourceUrl}
          alt={data.illustration.node.altText || 'Values illustration'}
          className="pointer-events-none select-none hidden md:block absolute -bottom-10 -right-6 w-[260px]"
          draggable={false}
        />
      )}
    </section>
  );
};

export default ValuesBlock;
