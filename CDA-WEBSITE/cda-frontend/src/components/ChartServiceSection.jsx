import Link from 'next/link';
import Image from 'next/image';

export default function ChartServiceSection({ serviceColor = '#3cbeeb' }) {
  return (
    <section className="chart-service-section bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>

        {/* SECTION 1: Chart + Title/Description/CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 lg:mb-32">
          {/* Chart Image - Left on desktop, top on mobile */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="chart-image-wrapper">
              <Image
                src="/images/service-chart-image.svg"
                alt="Service growth chart"
                width={427}
                height={316}
                className="w-full h-auto max-w-[203px] lg:max-w-[427px]"
                style={{ filter: `hue-rotate(0deg)` }}
              />
            </div>
          </div>

          {/* Content - Right on desktop, top on mobile */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
              Seamless, Scalable, & Stress-Free Ecommerce
            </h2>
            <p className="text-base lg:text-lg text-gray-700 mb-8 lg:mb-10 leading-relaxed">
              In eCommerce, efficiency is the key to success, and technology is at the heart of that. It should make your life easier – not more complicated. That's why we develop end-to-end eCommerce solutions that integrate your entire business ecosystem – to ensure your online store runs smoothly from the first click to final delivery.
            </p>
            <Link href="#contact-form" className="button-l">
              Get Started
            </Link>
          </div>
        </div>

        {/* SECTION 2: Platforms Integration + Down Arrow */}
        <div className="relative">
          <div className="max-w-4xl">
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-6 lg:mb-8">
              Platform-Agnostic, Fully Integrated Solutions
            </h3>
            <p className="text-base lg:text-lg text-gray-700 mb-6 lg:mb-8 leading-relaxed">
              We're platform agnostic – we'll recommend the eCommerce system that best suits your business goals – meaning whether you launch on Shopify, WooCommerce, Magento, or another platform, we'll create a network that brings it all together.
            </p>
            <p className="text-base lg:text-lg font-semibold text-gray-900 mb-6">
              We integrate with:
            </p>

            {/* Bullet List */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: serviceColor }}
                ></span>
                <span className="text-base lg:text-lg text-gray-700">
                  Accounting software like Xero & Sage
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: serviceColor }}
                ></span>
                <span className="text-base lg:text-lg text-gray-700">
                  CRMs & fulfilment providers to streamline operations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: serviceColor }}
                ></span>
                <span className="text-base lg:text-lg text-gray-700">
                  Email marketing tools like Mailchimp, Klaviyo & Dot Digital
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: serviceColor }}
                ></span>
                <span className="text-base lg:text-lg text-gray-700">
                  Social media channels including Meta and LinkedIn, and ads tracking
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: serviceColor }}
                ></span>
                <span className="text-base lg:text-lg text-gray-700">
                  Sales channels like Amazon, eBay, & Etsy for unified stock and order management
                </span>
              </li>
            </ul>

            <p className="text-base lg:text-lg text-gray-700">
              No more juggling complicated systems – just one seamless, efficient workflow.
            </p>
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
