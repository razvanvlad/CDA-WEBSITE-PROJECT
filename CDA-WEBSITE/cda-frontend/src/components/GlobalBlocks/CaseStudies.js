'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import TextLinkButton from '../ui/TextLinkButton';
import ResponsiveUnderlinedTitle from '../ResponsiveUnderlinedTitle';

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
const CaseStudies = ({ globalData, pageData, useOverride = false, serviceColor }) => {
  // Logic: 
  // 1. If overrides enabled AND pageData exists AND it has studies => Use pageData
  // 2. Otherwise (no override needed OR local data empty) => Use globalData
  const hasLocalStudies = useOverride && pageData?.selectedStudies?.nodes?.length > 0;
  const data = hasLocalStudies ? pageData : globalData;

  // Don't render if no data (neither local nor global)
  if (!data) {
    return null;
  }

  const {
    title,
    subtitle,
    knowledgeHubLink,
    selectedStudies
  } = data || {};


  // Don't render if no essential content
  if (!title && !subtitle && (!selectedStudies?.nodes || selectedStudies.nodes.length === 0)) {
    return null;
  }

  const studies = selectedStudies?.nodes || [];

  // Track if we're on desktop to conditionally apply reverse layout
  const [isDesktop, setIsDesktop] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1025);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Scroll-triggered overlay animation using Intersection Observer
  useEffect(() => {
    // Skip if window undefined (SSR safety)
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get all image containers
    const mediaElements = document.querySelectorAll('.cs-media');

    // Track which elements have animated (prevent double-triggering in React strict mode)
    const animatedElements = new Set();

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger only once when entering viewport
          if (entry.isIntersecting && !animatedElements.has(entry.target)) {
            animatedElements.add(entry.target);

            // Add class to trigger animation (skip if reduced motion)
            if (!prefersReducedMotion) {
              entry.target.classList.add('cs-media-animate');
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    // Observe all media elements
    mediaElements.forEach(element => observer.observe(element));

    // Cleanup
    return () => {
      mediaElements.forEach(element => observer.unobserve(element));
      observer.disconnect();
    };
  }, []); // Empty dependency - run once on mount

  return (
    <section className="home-case-studies py-20">
      <div className="cda-container">
        {/* Header: left subtitle + title, right CTA (empty box style) */}
        <div className="cs-header">
          <div className="cs-head-left">
            {subtitle && (
              <p className="cda-subtitle">{subtitle}</p>
            )}
            {title && (
              <ResponsiveUnderlinedTitle
                as="h2"
                underlineColor={serviceColor || "#FD8721"}
                className="section-title my-4"
              >
                {title}
              </ResponsiveUnderlinedTitle>
            )}
          </div>
          {knowledgeHubLink && (
            <TextLinkButton
              href={knowledgeHubLink.url}
              className="cs-header-cta mb-2"
              target={knowledgeHubLink.target || '_self'}
            >
              {knowledgeHubLink.title}
            </TextLinkButton>
          )}
        </div>

        {/* Selected Case Studies - Alternating two-up layout */}
        {studies.length > 0 && (
          <div className="cs-list" style={{ marginBottom: '3rem' }}>
            {studies.slice(0, 2).map((study, index) => (
              <article key={study.id || index} className={`cs-item ${index % 2 === 1 && isDesktop ? 'cs-item--reverse' : ''}`}>
                <div className="cs-media mb-2">
                  {study.featuredImage?.node?.sourceUrl ? (
                    <Image
                      src={study.featuredImage.node.sourceUrl}
                      alt={study.featuredImage.node.altText || study.title}
                      width={640}
                      height={400}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                      className="cs-img"
                      unoptimized
                    />
                  ) : (
                    <div className="cs-img bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="cs-content">
                  <h3 className="cs-title mb-4">{study.title}</h3>
                  <div className="cs-excerpt mb-2" dangerouslySetInnerHTML={{ __html: study.excerpt }} />
                  <Link href={`/case-studies/${study.slug}`} className="button-l-transparent mt-5">Read Case Study</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;
