// src/components/GlobalBlocks/PhotoFrame.js
import React from 'react';

const PhotoFrame = ({ globalData }) => {
  // Return null if no data is provided
  if (!globalData) {
    return null;
  }

  const {
    frameImage,
    contentImage,
    subtitle,
    title,
    text,
    button,
    arrowImage
  } = globalData;
  
  // Handle legacy field names for backward compatibility
  const innerImage = contentImage || globalData.innerImage;
  const arrowIllustration = arrowImage || globalData.arrowIllustration;

  return (
    <section className="photo-frame-section py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Photo Frame */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative max-w-md w-full">
              {/* Frame Image */}
              {frameImage?.node?.sourceUrl && (
                <div className="relative">
                  <img
                    src={frameImage.node.sourceUrl}
                    alt={frameImage.node.altText || 'Photo frame'}
                    className="w-full h-auto relative z-10"
                  />
                  
                  {/* Inner Image/GIF positioned within frame */}
                  {innerImage?.node?.sourceUrl && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 z-0">
                      <img
                        src={innerImage.node.sourceUrl}
                        alt={innerImage.node.altText || 'Team photo'}
                        className="max-w-full max-h-full object-cover rounded-lg shadow-lg"
                        style={{
                          maxWidth: '85%',
                          maxHeight: '85%'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Fallback if no frame image */}
              {!frameImage?.node?.sourceUrl && innerImage?.node?.sourceUrl && (
                <div className="relative">
                  <img
                    src={innerImage.node.sourceUrl}
                    alt={innerImage.node.altText || 'Team photo'}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* Subtitle */}
            {subtitle && (
              <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
                {subtitle}
              </p>
            )}

            {/* Title */}
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {title}
              </h2>
            )}

            {/* Text - Expandable */}
            {text && (
              <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                {text.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            )}

            {/* Button */}
            {button?.url && button?.title && (
              <div className="pt-4">
                <a
                  href={button.url}
                  target={button.target === '_blank' ? '_blank' : '_self'}
                  rel={button.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  {button.title}
                  <svg 
                    className="ml-2 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </a>
              </div>
            )}

            {/* Arrow Illustration */}
            {arrowIllustration?.node?.sourceUrl && (
              <div className="pt-6">
                <img
                  src={arrowIllustration.node.sourceUrl}
                  alt={arrowIllustration.node.altText || 'Arrow illustration'}
                  className="max-w-xs h-auto"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .photo-frame-section {
          position: relative;
        }
        
        /* Ensure frame positioning works correctly */
        .relative {
          position: relative;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .photo-frame-section {
            padding: 4rem 0;
          }
        }
        
        @media (max-width: 768px) {
          .photo-frame-section {
            padding: 3rem 0;
          }
        }
        
        /* Animation for button hover */
        .inline-flex {
          transition: all 0.3s ease;
        }
        
        .inline-flex:hover {
          transform: translateY(-2px);
        }
        
        /* Text expansion styling */
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        
        /* Frame overlay positioning */
        .absolute.inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
      `}</style>
    </section>
  );
};

export default PhotoFrame;