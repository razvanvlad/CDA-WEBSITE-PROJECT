'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import SectionBand from '@/components/SectionBand';

const WhyCdaBlock = ({ globalData }) => {
  const cards = Array.isArray(globalData?.usp) ? globalData.usp.filter(Boolean) : [];
  if (!cards.length && !globalData?.title && !globalData?.subtitle) return null;

  // simple mobile detector for slider
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const perView = 1;
  const maxIndex = Math.max(0, cards.length - perView);
  const next = () => setIndex((p) => (p >= maxIndex ? 0 : p + 1));
  const prev = () => setIndex((p) => (p <= 0 ? maxIndex : p - 1));

  return (
    <SectionBand
      className="bg-white"
      color="bg-[#F4F4F4]"
      position="top"
      padding="pt-12 md:pt-20 pb-0"
      mobile={{ color: 'bg-[#F4F4F4]', height: 'h-[500px]', position: 'top' }}
      desktop={{ color: 'bg-[#F4F4F4]', height: 'h-[350px]', position: 'top' }}
    >
      <section>
        <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center md:text-left mb-10">
            {globalData?.title && <p className="cda-subtitle">{globalData.title}</p>}
            {globalData?.subtitle && <h2 className="cda-title">{globalData.subtitle}</h2>}
          </div>

          {/* MOBILE: slider */}
          <div className="lg:hidden">
            {cards.length > 0 && (
              <>
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
                  >
                    {cards.map((card, i) => (
                      <div key={i} className="w-full flex-shrink-0 px-3">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <div className="p-6 text-center">
                            {card?.title && (
                              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {card.title}
                              </h3>
                            )}
                            {card?.description && (
                              <p className="text-gray-600 leading-relaxed mb-6">
                                {card.description}
                              </p>
                            )}
                            {card?.icon?.node?.sourceUrl && (
                              <div className="w-full">
                                <Image
                                  src={card.icon.node.sourceUrl}
                                  alt={card.icon.node.altText || card.title || ''}
                                  width={560}
                                  height={360}
                                  className="w-full h-auto object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* mobile controls */}
                {cards.length > 1 && (
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      onClick={prev}
                      aria-label="Previous"
                      className="p-2 border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      ←
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next"
                      className="p-2 border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* DESKTOP: 2-column grid with image anchored bottom-right */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[260px]"
              >
                {/* Text column (leave room on the right for the image) */}
                <div className="p-8 pr-52">
                  {card?.title && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {card.title}
                    </h3>
                  )}
                  {card?.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>

                {/* Illustration anchored to bottom-right */}
                {card?.icon?.node?.sourceUrl && (
                  <div className="absolute right-6 bottom-0 h-[160px] lg:h-[180px] pointer-events-none select-none">
                    <Image
                      src={card.icon.node.sourceUrl}
                      alt={card.icon.node.altText || card.title || ''}
                      width={360}
                      height={220}
                      sizes="(min-width: 1024px) 180px"
                      className="h-full w-auto object-contain"
                      priority={index < 2}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionBand>
  );
};

export default WhyCdaBlock;
