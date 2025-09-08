'use client';

import React, { useMemo, useState } from 'react';

/*
  LocationsImage (Global block)
  - Tabs for countries (UK, USA, UAE, ...)
  - For selected country, render its offices in two columns (stacked on mobile)
  - Decorative astronaut illustration on the right (desktop), below on mobile
  - Uses fields from globalContentBlocks.locationsImage
    { title, subtitle, countries[{ countryName, offices[{ name, address, email, phone }] }], illustration{node{sourceUrl, altText}} }
*/
const LocationsImage = ({ globalData }) => {
  if (!globalData) return null;

  const countries = useMemo(
    () => (Array.isArray(globalData.countries) ? globalData.countries : []),
    [globalData]
  );
  const [active, setActive] = useState(0);

  const current = countries[active] || null;

  return (
    <section className="py-16 md:py-20 lg:py-24">
<div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 md:mb-10">
          {globalData.subtitle && (
            <p className="text-[12px] tracking-[0.18em] font-semibold uppercase text-[#111827] mb-2">{globalData.subtitle}</p>
          )}
          {globalData.title && (
            <h2 className="font-bold text-[#111827]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: 38, lineHeight: 1.1 }}>
              <span className="relative inline-block align-baseline">
                {globalData.title}
                <img src="/images/underlines/Path%20304.svg" alt="" className="underline-svg" />
              </span>
            </h2>
          )}
        </div>

        {/* Mobile: horizontal country tabs */}
        {countries.length > 0 && (
          <div className="md:hidden flex items-center gap-8 mb-8 overflow-x-auto">
            {countries.map((c, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActive(idx)}
                  className="relative pb-1 text-[24px] font-semibold shrink-0"
                  aria-pressed={isActive}
                >
                  <span className={isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'}>{c.countryName}</span>
                  {isActive && <span className="absolute left-0 right-0 -bottom-0.5 h-[6px] bg-[#FF3B80]"></span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-start">
          {/* Left: vertical country tabs (desktop) */}
          <div className="hidden md:block md:col-span-3">
            {countries.length > 0 && (
              <div className="flex flex-col gap-6">
                {countries.map((c, idx) => {
                  const isActive = idx === active;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActive(idx)}
                      className="relative text-left pb-1 text-[28px] font-semibold"
                      aria-pressed={isActive}
                    >
                      <span className={isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'}>{c.countryName}</span>
                      {isActive && <span className="absolute left-0 right-24 -bottom-0.5 h-[6px] bg-[#FF3B80]"></span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Middle: Offices for active country */}
          <div className="col-span-12 md:col-span-6 xl:col-span-5">
            {current && Array.isArray(current.offices) && current.offices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {current.offices.map((office, idx) => (
                  <div key={idx}>
                    {office.name && (
                      <h3 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-5">{office.name}</h3>
                    )}

                    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                      <div>
                        <p className="text-[18px] font-semibold text-[#111827] mb-2">Address</p>
                        {office.address && (
                          <p className="text-[16px] leading-[1.8] text-[#111827] whitespace-pre-line">{office.address}</p>
                        )}

                          <p className="text-[18px] font-semibold text-[#111827] mb-2">Email</p>
                          {office.email && (
                            <p className="text-[16px] text-[#111827]">{office.email}</p>
                          )}
                                                    <p className="text-[18px] font-semibold text-[#111827] mb-2">Phone</p>
                          {office.phone && (
                            <p className="text-[16px] text-[#111827]">{office.phone}</p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Illustration (right) */}
          <div className="col-span-12 md:col-span-3 xl:col-span-4">
            <div className="relative">

              {globalData.illustration?.node?.sourceUrl && (
                <img
                  src={globalData.illustration.node.sourceUrl}
                  alt={globalData.illustration.node.altText || 'Illustration'}
                  className="w-full h-auto max-w-[560px] mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsImage;
