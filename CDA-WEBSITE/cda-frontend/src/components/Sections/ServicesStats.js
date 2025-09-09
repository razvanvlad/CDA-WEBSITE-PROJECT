import React from 'react';

export default function ServicesStats({ title = 'Key Results', stats = [] }) {
  const safeStats = stats && stats.length ? stats : [
    { number: '120+', label: 'Projects Delivered' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '15+', label: 'Years Experience' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safeStats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{s.number}</div>
              <p className="text-[16px] leading-[1.7] text-[#4B5563]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

