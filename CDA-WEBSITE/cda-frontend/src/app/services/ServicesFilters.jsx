"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const FILTERS = [
  { label: 'eCommerce Development', slug: 'ecommerce' },
  { label: 'B2B Lead Generation', slug: 'b2b-lead-generation' },
  { label: 'Software Development', slug: 'software-development' },
  { label: 'Booking Systems', slug: 'booking-systems' },
  { label: 'Digital Marketing', slug: 'digital-marketing' },
  { label: 'Outsourced CMO', slug: 'outsourced-cmo' },
  { label: 'AI & Automation Solutions', slug: 'ai' },
];

export default function ServicesFilters({ options }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = searchParams.get('service_type') || null;

  const toggle = (slug) => {
    const next = new URLSearchParams(searchParams.toString());
    const current = selected;
    next.delete('service_type');
    // Toggle behavior: clicking the active chip clears the filter; otherwise select only this slug
    if (current !== slug) {
      next.set('service_type', slug);
    }
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('service_type');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-2 mb-8">
      <div className="flex items-center gap-3 flex-wrap justify-center text-center">
        <span className="text-sm font-semibold text-gray-600">Shortcuts:</span>
        {(options && options.length ? options : FILTERS).map((f) => {
          const active = selected === f.slug;
          return (
            <button
              key={f.slug}
              type="button"
              onClick={() => toggle(f.slug)}
              className={[
                'px-4 py-2 text-sm font-medium transition-colors border services-filter-chip',
                active
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200',
              ].join(' ')}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
