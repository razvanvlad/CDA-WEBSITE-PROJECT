import React from 'react';

export default function ContactMap({ embedUrl }) {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">Our Location</h2>
        <div className="w-full rounded-lg overflow-hidden shadow">
          {embedUrl ? (
            <iframe title="Map" src={embedUrl} className="w-full h-[400px] border-0" loading="lazy" />
          ) : (
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">Map coming soon</div>
          )}
        </div>
      </div>
    </section>
  );
}

