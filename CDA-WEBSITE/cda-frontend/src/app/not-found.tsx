// src/app/not-found.tsx
// Static 404 page (App Router). No WP requests, no client JS.
// Renders Header → simple copy → edge-to-edge ice-cream image → Footer.

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UnderlinedTitle from '@/components/UnderlinedTitle';

export const metadata = { title: '404 – Page Not Found' };

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* Copy */}
        <section className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <UnderlinedTitle
              as="h1"
              className="cda-page-title mb-4"
              underlineColor="#FF60DF"
              size="large"
            >
              Oops, Page Not Found
            </UnderlinedTitle>

            <p className="text-[16px] md:text-[18px] text-[#0B0B0E]/70 leading-relaxed mb-8">
              Looks like the page you're looking for cannot be found
            </p>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <a href="/" className="button-without-box">Home</a>
              <a href="/about" className="button-without-box">About</a>
              <a href="/services" className="button-without-box">All Services</a>
              <a href="/case-studies" className="button-without-box">Case Studies</a>
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
