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

export default function ServicesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = new Set(searchParams.getAll('service_type'));

  const toggle = (slug) => {
    const next = new URLSearchParams(searchParams.toString());
    const current = next.getAll('service_type');
    if (selected.has(slug)) {
      const remaining = current.filter((s) => s !== slug);
      next.delete('service_type');
      remaining.forEach((s) => next.append('service_type', s));
    } else {
      next.append('service_type', slug);
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
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-gray-600">Shortcuts:</span>
        {FILTERS.map((f) => {
          const active = selected.has(f.slug);
          return (
            <button
              key={f.slug}
              type="button"
              onClick={() => toggle(f.slug)}
              className={[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                active
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200',
              ].join(' ')}
            >
              {f.label}
            </button>
          );
        })}
        {selected.size > 0 && (
          <button type="button" onClick={clearAll} className="ml-2 text-sm text-blue-700 underline">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
