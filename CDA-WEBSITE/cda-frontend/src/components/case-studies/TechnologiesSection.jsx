'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TechnologiesSection({ technologies }) {
  if (!technologies?.logos?.nodes || technologies.logos.nodes.length === 0) {
    return null;
  }

  const scrollContainer = (direction) => {
    const container = document.getElementById('tech-scroll-container');
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="cda-container">
        {/* Header with title on left and arrows on right */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            {technologies.title || "The Technologies We Used"}
          </h2>

          {/* Desktop arrows - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollContainer('left')}
              aria-label="Previous"
              className="p-0 flex-shrink-0 opacity-100 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
            </button>
            <button
              onClick={() => scrollContainer('right')}
              aria-label="Next"
              className="p-0 flex-shrink-0 opacity-100 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Technologies grid/scroll */}
        <div
          id="tech-scroll-container"
          className="flex md:flex-wrap gap-8 md:gap-12 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {technologies.logos.nodes.map((tech) => (
            <Link
              key={tech.id}
              href={tech.uri || `/technologies/${tech.slug}`}
              className="group flex-shrink-0 snap-center"
            >
              {tech.featuredImage?.node?.sourceUrl && (
                <div className="relative h-[50px] w-auto min-w-[80px] flex items-center justify-center">
                  <Image
                    src={tech.featuredImage.node.sourceUrl}
                    alt={tech.featuredImage.node.altText || tech.title}
                    height={50}
                    width={100}
                    className="object-contain h-[50px] w-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ height: '50px', width: 'auto' }}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile arrows below - shown only on mobile */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-6">
          <button
            onClick={() => scrollContainer('left')}
            aria-label="Previous"
            className="p-0 flex-shrink-0 opacity-100 hover:opacity-75 transition-opacity cursor-pointer"
          >
            <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
          </button>
          <button
            onClick={() => scrollContainer('right')}
            aria-label="Next"
            className="p-0 flex-shrink-0 opacity-100 hover:opacity-75 transition-opacity cursor-pointer"
          >
            <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
          </button>
        </div>

        <style jsx>{`
          #tech-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
