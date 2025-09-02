// components/Header.js
import { useState } from 'react';

export default function Header({ globalOptions, menu }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const headerContent = globalOptions?.headerContent;
  const footerContent = globalOptions?.footerContent;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {headerContent?.headerLogo?.node?.sourceUrl ? (
              <img 
                src={headerContent.headerLogo.node.sourceUrl} 
                alt={headerContent.headerLogo.node.altText || 'Logo'}
                className="h-8 w-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">CDA</h1>
            )}
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            {headerContent?.headerPhone && (
              <a href={`tel:${headerContent.headerPhone}`} className="hover:text-gray-900 transition-colors">
                {headerContent.headerPhone}
              </a>
            )}
            {headerContent?.headerEmail && (
              <a href={`mailto:${headerContent.headerEmail}`} className="hover:text-gray-900 transition-colors">
                {headerContent.headerEmail}
              </a>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            {menu?.menuItems?.nodes?.filter(item => !item.parentId).map((item) => (
              <a
                key={item.id}
                href={item.url}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {menu?.menuItems?.nodes?.filter(item => !item.parentId).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
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
  );
}