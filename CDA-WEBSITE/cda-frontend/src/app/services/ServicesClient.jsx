"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ResponsiveUnderlinedTitle from '@/components/ResponsiveUnderlinedTitle';
import TextLinkButton from '@/components/ui/TextLinkButton';

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
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const selectedType = searchParams.get('service_type') || null;

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

    if (selectedType) {
      items = items.filter((svc) => {
        const nodes = svc?.serviceTypes?.nodes || [];
        const slugs = nodes.map((t) => t.slug);
        return slugs.includes(selectedType);
      });
    }

    return items;
  }, [initialItems, searchQuery, selectedType]);

  if (!services.length) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || (selectedType && selectedType.length > 0)
              ? 'Try adjusting your search criteria or clearing filters.'
              : 'No services are available at the moment. Please check back later.'}
          </p>
          {(searchQuery || (selectedType && selectedType.length > 0)) && (
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
    <div className="mb-16">
      {/* Container: top border + divide-y for shared middle lines */}
      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {services.map((service, index) => {
          // Determine if this is the last item
          const isLast = index === services.length - 1;

          return (
            <div
              key={service.id}
              className={`bg-white ${isLast ? 'border-b border-gray-200' : ''} hover:shadow-lg transition-all duration-300 hover:border-gray-300`}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Left Section - Title and Image */}
                <div className="lg:w-1/3 p-6">
                  <h2 className="font-bold text-gray-900 mt-4 text-center lg:text-left" style={{ fontSize: '38px', lineHeight: '1.2' }}>
                    <Link href={`/services/${service.slug}`} className="transition-colors">
                      <ResponsiveUnderlinedTitle as="h2" underlineColor={getServiceColor(service.slug)}>
                        {service.title}
                      </ResponsiveUnderlinedTitle>
                    </Link>
                  </h2>

                  {/* Image Section - Hidden on mobile */}
                  {service.featuredImage?.node?.sourceUrl && (
                    <div className="relative h-48 w-full overflow-hidden rounded-lg hidden lg:block">
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
                  {service.serviceFields?.heroSection?.description && (
                    <div className="mb-6">
                      {service.serviceFields?.serviceBulletPoints?.title && (
                        <h3 className="text-sm lg:text-lg font-bold text-gray-900 mb-3">
                          {service.serviceFields.serviceBulletPoints.title}
                        </h3>
                      )}
                      <div className="text-sm lg:text-lg text-gray-700 leading-relaxed mb-4">
                        {service.serviceFields.heroSection.description}
                      </div>
                    </div>
                  )}

                  {service.serviceFields?.serviceBulletPoints?.bullets && service.serviceFields.serviceBulletPoints.bullets.length > 0 && (
                    <div className="mb-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5">
                        {service.serviceFields.serviceBulletPoints.bullets.slice(0, 6).map((bullet, index) => (
                          <li key={index} className="text-gray-700" style={{ color: getServiceColor(service.slug) }}>
                            <span className="text-sm lg:text-lg text-gray-700">{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-8">
                    <Link href={`/services/${service.slug}#contact-form`} className="button-l-white">
                      Find Out More
                    </Link>
                    <TextLinkButton href={`/services/${service.slug}`}>
                      Speak To Us
                    </TextLinkButton>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
