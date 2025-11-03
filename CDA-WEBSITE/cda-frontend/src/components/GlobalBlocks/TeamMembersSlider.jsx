"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getTeamMembersWithPagination, getTeamMembersCoreWithPagination } from "@/lib/graphql-queries.js"

// TeamMembersSlider
// - Matches the style/structure of ServicesSlider
// - 4 cards per view on desktop, 1 per view on mobile
// - Shows profile image, name (title), job title, and links to profile
export default function TeamMembersSlider({ title = "Meet Our Other Team Members", subtitle = "The Leadership Team", first = 24 }) {
  const [items, setItems] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { nodes } = await getTeamMembersWithPagination({ first })
        if (nodes && nodes.length) {
          setItems([...nodes].sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0)))
        } else {
          const core = await getTeamMembersCoreWithPagination({ first })
          const list = core?.nodes || []
          setItems([...list].sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0)))
        }
      } catch (e) {
        console.warn("TeamMembersSlider: failed to load team members", e)
      }
    }
    fetchData()
  }, [first])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const perView = isMobile ? 1 : 4
  const maxIndex = Math.max(0, (items.length - perView))

  const next = () => setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  const prev = () => setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))

  if (!items || items.length === 0) return null

  return (
    <section className="services-slider py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-[38px] md:px-6 lg:px-8">
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
            {items.map((m) => {
              const img = m?.featuredImage?.node?.sourceUrl
              const alt = m?.featuredImage?.node?.altText || m?.title
              const job = m?.teamMemberFields?.jobTitle || m?.jobTitle || m?.acf?.jobTitle || m?.fields?.jobTitle || ""
              return (
                <div key={m.id} className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-3">
                  <div className="block group text-center">
                    <Link href={`/team/${m.slug}`} className="block">
                      <div className="relative w-full pb-[100%] bg-gray-100 overflow-hidden rounded-md">
                        {img && (
                          <Image src={img} alt={alt} fill className="object-cover" />
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="font-semibold text-black leading-tight group-hover:underline">{m.title}</div>
                        {job && <div className="text-sm text-gray-600">{job}</div>}
                      </div>
                    </Link>
                    <div className="mt-3">
                      <Link href={`/team/${m.slug}`} className="inline-flex items-center gap-2 font-semibold text-black hover:underline">
                        <span>View Profile</span>
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
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
