import React from 'react';
import Image from 'next/image';

/**
 * TechnologiesSlider Component
 * 
 * Displays a technologies slider with:
 * - Subtitle
 * - Title
 * - Logo images in a slider/grid layout
 * 
 * @param {Object} props - Component props
 * @param {string} props.subtitle - Section subtitle
 * @param {string} props.title - Section title
 * @param {Array} props.logos - Array of logo objects with image data
 * @returns {JSX.Element} TechnologiesSlider component
 */
const TechnologiesSlider = ({ subtitle, title, logos }) => {
  // Don't render if no data
  if (!subtitle && !title && (!logos || logos.length === 0)) {
    return null;
  }

  return (
    <section className="technologies-slider">
      <div className="container">
        {/* Header Section */}
        <div className="technologies-header">
          {subtitle && (
            <p className="technologies-subtitle">{subtitle}</p>
          )}
          {title && (
            <h2 className="technologies-title">{title}</h2>
          )}
        </div>

        {/* Logos Grid/Slider */}
        {logos && logos.length > 0 && (
          <div className="technologies-logos">
            <div className="logos-grid">
              {logos.map((logo, index) => (
                <div key={index} className="logo-item">
                  {logo?.url && (
                    <Image
                      src={logo.url}
                      alt={logo.alt || `Technology ${index + 1}`}
                      width={120}
                      height={80}
                      className="logo-image"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .technologies-slider {
          padding: 80px 0;
          background: #f8f9fa;
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .technologies-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .technologies-subtitle {
          font-size: 16px;
          font-weight: 500;
          color: #6c757d;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .technologies-title {
          font-size: 42px;
          font-weight: 700;
          color: #212529;
          margin: 0;
          line-height: 1.2;
        }

        .technologies-logos {
          position: relative;
        }

        .logos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 40px;
          align-items: center;
          justify-items: center;
        }

        .logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          min-height: 120px;
        }

        .logo-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .logo-image {
          max-width: 100%;
          height: auto;
          object-fit: contain;
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }

        .logo-item:hover .logo-image {
          filter: grayscale(0%);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .technologies-slider {
            padding: 60px 0;
          }

          .container {
            padding: 0 16px;
          }

          .technologies-header {
            margin-bottom: 40px;
          }

          .technologies-title {
            font-size: 32px;
          }

          .logos-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
          }

          .logo-item {
            padding: 15px;
            min-height: 100px;
          }
        }

        @media (max-width: 480px) {
          .technologies-title {
            font-size: 28px;
          }

          .logos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default TechnologiesSlider;