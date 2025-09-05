'use client';
// src/components/GlobalBlocks/ApproachBlock.js
import React from 'react';

const ApproachBlock = ({ globalData, pageData, useOverride = false }) => {
  // Use override data if specified, otherwise use global data
  const data = useOverride && pageData ? pageData : globalData;
  
  if (!data?.steps || data.steps.length === 0) return null;

  // Sort steps by step_number to ensure correct order
  const sortedSteps = [...data.steps].sort((a, b) => a.stepNumber - b.stepNumber);

  // Generate SVG arrow component for connecting steps
  const Arrow = ({ direction = 'right', className = '' }) => (
    <svg 
      className={`arrow ${className}`}
      width="60" 
      height="20" 
      viewBox="0 0 60 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {direction === 'right' ? (
        <path 
          d="M2 10H58M58 10L52 4M58 10L52 16" 
          stroke="#FD8721" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      ) : (
        <path 
          d="M30 2V18M30 18L24 12M30 18L36 12" 
          stroke="#FD8721" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      )}
    </svg>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
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

        {/* Desktop Layout - 5 Column Grid with Horizontal Arrows */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Steps Container */}
            <div className="grid grid-cols-5 gap-8 items-start">
              {sortedSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center relative">
                  {/* Step Number Badge */}
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 z-10 relative">
                    {step.stepNumber || index + 1}
                  </div>
                  
                  {/* Step Image */}
                  {step.image && (
                    <div className="w-20 h-20 mb-4 flex items-center justify-center">
                      <img 
                        src={step.image.node.sourceUrl}
                        alt={step.image.node.altText || step.title || ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Step Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Horizontal Arrow - Show for all except last step */}
                  {index < sortedSteps.length - 1 && (
                    <div className="absolute top-6 left-full transform -translate-y-1/2 translate-x-4 z-0">
                      <Arrow direction="right" className="text-orange-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet Layout - 3 Column Grid with Mixed Arrows */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-3 gap-8">
            {sortedSteps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center relative">
                  {/* Step Number Badge */}
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {step.stepNumber || index + 1}
                  </div>
                  
                  {/* Step Image */}
                  {step.image && (
                    <div className="w-20 h-20 mb-4 flex items-center justify-center">
                      <img 
                        src={step.image.node.sourceUrl}
                        alt={step.image.node.altText || step.title || ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Step Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Arrow Logic for Tablet */}
                {index < sortedSteps.length - 1 && (
                  <div className="flex justify-center items-center">
                    {/* Horizontal arrow for same row, vertical for row breaks */}
                    {(index + 1) % 3 === 0 ? (
                      <Arrow direction="down" className="transform rotate-90" />
                    ) : (
                      <Arrow direction="right" />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile Layout - Vertical Stack with Down Arrows */}
        <div className="block md:hidden">
          <div className="space-y-8">
            {sortedSteps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center">
                  {/* Step Number Badge */}
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {step.stepNumber || index + 1}
                  </div>
                  
                  {/* Step Image */}
                  {step.image && (
                    <div className="w-24 h-24 mb-4 flex items-center justify-center">
                      <img 
                        src={step.image.node.sourceUrl}
                        alt={step.image.node.altText || step.title || ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Step Content */}
                  <div className="space-y-3 max-w-sm">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Vertical Arrow - Show for all except last step */}
                {index < sortedSteps.length - 1 && (
                  <div className="flex justify-center py-4">
                    <svg 
                      width="20" 
                      height="40" 
                      viewBox="0 0 20 40" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-orange-500"
                    >
                      <path 
                        d="M10 2V38M10 38L4 32M10 38L16 32" 
                        stroke="#FD8721" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for arrow animations */}
      <style jsx>{`
        .arrow {
          transition: all 0.3s ease;
        }
        
        .arrow:hover {
          transform: scale(1.1);
        }
        
        /* Responsive arrow sizing */
        @media (max-width: 768px) {
          .arrow {
            width: 40px;
            height: 16px;
          }
        }
        
        /* Add subtle animation to step cards */
        .step-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
};

export default ApproachBlock;