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

  return (
    <section className="py-10 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-6">
          <h2 className="cda-title title-small-purple mb-6">Book Time With {ownerSlug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())}</h2>
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
            <button type="button" className={`px-5 py-3 border ${provider === 'teams' ? 'bg-black text-white' : 'bg-white text-black'} border-black`} onClick={() => setProvider("teams")}>
              Teams
            </button>
            <button type="button" className={`px-5 py-3 border ${provider === 'zoom' ? 'bg-black text-white' : 'bg-white text-black'} border-black`} onClick={() => setProvider("zoom")}>
              Zoom
            </button>
          </div>

          <div className="mt-8 text-sm text-[#4B5563]">
            <p className="mb-4">Your meeting details will be applied to the scheduler on the right.</p>
            <button type="button" className="button-l">Book A Meeting</button>
          </div>
        </div>

        {/* Right: HubSpot Meetings Embed */}
        <div className="lg:col-span-6">
          {/* Re-render container when URL changes so the script attaches a new iframe */}
          <div key={embedUrl} className="meetings-iframe-container" data-src={embedUrl} />
        </div>
      </div>
    </section>
  );
}
