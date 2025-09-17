'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getServicesCoreWithPagination } from '@/lib/graphql-queries.js'

// Client component slider that fetches Services posts and renders a horizontal slider.
// Not editable in WP; purely presentational and fed by Services CPT.
export default function ServicesSlider({ title = 'You May Also Be Interested In', subtitle = 'Our Services', first = 12 }) {
  const [items, setItems] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
const { nodes } = await getServicesCoreWithPagination({ first })
        setItems(nodes)
      } catch (e) {
        console.warn('ServicesSlider: failed to load services', e)
      }
    }
    fetchData()
  }, [first])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const perView = isMobile ? 1 : 4
  const maxIndex = Math.max(0, (items.length - perView))

  const next = () => setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  const prev = () => setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))

  if (!items || items.length === 0) return null

  return (
    <section className="services-slider py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black">{title}</h2>
          </div>
          {items.length > perView && (
            <div className="hidden md:flex items-center gap-4">
              <button onClick={prev} aria-label="Previous" className="p-2 border border-gray-300 hover:bg-gray-50">←</button>
              <button onClick={next} aria-label="Next" className="p-2 border border-gray-300 hover:bg-gray-50">→</button>
            </div>
          )}
        </div>

        {/* Track */}
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * (100 / perView)}%)` }}>
            {items.map((svc) => (
              <div key={svc.id} className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-3">
                <Link href={`/services/${svc.slug}`} className="block group">
                  <div className="relative w-full pb-[66%] bg-gray-100 overflow-hidden">
                    {svc.featuredImage?.node?.sourceUrl && (
                      <Image src={svc.featuredImage.node.sourceUrl} alt={svc.featuredImage.node.altText || svc.title} fill className="object-contain" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="font-semibold text-black group-hover:underline">{svc.title}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile arrows */}
        {items.length > perView && (
          <div className="mt-6 flex md:hidden justify-center gap-4">
            <button onClick={prev} aria-label="Previous" className="p-2 border border-gray-300 hover:bg-gray-50">←</button>
            <button onClick={next} aria-label="Next" className="p-2 border border-gray-300 hover:bg-gray-50">→</button>
          </div>
        )}
      </div>
    </section>
  )
}
