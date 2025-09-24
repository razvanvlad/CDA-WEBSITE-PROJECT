'use client';

import React, { useState, useMemo } from 'react';

const ServicesAccordion = ({
  globalData,
  // NEW: tweak these per page/section as needed
  illustrationClass = "hidden md:block absolute bottom-[-100px] left-[-100px] w-[480px] md:w-[340px] lg:w-[650px] pointer-events-none select-none z-[5]",
  mobileIllustrationClass = "w-full h-auto max-w-[420px] rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:hidden",
}) => {
  if (!globalData) return null;

  const itemsRaw = useMemo(() => {
    const s = globalData.services?.nodes || globalData.servicesList?.nodes || globalData.servicesList || [];
    return (Array.isArray(s) ? s : []).map((svc) => svc?.node || svc).filter(Boolean);
  }, [globalData]);

  const [openIndex, setOpenIndex] = useState(0);

  if (!itemsRaw.length && !globalData.title) return null;

  return (
    <section className="relative -mt-16 md:-mt-24 lg:-mt-28 bg-[#F4F4F4] py-16 md:py-20 lg:py-24 overflow-visible">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-12 gap-y-10 gap-x-10 items-start">
          {/* Left: Title + subtitle + (mobile) illustration */}
          <div className="col-span-12 lg:col-span-4">
            {globalData.subtitle && <p className="cda-subtitle">{globalData.subtitle}</p>}
            {globalData.title && <h2 className="cda-title title-small-purple">{globalData.title}</h2>}
            {globalData.illustration?.node?.sourceUrl && (
              <img
                src={globalData.illustration.node.sourceUrl}
                alt={globalData.illustration.node.altText || globalData.title || 'Illustration'}
                className={mobileIllustrationClass}
              />
            )}
          </div>

          {/* Right: Accordion */}
          <div className="col-span-12 lg:col-span-8">
            <div className="divide-y divide-[#E5E7EB] rounded-[14px] border border-[#E5E7EB] bg-[#F4F4F4]">
              {itemsRaw.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={item.id || idx}>
                    <button
                      type="button"
                      className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    >
                      <span className="text-[16px] md:text-[18px] font-semibold text-black">{item.title}</span>
                      {isOpen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-black">
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-black">
                          <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                    <div className={`px-5 md:px-6 pb-5 md:pb-6 ${isOpen ? 'block' : 'hidden'}`}>
                      <div className="text-[15px] md:text-[16px] leading-[1.7] text-[#4B5563]">
                        {(() => {
                          const sub = item?.serviceFields?.heroSection?.subtitle || item?.heroSection?.subtitle || item?.subtitle || '';
                          return sub ? (<p className="mb-4">{sub}</p>) : null;
                        })()}
                        {item.slug && (
                          <a href={`/services/${item.slug}`} className="button-l inline-flex">Find Out More</a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop illustration (absolute) */}
      {globalData.illustration?.node?.sourceUrl && (
        <img
          src={globalData.illustration.node.sourceUrl}
          alt={globalData.illustration.node.altText || globalData.title || 'Illustration'}
          className={illustrationClass}
        />
      )}
    </section>
  );
};

export default ServicesAccordion;
