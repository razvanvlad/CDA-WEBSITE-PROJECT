'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getServicesCoreWithPagination } from '@/lib/graphql-queries.js'
import SectionBand from '@/components/SectionBand'
import TextLinkButton from '../ui/TextLinkButton'

export default function ServicesSlider({
  title = 'The Services We Offer',
  subtitle = 'Our Services',
  first = 12,
}) {
  const [items, setItems] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    (async () => {
      try {
        const { nodes } = await getServicesCoreWithPagination({ first })
        setItems(nodes)
      } catch (e) {
        console.warn('ServicesSlider: failed to load services', e)
      }
    })()
  }, [first])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const perView = isMobile ? 1 : 4
  const maxIndex = Math.max(0, items.length - perView)
  const next = () => setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  const prev = () => setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))

  if (!items?.length) return null

  return (
    <SectionBand
      className="bg-white"                 // section bg
      color="bg-[#F4F4F4]"                  // band color
      position="top"                       // <-- paint the TOP half
      padding="pt-12 md:pt-20 pb-0"
      mobile={{ color: 'bg-gray-100', height: 'h-[340px]', position: 'top' }}
      desktop={{ color: 'bg-gray-100', height: 'h-[320px]', position: 'top' }}
    >
      <section className="services-slider">
        <div className="cda-container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center md:text-left w-full">
              <p className="cda-subtitle">
                {subtitle}
              </p>
              <h2 className="cda-title">
                {title}
              </h2>
            </div>

            {/* Desktop controls + All Services */}
            <div className="hidden md:flex items-center gap-6 ml-6 whitespace-nowrap">
              {items.length > perView && (
                <div className="flex items-center gap-2 mr-5">
                  <button
                    onClick={prev}
                    disabled={index === 0}
                    aria-label="Previous"
                    className={`p-0 flex-shrink-0 transition-opacity ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-100 active:opacity-100 cursor-pointer'}`}
                  >
                    <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
                  </button>
                  <button
                    onClick={next}
                    disabled={index >= maxIndex}
                    aria-label="Next"
                    className={`p-0 flex-shrink-0 transition-opacity ${index >= maxIndex ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-100 active:opacity-100 cursor-pointer'}`}
                  >
                    <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
                  </button>
                </div>
              )}
              <TextLinkButton href="/services">
                All Services
              </TextLinkButton>
            </div>
          </div>

          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: isMobile
                  ? `translateX(calc(-${index * 373}px + calc(50% - 186.5px)))`
                  : `translateX(-${index * (100 / perView)}%)`
              }}
            >
              {items.map((svc) => (
                <div
                  key={svc.id}
                  className="w-[373px] md:w-1/2 lg:w-1/4 flex-shrink-0 md:px-3"
                  style={isMobile ? { padding: '0 10px' } : {}}
                >
                  <Link href={`/services/${svc.slug}`} className="block group">
                    <div className="relative w-full pb-[66%] bg-white border border-gray-200 overflow-hidden">
                      {svc.featuredImage?.node?.sourceUrl && (
                        <Image
                          src={svc.featuredImage.node.sourceUrl}
                          alt={svc.featuredImage.node.altText || svc.title}
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="font-semibold text-black group-hover:underline">
                        {svc.title}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile controls */}
          {items.length > perView && (
            <div className="mt-6 flex md:hidden justify-center gap-4">
              <button
                onClick={prev}
                aria-label="Previous"
                className="p-0 flex-shrink-0 opacity-30 hover:opacity-100 active:opacity-100 transition-opacity cursor-pointer"
              >
                <img src="/images/arrow-icons/left-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="p-0 flex-shrink-0 opacity-30 hover:opacity-100 active:opacity-100 transition-opacity cursor-pointer"
              >
                <img src="/images/arrow-icons/right-arrow.svg" alt="" width="14" height="14" className="w-[14px] h-[14px] block" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>
    </SectionBand>
  )
}
