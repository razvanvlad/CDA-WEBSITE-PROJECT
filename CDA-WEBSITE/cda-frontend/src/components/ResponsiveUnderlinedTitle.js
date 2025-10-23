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
 * Note: Offset values may need visual adjustment
 */

'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import UnderlinedTitle from './UnderlinedTitle';

export default function ResponsiveUnderlinedTitle({
  as = 'h2',
  children,
  className = '',
  underlineColor = '#FF5C8A',
  size,
  ...props
}) {
  const isMobile = useIsMobile();

  // Determine if this is H1 or H2 based on 'as' prop
  const isH1 = as === 'h1';

  // Set responsive values based on heading level
  const responsiveProps = isH1
    ? {
      strokeWidth: isMobile ? 8 : 11,
      underlineOffset: isMobile ? 25 : 41,
      size: isMobile ? 'small' : 'large'
    }
    : {
      strokeWidth: isMobile ? 7 : 9,
      underlineOffset: isMobile ? 22 : 32,
      size: isMobile ? 'small' : 'medium'
    };

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
