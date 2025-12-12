'use client';

import React, { useRef } from 'react';
import Image from 'next/image';

export default function SolutionGallery({ data }) {
  const desktopScrollRef = useRef(null);
  const mobileScrollRef = useRef(null);

  // --- 1. Dynamic Scroll Logic ---
  // Calculates the width of the first card to scroll exactly one item at a time
  const scroll = (ref, direction, gap = 24) => {
    if (ref.current) {
      // Get the width of the first image card + gap
      const firstCard = ref.current.firstElementChild;
      const scrollAmount = firstCard ? firstCard.clientWidth + gap : 400;

      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const desktopImages = data?.desktopImage?.nodes || [];
  const mobileImages = data?.mobileImage?.nodes || [];

  return (
    <div className="flex flex-col gap-20 lg:gap-32 w-full">

      {/* =========================================
          ROW 1: DESKTOP SHOWCASE
          Text Left | Images Right (Overflows Right Edge)
      ========================================= */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">

        {/* LEFT COL: Text Content */}
        <div className="lg:w-[30%] flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-6 relative inline-block">
            {data?.title || 'Our Solution'}
            <span className="absolute bottom-1 left-0 w-full h-3 bg-purple-200 -z-10 opacity-50"></span>
          </h2>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => scroll(desktopScrollRef, 'left', 24)}
              className="p-3 border border-gray-300 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Previous image"
            >
              {/* Rotate arrow for Left */}
              <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
            <button
              onClick={() => scroll(desktopScrollRef, 'right', 24)}
              className="p-3 border border-gray-300 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Next image"
            >
              <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
          </div>

          <div
            className="prose prose-lg text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.desktopText || '' }}
          />
        </div>

        {/* RIGHT COL: Desktop Gallery
            - lg:mr-[calc(50%-50vw)]: Pulls the container margin to the screen edge
            - lg:w-[150vw]: Makes it wide enough to overflow
        */}
        <div className="lg:w-[70%] relative min-w-0">
          <div
            ref={desktopScrollRef}
            className="
              flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory
              no-scrollbar
              w-full
              lg:mr-[calc(50%-50vw)] lg:w-[150vw] lg:pr-[10vw]
            "
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {desktopImages.map((img, i) => (
              // Increased min-width for better visibility (650px -> 750px)
              <div key={i} className="min-w-[85vw] md:min-w-[750px] snap-start flex-shrink-0">
                <div className="relative aspect-[16/10] shadow-xl rounded-md overflow-hidden bg-white border border-gray-100">
                  <Image
                    src={img.sourceUrl}
                    alt={img.altText || 'Desktop Solution Interface'}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            ))}
            {/* Spacer to ensure last item can be scrolled into view */}
            <div className="min-w-[5vw]"></div>
          </div>
        </div>
      </div>


      {/* =========================================
          ROW 2: MOBILE SHOWCASE
          Images Left (Overflows Left Edge) | Text Right
      ========================================= */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">

        {/* LEFT COL: Mobile Gallery
            - Order-2 on mobile (text first), Order-1 on Desktop (images first)
            - lg:ml-[calc(50%-50vw)]: Pulls container to left screen edge
        */}
        <div className="lg:w-[70%] relative min-w-0 order-2 lg:order-1">
          <div
            ref={mobileScrollRef}
            className="
              flex gap-12 overflow-x-auto pb-8 snap-x snap-mandatory
              no-scrollbar
              w-full
              lg:ml-[calc(50%-50vw+90px)] lg:w-[150vw]
            "
            // ADJUST HORIZONTAL POSITION: Change '92px' in the calc below to move left/right.
            // Larger px value (e.g. 150px) = more to the left (more cut off)
            // Smaller px value (e.g. 50px) = more to the right (less cut off)
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {mobileImages.map((img, i) => (
              <div key={i} className="min-w-[297px] w-[297px] snap-start flex-shrink-0">
                <div className="relative w-[297px] h-[661px] rounded-2xl overflow-hidden bg-white border border-gray-100">
                  <Image
                    src={img.sourceUrl}
                    alt={img.altText || 'Mobile Solution Interface'}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            ))}
            <div className="min-w-[5vw]"></div>
          </div>
        </div>

        {/* RIGHT COL: Text Content */}
        <div className="lg:w-[30%] flex flex-col justify-start order-1 lg:order-2">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => scroll(mobileScrollRef, 'left', 48)}
              className="p-3 border border-gray-300 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Previous mobile view"
            >
              <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
            <button
              onClick={() => scroll(mobileScrollRef, 'right', 48)}
              className="p-3 border border-gray-300 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Next mobile view"
            >
              <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" />
            </button>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile Experience</h3>

          <div
            className="prose prose-lg text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.mobileText || '<p>Fully responsive mobile design ensuring seamless user experience across all devices.</p>' }}
          />
        </div>

      </div>
    </div>
  );
}
