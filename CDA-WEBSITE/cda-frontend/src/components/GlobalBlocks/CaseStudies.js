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
    <section className="home-case-studies" style={{padding: '5rem 1rem'}}>
      <div style={{maxWidth: '1620px', margin: '0 auto'}}>
        {/* Header: left subtitle + title, right CTA (empty box style) */}
        <div className="cs-header">
          <div className="cs-head-left">
            {subtitle && (
              <p className="cda-subtitle">{subtitle}</p>
            )}
            {title && (
              <h2 className="cda-title title-small-orange">{title}</h2>
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
          <div className="cs-list" style={{marginBottom: '3rem'}}>
            {studies.slice(0, 2).map((study, index) => (
              <article key={study.id || index} className={`cs-item ${index % 2 === 1 ? 'cs-item--reverse' : ''}`}>
                <div className="cs-media">
                  {study.featuredImage?.node?.sourceUrl && (
                    <Image
                      src={study.featuredImage.node.sourceUrl}
                      alt={study.featuredImage.node.altText || study.title}
                      width={640}
                      height={400}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                      className="cs-img"
                    />
                  )}
                </div>
                <div className="cs-content">
                  <h3 className="cs-title">{study.title}</h3>
                  <div className="cs-excerpt" dangerouslySetInnerHTML={{__html: study.excerpt}} />
                  <a href={study.uri} className="button-l button-l--white cs-cta">Read Case Study</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
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

        .cs-header-cta {
          flex-shrink: 0;
        }

        .cs-list {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .cs-item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .cs-item--reverse {
          grid-template-columns: 1fr 1fr;
        }

        .cs-item--reverse .cs-media {
          order: 2;
        }

        .cs-item--reverse .cs-content {
          order: 1;
        }

        .cs-media {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border-radius: 12px;
        }

        .cs-content {
          padding: 2rem 0;
        }

        .cs-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .cs-excerpt {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .cs-excerpt p {
          margin-bottom: 1rem;
        }

        .cs-excerpt p:last-child {
          margin-bottom: 0;
        }

        .cs-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .cs-cta:hover {
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cs-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 2.5rem;
            gap: 1.5rem;
          }

          .cs-item {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .cs-item--reverse {
            grid-template-columns: 1fr;
          }

          .cs-item--reverse .cs-media,
          .cs-item--reverse .cs-content {
            order: initial;
          }

          .cs-content {
            padding: 1rem 0;
          }

          .cs-title {
            font-size: 1.75rem;
            margin-bottom: 1rem;
          }

          .cs-excerpt {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .cs-list {
            gap: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .home-case-studies {
            padding: 3rem 1rem !important;
          }

          .cs-title {
            font-size: 1.5rem;
          }

          .cs-excerpt {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CaseStudies;
