'use client';
import React from 'react';

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

  const desktopPositions = [
    { top: '20px', left: '0%' },      // STEP 1 (Discovery & Strategy) - Top-left
    { top: '290px', left: '23%' },    // STEP 2 (Creative Design) - Bottom-left
    { top: '-180px', left: '37%' },     // STEP 3 (Development & Integration) - 
    { top: '225px', left: '59%' },    // STEP 4 (Launch & Optimisation) - Bottom-right
    { top: '-120px', left: '82%' }      // STEP 5 (Growth & Support) - Top-right
  ];

  const desktopArrowPositions = [
    { top: '258px', left: '17%', rotation: '-5deg' },   // ARROW 1→2
    { top: '58px', left: '32%', rotation: '0deg' },    // ARROW 2→3
    { top: '30px', left: '61%', rotation: '0deg' },   // ARROW 3→4
    { top: '150px', left: '80%', rotation: '0deg' }     // ARROW 4→5
  ];

  const mobilePositions = [
    { marginTop: '0px' },       // STEP 1 (Discovery & Strategy) - First item
    { marginTop: '-30px' },      // STEP 2 (Creative Design) - reduced from 60px
    { marginTop: '-20px' },      // STEP 3 (Development & Integration) - reduced from 60px
    { marginTop: '-16px' },      // STEP 4 (Launch & Optimisation) - reduced from 60px
    { marginTop: '-20px' }       // STEP 5 (Growth & Support) - reduced from 60px
  ];

  const mobileArrowPositions = [
    { marginTop: '-10px', marginLeft: '10px' },    // ARROW 1→2 - reduced from 30px
    { marginTop: '-25px', marginLeft: '150px' },   // ARROW 2→3 - reduced from 30px
    { marginTop: '-18px', marginLeft: '10px' },    // ARROW 3→4 - reduced from 30px
    { marginTop: '-10px', marginLeft: '172px' }    // ARROW 4→5 - reduced from 30px
  ];

  return (
    <section className="py-16 my-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 md:mb-16 text-center lg:text-left">
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

        {/*
          MOBILE LAYOUT - Manual Adjustment Guide:

          TO ADJUST STEP CARD SPACING:
          - Edit the 'mobilePositions' array above (around line 48)
          - 'marginTop': Controls vertical spacing between steps

          TO ADJUST ARROW POSITIONS:
          - Edit the 'mobileArrowPositions' array above (around line 58)
          - 'marginTop': Vertical spacing from previous element
          - 'marginLeft': Horizontal offset (useful for alternating left/right)

          LAYOUT STRUCTURE:
          - Image: Left column (fixed width)
          - Number + Title + Description: Right column (flexible width)
          - Arrow: Centered between steps
        */}

        {/* Mobile & Tablet: 2-column layout (image left, content right) */}
        <div className="lg:hidden relative" style={{ zIndex: 0 }}>
          {steps.map((step, i) => (
            <div key={i}>
              {/* Step Row - 2 Column Layout */}
              <div
                className="flex gap-6 items-start relative"
                style={{
                  marginTop: mobilePositions[i]?.marginTop || '0px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  zIndex: 1
                }}
              >
                {/* Left Column: Image with background */}
                <div className="flex-shrink-0" style={{ width: '45%' }}>
                  <div className="relative bg-gray-100 rounded-md w-full flex items-center justify-center overflow-hidden p-4" style={{ aspectRatio: '1/1' }}>
                    {step?.image?.node?.sourceUrl && (
                      <img
                        src={step.image.node.sourceUrl}
                        alt={step.image.node.altText || step.title || ''}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Right Column: Number, Title, Description */}
                <div className="flex-1 pt-4 flex flex-col justify-center">
                  {/* Step Number */}
                  <div
                    className="text-gray-300 mb-3"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      lineHeight: '1'
                    }}
                  >
                    {String(step.stepNumber || i + 1).padStart(2, '0')}
                  </div>

                  {/* Step Title */}
                  {step.title && (
                    <h3
                      className="leading-tight mb-0"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '20px',
                        textAlign: 'left',
                        lineHeight: '1.2'
                      }}
                    >
                      {step.title}
                    </h3>
                  )}

                  {/* Step Description */}
                  {step.description && (
                    <p
                      className="text-gray-600 mt-2"
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        textAlign: 'center'
                      }}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div
                  className="flex relative"
                  style={{
                    marginTop: mobileArrowPositions[i]?.marginTop || '30px',
                    marginLeft: mobileArrowPositions[i]?.marginLeft || '0px',
                    marginBottom: '0px',
                    zIndex: 10
                  }}
                >
                  <img
                    src={mobileArrows[i]}
                    alt=""
                    className="w-auto h-auto"
                    style={{
                      maxWidth: '80px',
                      maxHeight: '88px'
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
