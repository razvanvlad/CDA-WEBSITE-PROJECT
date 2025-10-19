'use client';
import React from 'react';
import Image from 'next/image';

const ApproachBlock = ({ globalData, pageData, useOverride = false }) => {
  const data = useOverride && pageData ? pageData : globalData;
  if (!data?.steps?.length) return null;

  const steps = [...data.steps].sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));

  // Desktop arrow images with original dimensions
  const desktopArrows = [
    { src: '/images/approach/desktop/step1.png', width: 116, height: 103 },
    { src: '/images/approach/desktop/step2.png', width: 213, height: 296 },
    { src: '/images/approach/desktop/step3.png', width: 116, height: 195 },
    { src: '/images/approach/desktop/step4.png', width: 420, height: 393 },
  ];

  // Mobile arrow images
  const mobileArrows = [
    '/images/approach/mobile/mobile-step1.png',
    '/images/approach/mobile/mobile-step2.png',
    '/images/approach/mobile/mobile-step3.png',
    '/images/approach/mobile/mobile-step4.png',
  ];

  // Desktop step positions - Adjust these values to move step cards
  // Format: { top: 'vertical position', left: 'horizontal position from left edge' }
  const desktopPositions = [
    { top: '20px', left: '0%' },      // STEP 1 (Discovery & Strategy) - Top-left
    { top: '290px', left: '23%' },    // STEP 2 (Creative Design) - Bottom-left
    { top: '-180px', left: '37%' },     // STEP 3 (Development & Integration) - 
    { top: '225px', left: '59%' },    // STEP 4 (Launch & Optimisation) - Bottom-right
    { top: '-120px', left: '82%' }      // STEP 5 (Growth & Support) - Top-right
  ];

  // Desktop arrow positions - Adjust these to change arrow placement and angle
  // Format: { top: 'vertical position', left: 'horizontal position', rotation: 'angle in degrees' }
  const desktopArrowPositions = [
    { top: '258px', left: '17%', rotation: '-5deg' },   // ARROW 1→2 
    { top: '58px', left: '32%', rotation: '0deg' },    // ARROW 2→3 
    { top: '30px', left: '61%', rotation: '0deg' },   // ARROW 3→4
    { top: '150px', left: '80%', rotation: '0deg' }     // ARROW 4→5 
  ];

  return (
    <section className="py-16 my-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 md:mb-16">
          {data.subtitle && (
            <h2 className="cda-subtitle">
              {data.subtitle}
            </h2>
          )}
          {data.title && (
            <p className="cda-title">
              {data.title}
            </p>
          )}
        </div>

        {/* Desktop: Flowing layout with absolute positioning */}
        <div className="hidden lg:block relative min-h-[550px]">
          <div className="relative">
            {steps.map((step, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  // Position for: {step.title || `Step ${i + 1}`}
                  top: desktopPositions[i]?.top || '0px',
                  left: desktopPositions[i]?.left || '0%'
                }}
              >
                {/* Step Box - displays at original image size */}
                <div className="relative rounded-md flex items-end justify-center">
                  <div className="absolute top-3 left-3 text-gray-300 font-extrabold text-2xl select-none">
                    {/* {String(step.stepNumber || i + 1).padStart(2, '0')} */}
                  </div>

                  {step?.image?.node?.sourceUrl && (
                    <img
                      src={step.image.node.sourceUrl}
                      alt={step.image.node.altText || step.title || ''}
                      style={{ display: 'block' }}
                    />
                  )}
                </div>

                {/* Step Title and Description */}
                <div className="text-center mt-6">
                  {step.title && (
                    <h3 className="cda-subtitle text-lg">
                      {step.title}
                    </h3>
                  )}
                  {step.description && (
                    <p className="mt-1 text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop PNG Arrows - positioned to flow between steps */}
          {desktopArrows.map((arrow, i) => (
            <img
              key={i}
              src={arrow.src}
              alt=""
              className="absolute pointer-events-none"
              style={{
                // Arrow {i + 1} connecting steps {i + 1} → {i + 2} (Original size: {arrow.width}x{arrow.height}px)
                top: desktopArrowPositions[i]?.top || '100px',
                left: desktopArrowPositions[i]?.left || '20%',
                transform: `rotate(${desktopArrowPositions[i]?.rotation || '0deg'})`,
                width: `${arrow.width}px`,
                height: `${arrow.height}px`,
                zIndex: 1
              }}
            />
          ))}
        </div>

        {/* Mobile & Tablet: Vertical stacked layout with PNG arrows */}
        <div className="lg:hidden space-y-12 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col relative">
              <div className="relative bg-gray-100 rounded-md w-full h-56 flex items-end justify-center overflow-hidden">
                <div className="absolute top-3 left-3 text-gray-300 font-extrabold text-2xl select-none">
                  {String(step.stepNumber || i + 1).padStart(2, '0')}
                </div>

                {step?.image?.node?.sourceUrl && (
                  <Image
                    src={step.image.node.sourceUrl}
                    alt={step.image.node.altText || step.title || ''}
                    width={420}
                    height={320}
                    sizes="90vw"
                    className="w-auto h-[78%] object-contain"
                    priority={i === 0}
                  />
                )}
              </div>

              {step.title && (
                <h3 className="cda-subtitle mt-4 text-lg text-center">
                  {step.title}
                </h3>
              )}
              {step.description && (
                <p className="mt-1 text-gray-600 leading-relaxed text-center">
                  {step.description}
                </p>
              )}

              {/* Mobile Arrow - positioned between steps */}
              {i < steps.length - 1 && (
                <div className="flex justify-center my-6">
                  <img
                    src={mobileArrows[i]}
                    alt=""
                    className="w-auto"
                    style={{
                      // Placeholder positions - adjust these values manually
                      maxWidth: '80px',
                      height: 'auto',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachBlock;
