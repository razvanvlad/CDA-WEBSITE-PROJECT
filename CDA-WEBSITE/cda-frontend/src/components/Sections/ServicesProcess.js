import React from 'react';

export default function ServicesProcess({ heading = 'Our Process', steps = [] }) {
  const safeSteps = steps && steps.length ? steps : [
    { title: 'Discover', description: 'We align on goals, stakeholders, timelines, scope.' },
    { title: 'Design', description: 'We translate insights into wireframes and UI.' },
    { title: 'Build', description: 'We implement, test, and release iteratively.' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safeSteps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{i + 1}</div>
              <h3 className="text-xl font-semibold text-black mb-2">{s.title}</h3>
              <p className="text-[16px] leading-[1.7] text-[#4B5563]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

