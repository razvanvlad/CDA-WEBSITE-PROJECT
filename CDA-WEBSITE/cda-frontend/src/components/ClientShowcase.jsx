'use client';

import TextLinkButton from './ui/TextLinkButton';
import Image from 'next/image';

/**
 * Client Showcase Section Component
 * Two-area layout: TOP (centered) and BOTTOM (left-aligned with paper plane)
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

        {/* BOTTOM AREA - LEFT-ALIGNED with Paper Plane */}
        <div className="relative">
          {/* Paper Plane - Absolute positioned on right side (desktop only) */}
          <div className="hidden lg:block absolute right-0 top-0 w-[400px] h-[400px] pointer-events-none">
            <Image
              src="/images/paper-plane.svg"
              alt="Paper plane illustration"
              width={400}
              height={400}
              className="opacity-40"
            />
          </div>

          {/* LEFT SIDE - All left-aligned, stacked vertically */}
          <div className="relative z-10">
            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3">
              CLIENTS
            </p>

            {/* Heading */}
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Some Of Our Ecommerce Clients
            </h3>

            {/* Link */}
            <div className="mb-12 lg:mb-16">
              <TextLinkButton href="/case-studies" className="font-semibold">
                View Our Ecommerce Case Studies
              </TextLinkButton>
            </div>

            {/* Logo Grid - 3 columns, 2 rows, left-aligned */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20 lg:gap-x-24 lg:gap-y-24 justify-items-start">
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="transition-opacity duration-300 hover:opacity-80"
                >
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={160}
                    height={80}
                    className="w-auto h-auto max-w-[140px] max-h-[60px]"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
