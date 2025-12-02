import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EcommerceSolutionsSection = () => {
  const bullets = [
    "Fast, Flexible Builds",
    "Built Around Your Business, Not The Other Way Around",
    "Designed To Grow With You",
    "Human-First Design"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side: Bullet Points */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <ul className="space-y-8">
              {bullets.map((text, index) => (
                <li key={index} className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/services/bullet-services.svg"
                      alt="Check"
                      width={40}
                      height={41}
                      className="w-[27px] h-[28px] lg:w-[40px] lg:h-[41px]"
                    />
                  </div>
                  <span className="text-lg lg:text-xl font-bold text-black">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Content Card */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="bg-white p-8 lg:p-12 shadow-sm">
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight">
                Ecommerce Solutions That Drive Growth & Simplify Selling
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We're an expert eCommerce solutions provider with a proven track record in creating high-performing digital storefronts that turn users into loyal customers. We’ve been clients ourselves, working in senior eCommerce roles in the corporate world, so we know exactly what it takes to boost conversions, reduce bounce rates, and increase average order values. Our goal? To make your online store work smarter, not harder, so you can focus on growing your business.
              </p>
              <Link href="#contact-form" className="button-l">
                Get Started
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EcommerceSolutionsSection;
