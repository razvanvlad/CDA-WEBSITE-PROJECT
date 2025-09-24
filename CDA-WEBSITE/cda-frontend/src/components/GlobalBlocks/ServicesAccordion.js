// src/components/GlobalBlocks/ServicesAccordion.js
'use client';

import React, { useState, useMemo } from 'react';

const ServicesAccordion = ({
  globalData,
  overlap = true,
  bg = 'bg-[#F4F4F4]',
  panelBg = 'bg-[#F4F4F4]',
  className = '',
}) => {
  if (!globalData) return null;

  // Normalize the list input so we always get a flat array of service nodes
  const itemsRaw = useMemo(() => {
    const s =
      globalData.services?.nodes ||
      globalData.servicesList?.nodes ||
      globalData.servicesList ||
      [];
    return (Array.isArray(s) ? s : [])
      .map((svc) => svc?.node || svc)
      .filter(Boolean);
  }, [globalData]);


// change snipp for about page

  const [openIndex, setOpenIndex] = useState(0);
  if (!itemsRaw.length && !globalData.title) return null;

  const overlapCls = overlap ? '-mt-16 md:-mt-24 lg:-mt-28' : '';
  const sectionCls = [
    'relative',
    'py-16 md:py-20 lg:py-24',
    'overflow-visible',
    bg,
    overlapCls,
    className,
  ].join(' ');

  return (
    <section className={sectionCls}>
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-12 gap-y-10 gap-x-10 items-start">
          {/* Left: Title/subtitle */}
          <div className="col-span-12 lg:col-span-4">
            {globalData.subtitle && <p className="cda-subtitle">{globalData.subtitle}</p>}
            {globalData.title && (
              <h2 className="cda-title title-small-purple">{globalData.title}</h2>
            )}
          </div>

          {/* Right: Accordion */}
          <div className="col-span-12 lg:col-span-8">
            <div
              className={[
                'divide-y divide-[#E5E7EB] rounded-[14px] border border-[#E5E7EB]',
                panelBg,
              ].join(' ')}
            >
              {itemsRaw.map((item, idx) => {
                const isOpen = openIndex === idx;

                // Build a subtitle from the most common places the data can live:
                const sub =
                  item?.serviceFields?.heroSection?.subtitle ?? // preferred
                  item?.heroSection?.subtitle ??                // alt shape
                  item?.serviceFields?.subtitle ??              // rare alt
                  item?.subtitle ??                             // generic
                  '';                                           // nothing

                // Helper: string contains HTML tags?
                const looksLikeHtml = typeof sub === 'string' && /<[^>]+>/.test(sub);

                return (
                  <div key={item.id || `${item.slug || 'svc'}-${idx}`}>
                    <button
                      type="button"
                      className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    >
                      <span className="text-[16px] md:text-[18px] font-semibold text-black">
                        {item.title}
                      </span>
                      {isOpen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>

                    {/* Panel body with subtitle */}
                    {/* <div className={`px-5 md:px-6 pb-5 md:pb-6 ${isOpen ? 'block' : 'hidden'}`}>
                      <div className="text-[15px] md:text-[16px] leading-[1.7] text-[#4B5563]">
                        {sub
                          ? (looksLikeHtml ? (
                              <div className="mb-4" dangerouslySetInnerHTML={{ __html: sub }} />
                            ) : (
                              <p className="mb-4">{sub}</p>
                            ))
                          : null}

                        {item.slug && (
                          <a href={`/services/${item.slug}`} className="button-l inline-flex">
                            Find Out More
                          </a>
                        )}
                      </div>
                    </div> */}

                    {/* //2 */}
{/* <div className={`px-5 md:px-6 pb-5 md:pb-6 ${isOpen ? 'block' : 'hidden'}`}>
  <div className="text-[15px] md:text-[16px] leading-[1.7] text-[#4B5563]">
    {(() => {
      // Prefer the WP ACF field used on service pages
      const sub =
        item?.serviceFields?.heroSection?.subtitle ??
        item?.heroSection?.subtitle ??
        item?.serviceFields?.subtitle ??
        item?.subtitle ??
        '';

      if (!sub) return null;

      // If WordPress returns HTML, render it safely; otherwise as plain text
      const looksLikeHtml = typeof sub === 'string' && /<[^>]+>/.test(sub);
      return looksLikeHtml
        ? <div className="mb-4" dangerouslySetInnerHTML={{ __html: sub }} />
        : <p className="mb-4">{sub}</p>;
    })()}

    {item.slug && (
      <a href={`/services/${item.slug}`} className="button-l inline-flex">
        Find Out More
      </a>
    )}
  </div>
</div> */}

{/* 3 */}
<div className={`px-5 md:px-6 pb-5 md:pb-6 ${isOpen ? 'block' : 'hidden'}`}>
  <div className="text-[15px] md:text-[16px] leading-[1.7] text-[#4B5563]">
    {(() => {
      // Prefer the ACF subtitle if present, otherwise use WP excerpt, then content
      const subRaw =
        item?.serviceFields?.heroSection?.subtitle ||
        item?.excerpt ||
        item?.content ||
        item?.subtitle ||
        '';

      if (!subRaw) return null;

      const looksLikeHtml =
        typeof subRaw === 'string' && /<[^>]+>/.test(subRaw);

      return looksLikeHtml ? (
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: subRaw }} />
      ) : (
        <p className="mb-4">{subRaw}</p>
      );
    })()}

    {item.slug && (
      <a href={`/services/${item.slug}`} className="button-l inline-flex">
        Find Out More
      </a>
    )}
  </div>
</div>


                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile-only illustration at the bottom */}
        {globalData.illustration?.node?.sourceUrl && (
          <div className="md:hidden mt-10 flex justify-start">
            <img
              src={globalData.illustration.node.sourceUrl}
              alt={globalData.illustration.node.altText || globalData.title || 'Illustration'}
              className="w-[260px] h-auto pointer-events-none select-none"
            />
          </div>
        )}
      </div>

      {/* Desktop illustration */}
      {globalData.illustration?.node?.sourceUrl && (
        <img
          src={globalData.illustration.node.sourceUrl}
          alt={globalData.illustration.node.altText || globalData.title || 'Illustration'}
          className="hidden md:block absolute bottom-0 left-0 w-[280px] md:w-[340px] lg:w-[380px] pointer-events-none select-none z-[5]"
        />
      )}
    </section>
  );
};

export default ServicesAccordion;
