'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { gql } from '@apollo/client';
import client from '../lib/graphql/client';

/* -------------------------------------------------------------------------- */
/* Magnifier configuration                                                    */
/* -------------------------------------------------------------------------- */
const MAG_CONFIG = {
  baseSrc: '/images/footer-magnifying-glass/footer-magnifying-glass-desktop.svg',
  hoverSrc: '/images/footer-magnifying-glass/footer-magnifying-glass-desktop-hover.svg',
  mobileSrc: '/images/footer-magnifying-glass/footer-magnifying-glass-mobile.svg',

  // While aligning on desktop keep both visible; set to false afterwards
  showBothOnDesktop: false,
  reserveBottomDesktop: 0,
  layerDesktop: 'behind',    // 'behind' or 'front' (z-index control)

  // Mobile (<768px): no hover; show only the hover art with these settings
  mobile: {
    width: 380,
    x: -20,
    y: 80,
    scale: 1,
    rotate: 0,
  },

  // Desktop (≥768px): independent positions for base and hover
  desktop: {
    base: { width: 680, x: 480, y: 100, scale: 1, rotate: 0 },
    hover: { width: 680, x: 350, y: -50, scale: 1, rotate: 0 },
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

export default function FooterTest() {
  /* ------------------------------- Menu state ------------------------------ */
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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
    } catch { }
    return '';
  }, []);

  const normalizePath = (path) => {
    if (!path || typeof path !== 'string') return '/';
    let p = path;
    try {
      if (p.startsWith('http://') || p.startsWith('https://')) {
        p = new URL(p).pathname;
      }
    } catch { }
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
          } catch { }
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

  /* --------------------------------- Render -------------------------------- */
  return (
    <footer className="bg-white pt-5">
      <div className="mx-auto max-w-[1620px] px-[38px]">
        {/* CTA Section */}
        <div className="footer-cta-card relative rounded-2xl bg-white group flex flex-col items-center justify-center text-center pt-16 pb-[169px] md:pb-[162px]">
          <p className="cda-subtitle mb-2">Take The First Step Toward Something Great</p>
          <h2 className="cda-page-title-clean text-center mb-10 text-4xl md:text-6xl font-bold">
            Ready To Start Your&nbsp;
            <span className="relative inline-block">
              <span className="relative z-10">Project?</span>
              <span className="absolute left-0 bottom-1 w-full h-2 bg-[#FD8721] -z-0"></span>
            </span>
          </h2>
          <a
            href="/contact"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="
         button-l footer-cta-btn mt-6 inline-flex items-center justify-center
         bg-black text-white px-10 py-4 rounded-none border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,1)]
         transform-gpu transition-transform duration-300 ease-out will-change-transform
         hover:scale-105
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/70
         active:scale-[1.02]
         z-20 relative
    "
          >
            Let's Talk</a>

          {/* Magnifier canvas */}
          <div
            className="absolute inset-0 pointer-events-none z-0 overflow-visible"
            style={{ contain: 'layout style' }}
          >
            {isMobile ? (
              <img
                src={MAG_CONFIG.mobileSrc}
                alt=""
                className="absolute"
                style={{
                  width: '320px',
                  maxWidth: 'none',
                  left: '50%',
                  bottom: '0',
                  transform: 'translateX(-50%) translateY(35%)',
                }}
              />
            ) : (
              <>
                {/* Base Image */}
                <img
                  src={MAG_CONFIG.baseSrc}
                  alt=""
                  className={`absolute transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    width: '580px',
                    maxWidth: 'none',
                    left: 'calc(50% - 100px)',
                    bottom: '0',
                    transform: 'translateX(-50%) translateY(45%) scale(1)',
                  }}
                />
                {/* Hover Image */}
                <img
                  src={MAG_CONFIG.hoverSrc}
                  alt=""
                  className={`absolute transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    width: '458px',
                    maxWidth: 'none',
                    left: 'calc(50% - 38px)',
                    bottom: '0',
                    transform: 'translateX(-50%) translateY(45%) scale(1)',
                  }}
                />
              </>
            )}
          </div>
        </div>


        {/* Bottom Section */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          {/* Left: Links */}
          <div className="w-full pb-[106px] md:pb-[65px] md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="cda-subtitle mb-6">Have A Browse</h3>

            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
              {!loading && menuItems.length === 0 && (
                <span className="text-[14px] text-[#000000]/60">
                  No footer links configured
                </span>
              )}
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={resolveHref(item)}
                  className="text:[14px] text-[#000000] hover:underline"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <p className="mt-4 text-[14px] text-[#000000]/60">
              CDA © {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>

          {/* Right: Social & contact */}
          <div className="w-full pb-[106px] md:pb-[65px] md:w-auto flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="cda-subtitle mb-6">Let&apos;s Connect</h3>
            <div className="flex items-center gap-5 mb-6 justify-center md:justify-end">
              <a href="https://www.facebook.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="side-menu-social">
                <Image src="/images/social-icons/black/facebook.svg" alt="" width={9} height={20} aria-hidden="true" />
              </a>
              <a href="https://www.tiktok.com/@cdagroupuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="side-menu-social">
                <Image src="/images/social-icons/black/tiktok.svg" alt="" width={17} height={20} aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="side-menu-social">
                <Image src="/images/social-icons/black/instagram.svg" alt="" width={18} height={20} aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/company/cdagroup/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="side-menu-social">
                <Image src="/images/social-icons/black/linkedin.svg" alt="" width={18} height={20} aria-hidden="true" />
              </a>
              <a href="https://www.youtube.com/@CDAGroupUK" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="side-menu-social">
                <Image src="/images/social-icons/black/youtube.svg" alt="" width={26} height={20} aria-hidden="true" />
              </a>
            </div>
            <div className="flex items-center gap-6 text-[14px] text-[#000000] justify-center md:justify-end">
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
