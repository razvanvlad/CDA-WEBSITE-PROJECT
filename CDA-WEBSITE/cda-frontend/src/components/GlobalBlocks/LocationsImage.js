'use client';

import React, { useMemo, useState } from 'react';
import ResponsiveUnderlinedTitle from '../ResponsiveUnderlinedTitle';


const LocationsImage = ({ globalData }) => {
  if (!globalData) return null;

  const countries = useMemo(
    () => (Array.isArray(globalData.countries) ? globalData.countries : []),
    [globalData]
  );
  const [active, setActive] = useState(0);

  const current = countries[active] || null;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="cda-container">
        {/* Heading */}
        <div className="mb-8 md:mb-10">
          {globalData.subtitle && (
            <p className="cda-subtitle">{globalData.subtitle}</p>
          )}
          {globalData.title && (
            <ResponsiveUnderlinedTitle
              as="h2"
              className="section-title"
              underlineColor="#FF5C8A"
            >
              {globalData.title}
            </ResponsiveUnderlinedTitle>
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
                  className="relative pb-1 shrink-0"
                  aria-pressed={isActive}
                >
                  <ResponsiveUnderlinedTitle
                    as="h3"
                    className="section-title"
                    underlineColor={isActive ? "#FF5C8A" : "#9CA3AF"}
                  >
                    <span className={isActive ? "text-[28px] font-bold text-[#111827]" : "text-[28px] font-bold text-[#9CA3AF]"}>
                      {c.countryName}
                    </span>
                  </ResponsiveUnderlinedTitle>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-start">
          {/* Left: vertical country tabs (desktop) */}
          <div className="hidden md:block md:col-span-2">
            {countries.length > 0 && (
              <div className="flex flex-col gap-6">
                {countries.map((c, idx) => {
                  const isActive = idx === active;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActive(idx)}
                      className="relative text-left pb-1"
                      aria-pressed={isActive}
                    >
                      {isActive ? (
                        <ResponsiveUnderlinedTitle
                          as="h3"
                          className="text-[28px] md:text-[45px] font-bold text-[#111827]"
                          underlineColor="#FF5C8A"

                        >
                          {c.countryName}
                        </ResponsiveUnderlinedTitle>
                      ) : (
                        <span className="text-[28px] md:text-[45px] font-bold text-[#9CA3AF]">{c.countryName}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Middle: Offices for active country */}
          <div className="col-span-12 md:col-span-7 xl:col-span-6">
            {current && Array.isArray(current.offices) && current.offices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {current.offices.map((office, idx) => (
                  <div key={idx}>
                    {office.name && (
                      <h3 className="text-[28px] md:text-[32px] font-bold mb-5">{office.name}</h3>
                    )}

                    <div className="w-full">
                      <div>
                        <p className="cda-locations-text-top mb-2">Address</p>
                        {office.address && (
                          <p className="cda-locations-text-bot">{office.address}</p>
                        )}

                        <p className="cda-locations-text-top mb-2">Email</p>
                        {office.email && (
                          <p className="cda-locations-text-bot">{office.email}</p>
                        )}
                        <p className="cda-locations-text-top mb-2">Phone</p>
                        {office.phone && (
                          <p className="cda-locations-text-bot">{office.phone}</p>
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
