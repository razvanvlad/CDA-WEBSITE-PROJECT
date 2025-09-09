import React from 'react';

export default function FounderSpotlight({ leader }) {
  // Safe defaults
  const name = leader?.name || 'Founder Name';
  const title = leader?.position || 'Founder & CEO';
  const bio = leader?.bio || 'Short bio about the founder will appear here.';
  const photo = leader?.photo?.node?.sourceUrl || null;

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[12px] tracking-[0.18em] font-semibold uppercase text-black mb-2">Founder Spotlight</p>
          <h2 className="text-3xl md:text-4xl font-bold text-black">Our Leadership</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-semibold text-black mb-2">{name}</h3>
            <p className="text-blue-600 font-medium mb-4">{title}</p>
            <p className="text-[16px] leading-[1.7] text-[#4B5563]">{bio}</p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-100">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Photo</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

