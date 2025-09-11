// components/Footer.js
'use client'

import { useEffect, useState, useMemo } from 'react'
import client from '../lib/graphql/client'
import { GET_FOOTER_MENU } from '../lib/graphql/queries'

export default function Footer({ globalOptions }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Derive WP base path once, e.g., /CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
  const wpBasePath = useMemo(() => {
    try {
      const url = process.env.NEXT_PUBLIC_WORDPRESS_URL
      if (url) return new URL(url).pathname.replace(/\/$/, '')
    } catch {}
    return ''
  }, [])

  const normalizePath = (path) => {
    if (!path || typeof path !== 'string') return '/'
    let p = path
    // If absolute URL, reduce to pathname
    try {
      if (p.startsWith('http://') || p.startsWith('https://')) {
        p = new URL(p).pathname
      }
    } catch {}
    // Strip WP base path
    if (wpBasePath && p.startsWith(wpBasePath)) {
      p = p.slice(wpBasePath.length) || '/'
    }
    // Strip index.php prefix
    if (p.startsWith('/index.php')) {
      p = p.replace(/^\/index\.php/, '') || '/'
    }
    // Ensure leading slash and collapse duplicates
    if (!p.startsWith('/')) p = '/' + p
    p = p.replace(/\/+/g, '/')
    return p === '' ? '/' : p
  }

  const resolveHref = (item) => {
    const uri = item?.connectedNode?.node?.uri
    if (typeof uri === 'string' && uri.length > 0) return normalizePath(uri)
    const url = item?.url
    try {
      if (typeof url === 'string' && url.length > 0) {
        const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
        return normalizePath(u.pathname || '/')
      }
    } catch (e) {}
    return '/'
  }

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
        <div className="footer-cta-card relative overflow-visible rounded-2xl border border-gray-200 bg-white">
          <div className="footer-cta-content py-16 px-6 md:px-12">
            <p className="text-[14px] font-semibold uppercase tracking-wider text-[#0B0B0E]">Take The First Step Toward Something Great</p>
            <h2 className="mt-3 text-[34px] md:text-[44px] leading-tight font-extrabold text-[#0B0B0E] text-center">
              Ready To Start Your{' '}
              <span className="relative inline-block">
                Project?
                <span className="absolute left-0 bottom-1 h-2 w-full bg-[#FF6A00] -z-10"></span>
              </span>
            </h2>
            <a href="/contact" className="button-l footer-cta-btn mt-6">Let's Talk</a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0B0B0E] mb-4">Have A Browse</h3>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {menuItems && menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <a key={item.id} href={resolveHref(item)} className="text:[14px] text-[#0B0B0E] hover:underline">
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

          <div className="w-full md:w-auto flex flex-col items-start md:items-end">
            <h3 className="text-[16px] font-semibold text-[#0B0B0E] mb-4">Let's Connect</h3>
            <div className="flex items-center gap-4 mb-4">
              <a href="#" aria-label="Facebook" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12.07C22 6.49 17.52 2 11.93 2 6.35 2 1.86 6.49 1.86 12.07c0 5.01 3.66 9.16 8.44 9.96v-7.04H7.9v-2.92h2.4V9.85c0-2.38 1.42-3.69 3.6-3.69 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.92h-2.22V22c4.78-.8 8.44-4.95 8.44-9.96z"/>
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2c.5 2.5 2.3 4.5 4.8 5v3.2c-1.4-.1-2.7-.5-3.9-1.2v5.7c0 3-2.4 5.3-5.4 5.3S2 17.7 2 14.7c0-2.5 1.6-4.6 3.8-5.2v3.3c-.6.4-1 .9-1 1.7 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2V2h2.8z"/>
                </svg>
              </a>
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