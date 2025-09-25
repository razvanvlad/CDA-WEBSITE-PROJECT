// components/HeaderClient.js
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { gql } from '@apollo/client'
import client from '../lib/graphql/client'
import BookingModal from './BookingModal'
import { usePathname } from 'next/navigation'

// Client-side queries (used only as background refresh when initial props are missing)
const MENU_BY_DBID = gql`
  query MenuByDbId($id: ID!) {
    menu(id: $id, idType: DATABASE_ID) {
      id
      name
      menuItems(first: 100) {
        nodes {
          id
          databaseId
          label
          url
          path
          parentId
          order
        }
      }
    }
  }
`

const MENU_BY_NAME = gql`
  query MenuByName($name: ID!) {
    menu(id: $name, idType: NAME) {
      id
      name
      menuItems(first: 100) {
        nodes {
          id
          databaseId
          label
          url
          path
          parentId
          order
        }
      }
    }
  }
`

const LIST_MENUS = gql`
  query ListMenus {
    menus(first: 100) {
      nodes { id databaseId name }
    }
  }
`

export default function Header({ initialPrimaryLinks = [], initialCompanyLinks = [] }) {
  const [menuItems, setMenuItems] = useState([])
  const [menuNodes, setMenuNodes] = useState([])

  const [primaryLinks, setPrimaryLinks] = useState(initialPrimaryLinks)
  const [companyLinks, setCompanyLinks] = useState(initialCompanyLinks)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  // Default to company menu view
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  const normalizeNodes = (nodes) =>
    (nodes || [])
      .map((n, idx) => ({
        id: n?.id || `node-${idx}`,
        label: n?.label || '',
        url: n?.path || n?.url || '#',
        parentId: n?.parentId ?? null,
        order: n?.order ?? (idx + 1),
      }))
      .filter((n) => n.label && n.url)

  // Background fetch only if props were empty
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (primaryLinks.length && companyLinks.length) {
        return
      }
      try {
        // Primary (id 4)
        if (!primaryLinks.length) {
          try {
            const res = await client.query({ query: MENU_BY_DBID, variables: { id: '4' }, fetchPolicy: 'no-cache', errorPolicy: 'all' })
            const nodes = res?.data?.menu?.menuItems?.nodes || []
            const norm = normalizeNodes(nodes)
            if (mounted) {
              setPrimaryLinks(norm)
              setMenuNodes(nodes)
              setMenuItems(nodes.filter(n => !n?.parentId))
            }
          } catch {}
        }

        // Company (id 18 -> name 'company' -> auto-resolve)
        if (!companyLinks.length) {
          let company = []
          try {
            const resCompany = await client.query({ query: MENU_BY_DBID, variables: { id: '18' }, fetchPolicy: 'no-cache', errorPolicy: 'all' })
            company = normalizeNodes(resCompany?.data?.menu?.menuItems?.nodes || [])
          } catch {}
          if (!company.length) {
            try {
              const resByName = await client.query({ query: MENU_BY_NAME, variables: { name: 'company' }, fetchPolicy: 'no-cache', errorPolicy: 'all' })
              company = normalizeNodes(resByName?.data?.menu?.menuItems?.nodes || [])
            } catch {}
          }
          if (!company.length) {
            try {
              const resList = await client.query({ query: LIST_MENUS, fetchPolicy: 'no-cache', errorPolicy: 'all' })
              const menus = resList?.data?.menus?.nodes || []
              const match = menus.find(m => typeof m?.name === 'string' && /company|sidebar/i.test(m.name))
              if (match?.databaseId) {
                const resAuto = await client.query({ query: MENU_BY_DBID, variables: { id: String(match.databaseId) }, fetchPolicy: 'no-cache', errorPolicy: 'all' })
                company = normalizeNodes(resAuto?.data?.menu?.menuItems?.nodes || [])
              }
            } catch {}
          }
          if (mounted) setCompanyLinks(company)
        }
      } catch {}
    })()
    return () => { mounted = false }
  }, [primaryLinks.length, companyLinks.length])

  // Derive Services submenu from primary menu if needed
  const servicesLabels = ['eCommerce','B2B Lead Generation','Software Development','Booking Systems','Digital Marketing','Outsourced CMO','AI']
  const servicesParent = menuNodes.find(
    (n) => (n?.label || '').toLowerCase() === 'services' || (typeof n?.url === 'string' && n.url.toLowerCase().includes('/services'))
  )
  const servicesChildren = servicesParent ? menuNodes.filter((n) => n.parentId === servicesParent.id) : []
  const servicesFromLabels = menuNodes.filter((n) => servicesLabels.includes((n?.label || '').trim()))
  const servicesMenu = (servicesChildren && servicesChildren.length > 0) ? servicesChildren : servicesFromLabels

  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === ''

  const crumbParts = (pathname || '/').split('/').filter(Boolean)
  const formatLabel = (seg) => decodeURIComponent(seg).replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())

  return (
    <>
      {/* Desktop Sticky Start Project Button - Left Edge */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <button onClick={() => setIsBookingModalOpen(true)} className="button-without-box-vertical-black shadow-lg hover:shadow-xl transition-shadow duration-300">Start A Project</button>
      </div>

      {/* Mobile Sticky Start Project Button - Bottom Edge */}
      <div className="fixed bottom-0 left-0 z-50 md:hidden">
        <button onClick={() => setIsBookingModalOpen(true)} className="button-without-box-vertical-black shadow-lg hover:shadow-xl transition-shadow duration-300">Start A Project</button>
      </div>

      <header className="bg-white" style={{ borderBottom: '1px solid #EBEBEB' }}>
        <div className="mx-auto max-w-[1620px] px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" aria-label="Go to homepage">
                <Image src="/images/cda-logo.svg" alt="CDA Logo" width={120} height={32} priority />
              </a>
            </div>

            {/* Desktop Navigation - primary menu */}
            <nav className="hidden md:flex space-x-8">
              {(primaryLinks || []).map((item) => (
                <a key={item.id} href={item.url} className="nav-link" style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: '600' }}>
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Side Menu and Mobile Menu Buttons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsSideMenuOpen(true)} aria-label="Open side menu">
                <img src="/images/menu-icon.svg" alt="" className="w-6 h-6" aria-hidden="true" />
              </button>
              <button className="hidden" aria-hidden="true" tabIndex={-1} aria-label="Open mobile menu" style={{ display: 'none' }}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Breadcrumb row (outside header, below the line) */}
      {!isHome && (
        <div className="bg-white">
          <div className="mx-auto max-w-[1620px] px-4 py-2">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[14px] md:text-[15px] text-black">
                <li>
                  <a href="/" className="underline font-semibold">Home</a>
                </li>
                {crumbParts.map((seg, idx) => {
                  const href = '/' + crumbParts.slice(0, idx + 1).join('/')
                  const last = idx === crumbParts.length - 1
                  const label = formatLabel(seg)
                  return (
                    <li key={href} className="flex items-center gap-2">
                      <span className="opacity-60">/</span>
                      {last ? (
                        <span>{label}</span>
                      ) : (
                        <a href={href} className="underline font-semibold">{label}</a>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          </div>
        </div>
      )}

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:bg-transparent md:bg-opacity-0 z-50" onClick={() => { setIsSideMenuOpen(false); setIsCompanyMenuOpen(false); }} />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[430px] bg-black shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Side Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <a href="/" aria-label="Go to homepage">
              <Image src="/images/cda-logo-white.svg" alt="CDA Logo" width={120} height={32} />
            </a>
            <button onClick={() => { setIsSideMenuOpen(false); setIsCompanyMenuOpen(false); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close side menu">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Side Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-6">
              {!isServicesOpen && (
                <>
                  <button type="button" onClick={() => setIsServicesOpen(true)} className="w-full flex items-center justify-between mb-3 text-left" aria-expanded={isServicesOpen} aria-controls="side-menu-services">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect x="3" y="3" width="4" height="4" fill="#fff"/>
                        <rect x="10" y="3" width="4" height="4" fill="#fff"/>
                        <rect x="17" y="3" width="4" height="4" fill="#fff"/>
                        <rect x="3" y="10" width="4" height="4" fill="#fff"/>
                        <rect x="10" y="10" width="4" height="4" fill="#fff"/>
                        <rect x="17" y="10" width="4" height="4" fill="#fff"/>
                        <rect x="3" y="17" width="4" height="4" fill="#fff"/>
                        <rect x="10" y="17" width="4" height="4" fill="#fff"/>
                        <rect x="17" y="17" width="4" height="4" fill="#fff"/>
                      </svg>
                      <span className="side-menu-heading">Our Services</span>
                    </div>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9 18l6-6-6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <hr className="side-menu-divider" />
                </>
              )}

              {isServicesOpen && (
                <>
                  <button type="button" onClick={() => setIsServicesOpen(false)} className="w-full flex items-center gap-3 mb-3 text-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    <span className="side-menu-heading">Back</span>
                  </button>
                  <hr className="side-menu-divider" />
                  <ul id="side-menu-services" className="space-y-4">
                    {primaryLinks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((svc) => (
                      <li key={svc.id}>
                        <a href={svc.url} className="side-menu-item block" onClick={() => { setIsSideMenuOpen(false); setIsServicesOpen(false); }} title={svc.label}>
                          {svc.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {!isServicesOpen && (
                <ul className="mt-6 space-y-4">
                  {companyLinks
                    .filter((i) => (i?.label || '').toLowerCase() !== 'services')
                    .sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)))
                    .map((item) => (
                      <li key={item.id}>
                        <a href={item.url} className="side-menu-item" onClick={() => { setIsSideMenuOpen(false); setIsCompanyMenuOpen(false); }}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                </ul>
              )}

              {/* Let’s Connect */}
              <div className="mt-10">
                <h3 className="side-menu-connect-heading">Let’s Connect</h3>
                <div className="mt-3 flex items-center gap-4">
                  <a href="/contact" className="side-menu-connect-link" onClick={() => setIsSideMenuOpen(false)}>Contact Us</a>
                  <span className="side-menu-connect-text">0203 780 0808</span>
                </div>
                <div className="mt-4 flex items-center gap-5">
                  <a href="https://www.facebook.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="side-menu-social"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.41V9.41c0-2.38 1.42-3.7 3.6-3.7 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.47v1.77h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z"/></svg></a>
                  <a href="https://www.instagram.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="side-menu-social"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM17.8 6.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg></a>
                  <a href="https://www.linkedin.com/company/cdagroup/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="side-menu-social"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 6.94A2.44 2.44 0 1 1 2.06 6.94a2.44 2.44 0 0 1 4.88 0zM2.4 8.8h4.8V22H2.4V8.8zm7.2 0h4.6v1.81h.06c.64-1.21 2.2-2.49 4.52-2.49 4.84 0 5.73 3.19 5.73 7.33V22h-4.8v-6.15c0-1.47-.03-3.36-2.05-3.36-2.06 0-2.38 1.6-2.38 3.26V22H9.6V8.8z"/></svg></a>
                  <a href="https://www.youtube.com/@CDAGroupUK" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="side-menu-social"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.8 8.2a3 3 0 0 0-2.1-2.1C17.7 5.5 12 5.5 12 5.5s-5.7 0-7.7.6A3 3 0 0 0 2.2 8.2 31.4 31.4 0 0 0 1.8 12a31.4 31.4 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c2 .6 7.7.6 7.7.6s5.7 0 7.7-.6a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8 0-1.3-.1-2.6-.4-3.8zM10 14.7V9.3l4.8 2.7L10 14.7z"/></svg></a>
                  <a href="https://www.tiktok.com/@cdagroupuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="side-menu-social"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 8.5a7 7 0 0 1-4-1.3v7.1a6.3 6.3 0 1 1-5.4-6.3v3a3.3 3.3 0 1 0 2.3 3.1V2h3a4 4 0 0 0 4 4v2.5z"/></svg></a>
                </div>
              </div>
            </nav>
          </div>

          {/* Side Menu Footer (optional placeholder to keep spacing) */}
          <div className="p-6"></div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
      )}
    </>
  )
}
