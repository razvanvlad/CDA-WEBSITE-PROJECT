'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import SectionBand from '@/components/SectionBand';

const Card = ({ card, centered = false }) => {
  const hasImg = !!card?.icon?.node?.sourceUrl;

  return (
    <div
      className={[
        'bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow overflow-hidden',
        centered ? 'p-6 flex flex-col items-center text-center gap-4' : '',
      ].join(' ')}
    >
      {/* Text */}
      <div className={centered ? 'w-full' : 'flex-1 p-6 flex flex-col justify-center'}>
        {card?.title && (
          <h3
            className={
              centered
                ? 'text-2xl md:text-xl font-semibold text-gray-900'
                : 'text-xl font-semibold text-gray-900 mb-3 pl-10'
            }
          >
            {card.title}
          </h3>
        )}
        {card?.description && (
          <p
            className={
              centered
                ? 'text-gray-600 text-[17px] leading-relaxed'
                : 'text-gray-600 leading-relaxed pl-10'
            }
          >
            {card.description}
          </p>
        )}
      </div>

      {/* Illustration */}
      {hasImg && (
        centered ? (
          <div className="relative w-full max-w-[520px] mx-auto pb-[60%]">
            <Image
              src={card.icon.node.sourceUrl}
              alt={card.icon.node.altText || card.title || ''}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 520px"
            />
          </div>
        ) : (
          <div className="w-60 flex-shrink-0 flex items-end">
            <Image
              src={card.icon.node.sourceUrl}
              alt={card.icon.node.altText || card.title || ''}
              width={240}
              height={180}
              className="w-full h-auto object-contain"
              sizes="(max-width: 1024px) 50vw, 240px"
            />
          </div>
        )
      )}
    </div>
  );
};

export default function WhyCdaBlock({ globalData }) {
  const cards = Array.isArray(globalData?.usp) ? globalData.usp.filter(Boolean) : [];
  if (cards.length === 0 && !globalData?.title && !globalData?.subtitle) return null;

  // mobile slider state
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
      color="bg-gray-100"
      position="top"
      padding="pt-12 md:pt-20 pb-0"
      mobile={{ color: 'bg-gray-100', height: 'h-[340px]', position: 'top' }}
      desktop={{ color: 'bg-gray-100', height: 'h-[410px]', position: 'top' }}
    >
      <section>
        <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center md:text-left mb-8 md:mb-12">
            {globalData?.title && <p className="cda-subtitle">{globalData.title}</p>}
            {globalData?.subtitle && <h2 className="cda-title">{globalData.subtitle}</h2>}
          </div>

          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            {cards.map((card, i) => (
              <Card key={i} card={card} centered={false} />
            ))}
          </div>

          {/* Mobile slider */}
          <div className="lg:hidden">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
              >
                {cards.map((card, i) => (
                  <div key={i} className="w-full flex-shrink-0 px-2">
                    <Card card={card} centered />
                  </div>
                ))}
              </div>
            </div>

            {cards.length > 1 && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="p-2 border border-gray-300 hover:bg-gray-50"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="p-2 border border-gray-300 hover:bg-gray-50"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </SectionBand>
  );
}
