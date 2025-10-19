// components/Footer.js
'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { gql } from '@apollo/client';
import client from '../lib/graphql/client';

/* -------------------------------------------------------------------------- */
/* Magnifier configuration                                                    */
/* -------------------------------------------------------------------------- */
const MAG_CONFIG = {
  baseSrc: '/images/magnifying-glass.svg',
  hoverSrc: '/images/magnifying-glass-hover.svg',

  // While aligning on desktop keep both visible; set to false afterwards
  showBothOnDesktop: false,
  reserveBottomDesktop: 240, // pixels of extra space under the CTA to show the magnifier
  layerDesktop: 'behind',    // 'behind' or 'front' (z-index control)

  // Mobile (<768px): no hover; show only the hover art with these settings
  mobile: {
    width: 880,
    x: -85,
    y: 160,
    scale: 1,
    rotate: 20,
  },

  // Desktop (≥768px): independent positions for base and hover
  desktop: {
    base:  { width: 680, x: 500, y: 190, scale: 1, rotate: 0 },
    hover: { width: 680, x: 365, y:  40, scale: 1, rotate: 0 },
  },
};

/* -------------------------------------------------------------------------- */
/* WP Menu Queries                                                            */
/* -------------------------------------------------------------------------- */
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
`;

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
`;

/* -------------------------------------------------------------------------- */

