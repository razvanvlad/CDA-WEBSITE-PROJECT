'use client';

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

  // Don't render if there's no meaningful content
  if (!sectionTitle && !title && (!logos || logos.length === 0)) return null;

  return (
    <section className="py-20 lg:py-32">
      <div className="cda-container">
        {/* TOP AREA - CENTERED */}
        <div className="text-center mb-32 lg:mb-48">
          {sectionTitle && (
            <h2 className="section-title">
              {sectionTitle}
            </h2>
          )}

          {cta?.url && cta?.title && (
            <div className="flex justify-center">
              <Link
                href={cta.url}
                target={cta.target || '_self'}
                className="button-without-box text-base lg:text-lg font-semibold"
              >
                <span className="button-text">{cta.title}</span>
                <span className="button-icon-wrapper">
                  <img
                    src="/images/arrow-icons/diagonal-right-arrow.svg"
                    alt=""
                    className="button-icon button-icon-default"
                    aria-hidden="true"
                  />
                  <img
                    src="/images/arrow-icons/right-arrow.svg"
                    alt=""
                    className="button-icon button-icon-hover"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* BOTTOM AREA - Split Layout (Desktop) / Centered (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT SIDE - Content & Logos */}
          <div className="text-center lg:text-left">
            {/* Label */}
            {subtitle && (
              <p className="text-[22px] font-bold tracking-widest mb-4">
                {subtitle}
              </p>
            )}

            {/* Heading */}
            {title && (
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                {title}
              </h3>
            )}

            {/* Link from sectionSubtitle */}
            {sectionSubtitle?.url && sectionSubtitle?.title && (
              <div className="mb-16 flex justify-center lg:justify-start">
                <Link
                  href={sectionSubtitle.url}
                  target={sectionSubtitle.target || '_self'}
                  className="button-without-box"
                >
                  <span className="button-text">{sectionSubtitle.title}</span>
                  <span className="button-icon-wrapper">
                    <img
                      src="/images/arrow-icons/diagonal-right-arrow.svg"
                      alt=""
                      className="button-icon button-icon-default"
                      aria-hidden="true"
                    />
                    <img
                      src="/images/arrow-icons/right-arrow.svg"
                      alt=""
                      className="button-icon button-icon-hover"
                      aria-hidden="true"
                    />
                  </span>
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
                      unoptimized
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
                  unoptimized
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
                  unoptimized
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
