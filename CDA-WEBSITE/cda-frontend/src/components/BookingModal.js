// components/BookingModal.js
'use client'

import { useEffect, useMemo, useState } from 'react';

export default function BookingModal({ isOpen = true, onClose }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [provider, setProvider] = useState('zoom') // default zoom

  const region = 'eu1'
  const ownerSlug = 'stuart-alldis'
  const meetingsBase = useMemo(() => `https://meetings-${region}.hubspot.com/${ownerSlug}`, [])

  const embedUrl = useMemo(() => {
    const base = provider === 'zoom' ? `${meetingsBase}/general-zoom` : meetingsBase
    const params = new URLSearchParams()
    if (firstName) params.set('firstname', firstName)
    if (lastName) params.set('lastname', lastName)
    if (email) params.set('email', email)
    params.set('embed', 'true')
    return `${base}?${params.toString()}`
  }, [meetingsBase, provider, firstName, lastName, email])

  useEffect(() => {
    if (!isOpen) return
    const script = document.createElement('script')
    script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
    script.async = true
    document.body.appendChild(script)
    return () => { try { document.body.removeChild(script) } catch(_){} }
  }, [isOpen, embedUrl])

  const isValid = Boolean(firstName && lastName && /.+@.+\..+/.test(email))

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg max-w-[1100px] w-full max-h-[90vh] overflow-hidden relative shadow-2xl">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-900" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="grid grid-cols-12 gap-0 h-full">
          {/* Left: Form */}
          <div className="col-span-12 lg:col-span-5 p-6 lg:p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <span className="transition-colors" style={{ textDecoration: 'underline', textDecorationColor: '#FF5C8A', textDecorationThickness: '4px' }}>
                Book Time With Us
              </span>
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
              <button type="button" className={`px-5 py-3 border border-black inline-flex items-center gap-2 ${provider === 'teams' ? 'bg-black text-white' : 'bg-white text-black'}`} onClick={() => setProvider('teams')}>
                {/* Teams icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="6" width="8" height="12" rx="2"></rect><path d="M13 8h5a2 2 0 0 1 2 2v8h-7V8z"></path><text x="7" y="15" fontSize="8" fontFamily="Arial" fill="white">T</text></svg>
                <span>Teams</span>
              </button>
              <button type="button" className={`px-5 py-3 border border-black inline-flex items-center gap-2 ${provider === 'zoom' ? 'bg-black text-white' : 'bg-white text-black'}`} onClick={() => setProvider('zoom')}>
                {/* Zoom icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="7" width="12" height="10" rx="2"></rect><path d="M17 9l4 3-4 3V9z"></path></svg>
                <span>Zoom</span>
              </button>
            </div>

            <div className="mt-8 text-sm text-[#4B5563]">
              <p className="mb-4">Your meeting details will be applied to the scheduler.</p>
              <button type="button" disabled={!isValid} onClick={() => { /* optional no-op */ }} className={`inline-flex items-center justify-center px-6 py-3 font-semibold transition-colors ${isValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                Book A Meeting
              </button>
              <p className="mt-3 text-[#111827]">Or give us a call on 0203 780 0808</p>
            </div>
          </div>

          {/* Right: Embed */}
          <div className="col-span-12 lg:col-span-7 p-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white min-h-[300px]">
            <div key={embedUrl} className="meetings-iframe-container" data-src={embedUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