export default function Footer() {
  /* ------------------------------- Menu state ------------------------------ */
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------- Mobile/desktop ---------------------------- */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* -------------------------- URL/path normalisation ----------------------- */
  const wpBasePath = useMemo(() => {
    try {
      const url = process.env.NEXT_PUBLIC_WORDPRESS_URL;
      if (url) return new URL(url).pathname.replace(/\/$/, '');
    } catch {}
    return '';
  }, []);

  const normalizePath = (path) => {
    if (!path || typeof path !== 'string') return '/';
    let p = path;
    try {
      if (p.startsWith('http://') || p.startsWith('https://')) {
        p = new URL(p).pathname;
      }
    } catch {}
    if (wpBasePath && p.startsWith(wpBasePath)) {
      p = p.slice(wpBasePath.length) || '/';
    }
    if (p.startsWith('/index.php')) {
      p = p.replace(/^\/index\.php/, '') || '/';
    }
    if (!p.startsWith('/')) p = '/' + p;
    p = p.replace(/\/+/g, '/');
    return p === '' ? '/' : p;
  };

  const resolveHref = (item) => {
    const raw = item?.path || item?.url || '/';
    return normalizePath(raw);
  };

  /* ------------------------------- Fetch menu ------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        // Use your footer menu DB ID here
        let response = await client.query({
          query: MENU_BY_DBID,
          variables: { id: '41' },
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        });
        let raw = response.data?.menu?.menuItems?.nodes || [];

        if (!raw.length) {
          try {
            const byName = await client.query({
              query: MENU_BY_NAME,
              variables: { name: 'footer' },
              fetchPolicy: 'no-cache',
              errorPolicy: 'all',
            });
            raw = byName.data?.menu?.menuItems?.nodes || [];
          } catch {}
        }

        const topLevel = raw.filter((i) => !i.parentId);
        topLevel.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
        setMenuItems(topLevel);
      } catch (e) {
        console.error('Footer menu fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ----------------------- Hover image visibility class -------------------- */
  const hoverVisibleClass = MAG_CONFIG.showBothOnDesktop
    ? 'opacity-100'
    : 'opacity-0 md:group-hover:opacity-100';
// When not aligning, hide the base on desktop hover (cross-fade with hover image)
const baseVisibleClass = MAG_CONFIG.showBothOnDesktop
  ? 'opacity-100'
  : 'opacity-100 md:group-hover:opacity-0';
  /* --------------------------------- Render -------------------------------- */
  return (
    <footer className="bg-white pt-5">
      <div className="mx-auto max-w-[1620px] px-4">
        {/* CTA Section (group used for desktop hover) */}
        {/* CTA Section */}
<div className="footer-cta-card relative rounded-2xl bg-white group"
  style={{ paddingBottom: isMobile ? 0 : (MAG_CONFIG.reserveBottomDesktop || 0) }}
>
  <div className="footer-cta-content py-16 px-6 md:px-12 relative"
        style={{ zIndex: MAG_CONFIG.layerDesktop === 'front' ? 20 : 10 }}
  >
    <p className="cda-subtitle">Take The First Step Toward Something Great</p>
    <h2 className="mt-3 text-[34px] md:text-[44px] mb-[40px] leading-tight font-extrabold text-[#0B0B0E] text-center">
      Ready To Start Your{' '}
      <span className="relative inline-block">
        Project?
        <span className="absolute left-0 bottom-1 h-2 w-full bg-[#FF6A00] -z-10"></span>
      </span>
    </h2>
    <a 
      href="/contact" 
        className="
         button-l footer-cta-btn mt-6 inline-flex items-center justify-center
         transform-gpu transition-transform duration-300 ease-out will-change-transform
         motion-safe:md:hover:scale-[1.06] motion-safe:md:group-hover:scale-[1.06]
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/70
         active:scale-[1.02]
    " 
    >
      Let's Talk</a>
  </div>

  {/* 🔒 Magnifier canvas — this is what guarantees no extra scrollbar */}
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        style={{ contain: 'paint', zIndex: MAG_CONFIG.layerDesktop === 'front' ? 30 : 0 }}
  >
    {/* MOBILE: single image (no hover on touch) */}
    {isMobile ? (
      <img
        src={MAG_CONFIG.hoverSrc}
        alt=""
        className="absolute select-none will-change-transform"
        style={{
          left: MAG_CONFIG.mobile.x,
          top: MAG_CONFIG.mobile.y,
          width: MAG_CONFIG.mobile.width,
          transform: `scale(${MAG_CONFIG.mobile.scale}) rotate(${MAG_CONFIG.mobile.rotate}deg)`,
        }}
        draggable={false}
      />
    ) : (
      <>
        {/* DESKTOP: base */}
        <img
          src={MAG_CONFIG.baseSrc}
          alt=""
          className={`absolute select-none will-change-transform transition-opacity duration-300 ease-out ${
            MAG_CONFIG.showBothOnDesktop ? 'opacity-100' : 'md:group-hover:opacity-0'
          }`}
          style={{
            left: MAG_CONFIG.desktop.base.x,
            top: MAG_CONFIG.desktop.base.y,
            width: MAG_CONFIG.desktop.base.width,
            transform: `scale(${MAG_CONFIG.desktop.base.scale}) rotate(${MAG_CONFIG.desktop.base.rotate}deg)`,
          }}
          draggable={false}
        />

        {/* DESKTOP: hover */}
        <img
          src={MAG_CONFIG.hoverSrc}
          alt=""
          className={`absolute select-none will-change-transform transition-opacity duration-300 ease-out ${
            MAG_CONFIG.showBothOnDesktop ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'
          }`}
          style={{
            left: MAG_CONFIG.desktop.hover.x,
            top: MAG_CONFIG.desktop.hover.y,
            width: MAG_CONFIG.desktop.hover.width,
            transform: `scale(${MAG_CONFIG.desktop.hover.scale}) rotate(${MAG_CONFIG.desktop.hover.rotate}deg)`,
          }}
          draggable={false}
        />
      </>
    )}
  </div>
</div>


        {/* Bottom Section */}
        <div className="pb-10 mt-10 flex flex-col md:flex-row items-center justify-between gap-10">
  {/* Left: Links */}
  <div className="w-full md:w-auto text-center md:text-left">
    <h3 className="cda-subtitle mb-6">Have A Browse</h3>

    <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
      {!loading && menuItems.length === 0 && (
        <span className="text-[14px] text-[#0B0B0E]/60">
          No footer links configured
        </span>
      )}
      {menuItems.map((item) => (
        <a
          key={item.id}
          href={resolveHref(item)}
          className="text:[14px] text-[#0B0B0E] hover:underline"
        >
          {item.label}
        </a>
      ))}
    </div>

    <p className="mt-6 text-[14px] text-[#111827]/60">
      CDA © {new Date().getFullYear()}. All rights reserved.
    </p>
  </div>

          {/* Right: Social & contact */}
          <div className="w-full pb-10 md:w-auto flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="cda-subtitle mb-8">Let&apos;s Connect</h3>
            <div className="flex items-center gap-5 mb-4 justify-center md:justify-end">
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
            <div className="flex items-center gap-6 text-[14px] text-[#0B0B0E] justify-center md:justify-end">
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
              <a href="tel:02037800808" className="hover:underline">
                0203 780 0808
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
