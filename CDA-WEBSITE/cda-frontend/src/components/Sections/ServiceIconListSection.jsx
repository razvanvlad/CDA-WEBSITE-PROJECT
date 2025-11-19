'use client';

import ResponsiveUnderlinedTitle from '../ResponsiveUnderlinedTitle';
import Image from 'next/image';
import Link from 'next/link';

/**
 * ServiceIconListSection - Two-column layout with icon list and content
 *
 * Left column: Icon list with checkmarks
 * Right column: Title, description, and CTA button
 */
export default function ServiceIconListSection() {
  const features = [
    "Fast, Flexible Builds",
    "Built Around Your Business, Not The Other Way Around",
    "Designed To Grow With You",
    "Human-First Design"
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="cda-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column - Icon List (~40%) */}
          <div className="lg:col-span-5">
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Image
                      src="/images/check-circle.svg"
                      alt=""
                      width={32}
                      height={32}
                      className="text-black"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Content (~60%) */}
          <div className="lg:col-span-7">
            <ResponsiveUnderlinedTitle
              as="h2"
              className="cda-title mb-6"
              underlineColor="#FF60DF"
            >
              Ecommerce Solutions That Drive Growth & Simplify Selling
            </ResponsiveUnderlinedTitle>

            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our ecommerce solutions are designed to help businesses of all sizes sell
                online effectively. Whether you're launching your first online store or
                scaling an established platform, we build custom solutions that grow with
                your business.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We focus on creating seamless shopping experiences that convert visitors
                into customers while providing you with the tools and flexibility to manage
                and scale your operations efficiently.
              </p>
            </div>

            <Link href="/contact" className="button-l">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
