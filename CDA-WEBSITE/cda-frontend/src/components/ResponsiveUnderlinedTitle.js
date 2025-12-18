/**
 * ResponsiveUnderlinedTitle - Automatic responsive title component
 *
 * H1 Typography:
 * - Desktop: 50px, strokeWidth: 11, offset: 4
 * - Mobile: 32px, strokeWidth: 8, offset: 6
 *
 * H2 Typography:
 * - Desktop: 38px, strokeWidth: 9, offset: 4
 * - Mobile: 28px, strokeWidth: 7, offset: 6
 *
 * H3 Typography (New - Locations):
 * - Desktop: 45px, strokeWidth: 9, offset: inferred 37
 * - Mobile: 28px, strokeWidth: 7, offset: 22
 *
 * Note: Offset values may need visual adjustment
 */

'use client';

import { useState, useEffect } from 'react';
import UnderlinedTitle from './UnderlinedTitle';

export default function ResponsiveUnderlinedTitle({
  as = 'h2',
  children,
  className = '',
  underlineColor = '#FF5C8A',
  ...props
}) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Avoid hydration mismatch by only checking mobile after mount
  useEffect(() => {
    setMounted(true);
    // Check if window is defined (client-side only)
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Determine if this is H1 or H2 or H3 based on 'as' prop
  const isH1 = as === 'h1';
  const isH3 = as === 'h3';

  let responsiveProps = {};

  if (isH1) {
    responsiveProps = {
      strokeWidth: (mounted && isMobile) ? 8 : 11,
      underlineOffset: (mounted && isMobile) ? 25 : 41,
      size: (mounted && isMobile) ? 'small' : 'large'
    };
  } else if (isH3) {
    responsiveProps = {
      strokeWidth: (mounted && isMobile) ? 7 : 9,
      underlineOffset: (mounted && isMobile) ? 22 : 37, // 37 is approx interpolated between 32 and 41 based on 45px font
      size: (mounted && isMobile) ? 'small' : 'medium'
    };
  } else {
    // Default to H2
    responsiveProps = {
      strokeWidth: (mounted && isMobile) ? 7 : 9,
      underlineOffset: (mounted && isMobile) ? 22 : 32,
      size: (mounted && isMobile) ? 'small' : 'medium'
    };
  }

  return (
    <UnderlinedTitle
      as={as}
      className={className}
      underlineColor={underlineColor}
      {...responsiveProps}
      {...props}
    >
      {children}
    </UnderlinedTitle>
  );
}
