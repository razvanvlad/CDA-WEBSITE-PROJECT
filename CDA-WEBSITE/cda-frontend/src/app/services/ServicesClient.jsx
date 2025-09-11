"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

const getServiceColor = (slug) => {
  const colorMap = {
    ecommerce: '#3CBEEB',
    'b2b-lead-generation': '#AD80F9',
    'software-development': '#01E486',
    'franchise-booking-systems': '#FD8721',
    'booking-systems': '#FD8721',
    'digital-marketing': '#FF60DF',
    'outsourced-cmo': '#FF5C8A',
    ai: '#3CBEEB',
  };
  return colorMap[slug] || '#7c3aed';
};

export default function ServicesClient({ initialItems = [] }) {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const searchQuery = params.get('search') || '';
  const selectedTypes = params.getAll('service_type');

  const services = useMemo(() => {
    let items = Array.isArray(initialItems) ? initialItems : [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((svc) => {
        const title = (svc.title || '').toLowerCase();
        const excerpt = (svc.excerpt || '').replace(/<[^>]*>/g, '').toLowerCase();
        return title.includes(q) || excerpt.includes(q);
      });
    }

    if (selectedTypes.length > 0) {
      items = items.filter((svc) => {
        const nodes = svc?.serviceTypes?.nodes || [];
        const slugs = nodes.map((t) => t.slug);
        return selectedTypes.some((sel) => slugs.includes(sel));
      });
    }

    return items;
  }, [initialItems, searchQuery, selectedTypes]);

  if (!services.length) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || selectedTypes.length > 0
              ? 'Try adjusting your search criteria or clearing filters.'
              : 'No services are available at the moment. Please check back later.'}
          </p>
          {(searchQuery || selectedTypes.length > 0) && (
            <Link
              href="/services"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Services
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-16">
      {services.map((service) => (
        <div key={service.id} className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Title and Image */}
            <div className="lg:w-1/3 p-6">
              <div className="flex items-center gap-2 mb-4">
                {service.serviceTypes?.nodes?.slice(0, 2).map((type) => (
                  <span key={type.id} className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {type.name}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                <Link
                  href={`/services/${service.slug}`}
                  className="transition-colors"
                  style={{
                    textDecoration: 'underline',
                    textDecorationColor: getServiceColor(service.slug),
                    textDecorationThickness: '4px',
                  }}
                >
                  {service.title}
                </Link>
              </h2>

              {/* Image Section */}
              {service.featuredImage?.node?.sourceUrl && (
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={service.featuredImage.node.sourceUrl}
                    alt={service.featuredImage.node.altText || service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Right Section - Content */}
            <div className="lg:w-2/3 p-6">
              {service.excerpt && (
                <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: service.excerpt }} />
              )}

              {service.serviceFields?.heroSection?.description && (
                <div className="mb-6">
                  {service.serviceFields?.serviceBulletPoints?.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {service.serviceFields.serviceBulletPoints.title}
                    </h3>
                  )}
                  <div className="text-gray-700 leading-relaxed mb-4">
                    {service.serviceFields.heroSection.description}
                  </div>
                </div>
              )}

              {service.serviceFields?.serviceBulletPoints?.bullets && service.serviceFields.serviceBulletPoints.bullets.length > 0 && (
                <div className="mb-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.serviceFields.serviceBulletPoints.bullets.slice(0, 6).map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div
                          className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                          style={{ backgroundColor: getServiceColor(service.slug) }}
                        ></div>
                        <span className="text-gray-700 text-sm">{bullet.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Link href={`/services/${service.slug}#contact-form`} className="button-l">
                  Get Started
                </Link>
                <Link href={`/services/${service.slug}`} className="button-without-box">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
