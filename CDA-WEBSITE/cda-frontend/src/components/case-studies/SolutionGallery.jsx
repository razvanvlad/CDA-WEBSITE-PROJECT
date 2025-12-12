'use client'
import React, { useState } from 'react'
import Image from 'next/image'

function GallerySlider({ images, title, aspectRatio = 'aspect-video' }) {
    const [index, setIndex] = useState(0)

    if (!images || images.length === 0) return null

    const next = () => setIndex((prev) => (prev + 1) % images.length)
    const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length)

    return (
        <div className="relative">
            {/* Header with Title and Arrows */}
            <div className="flex items-center justify-between mb-6">
                {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}

                {images.length > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prev}
                            aria-label="Previous"
                            className="p-0 flex-shrink-0 opacity-100 hover:opacity-75 transition-opacity cursor-pointer transform rotate-180" // Rotate for left arrow if using same icon or verify icon direction
                        >
                            <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next"
                            className="p-0 flex-shrink-0 opacity-100 hover:opacity-75 transition-opacity cursor-pointer"
                        >
                            <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>

            {/* Image Container */}
            <div className={`relative w-full ${aspectRatio} bg-gray-100 overflow-hidden rounded-lg shadow-md`}>
                {images.map((img, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-500 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {img.sourceUrl && (
                            <Image
                                src={img.sourceUrl}
                                alt={img.altText || `Solution image ${i + 1}`}
                                fill
                                className="object-cover object-top" // object-top is usually better for scrolling screenshots
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function SolutionGallery({ desktopImages, mobileImages }) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Desktop Views */}
                {desktopImages && desktopImages.length > 0 && (
                    <div>
                        <GallerySlider
                            images={desktopImages}
                            title="Desktop View"
                            aspectRatio="aspect-[16/10]" // Slightly taller than video for web screenshots
                        />
                    </div>
                )}

                {/* Mobile Views */}
                {mobileImages && mobileImages.length > 0 && (
                    <div className="w-full max-w-sm mx-auto lg:max-w-none">
                        <GallerySlider
                            images={mobileImages}
                            title="Mobile View"
                            aspectRatio="aspect-[9/19]" // Mobile ratio
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
