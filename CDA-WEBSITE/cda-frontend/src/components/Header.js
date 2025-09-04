// components/Header.js
'use client'

import { useEffect, useState } from 'react';
import client from '../lib/graphql/client';
import { GET_MENU } from '../lib/graphql/queries';

export default function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="bg-white" style={{ borderBottom: '1px solid #EBEBEB' }}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Static Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">CDA</h1>
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
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
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
  );
}