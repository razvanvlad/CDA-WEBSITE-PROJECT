'use client';

import React, { useRef } from 'react';
import Image from 'next/image';

export default function SolutionGallery({ data }) {
  const desktopScrollRef = useRef(null);
  const mobileScrollRef = useRef(null);

  // Smooth Scroll Helper
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 500; // Adjusts scroll distance per click
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const desktopImages = data?.desktopImage?.nodes || [];
  const mobileImages = data?.mobileImage?.nodes || [];

  return (
    <div className="flex flex-col gap-24 lg:gap-32">

      {/* =========================================
          ROW 1: DESKTOP CONTEXT
          Text Left | Images Right (Overflows Right)
      ========================================= */}
      <div className="flex flex-col lg:flex-row gap-12 lg:items-center">

        {/* LEFT COL: Text Content */}
        <div className="lg:w-[40%] flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-6 relative inline-block">
            {data?.title || 'Our Solution'}
            <span className="absolute bottom-1 left-0 w-full h-3 bg-purple-200 -z-10 opacity-50"></span>
          </h2>

          {/* Navigation Controls */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => scroll(desktopScrollRef, 'left')}
              className="p-2 border border-gray-300 hover:bg-gray-100 transition-opacity cursor-pointer flex items-center justify-center rounded-full"
              aria-label="Scroll Desktop Gallery Left"
            >
               <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
            <button
              onClick={() => scroll(desktopScrollRef, 'right')}
              className="p-2 border border-gray-300 hover:bg-gray-100 transition-opacity cursor-pointer flex items-center justify-center rounded-full"
              aria-label="Scroll Desktop Gallery Right"
            >
               <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
          </div>

          <div
            className="prose prose-lg text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.desktopText || '' }}
          />
        </div>

        {/* RIGHT COL: Desktop Images (Breakout Layout) */}
        <div className="lg:w-[60%] relative">
          {/* w-[150vw] ensures the container extends well beyond the right edge of the screen */}
          <div
            ref={desktopScrollRef}
            className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory w-[150vw]"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {desktopImages.map((img, i) => (
              <div key={i} className="min-w-[85vw] md:min-w-[650px] snap-center flex-shrink-0 first:pl-0">
                <div className="relative aspect-[16/10] shadow-xl rounded-md overflow-hidden bg-white">
                  <Image
                    src={img.sourceUrl}
                    alt={img.altText || 'Desktop Solution Interface'}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            ))}
             {/* Spacer to allow full scroll */}
            <div className="min-w-[100px]"></div>
          </div>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>


      {/* =========================================
          ROW 2: MOBILE CONTEXT
          Images Left (Overflows Left) | Text Right
      ========================================= */}
      <div className="flex flex-col lg:flex-row gap-12 lg:items-center">

        {/* LEFT COL: Mobile Images (Breakout Layout) */}
        {/* order-2 lg:order-1 puts images on the left on desktop */}
        <div className="lg:w-[60%] relative order-2 lg:order-1">
          <div
            ref={mobileScrollRef}
            className="flex gap-8 overflow-x-auto pb-10 snap-x snap-mandatory px-4 lg:px-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              // Pulls the container way to the left to create the "irregular overflow"
              marginLeft: '-50vw',
              width: '150vw',
              // Padding left ensures the first image roughly aligns with where we want it, or flows from edge
              paddingLeft: 'calc(50vw + 1rem)'
            }}
          >
            {mobileImages.map((img, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] snap-center flex-shrink-0">
                <div className="relative aspect-[9/19] rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100">
                   <Image
                      src={img.sourceUrl}
                      alt={img.altText || 'Mobile Solution Interface'}
                      fill
                      className="object-cover object-top"
                  />
                </div>
              </div>
            ))}
            <div className="min-w-[100px]"></div>
          </div>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        {/* RIGHT COL: Text Content */}
        <div className="lg:w-[40%] flex flex-col justify-center order-1 lg:order-2">
           <div className="flex gap-4 mb-6">
            <button
              onClick={() => scroll(mobileScrollRef, 'left')}
              className="p-2 border border-gray-300 hover:bg-gray-100 transition-opacity cursor-pointer flex items-center justify-center rounded-full"
              aria-label="Scroll Mobile Gallery Left"
            >
               <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
            <button
              onClick={() => scroll(mobileScrollRef, 'right')}
              className="p-2 border border-gray-300 hover:bg-gray-100 transition-opacity cursor-pointer flex items-center justify-center rounded-full"
              aria-label="Scroll Mobile Gallery Right"
            >
               <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile Experience</h3>

          <div
            className="prose prose-lg text-gray-600 leading-relaxed"
            // Fallback: If no mobileText exists, show a generic message or desktopText
            dangerouslySetInnerHTML={{ __html: data?.mobileText || '<p>Fully responsive mobile design ensuring seamless user experience across all devices.</p>' }}
          />
        </div>

      </div>
    </div>
  );
}
