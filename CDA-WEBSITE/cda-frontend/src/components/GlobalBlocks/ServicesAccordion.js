// src/components/GlobalBlocks/ServicesAccordion.js
'use client';

import React, { useState, useMemo } from 'react';
import ResponsiveUnderlinedTitle from '../ResponsiveUnderlinedTitle';

const ServicesAccordion = ({
  globalData,
  overlap = true,
  bg = 'bg-[#F4F4F4]',
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
      <div className="cda-container relative z-10">
        <div className="grid grid-cols-12 gap-y-10 gap-x-10 items-start">
          {/* Left: Title/subtitle */}
          <div className="col-span-12 lg:col-span-4">
            {globalData.subtitle && <p className="cda-subtitle">{globalData.subtitle}</p>}
            {globalData.title && (
              <ResponsiveUnderlinedTitle
                as="h2"
                className="section-title"
                underlineColor="#AD80F9"
              >
                {globalData.title}
              </ResponsiveUnderlinedTitle>
            )}
          </div>

          {/* Right: Accordion */}
          <div className="col-span-12 lg:col-span-8 overflow-hidden">
            <div className="divide-y divide-gray-200 border-t border-gray-200">
              {itemsRaw.map((item, idx) => {
                const isOpen = openIndex === idx;
                const isLast = idx === itemsRaw.length - 1;

                return (
                  <div key={item.id || `${item.slug || 'svc'}-${idx}`} className={isLast ? 'border-b border-gray-200' : ''}>
                    <button
                      type="button"
                      className="w-full text-left py-3 md:py-6 flex items-center gap-3 md:gap-4"
                      style={{ minWidth: 0 }}
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    >
                      <span
                        className="flex-1 min-w-0 text-[18px] md:text-[22px] font-bold text-black leading-tight"
                        style={{
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.title}
                      </span>
                      <span className="flex-shrink-0 ml-2">
                        {isOpen ? (
                          <img
                            src="/images/minus.svg"
                            alt="Collapse"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        ) : (
                          <img
                            src="/images/plus.svg"
                            alt="Expand"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        )}
                      </span>
                    </button>

                    {/* 3 */}
                    <div className={`pb-5 md:pb-6 ${isOpen ? 'block' : 'hidden'}`}>
                      <div className="text-[14px] md:text-[16px] leading-[1.7] text-[#4B5563]">
                        {(() => {
                          // Use description from heroSection as specified
                          const descRaw =
                            item?.serviceFields?.heroSection?.description ||
                            item?.heroSection?.description ||
                            item?.excerpt ||
                            item?.content ||
                            '';

                          if (!descRaw) return null;

                          const looksLikeHtml =
                            typeof descRaw === 'string' && /<[^>]+>/.test(descRaw);

                          return looksLikeHtml ? (
                            <div
                              className="mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:table [&_table]:border [&_table]:border-gray-200 [&_td]:p-3 [&_td]:border [&_td]:border-gray-200 [&_th]:p-3 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:font-bold"
                              dangerouslySetInnerHTML={{ __html: descRaw }}
                            />
                          ) : (
                            <p className="mb-4">{descRaw}</p>
                          );
                        })()}

                        {item.slug && (
                          <a href={`/services/${item.slug}`} className="button-l-transparent inline-flex">
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
          className="hidden md:block absolute bottom-0 left-[-100px] w-[280px] md:w-[340px] lg:w-[580px] pointer-events-none select-none z-[5]"
        />
      )}
    </section>
  );
};

export default ServicesAccordion;
