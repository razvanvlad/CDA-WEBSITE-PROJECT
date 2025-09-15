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
        <div className="footer-cta-card relative overflow-visible rounded-2xl bg-white">
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
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="/case-studies" className="text:[14px] text-[#0B0B0E] hover:underline">
                Work
              </a>
              <a href="/services" className="text:[14px] text-[#0B0B0E] hover:underline">
                Services
              </a>
              <a href="/jobs" className="text:[14px] text-[#0B0B0E] hover:underline">
                Careers
              </a>
              <a href="/policies" className="text:[14px] text-[#0B0B0E] hover:underline">
                Policies
              </a>
            </div>
            <p className="mt-6 text-[14px] text-[#111827]/60">CDA © {new Date().getFullYear()}. All rights reserved.</p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-start md:items-end">
            <h3 className="text-[16px] font-semibold text-[#0B0B0E] mb-4">Let's Connect</h3>
            <div className="flex items-center gap-4 mb-4">
              <a href="https://www.facebook.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.41V9.41c0-2.38 1.42-3.7 3.6-3.7 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.47v1.77h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM17.8 6.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/cdagroup/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.94 6.94A2.44 2.44 0 1 1 2.06 6.94a2.44 2.44 0 0 1 4.88 0zM2.4 8.8h4.8V22H2.4V8.8zm7.2 0h4.6v1.81h.06c.64-1.21 2.2-2.49 4.52-2.49 4.84 0 5.73 3.19 5.73 7.33V22h-4.8v-6.15c0-1.47-.03-3.36-2.05-3.36-2.06 0-2.38 1.6-2.38 3.26V22H9.6V8.8z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@CDAGroupUK" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.8 8.2a3 3 0 0 0-2.1-2.1C17.7 5.5 12 5.5 12 5.5s-5.7 0-7.7.6A3 3 0 0 0 2.2 8.2 31.4 31.4 0 0 0 1.8 12a31.4 31.4 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c2 .6 7.7.6 7.7.6s5.7 0 7.7-.6a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8 0-1.3-.1-2.6-.4-3.8zM10 14.7V9.3l4.8 2.7L10 14.7z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@cdagroupuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-black hover:opacity-80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 8.5a7 7 0 0 1-4-1.3v7.1a6.3 6.3 0 1 1-5.4-6.3v3a3.3 3.3 0 1 0 2.3 3.1V2h3a4 4 0 0 0 4 4v2.5z"/>
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