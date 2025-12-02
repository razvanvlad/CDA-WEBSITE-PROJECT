'use client';

import TextLinkButton from './ui/TextLinkButton';
import Image from 'next/image';
import Link from 'next/link';
import { safeImageUrl } from '@/lib/imageUtils';

/**
 * Client Showcase Section Component
 * Two-area layout: TOP (centered) and BOTTOM (desktop: split, mobile: centered)
 */
export default function ClientShowcase({ clientsLogosFields }) {
  if (!clientsLogosFields) return null;

  const { sectionTitle, sectionSubtitle, title, subtitle, cta, image, logos } = clientsLogosFields;

  return (
    <section className="py-20 lg:py-32">
      <div className="cda-container">
        {/* TOP AREA - CENTERED */}
        <div className="text-center mb-32 lg:mb-48">
          {sectionTitle && (
            <h2 className="cda-title mb-6 lg:mb-8">
              {sectionTitle}
            </h2>
          )}

          {cta?.url && cta?.title && (
            <div className="flex justify-center">
              <TextLinkButton
                href={cta.url}
                className="text-base lg:text-lg font-semibold"
                target={cta.target || '_self'}
              >
                {cta.title}
              </TextLinkButton>
            </div>
          )}
        </div>

        {/* BOTTOM AREA - Split Layout (Desktop) / Centered (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT SIDE - Content & Logos */}
          <div className="text-center lg:text-left">
            {/* Label */}
            {subtitle && (
              <p className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">
                {subtitle}
              </p>
            )}

            {/* Heading with cyan underline on mobile */}
            {title && (
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                {title}
                {/* Cyan underline - visible on mobile only */}
                <span className="lg:hidden absolute left-0 right-0 bottom-0 h-1 bg-cyan-400" style={{ bottom: '-4px' }}></span>
              </h3>
            )}

            {/* Link from sectionSubtitle */}
            {sectionSubtitle?.url && sectionSubtitle?.title && (
              <div className="mb-16 flex justify-center lg:justify-start">
                <Link
                  href={sectionSubtitle.url}
                  target={sectionSubtitle.target || '_self'}
                  className="font-bold text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-gray-700 hover:border-gray-700 transition-colors"
                >
                  {sectionSubtitle.title}
                </Link>
              </div>
            )}

            {/* Logo Grid from ACF - 2 columns (mobile), 3 columns (desktop) */}
            {logos && logos.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 items-center justify-items-center lg:justify-items-start mb-16 lg:mb-0">
                {logos.map((item, index) => (
                  <div
                    key={index}
                    className="relative w-full h-12 flex items-center justify-center lg:justify-start"
                  >
                    <Image
                      src={safeImageUrl ? safeImageUrl(item.logo.node.sourceUrl) : item.logo.node.sourceUrl}
                      alt={item.logo.node.altText || 'Client logo'}
                      fill
                      className="object-contain object-center lg:object-left"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Illustration from ACF (Desktop only) */}
          {image?.node?.sourceUrl && (
            <>
              <div className="hidden lg:flex justify-end items-center h-full relative min-h-[400px]">
                <Image
                  src={safeImageUrl ? safeImageUrl(image.node.sourceUrl) : image.node.sourceUrl}
                  alt={image.node.altText || 'Illustration'}
                  width={600}
                  height={500}
                  className="w-full h-auto object-contain"
                  style={{ maxWidth: '600px' }}
                />
              </div>

              {/* Illustration - Mobile only (centered at bottom) */}
              <div className="lg:hidden flex justify-center items-center mt-16">
                <Image
                  src={safeImageUrl ? safeImageUrl(image.node.sourceUrl) : image.node.sourceUrl}
                  alt={image.node.altText || 'Illustration'}
                  width={350}
                  height={350}
                  className="w-full h-auto object-contain"
                  style={{ maxWidth: '350px' }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
