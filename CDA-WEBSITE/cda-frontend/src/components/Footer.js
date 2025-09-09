// components/Footer.js
'use client'

import { useEffect, useState } from 'react'
import client from '../lib/graphql/client'
import { GET_FOOTER_MENU } from '../lib/graphql/queries'

export default function Footer({ globalOptions }) {
  // Fetch footer menu (WordPress menu with slug: "footer")
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFooterMenu = async () => {
      try {
        const response = await client.query({ query: GET_FOOTER_MENU, errorPolicy: 'all' })
        const items = response.data?.footerMenu?.menuItems?.nodes?.filter(i => !i.parentId) || []
        setMenuItems(items)
      } catch (e) {
        console.error('Footer menu fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchFooterMenu()
  }, [])

  return (
    <footer className="bg-white pt-20">
      <div className="mx-auto max-w-[1620px] px-4">
        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16 px-6 md:px-12">
            <div className="text-center lg:text-left">
              <p className="text-[14px] font-semibold uppercase tracking-wider text-[#0B0B0E]">Take The First Step Toward Something Great</p>
              <h2 className="mt-3 text-[34px] md:text-[44px] leading-tight font-extrabold text-[#0B0B0E]">
                Ready To Start Your{' '}
                <span className="relative inline-block">
                  Project?
                  <span className="absolute left-0 bottom-1 h-2 w-full bg-[#FF6A00] -z-10"></span>
                </span>
              </h2>
              <a
                href="/contact"
                className="inline-block mt-6 px-8 py-3 bg-black text-white font-semibold rounded-md shadow hover:shadow-lg transition"
              >
                Let's Talk
              </a>
            </div>

            {/* Illustration */}
            <div className="hidden lg:flex justify-end pr-4">
              {/* Inline SVG: Magnifying Glass */}
              <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="170" cy="150" r="90" stroke="#A78BFA" strokeWidth="14" fill="white" />
                <path d="M110 210 L40 280" stroke="#A78BFA" strokeWidth="22" strokeLinecap="round" />
                {/* Decorative inner strokes */}
                <path d="M210 150c0 8-3 16-8 22" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
                <path d="M150 110c8 0 16 3 22 8" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
                <path d="M145 195c-8 0-16-3-22-8" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          {/* Left: Footer Menu */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0B0E] mb-4">Have A Browse</h3>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {menuItems && menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <a key={item.id} href={item.url} className="text-[14px] text-[#0B0B0E] hover:underline">
                      {item.label}
                    </a>
                  ))
                ) : (
                  <span className="text-[14px] text-gray-500">No footer links configured</span>
                )}
              </div>
            )}
            <p className="mt-6 text-[14px] text-[#111827]/60">CDA © {new Date().getFullYear()}. All rights reserved.</p>
          </div>

          {/* Right: Social + Contact */}
          <div className="w-full md:w-auto flex flex-col items-start md:items-end">
            <h3 className="text-[16px] font-semibold text-[#0B0B0E] mb-4">Let's Connect</h3>
            <div className="flex items-center gap-4 mb-4">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12.07C22 6.49 17.52 2 11.93 2 6.35 2 1.86 6.49 1.86 12.07c0 5.01 3.66 9.16 8.44 9.96v-7.04H7.9v-2.92h2.4V9.85c0-2.38 1.42-3.69 3.6-3.69 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.92h-2.22V22c4.78-.8 8.44-4.95 8.44-9.96z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" aria-label="TikTok" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2h-2v11.5a3.5 3.5 0 11-3.5-3.5c.2 0 .4 0 .6.1V8.1A5.5 5.5 0 1016 13.5V8.7a6 6 0 004 1.5V8a6 6 0 01-4-2V2z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 12s0-3.5-.45-5.06a3 3 0 00-2.1-2.1C18.79 4.38 12 4.38 12 4.38s-6.79 0-8.45.46a3 3 0 00-2.1 2.1C1 8.5 1 12 1 12s0 3.5.45 5.06a3 3 0 002.1 2.1c1.66.46 8.45.46 8.45.46s6.79 0 8.45-.46a3 3 0 002.1-2.1C23 15.5 23 12 23 12zM10 15.5v-7l6 3.5-6 3.5z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.7-2.2 3.6-2.2 3.8 0 4.5 2.5 4.5 5.8V24h-4v-6.8c0-1.6 0-3.6-2.2-3.6s-2.6 1.7-2.6 3.5V24h-4V8z"/>
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-6 text-[14px] text-[#0B0B0E]">
              <a href="/contact" className="hover:underline">Contact Us</a>
              <a href="tel:02037800808" className="hover:underline">0203 780 0808</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}