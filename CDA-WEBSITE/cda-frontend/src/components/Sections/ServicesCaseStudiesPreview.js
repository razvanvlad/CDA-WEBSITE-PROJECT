import React from 'react';

export default function ServicesCaseStudiesPreview({ title = 'Success Stories', items = [] }) {
  const safeItems = items && items.length ? items : [
    { title: 'Case Study A', client: 'Client A' },
    { title: 'Case Study B', client: 'Client B' },
    { title: 'Case Study C', client: 'Client C' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safeItems.map((cs, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black mb-2">{cs.title}</h3>
              <p className="text-[16px] leading-[1.7] text-[#4B5563]">Client: {cs.client}</p>
              <div className="mt-4">
                <a href="#" className="button-without-box">View case study</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

