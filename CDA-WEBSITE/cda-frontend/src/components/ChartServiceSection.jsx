import Link from 'next/link';
import Image from 'next/image';
import { safeImageUrl } from '@/lib/imageUtils';

export default function ChartServiceSection({ serviceColor = '#3cbeeb', performanceFields }) {
  if (!performanceFields) return null;

  const { title, subtitle, description, text, cta, image, bulletPoints } = performanceFields;

  // Don't render if there's no meaningful content
  if (!title && !description && !image?.node?.sourceUrl && !subtitle && !text && (!bulletPoints || bulletPoints.length === 0)) return null;

  return (
    <section className="chart-service-section bg-gray-50 py-16 lg:py-24">
      <div className="cda-container">

        {/* SECTION 1: Chart + Title/Description/CTA from ACF */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 lg:mb-32">
          {/* Chart Image - Left on desktop, top on mobile */}
          {image?.node?.sourceUrl && (
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="chart-image-wrapper">
                <Image
                  src={safeImageUrl ? safeImageUrl(image.node.sourceUrl) : image.node.sourceUrl}
                  alt={image.node.altText || "Performance chart"}
                  width={427}
                  height={316}
                  className="w-full h-auto max-w-[203px] lg:max-w-[427px]"
                  style={{ filter: `hue-rotate(0deg)` }}
                />
              </div>
            </div>
          )}

          {/* Content - Right on desktop, top on mobile */}
          <div className="order-1 lg:order-2">
            {title && (
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base lg:text-lg text-gray-700 mb-8 lg:mb-10 leading-relaxed">
                {description}
              </p>
            )}
            {cta?.url && cta?.title && (
              <Link
                href={cta.url}
                className="button-l"
                target={cta.target || '_self'}
              >
                {cta.title}
              </Link>
            )}
          </div>
        </div>

        {/* SECTION 2: Platforms Integration + Down Arrow from ACF */}
        <div className="relative">
          <div className="max-w-4xl">
            {subtitle && (
              <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-6 lg:mb-8">
                {subtitle}
              </h3>
            )}
            {text && (
              <p className="text-base lg:text-lg text-gray-700 mb-6 lg:mb-8 leading-relaxed">
                {text}
              </p>
            )}

            {/* Bullet List from ACF bulletPoints */}
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="space-y-4 mb-8">
                {bulletPoints.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: serviceColor }}
                    ></span>
                    <span className="text-base lg:text-lg text-gray-700">
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Down Arrow - Bottom right (desktop only initially, then mobile at bottom) */}
          <div className="hidden lg:block absolute -bottom-24 right-0 pointer-events-none">
            <Image
              src="/images/service-stats-down-arrow.svg"
              alt=""
              width={195}
              height={347}
              className="w-auto h-auto"
            />
          </div>

          {/* Down Arrow - Mobile (centered at bottom) */}
          <div className="lg:hidden flex justify-center mt-12 -mb-12">
            <Image
              src="/images/service-stats-down-arrow.svg"
              alt=""
              width={175}
              height={98}
              className="w-auto h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
