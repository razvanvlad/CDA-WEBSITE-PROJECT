'use client';

import React from 'react';
import Image from 'next/image';

/**
 * CaseStudies Global Block Component
 * 
 * Displays case studies with alternating two-up layout:
 * - Header with subtitle, title, and CTA link
 * - Selected case studies in alternating layout (max 2)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.globalData - Case studies data from WordPress
 * @returns {JSX.Element} CaseStudies component
 */
const CaseStudies = ({ globalData }) => {
  // Don't render if no data
  if (!globalData) {
    return null;
  }

  const {
    title,
    subtitle,
    knowledgeHubLink,
    selectedStudies
  } = globalData;

  // Don't render if no essential content
  if (!title && !subtitle && (!selectedStudies?.nodes || selectedStudies.nodes.length === 0)) {
    return null;
  }

  const studies = selectedStudies?.nodes || [];

  return (
    <section className="home-case-studies">
      <div className="cs-container">
        {/* Header: left subtitle + title, right CTA (empty box style) */}
        <div className="cs-header">
          <div className="cs-head-left">
            {subtitle && (
              <p className="cda-subtitle">{subtitle}</p>
            )}
            {title && (
              <h2 className="cda-title">
                {(() => {
                  // Split title to apply orange underline to "Case Studies" only
                  const titleLower = title.toLowerCase();
                  const caseStudiesIndex = titleLower.indexOf('case studies');

                  if (caseStudiesIndex !== -1) {
                    const before = title.substring(0, caseStudiesIndex);
                    const caseStudies = title.substring(caseStudiesIndex, caseStudiesIndex + 'case studies'.length);
                    const after = title.substring(caseStudiesIndex + 'case studies'.length);

                    return (
                      <>
                        {before && <span className="cs-title-plain">{before}</span>}
                        <span className="cs-title-underline">{caseStudies}</span>
                        {after && <span className="cs-title-plain">{after}</span>}
                      </>
                    );
                  }

                  return <span className="cs-title-plain">{title}</span>;
                })()}
              </h2>
            )}
          </div>
          {knowledgeHubLink && (
            <a
              href={knowledgeHubLink.url}
              className="button-without-box cs-header-cta"
              target={knowledgeHubLink.target || '_self'}
            >
              {knowledgeHubLink.title}
            </a>
          )}
        </div>
        
        {/* Selected Case Studies - Alternating two-up layout */}
        {studies.length > 0 && (
          <div className="cs-list">
            {studies.slice(0, 2).map((study, index) => (
              <article key={study.id || index} className={`cs-item ${index % 2 === 1 ? 'cs-item--reverse' : ''}`}>
                <div className="cs-media">
                  {study.featuredImage?.node?.sourceUrl && (
                    <Image
                      src={study.featuredImage.node.sourceUrl}
                      alt={study.featuredImage.node.altText || study.title}
                      width={800}
                      height={500}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="cs-img"
                      priority={index === 0}
                    />
                  )}
                </div>
                <div className="cs-content">
                  <h3 className="cs-case-title">{study.title}</h3>
                  <div className="cs-excerpt" dangerouslySetInnerHTML={{__html: study.excerpt}} />
                  <a href={study.uri} className="cs-cta">View Project</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .home-case-studies {
          padding: 5rem 1rem;
          background: #ffffff;
        }

        .cs-container {
          max-width: 1620px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .cs-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4rem;
          gap: 2rem;
        }

        .cs-head-left {
          flex: 1;
        }

        .cs-title-plain {
          color: #000000;
        }

        .cs-title-underline {
          position: relative;
          color: #000000;
        }

        .cs-title-underline::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 8px;
          height: 12px;
          background-color: #FF6B35;
          z-index: -1;
        }

        .cs-header-cta {
          flex-shrink: 0;
          align-self: center;
        }

        .cs-list {
          display: flex;
          flex-direction: column;
          gap: 5rem;
          margin-top: 3rem;
        }

        .cs-item {
          display: grid;
          grid-template-columns: 40fr 60fr;
          gap: 3rem;
          align-items: center;
        }

        .cs-item--reverse {
          grid-template-columns: 60fr 40fr;
        }

        .cs-item--reverse .cs-media {
          order: 1;
        }

        .cs-item--reverse .cs-content {
          order: 2;
        }

        .cs-media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: visible;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .cs-media :global(.cs-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
          transform: rotateY(-15deg) rotateX(5deg);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .cs-content {
          padding: 2rem 0;
          text-align: center;
        }

        .cs-case-title {
          font-family: var(--font-poppins), sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }

        .cs-excerpt {
          color: #666666;
          font-family: var(--font-inter), sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .cs-excerpt :global(p) {
          margin-bottom: 1rem;
        }

        .cs-excerpt :global(p:last-child) {
          margin-bottom: 0;
        }

        .cs-cta {
          display: inline-block;
          padding: 14px 32px;
          background: #ffffff;
          border: 2px solid #000000;
          color: #000000;
          font-family: var(--font-poppins), sans-serif;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 0;
        }

        .cs-cta:hover {
          background: #000000;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .cs-item,
          .cs-item--reverse {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .cs-item--reverse .cs-media,
          .cs-item--reverse .cs-content {
            order: initial;
          }

          .cs-media :global(.cs-img) {
            transform: none;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }
        }

        @media (max-width: 768px) {
          .home-case-studies {
            padding: 3rem 1rem;
          }

          .cs-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 2.5rem;
            gap: 1.5rem;
          }

          .cs-header-cta {
            align-self: flex-start;
          }

          .cs-content {
            padding: 1rem 0;
            text-align: left;
          }

          .cs-case-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .cs-excerpt {
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }

          .cs-list {
            gap: 3rem;
          }

          .cs-title-underline::after {
            bottom: 4px;
            height: 8px;
          }
        }

        @media (max-width: 480px) {
          .cs-case-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CaseStudies;
