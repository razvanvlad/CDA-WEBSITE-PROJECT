'use client';

import TextLinkButton from './ui/TextLinkButton';
import Image from 'next/image';

/**
 * Client Showcase Section Component
 * Two-area layout: TOP (centered) and BOTTOM (desktop: split, mobile: centered)
 */
export default function ClientShowcase() {
  // Client logos data - replace with actual logo paths
  const clients = [
    { name: 'Birkdale', logo: '/images/clients/birkdale.svg' },
    { name: 'Artisan Coffee', logo: '/images/clients/artisan-coffee.svg' },
    { name: 'Segway', logo: '/images/clients/segway.svg' },
    { name: 'BrainGain', logo: '/images/clients/braingain.svg' },
    { name: 'Sentia', logo: '/images/clients/sentia.svg' },
    { name: 'Pro-GMN', logo: '/images/clients/pro-gmn.svg' },
  ];

  return (
    <section className="bg-gray-50 py-20 lg:py-32">
      <div className="cda-container">
        {/* TOP AREA - CENTERED */}
        <div className="text-center mb-32 lg:mb-48">
          <h2 className="cda-title mb-6 lg:mb-8">
            Create Pain-Free User Experiences, Boost Online Sales,
            <br />
            Automate Admin Processes
          </h2>

          <div className="flex justify-center">
            <TextLinkButton href="/contact" className="text-base lg:text-lg font-semibold">
              Let&apos;s Chat About How We Can Help You Sell More Online
            </TextLinkButton>
          </div>
        </div>

        {/* BOTTOM AREA - Split Layout (Desktop) / Centered (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT SIDE - Content & Logos */}
          <div className="text-center lg:text-left">
            {/* Label */}
            <p className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">
              Clients
            </p>

            {/* Heading with cyan underline on mobile */}
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
              Some Of Our Ecommerce Clients
              {/* Cyan underline - visible on mobile only */}
              <span className="lg:hidden absolute left-0 right-0 bottom-0 h-1 bg-cyan-400" style={{ bottom: '-4px' }}></span>
            </h3>

            {/* Link */}
            <div className="mb-16 flex justify-center lg:justify-start">
              <TextLinkButton href="/case-studies" className="font-bold text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-gray-700 hover:border-gray-700 transition-colors">
                View Our Ecommerce Case Studies
              </TextLinkButton>
            </div>

            {/* Logo Grid - 2 columns (mobile), 3 columns (desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 items-center justify-items-center lg:justify-items-start mb-16 lg:mb-0">
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="relative w-full h-12 flex items-center justify-center lg:justify-start"
                >
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    fill
                    className="object-contain object-center lg:object-left"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Paper Plane Illustration (Desktop only) */}
          <div className="hidden lg:flex justify-end items-center h-full relative min-h-[400px]">
            <Image
              src="/images/paper-plane.svg"
              alt="Paper plane illustration"
              width={600}
              height={500}
              className="w-full h-auto object-contain"
              style={{ maxWidth: '600px' }}
            />
          </div>
        </div>

        {/* Paper Plane - Mobile only (centered at bottom) */}
        <div className="lg:hidden flex justify-center items-center mt-16">
          <Image
            src="/images/paper-plane.svg"
            alt="Paper plane illustration"
            width={350}
            height={350}
            className="w-full h-auto object-contain"
            style={{ maxWidth: '350px' }}
          />
        </div>
      </div>
    </section>
  );
}
