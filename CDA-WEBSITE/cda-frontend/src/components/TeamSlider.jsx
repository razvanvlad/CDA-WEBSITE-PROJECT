'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function TeamSlider({ teamMembers = [] }) {
  const [isMobile, setIsMobile] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const perView = 1 // Mobile shows 1 at a time
  const maxIndex = Math.max(0, teamMembers.length - perView)
  const next = () => setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  const prev = () => setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))

  if (!teamMembers?.length) return null

  // Desktop: Grid layout
  if (!isMobile) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((m) => {
          const img = m?.featuredImage?.node || m?.teamMemberFields?.featuredImage?.node
          const alt = img?.altText || m?.title
          const job = m?.teamMemberFields?.jobTitle || m?.jobTitle || ''
          return (
            <div key={m.id} className="w-full flex-shrink-0">
              <div className="block group text-left">
                <Link href={`/team/${m.slug}`} className="block">
                  <div className="relative w-full pb-[100%] overflow-visible rounded-md mb-4">
                    {img?.sourceUrl && (
                      <Image
                        src={img.sourceUrl}
                        alt={alt}
                        fill
                        className="object-cover object-top"
                        style={{ transform: 'translateY(-8%)' }}
                      />
                    )}
                  </div>
                  <div className="relative">
                    <div className="text-[22px] leading-tight text-black" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                      {m.title}
                    </div>
                    {job && (
                      <div className="text-[18px] text-gray-600 mt-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                        {job}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="mt-4">
                  <Link
                    href={`/team/${m.slug}`}
                    className="button-without-box"
                  >
                    <span className="button-text">View Profile</span>
                    <span className="button-icon-wrapper">
                      <img src="/images/arrow-icons/diagonal-right-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                      <img src="/images/arrow-icons/right-arrow.svg" alt="" className="button-icon button-icon-hover" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
        {/* Green arrow - only on desktop */}
        <div className="w-full flex-shrink-0">
          <div className="flex items-center justify-center h-full">
            <Image
              src="/images/green-arrow.svg"
              alt=""
              width={271}
              height={313}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    )
  }

  // Mobile: Carousel layout
  return (
    <div>
      {/* Track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {teamMembers.map((m) => {
            const img = m?.featuredImage?.node || m?.teamMemberFields?.featuredImage?.node
            const alt = img?.altText || m?.title
            const job = m?.teamMemberFields?.jobTitle || m?.jobTitle || ''
            return (
              <div key={m.id} className="w-full flex-shrink-0 px-3">
                <div className="block group text-left">
                  <Link href={`/team/${m.slug}`} className="block">
                    <div className="relative w-full pb-[100%] overflow-visible rounded-md mb-4">
                      {img?.sourceUrl && (
                        <Image
                          src={img.sourceUrl}
                          alt={alt}
                          fill
                          className="object-cover object-top"
                          style={{ transform: 'translateY(-8%)' }}
                        />
                      )}
                    </div>
                    <div className="relative">
                      <div className="text-[22px] leading-tight text-black" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                        {m.title}
                      </div>
                      {job && (
                        <div className="text-[18px] text-gray-600 mt-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                          {job}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="mt-4">
                    <Link
                      href={`/team/${m.slug}`}
                      className="button-without-box"
                    >
                      <span className="button-text">View Profile</span>
                      <span className="button-icon-wrapper">
                        <img src="/images/arrow-icons/diagonal-right-arrow.svg" alt="" className="button-icon button-icon-default" aria-hidden="true" />
                        <img src="/images/arrow-icons/right-arrow.svg" alt="" className="button-icon button-icon-hover" aria-hidden="true" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile controls */}
      {teamMembers.length > 1 && (
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
  )
}
