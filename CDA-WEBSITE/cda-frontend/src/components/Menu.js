// components/Menu.js
import { useState } from 'react';

export default function Menu({ menu }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug: Log the menu prop to see what's being received
  console.log('Menu component received:', menu);
  
  // Extract nodes from menuItems with detailed error checking
  const menuItems = menu?.menuItems?.nodes || [];
  
  // Debug: Log the extracted menu items
  console.log('Extracted menuItems:', menuItems);
  console.log('menuItems length:', menuItems.length);
  
  // Filter top-level menu items (no parent)
  const topLevelItems = menuItems.filter(item => !item.parentId) || [];
  
  // Debug: Log the top-level items
  console.log('Top level items:', topLevelItems);
  console.log('Top level items length:', topLevelItems.length);

  // Check for common issues
  const hasMenuData = !!menu;
  const hasMenuItems = !!menu?.menuItems;
  const hasNodes = !!menu?.menuItems?.nodes;
  const hasTopLevelItems = topLevelItems.length > 0;

  console.log('Menu data checks:', {
    hasMenuData,
    hasMenuItems,
    hasNodes,
    hasTopLevelItems
  });

  // If no menu data, show error message
  if (!hasMenuData) {
    return (
      <div className="text-red-500 text-sm bg-red-100 p-2 rounded">
        Error: No menu data provided to Menu component
      </div>
    );
  }

  if (!hasMenuItems) {
    return (
      <div className="text-red-500 text-sm bg-red-100 p-2 rounded">
        Error: Menu exists but menuItems is missing
      </div>
    );
  }

  if (!hasNodes) {
    return (
      <div className="text-red-500 text-sm bg-red-100 p-2 rounded">
        Error: menuItems exists but nodes array is missing
      </div>
    );
  }

  if (!hasTopLevelItems) {
    return (
      <div className="text-yellow-500 text-sm bg-yellow-100 p-2 rounded">
        Warning: Menu data loaded but no top-level items found (check parent IDs)
      </div>
    );
  }

  return (
    <nav className="relative">
      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex space-x-8">
        {topLevelItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            {topLevelItems.map((item) => (
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
    </nav>
  );
}