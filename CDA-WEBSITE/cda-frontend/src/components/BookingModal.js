// components/BookingModal.js
'use client'

import { useState, useEffect } from 'react';

export default function BookingModal({ isOpen, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (selectedMethod && showCalendar) {
      // Load HubSpot embed script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
      document.head.appendChild(script);

      return () => {
        // Cleanup
        const existingScript = document.querySelector('script[src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [selectedMethod, showCalendar]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowCalendar(true);
  };

  const handleBack = () => {
    setShowCalendar(false);
    setSelectedMethod('');
  };

  const handleClose = () => {
    setShowCalendar(false);
    setSelectedMethod('');
    onClose();
  };

  if (!isOpen) return null;

  const getEmbedUrl = () => {
    if (selectedMethod === 'teams') {
      return 'https://meetings-eu1.hubspot.com/stuart-alldis?embed=true';
    } else if (selectedMethod === 'zoom') {
      return 'https://meetings-eu1.hubspot.com/stuart-alldis/general-zoom?embed=true';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white square-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {!showCalendar ? (
          /* Method Selection */
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Book Time With Us</h2>
            <p className="text-gray-600 mb-8">The first step toward something great.</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Choose how you want to do this meeting</h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleMethodSelect('teams')}
                  className="flex flex-col items-center gap-3 px-8 py-6 bg-white border-2 border-gray-200 rounded-lg hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <img 
                    src="/images/teams-logo.png" 
                    alt="Teams" 
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Teams</span>
                </button>
                
                <button
                  onClick={() => handleMethodSelect('zoom')}
                  className="flex flex-col items-center gap-3 px-8 py-6 bg-white border-2 border-gray-200 rounded-lg hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <img 
                    src="/images/zoom-logo.png" 
                    alt="Zoom" 
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Zoom</span>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-gray-600">
                Or give us a call on <strong>0203 780 0808</strong>
              </p>
            </div>
          </div>
        ) : (
          /* Calendar Embed */
          <div className="h-full">
            <div className="p-4 border-b flex items-center">
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back
              </button>
            </div>
            
            <div className="p-4 h-[calc(100%-60px)]">
              <div 
                className="meetings-iframe-container h-full" 
                data-src={getEmbedUrl()}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}