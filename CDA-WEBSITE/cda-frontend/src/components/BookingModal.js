// components/BookingModal.js
'use client'

import { useEffect, useMemo, useState } from 'react';
import ResponsiveUnderlinedTitle from './ResponsiveUnderlinedTitle';

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
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    script.async = true;
    document.body.appendChild(script);

    // Function to inject comprehensive styles into the iFrame
    const injectIframeStyles = () => {
      const iframe = document.querySelector('.meetings-iframe-container iframe');
      if (!iframe || !iframe.contentDocument) return;

      // Avoid re-injecting
      if (iframe.contentDocument.querySelector('#custom-hubspot-styles')) return;

      const style = document.createElement('style');
      style.id = 'custom-hubspot-styles';
      style.textContent = `
        /* ========================================
           GLOBAL OVERRIDES - Force Light Theme
           ======================================== */

        * {
          border-radius: 0 !important; /* Remove ALL rounded corners */
        }

        body, html {
          background-color: #FFFFFF !important;
          color: #111827 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        /* Hide HubSpot branding and unnecessary elements */
        .hs-meeting-scheduler__footer,
        .hs-meeting-scheduler__powered-by,
        [data-test-id="powered-by"],
        .hs-meeting-scheduler__branding,
        .meetings-iframe-container__footer {
          display: none !important;
        }

        /* ========================================
           HEADER / MEETING TITLE SECTION
           ======================================== */

        /* Main container */
        .hs-meeting-scheduler__header {
          background-color: #FFFFFF !important;
          padding: 24px !important;
        }

        /* "Meeting with Stuart Alldis" text */
        .hs-meeting-scheduler__title,
        .hs-meeting-scheduler__meeting-title {
          color: #111827 !important;
          font-size: 24px !important;
          font-weight: 700 !important;
          margin-bottom: 8px !important;
        }

        /* Logo/Avatar */
        .hs-meeting-scheduler__avatar,
        .hs-meeting-scheduler__logo {
          width: 80px !important;
          height: 80px !important;
          border-radius: 0 !important; /* Square logo */
        }

        /* ========================================
           DURATION SELECTOR ("How long do you need?")
           ======================================== */

        .hs-meeting-scheduler__duration-selector {
          background-color: #FFFFFF !important;
          padding: 16px !important;
          border-bottom: 1px solid #E5E7EB !important;
        }

        .hs-meeting-scheduler__duration-label {
          color: #111827 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          margin-bottom: 12px !important;
        }

        /* Duration buttons (30 mins / 1 hour) */
        .hs-meeting-scheduler__duration-button {
          background-color: #FFFFFF !important;
          color: #111827 !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 0 !important;
          padding: 10px 20px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .hs-meeting-scheduler__duration-button:hover {
          border-color: #111827 !important;
          background-color: #F9FAFB !important;
        }

        .hs-meeting-scheduler__duration-button--selected {
          background-color: #D1D5DB !important;
          border-color: #111827 !important;
          color: #111827 !important;
        }

        /* ========================================
           CALENDAR SECTION
           ======================================== */

        .hs-meeting-scheduler__calendar-wrapper {
          background-color: #FFFFFF !important;
          padding: 24px !important;
        }

        .hs-meeting-scheduler__calendar {
          background-color: #FFFFFF !important;
        }

        /* Month/Year header and navigation */
        .hs-meeting-scheduler__calendar-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 20px !important;
          padding: 0 8px !important;
        }

        .hs-meeting-scheduler__month-selector,
        .hs-meeting-scheduler__calendar-title {
          font-weight: 700 !important;
          font-size: 20px !important;
          color: #111827 !important;
        }

        /* Navigation arrows */
        .hs-meeting-scheduler__nav-button,
        .hs-meeting-scheduler__arrow,
        .hs-meeting-scheduler__prev-month,
        .hs-meeting-scheduler__next-month,
        button[aria-label*="previous"],
        button[aria-label*="next"] {
          background-color: transparent !important;
          border: none !important;
          color: #111827 !important;
          font-size: 20px !important;
          cursor: pointer !important;
          padding: 8px !important;
          transition: opacity 0.2s ease !important;
        }

        .hs-meeting-scheduler__nav-button:hover,
        .hs-meeting-scheduler__arrow:hover {
          opacity: 0.7 !important;
        }

        /* Day names row (Mon, Tue, Wed...) */
        .hs-meeting-scheduler__day-names,
        .hs-meeting-scheduler__weekday-header {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 4px !important;
          margin-bottom: 8px !important;
        }

        .hs-meeting-scheduler__day-name,
        .hs-meeting-scheduler__weekday {
          text-align: center !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #111827 !important;
          text-transform: capitalize !important;
          padding: 8px 0 !important;
        }

        /* Calendar grid */
        .hs-meeting-scheduler__calendar-grid,
        .hs-meeting-scheduler__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 4px !important;
        }

        /* Individual date cells */
        .hs-meeting-scheduler__date,
        .hs-meeting-scheduler__day,
        .hs-meeting-scheduler__calendar-day,
        button[class*="day"] {
          width: 40px !important;
          height: 40px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          background-color: transparent !important;
          color: #111827 !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          cursor: pointer !important;
          transition: background-color 0.2s ease !important;
          border-radius: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Hover state for available dates */
        .hs-meeting-scheduler__date:hover:not([disabled]),
        .hs-meeting-scheduler__day:hover:not([disabled]),
        .hs-meeting-scheduler__calendar-day:hover:not([disabled]) {
          background-color: #F3F4F6 !important;
        }

        /* Selected date - BLACK BACKGROUND */
        .hs-meeting-scheduler__date--selected,
        .hs-meeting-scheduler__day--selected,
        .hs-meeting-scheduler__calendar-day--selected,
        [class*="selected"] {
          background-color: #111827 !important;
          color: #FFFFFF !important;
          border: none !important;
          font-weight: 600 !important;
        }

        /* Disabled/unavailable dates */
        .hs-meeting-scheduler__date--disabled,
        .hs-meeting-scheduler__day--disabled,
        .hs-meeting-scheduler__calendar-day--disabled,
        [disabled] {
          color: #D1D5DB !important;
          cursor: not-allowed !important;
          opacity: 0.5 !important;
        }

        /* Today's date (optional highlight) */
        .hs-meeting-scheduler__date--today,
        .hs-meeting-scheduler__day--today {
          font-weight: 700 !important;
        }

        /* ========================================
           TIMEZONE SELECTOR
           ======================================== */

        .hs-meeting-scheduler__timezone-selector {
          background-color: #FFFFFF !important;
          padding: 16px 24px !important;
          border-bottom: 1px solid #E5E7EB !important;
        }

        .hs-meeting-scheduler__timezone-label {
          color: #111827 !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          margin-bottom: 8px !important;
        }

        .hs-meeting-scheduler__timezone-select,
        select[name*="timezone"] {
          width: 100% !important;
          padding: 10px 12px !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 0 !important;
          background-color: #FFFFFF !important;
          color: #111827 !important;
          font-size: 14px !important;
          cursor: pointer !important;
        }

        /* ========================================
           TIME SLOTS SECTION
           ======================================== */

        .hs-meeting-scheduler__time-slots-wrapper {
          background-color: #FFFFFF !important;
          padding: 24px !important;
        }

        .hs-meeting-scheduler__time-slots-header {
          color: #111827 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          margin-bottom: 16px !important;
        }

        .hs-meeting-scheduler__time-slots,
        .hs-meeting-scheduler__slots-container {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
          gap: 12px !important;
        }

        /* Individual time slot buttons */
        .hs-meeting-scheduler__time-slot,
        .hs-meeting-scheduler__time-button,
        .hs-meeting-scheduler__slot,
        button[class*="time-slot"],
        button[class*="slot"] {
          background-color: #FFFFFF !important;
          color: #111827 !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 0 !important;
          padding: 12px 16px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          text-align: center !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          min-width: 100px !important;
        }

        /* Time slot hover */
        .hs-meeting-scheduler__time-slot:hover,
        .hs-meeting-scheduler__time-button:hover,
        .hs-meeting-scheduler__slot:hover {
          border-color: #111827 !important;
          background-color: #F9FAFB !important;
        }

        /* Selected time slot - BLACK BACKGROUND */
        .hs-meeting-scheduler__time-slot--selected,
        .hs-meeting-scheduler__time-button--selected,
        .hs-meeting-scheduler__slot--selected,
        [class*="slot"][class*="selected"] {
          background-color: #111827 !important;
          color: #FFFFFF !important;
          border-color: #111827 !important;
          font-weight: 600 !important;
        }

        /* ========================================
           FORM FIELDS (if visible in iframe)
           ======================================== */

        .hs-meeting-scheduler__form-field {
          margin-bottom: 16px !important;
        }

        .hs-meeting-scheduler__label,
        label {
          color: #111827 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          margin-bottom: 6px !important;
          display: block !important;
        }

        .hs-meeting-scheduler__input,
        input[type="text"],
        input[type="email"],
        textarea {
          width: 100% !important;
          padding: 10px 12px !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 0 !important;
          background-color: #FFFFFF !important;
          color: #111827 !important;
          font-size: 14px !important;
        }

        .hs-meeting-scheduler__input:focus,
        input:focus,
        textarea:focus {
          outline: none !important;
          border-color: #111827 !important;
          box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1) !important;
        }

        /* ========================================
           BUTTONS (Submit, Next, etc.)
           ======================================== */

        .hs-meeting-scheduler__button,
        .hs-meeting-scheduler__submit,
        .hs-meeting-scheduler__next-button,
        button[type="submit"] {
          background-color: #111827 !important;
          color: #FFFFFF !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 12px 24px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: background-color 0.2s ease !important;
        }

        .hs-meeting-scheduler__button:hover,
        .hs-meeting-scheduler__submit:hover,
        button[type="submit"]:hover {
          background-color: #000000 !important;
        }

        .hs-meeting-scheduler__button:disabled {
          background-color: #D1D5DB !important;
          color: #6B7280 !important;
          cursor: not-allowed !important;
        }

        /* ========================================
           SCROLLBARS
           ======================================== */

        ::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }

        ::-webkit-scrollbar-track {
          background: #F3F4F6 !important;
        }

        ::-webkit-scrollbar-thumb {
          background: #D1D5DB !important;
          border-radius: 0 !important;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF !important;
        }

        /* ========================================
           ADDITIONAL OVERRIDES
           ======================================== */

        /* Remove any box shadows */
        * {
          box-shadow: none !important;
        }

        /* Ensure all text is dark on light background */
        p, span, div, h1, h2, h3, h4, h5, h6 {
          color: #111827 !important;
        }

        /* Links */
        a {
          color: #111827 !important;
          text-decoration: underline !important;
        }

        a:hover {
          opacity: 0.8 !important;
        }
      `;

      iframe.contentDocument.head.appendChild(style);
      console.log('✅ HubSpot iframe styles injected successfully');
    };

    // Poll for iframe readiness with retry logic
    let attempts = 0;
    const maxAttempts = 30; // Increase attempts
    const styleInterval = setInterval(() => {
      attempts++;
      const iframe = document.querySelector('.meetings-iframe-container iframe');

      if (iframe && iframe.contentDocument) {
        try {
          // Check if document is ready
          if (iframe.contentDocument.readyState === 'complete' ||
            iframe.contentDocument.readyState === 'interactive') {

            injectIframeStyles();

            // Verify injection was successful
            if (iframe.contentDocument.querySelector('#custom-hubspot-styles')) {
              console.log('✅ Styles verified in iframe');
              clearInterval(styleInterval);

              // Re-inject if DOM changes (HubSpot sometimes re-renders)
              const observer = new MutationObserver(() => {
                if (!iframe.contentDocument.querySelector('#custom-hubspot-styles')) {
                  console.log('🔄 Re-injecting styles after DOM change');
                  injectIframeStyles();
                }
              });

              observer.observe(iframe.contentDocument.body, {
                childList: true,
                subtree: true
              });
            }
          }
        } catch (e) {
          console.warn('⚠️ Failed to inject styles:', e);
        }
      }

      // Stop trying after max attempts
      if (attempts >= maxAttempts) {
        console.error('❌ Failed to inject styles after', maxAttempts, 'attempts');
        clearInterval(styleInterval);
      }
    }, 500);

    return () => {
      clearInterval(styleInterval);
      try {
        document.body.removeChild(script);
      } catch (_) { }
    };
  }, [isOpen, embedUrl])

  const isValid = Boolean(firstName && lastName && /.+@.+\..+/.test(email))

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleOverlayClick}>
      <div className="bg-white max-w-[1281px] w-full max-h-[90vh] overflow-hidden relative shadow-2xl">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-900" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="grid grid-cols-12 gap-0 h-full px-8 py-8">
          {/* Left: Form */}
          <div className="col-span-12 lg:col-span-5 p-6 lg:p-8 overflow-y-auto">
            <ResponsiveUnderlinedTitle as="h2" className="mb-4" underlineColor="#FD8721">
              Book Time With Us
            </ResponsiveUnderlinedTitle>
            <p className="mb-6">The first step toward something great.</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input aria-label="First Name" placeholder="First Name*" className="border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input aria-label="Last Name" placeholder="Last Name*" className="border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="mb-6">
              <input aria-label="Email" placeholder="Email*" type="email" className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <p className="text-sm mb-3">Choose how you want to do this meeting</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button type="button" className={`px-4 py-3 border border-black inline-flex items-center gap-2 ${provider === 'teams' ? 'bg-white text-black' : 'bg-black text-white'}`} onClick={() => setProvider('teams')}>
                {/* Teams icon */}
                <img src="/images/form/teams.svg" alt="" className="md:w-[27.75px] md:h-[25.37px] w-[21.87px] h-[20px]" aria-hidden="true" />
                <span>Teams</span>
              </button>
              <button type="button" className={`px-4 py-3 border border-black inline-flex items-center gap-2 ${provider === 'teams' ? 'bg-black text-white' : 'bg-white text-black'}`} onClick={() => setProvider('zoom')}>
                {/* Zoom icon */}
                <img src="/images/form/zoom.svg" alt="" className="md:w-[24.13px] md:h-[24.13px] w-[19.94px] h-[19.94px]" aria-hidden="true" />
                <span>Zoom</span>
              </button>
            </div>

            <div className="mt-8 text-sm">
              <p className="mb-4">Your meeting details:</p>
              <button type="button" disabled={!isValid} onClick={() => { /* optional no-op */ }} className="button-l">
                Book A Meeting
              </button>
              <p className="mt-3">Or give us a call on <strong>0203 780 0808 </strong></p>
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
