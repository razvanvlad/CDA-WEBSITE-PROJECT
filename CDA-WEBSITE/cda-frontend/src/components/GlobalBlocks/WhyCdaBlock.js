// src/components/GlobalBlocks/WhyCdaBlock.js
import React from 'react';

const WhyCdaBlock = ({ globalData }) => {
  if (!globalData?.cards || globalData.cards.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4 max-w-6xl">
    <div className="text-center mb-12">
       {globalData.title && (
<h2 className="text-md font-bold text-black">
          {globalData.title}
        </h2>
      )}
      {globalData.subtitle && (
<p className="text-lg font-bold tracking-wider text-black">
          {globalData.subtitle}
        </p>
      )}
    </div>
    {/* card listing CDA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {globalData.cards.map((card, index) => (
            <div key={index} className="bg-white square-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex">
                {/* Text content - left side */}
                <div className="flex-1 p-6">
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
                
                {/* Image - right side touches borders */}
                {card.image && (
                <div className="w-60 flex-shrink-0 flex items-end">
                    <img 
                    src={card.image.node.sourceUrl}
                    alt={card.image.node.altText || card.title || ''}
                    className="w-full h-auto object-contain"
                    />
                </div>
                )}
            </div>
            </div>
        ))}
        </div>
        {/* card listing CDA */}
  </div>
</section>
  );
};

export default WhyCdaBlock;