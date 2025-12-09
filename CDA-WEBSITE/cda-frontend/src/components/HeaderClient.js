// components/HeaderClient.js
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gql } from '@apollo/client'
import client from '../lib/graphql/client'
import BookingModal from './BookingModal'
import { usePathname } from 'next/navigation'
import TextLinkButton from './ui/TextLinkButton'
import UnderlinedTitle from './UnderlinedTitle'

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

// NavLink component with custom SVG underline on hover
function NavLink({ href, children, className = '' }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={href}
      className={className}
      style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: '600' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <UnderlinedTitle
          as="span"
          underlineColor="#3CBEEB"
          strokeWidth={4}
          underlineOffset={16}
          curveIntensity={0.01}
        >
          {children}
        </UnderlinedTitle>
      ) : (
        <span>{children}</span>
      )}
    </a>
  )
}

export default function Header({ initialPrimaryLinks = [], initialCompanyLinks = [], backButton = null }) {
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
      ; (async () => {
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
            } catch { }
          }

          // Company (id 18 -> name 'company' -> auto-resolve)
          if (!companyLinks.length) {
            let company = []
            try {
              const resCompany = await client.query({ query: MENU_BY_DBID, variables: { id: '18' }, fetchPolicy: 'no-cache', errorPolicy: 'all' })
              company = normalizeNodes(resCompany?.data?.menu?.menuItems?.nodes || [])
            } catch { }
            if (!company.length) {
              try {
                const resByName = await client.query({ query: MENU_BY_NAME, variables: { name: 'company' }, fetchPolicy: 'no-cache', errorPolicy: 'all' })
                company = normalizeNodes(resByName?.data?.menu?.menuItems?.nodes || [])
              } catch { }
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
              } catch { }
            }
            if (mounted) setCompanyLinks(company)
          }
        } catch { }
      })()
    return () => { mounted = false }
  }, [primaryLinks.length, companyLinks.length])

  // Derive Services submenu from primary menu if needed
  const servicesLabels = ['eCommerce', 'B2B Lead Generation', 'Software Development', 'Booking Systems', 'Digital Marketing', 'Outsourced CMO', 'AI']
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
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-black h-[58px] flex items-center justify-center">
        <TextLinkButton onClick={() => setIsBookingModalOpen(true)} variant="white">
          Start A Project
        </TextLinkButton>
      </div>

      <header className="bg-white" style={{ borderBottom: '1px solid #EBEBEB' }}>
        {/* Mobile: 79px height | Desktop: 125px height */}
        <div className="mx-auto max-w-[1620px] container-padding h-[79px] md:h-[125px] flex items-center">
          {/* Mobile: 353px container for Logo + Menu */}
          <div className="w-full max-w-[353px] md:max-w-none mx-0 md:mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo - Mobile: 77x27 | Desktop: 131x46 */}
              <div className="flex items-center">
                <Link href="/" aria-label="Go to homepage">
                  <Image
                    src="/images/cda-logo.svg"
                    alt="CDA Logo"
                    width={77}
                    height={27}
                    priority
                    className="md:w-[131px] md:h-[46px]"
                  />
                </Link>
              </div>

              {/* Desktop Navigation - primary menu */}
              <nav className="hidden md:flex space-x-8">
                {(primaryLinks || []).map((item) => (
                  <NavLink key={item.id} href={item.url}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Side Menu and Mobile Menu Buttons - Mobile: 26x17 | Desktop: 31x20 */}
              <div className="flex items-center">
                <button className="hover:bg-gray-100 rounded-lg transition-colors p-0" onClick={() => setIsSideMenuOpen(true)} aria-label="Open side menu">
                  <img src="/images/menu-icon.svg" alt="" className="w-[26px] h-[17px] md:w-[31px] md:h-[20px]" aria-hidden="true" />
                </button>
                <button className="hidden" aria-hidden="true" tabIndex={-1} aria-label="Open mobile menu" style={{ display: 'none' }}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Breadcrumb row (outside header, below the line) */}
      {!isHome && (
        <div className="bg-white">
          <div className="mx-auto max-w-[1620px] container-padding py-2">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[14px] md:text-[15px] text-black min-w-0">
                <li className="flex-shrink-0">
                  <Link href="/" className="underline font-semibold">Home</Link>
                </li>
                {crumbParts.map((seg, idx) => {
                  const href = '/' + crumbParts.slice(0, idx + 1).join('/')
                  const last = idx === crumbParts.length - 1
                  const label = formatLabel(seg)
                  return (
                    <li key={href} className={`flex items-center gap-2 ${last ? 'min-w-0 flex-1' : 'flex-shrink-0'}`}>
                      <span className="opacity-60 flex-shrink-0">/</span>
                      {last ? (
                        <span className="truncate">{label}</span>
                      ) : (
                        <a href={href} className="underline font-semibold">{label}</a>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>

            {/* Back Button - appears directly under breadcrumb on detail pages */}
            {backButton && (
              <div className="mt-4">
                <TextLinkButton
                  href={backButton.href}
                  iconPosition="left"
                  variant={backButton.variant || 'default'}
                >
                  {backButton.label}
                </TextLinkButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:bg-transparent md:bg-opacity-0 z-50" onClick={() => { setIsSideMenuOpen(false); setIsCompanyMenuOpen(false); }} />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[662px] bg-black transform transition-transform duration-300 ease-in-out z-50 ${isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Side Menu Header - Mobile: 79px height | Desktop: 125px height */}
          <div className="flex items-center justify-between h-[79px] md:h-[125px] px-[38px] md:pl-[82px] md:pr-[178px]">
            {/* Mobile: 353px container for Logo + Close button */}
            <div className="w-full max-w-[353px] md:max-w-none mx-0 flex items-center justify-between md:justify-end">
              <Link href="/" aria-label="Go to homepage" className="md:hidden">
                <Image
                  src="/images/cda-logo-white.svg"
                  alt="CDA Logo"
                  width={77}
                  height={27}
                  className="md:w-[131px] md:h-[46px]"
                />
              </Link>
              <button onClick={() => { setIsSideMenuOpen(false); setIsCompanyMenuOpen(false); }} className="hover:bg-white/10 rounded-lg transition-colors p-0" aria-label="Close side menu">
                <svg className="w-[26px] h-[26px] md:w-[31px] md:h-[31px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Side Menu Content */}
          <div className="flex-1 overflow-y-auto px-[38px] md:pl-[82px] md:pr-6">
            {/* Mobile: 353px container for menu content */}
            <div className="w-full max-w-[353px] md:max-w-none mx-0">
              <nav className="py-6">
                {!isServicesOpen && (
                  <>
                    <button type="button" onClick={() => setIsServicesOpen(true)} className="md:hidden w-full flex items-center justify-between mb-3 text-left" aria-expanded={isServicesOpen} aria-controls="side-menu-services">
                      <div className="flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <rect x="3" y="3" width="4" height="4" fill="#fff" />
                          <rect x="10" y="3" width="4" height="4" fill="#fff" />
                          <rect x="17" y="3" width="4" height="4" fill="#fff" />
                          <rect x="3" y="10" width="4" height="4" fill="#fff" />
                          <rect x="10" y="10" width="4" height="4" fill="#fff" />
                          <rect x="17" y="10" width="4" height="4" fill="#fff" />
                          <rect x="3" y="17" width="4" height="4" fill="#fff" />
                          <rect x="10" y="17" width="4" height="4" fill="#fff" />
                          <rect x="17" y="17" width="4" height="4" fill="#fff" />
                        </svg>
                        <span className="side-menu-heading">Our Services</span>
                      </div>
                      <Image src="/images/right-icon.svg" alt="" width={16} height={16} aria-hidden="true" />
                    </button>
                    <hr className="side-menu-divider md:hidden" />
                  </>
                )}

                {/* Mobile: Services submenu when isServicesOpen is true */}
                {isServicesOpen && (
                  <>
                    <button type="button" onClick={() => setIsServicesOpen(false)} className="md:hidden w-full flex items-center gap-3 mb-3 text-left group">
                      <Image src="/images/left-back-icon.svg" alt="" width={11} height={11} aria-hidden="true" />
                      <span className="side-menu-heading group-hover:underline">Back</span>
                    </button>
                    <hr className="side-menu-divider md:hidden" />
                    <ul id="side-menu-services" className="space-y-4 md:hidden">
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

                {/* Mobile: Show company links only when not in services menu */}
                {!isServicesOpen && (
                  <ul className="mt-6 space-y-4 md:hidden">
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

                {/* Desktop: Always show company links (regardless of isServicesOpen state) */}
                <ul className="hidden md:block space-y-4">
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

                {/* Let’s Connect */}
                <div className="mt-10">
                  <h3 className="side-menu-connect-heading">Let’s Connect</h3>
                  <div className="mt-3 flex items-center gap-4">
                    <a href="/contact" className="side-menu-connect-link" onClick={() => setIsSideMenuOpen(false)}>Contact Us</a>
                    <span className="side-menu-connect-text">0203 780 0808</span>
                  </div>
                  <div className="mt-4 flex items-center gap-5">
                    <a href="https://www.facebook.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="side-menu-social">
                      <Image src="/images/social-icons/facebook.svg" alt="" width={9} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.tiktok.com/@cdagroupuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="side-menu-social">
                      <Image src="/images/social-icons/tiktok.svg" alt="" width={17} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.instagram.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="side-menu-social">
                      <Image src="/images/social-icons/instagram.svg" alt="" width={18} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.linkedin.com/company/cdagroup/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="side-menu-social">
                      <Image src="/images/social-icons/linkedin.svg" alt="" width={18} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.youtube.com/@CDAGroupUK" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="side-menu-social">
                      <Image src="/images/social-icons/youtube.svg" alt="" width={26} height={20} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </nav>
            </div>
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
