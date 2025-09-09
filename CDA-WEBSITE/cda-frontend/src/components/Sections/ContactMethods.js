import React from 'react';

export default function ContactMethods({ methods = [] }) {
  const safe = methods && methods.length ? methods : [
    { label: 'Email', value: 'hello@cda-website-solutions.com' },
    { label: 'Phone', value: '+1 (555) 000-0000' },
    { label: 'Address', value: '123 Main St, City, Country' },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safe.map((m, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-semibold text-black mb-2">{m.label}</div>
              <div className="text-[16px] leading-[1.7] text-[#4B5563]">{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

