"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * HubSpot Meetings Scheduler with prefill + provider toggle (Teams/Zoom)
 *
 * Props:
 * - ownerSlug: hubspot meetings owner slug (e.g., "stuart-alldis")
 * - defaultProvider: 'teams' | 'zoom'
 * - region: 'eu1' | 'na1' (defaults to 'eu1')
 */
export default function HubspotMeetingsScheduler({
  ownerSlug = "stuart-alldis",
  defaultProvider = "teams",
  region = "eu1",
  memberName = "",
  jobTitle = "",
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState(defaultProvider);

  const meetingsBase = useMemo(() => `https://meetings-${region}.hubspot.com/${ownerSlug}`, [ownerSlug, region]);

  const embedUrl = useMemo(() => {
    const base = provider === "zoom" ? `${meetingsBase}/general-zoom` : meetingsBase;
    const params = new URLSearchParams();
    // HubSpot Meetings supports these prefill query params
    if (firstName) params.set("firstname", firstName);
    if (lastName) params.set("lastname", lastName);
    if (email) params.set("email", email);
    // embed flag
    params.set("embed", "true");
    return `${base}?${params.toString()}`;
  }, [meetingsBase, provider, firstName, lastName, email]);

  // (Re)load Meetings embed script whenever embedUrl changes
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch (_) {}
    };
  }, [embedUrl]);

  // Derived labels
  const displayName = memberName || ownerSlug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
// Do not append job title to booking heading text

  // Decorative images from public folder
  const carUrl = '/images/Group-9161.svg'
  const arrowUrl = '/images/Component-113-–-2-1.svg'

  const isValid = Boolean(firstName && lastName && /.+@.+\..+/.test(email))

  return (
    <section className="relative py-10 pb-28 md:pb-36 bg-[#F4F4F4] overflow-visible">
      {/* Top decorative car image: positioned half outside the section */}
      <img
        src={carUrl}
        alt=""
        className="pointer-events-none select-none absolute right-6 top-0 md:w-[1021px] md:h-[325px] w-[436px] h-[139px] object-contain z-10 md:-translate-y-1/2"
        style={{ top: '-90px', width: '50%'}}
      />
      {/* Arrow placed under the HubSpot form, overlapping into next section by half its height */}
      <img
        src={arrowUrl}
        alt=""
        className="pointer-events-none select-none absolute z-10"
        style={{ width: '350px', height: '170px', bottom: '-85px', right: '82px' }}
      />

      <div className="relative mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 grid grid-cols-12 gap-y-10 gap-x-10 items-start">

        {/* Left: Form */}
        <div className="col-span-12 lg:col-span-6 relative z-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            <p className="transition-colors" style={{ textDecoration: 'underline', textDecorationColor: '#FF5C8A', textDecorationThickness: '4px' }}>
              {`Book Time With ${displayName}`}
            </p>
          </h2>
          <p className="text-[#4B5563] mb-6">The first step toward something great.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input aria-label="First Name" placeholder="First Name*" className="border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input aria-label="Last Name" placeholder="Last Name*" className="border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="mb-6">
            <input aria-label="Email" placeholder="Email*" type="email" className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <p className="text-sm text-[#111827] mb-3">Choose how you want to do this meeting</p>
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              className={`px-5 py-3 border border-black inline-flex items-center gap-2 ${provider === 'teams' ? 'bg-black text-white' : 'bg-white text-black'}`}
              onClick={() => setProvider('teams')}
            >
              {/* Teams icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="3" y="6" width="8" height="12" rx="2"></rect>
                <path d="M13 8h5a2 2 0 0 1 2 2v8h-7V8z"></path>
                <text x="7" y="15" fontSize="8" fontFamily="Arial" fill="white">T</text>
              </svg>
              <span>Teams</span>
            </button>
            <button
              type="button"
              className={`px-5 py-3 border border-black inline-flex items-center gap-2 ${provider === 'zoom' ? 'bg-black text-white' : 'bg-white text-black'}`}
              onClick={() => setProvider('zoom')}
            >
              {/* Zoom icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="3" y="7" width="12" height="10" rx="2"></rect>
                <path d="M17 9l4 3-4 3V9z"></path>
              </svg>
              <span>Zoom</span>
            </button>
          </div>

          <div className="mt-8 text-sm text-[#4B5563]">
            <p className="mb-4">Your meeting details will be applied to the scheduler on the right.</p>
            <button
              type="button"
              disabled={!isValid}
              onClick={() => {
                if (!isValid) return
                // Scroll to the embed times area
                try {
                  document.querySelector('.meetings-iframe-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } catch (_) {}
              }}
              className={`inline-flex items-center justify-center px-6 py-3 font-semibold transition-colors ${isValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              Book A Meeting
            </button>
            <p className="mt-3 text-[#111827]">Or give us a call on 0203 780 0808</p>
          </div>
        </div>

        {/* Right: HubSpot Meetings Embed */}
        <div className="col-span-12 lg:col-span-6 relative z-20">
          {/* Re-render container when URL changes so the script attaches a new iframe */}
          <div key={embedUrl} className="meetings-iframe-container" data-src={embedUrl} />
        </div>
      </div>
    </section>
  );
}
