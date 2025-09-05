// components/Header.js
'use client'

import { useEffect, useState } from 'react';
import client from '../lib/graphql/client';
import { GET_MENU } from '../lib/graphql/queries';
import BookingModal from './BookingModal';

export default function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await client.query({
          query: GET_MENU,
          errorPolicy: 'all'
        });
        
        const items = response.data?.primaryMenu?.menuItems?.nodes?.filter(item => !item.parentId) || [];
        setMenuItems(items);
      } catch (error) {
        console.error('Menu fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <>
      {/* Desktop Sticky Start Project Button - Left Edge */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="button-without-box-vertical-black shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          Start A Project
        </button>
      </div>
      
      {/* Mobile Sticky Start Project Button - Bottom Edge */}
      <div className="fixed bottom-0 left-0 z-50 md:hidden">
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="button-without-box-vertical-black shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          Start A Project
        </button>
      </div>

      <header className="bg-white" style={{ borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/images/cda-logo.svg" 
                alt="CDA Logo" 
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {loading ? (
                <div>Loading...</div>
              ) : (
                menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="nav-link"
                    style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: '600' }}
                  >
                    {item.label}
                  </a>
                ))
              )}
            </nav>

            {/* Side Menu and Mobile Menu Buttons */}
            <div className="flex items-center space-x-4">
              {/* Side Menu Button - visible on all devices */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsSideMenuOpen(true)}
                aria-label="Open side menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8M4 18h16"></path>
                </svg>
              </button>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => {
            setIsSideMenuOpen(false);
            setIsCompanyMenuOpen(false);
          }}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Side Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => {
                setIsSideMenuOpen(false);
                setIsCompanyMenuOpen(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close side menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Side Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-6">
              <div className="space-y-4">
                {/* Company Menu Item with Submenu */}
                <div>
                  <button
                    onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    <span>Company</span>
                    <svg 
                      className={`w-5 h-5 transform transition-transform ${isCompanyMenuOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {/* Company Submenu */}
                  {isCompanyMenuOpen && (
                    <div className="mt-2 ml-4 space-y-2 border-l border-gray-200 pl-4">
                      <a 
                        href="/about" 
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                          setIsSideMenuOpen(false);
                          setIsCompanyMenuOpen(false);
                        }}
                      >
                        About Us
                      </a>
                      <a 
                        href="/team" 
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                          setIsSideMenuOpen(false);
                          setIsCompanyMenuOpen(false);
                        }}
                      >
                        Our Team
                      </a>
                      <a 
                        href="/case-studies" 
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                          setIsSideMenuOpen(false);
                          setIsCompanyMenuOpen(false);
                        }}
                      >
                        Case Studies
                      </a>
                      <a 
                        href="/knowledge-hub" 
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                          setIsSideMenuOpen(false);
                          setIsCompanyMenuOpen(false);
                        }}
                      >
                        Knowledge Hub
                      </a>
                    </div>
                  )}
                </div>

                {/* Other Main Menu Items */}
                <a 
                  href="/services" 
                  className="block px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    setIsCompanyMenuOpen(false);
                  }}
                >
                  Services
                </a>
                <a 
                  href="/contact" 
                  className="block px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    setIsCompanyMenuOpen(false);
                  }}
                >
                  Contact
                </a>
              </div>
            </nav>
          </div>

          {/* Side Menu Footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                setIsBookingModalOpen(true);
                setIsSideMenuOpen(false);
                setIsCompanyMenuOpen(false);
              }}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start A Project
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </>
  );
}