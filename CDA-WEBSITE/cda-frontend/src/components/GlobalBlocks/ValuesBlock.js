'use client';
// src/components/GlobalBlocks/ValuesBlock.js
import React from 'react';

const ValuesBlock = ({ globalData, pageData, useOverride = false }) => {
  // Use override data if specified, otherwise use global data
  const data = useOverride && pageData ? pageData : globalData;
  
  // Support both new field structure (values) and legacy (cards)
  const items = data?.values || data?.cards || [];
  if (!items || items.length === 0) return null;

  // Sort items by cardNumber (legacy) or by index
  const sortedItems = [...items].sort((a, b) => {
    if (a.cardNumber && b.cardNumber) {
      return a.cardNumber - b.cardNumber;
    }
    return 0; // Keep original order if no cardNumber
  });

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {data.title && (
            <h2 className="text-md font-bold text-gray-700 mb-2">
              {data.title}
            </h2>
          )}
          {data.subtitle && (
            <p className="text-3xl font-bold tracking-wider text-gray-900">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-8">
            {sortedItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Card Number Badge */}
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {item.cardNumber || index + 1}
                </div>
                
                {/* Card Image */}
                {item.image && (
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <img 
                      src={item.image.node.sourceUrl}
                      alt={item.image.node.altText || item.title || ''}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Card Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  {(item.description || item.text) && (
                    <p className="text-gray-600 leading-relaxed">
                      {item.description || item.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet Layout - 2 Column Grid */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-6">
            {sortedItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Card Number Badge */}
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-md mb-4">
                  {item.cardNumber || index + 1}
                </div>
                
                {/* Card Image */}
                {item.image && (
                  <div className="w-14 h-14 mb-4 flex items-center justify-center">
                    <img 
                      src={item.image.node.sourceUrl}
                      alt={item.image.node.altText || item.title || ''}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Card Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  {(item.description || item.text) && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description || item.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {sortedItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                {/* Card Number Badge */}
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-md mb-4">
                  {item.cardNumber || index + 1}
                </div>
                
                {/* Card Image */}
                {item.image && (
                  <div className="w-12 h-12 mb-4 flex items-center justify-center">
                    <img 
                      src={item.image.node.sourceUrl}
                      alt={item.image.node.altText || item.title || ''}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Card Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  {(item.description || item.text) && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description || item.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Right Corner Image */}
      {data.cornerImage && (
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
          <img 
            src={data.cornerImage.node.sourceUrl}
            alt={data.cornerImage.node.altText || 'Values decoration'}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        /* Add subtle animation to value cards */
        .value-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        /* Badge animation */
        .card-badge {
          transition: transform 0.2s ease;
        }
        
        .card-badge:hover {
          transform: scale(1.1);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .corner-image {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </section>
  );
};

export default ValuesBlock;