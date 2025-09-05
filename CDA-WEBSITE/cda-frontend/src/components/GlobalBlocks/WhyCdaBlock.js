// src/components/GlobalBlocks/WhyCdaBlock.js
import React from 'react';

const WhyCdaBlock = ({ globalData }) => {
  if (!globalData?.cards || globalData.cards.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          {globalData.subtitle && (
            <p className="text-sm uppercase tracking-wider text-red-600 mb-2">
              {globalData.subtitle}
            </p>
          )}
          {globalData.title && (
            <h2 className="text-3xl font-bold text-gray-900">
              {globalData.title}
            </h2>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {globalData.cards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {card.image && (
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <img 
                    src={card.image.sourceUrl}
                    alt={card.image.altText || card.title || ''}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {card.title && (
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {card.title}
                </h3>
              )}
              {card.description && (
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCdaBlock;