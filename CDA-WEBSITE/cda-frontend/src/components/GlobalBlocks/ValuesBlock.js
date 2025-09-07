'use client';
// src/components/GlobalBlocks/ValuesBlock.js
import React from 'react';

/*
  Pixel-perfect pass for Values Block
  - Section label (subtitle), headline (title)
  - 3-up cards desktop, 2-up tablet, 1-up mobile
  - Number badges, subtle shadows, clean spacing
*/
const ValuesBlock = ({ globalData, pageData, useOverride = false }) => {
  const data = useOverride && pageData ? pageData : globalData;
  const items = data?.values || data?.cards || [];
  if (!items || items.length === 0) return null;

  const sortedItems = [...items];

  return (
    <section className="relative bg-[#F8FAFC] py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-[780px] mx-auto mb-12 md:mb-16">
          {data.subtitle && (
            <p className="text-[12px] tracking-[0.18em] font-semibold uppercase text-[#7C3AED] mb-3">{data.subtitle}</p>
          )}
          {data.title && (
            <h2 className="text-[32px] leading-[1.15] md:text-[40px] font-bold text-[#111827]">{data.title}</h2>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedItems.map((item, index) => (
            <div key={index} className="group bg-white rounded-[14px] p-6 md:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-shadow">
              {/* Badge + optional icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#FB923C] text-white font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                {item.image?.node?.sourceUrl && (
                  <img src={item.image.node.sourceUrl} alt={item.image.node.altText || item.title || ''} className="w-8 h-8 object-contain" />
                )}
              </div>

              {/* Content */}
              <h3 className="text-[18px] md:text-[20px] font-semibold text-[#111827] mb-2">{item.title}</h3>
              {(item.description || item.text) && (
                <p className="text-[15px] md:text-[16px] leading-[1.7] text-[#4B5563]">{item.description || item.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative bottom-right illustration */}
      {data?.illustration?.node?.sourceUrl && (
        <img
          src={data.illustration.node.sourceUrl}
          alt={data.illustration.node.altText || 'Values illustration'}
          className="pointer-events-none select-none hidden md:block absolute -bottom-6 -right-6 w-[220px] opacity-20"
          draggable={false}
        />
      )}
    </section>
  );
};

export default ValuesBlock;
