// src/app/not-found.tsx
// Static 404 page (App Router). No WP requests, no client JS.
// Renders Header → simple copy → edge-to-edge ice-cream image → Footer.

import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResponsiveUnderlinedTitle from '@/components/ResponsiveUnderlinedTitle';
import TextLinkButton from '@/components/ui/TextLinkButton';

export const metadata = { title: '404 – Page Not Found' };

function HeaderFallback() {
  return (
    <header className="bg-white" style={{ borderBottom: '1px solid #EBEBEB' }}>
      <div className="mx-auto max-w-[1620px] container-padding h-[79px] md:h-[125px] flex items-center">
        <div className="w-full max-w-[353px] md:max-w-none mx-0 md:mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" aria-label="Go to homepage">
                <img
                  src="/images/cda-logo.svg"
                  alt="CDA Logo"
                  className="w-[77px] h-[27px] md:w-[131px] md:h-[46px]"
                />
              </a>
            </div>
            <div className="flex items-center">
              <button className="hover:bg-gray-100 rounded-lg transition-colors p-0" aria-label="Open side menu">
                <img src="/images/menu-icon.svg" alt="" className="w-[26px] h-[17px] md:w-[31px] md:h-[20px]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function NotFound() {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>

      <main className="bg-white">
        {/* Copy */}
        <section className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <ResponsiveUnderlinedTitle
              as="h1"
              className="cda-title mb-4"
              underlineColor="#FF60DF"
            >
              Oops, Page Not Found
            </ResponsiveUnderlinedTitle>

            <p className="text-[16px] md:text-[18px] text-[#0B0B0E]/70 leading-relaxed mb-8">
              Looks like the page you're looking for cannot be found
            </p>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <TextLinkButton href="/">Home</TextLinkButton>
              <TextLinkButton href="/about">About</TextLinkButton>
              <TextLinkButton href="/services">All Services</TextLinkButton>
              <TextLinkButton href="/case-studies">Case Studies</TextLinkButton>
            </nav>
          </div>
        </section>

        {/* Edge-to-edge ice-cream illustration */}
        <section aria-hidden="true">
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
            <img
              src="/images/ice-cream.svg"
              alt=""
              className="w-full h-auto select-none"
              draggable={false}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
