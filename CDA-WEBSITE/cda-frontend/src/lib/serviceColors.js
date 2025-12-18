// Centralized service color management system
// Single source of truth for service-to-color mapping across the application

import COLORS from '../constants/colors';

// Centralized service color mapping
export const SERVICE_COLORS = {
  'ecommerce': COLORS.BLUE,              // #3CBEEB
  'b2b-lead-generation': COLORS.PURPLE,  // #AD80F9
  'software-development': COLORS.GREEN,  // #01E486
  'booking-systems': COLORS.ORANGE,      // #FD8721
  'digital-marketing': COLORS.PINK,      // #FF60DF
  'outsourced-cmo': COLORS.REDISH_PINK, // #FF5C8A
  'ai': COLORS.BLUE                      // #3CBEEB
};

/**
 * Get service color by slug
 * @param {string} slug - Service slug (e.g., 'ecommerce', 'digital-marketing')
 * @returns {string} - Hex color code
 */
export function getServiceColor(slug) {
  if (!slug) return COLORS.PURPLE; // Default fallback
  return SERVICE_COLORS[slug] || COLORS.PURPLE;
}

/**
 * Convert service slug to title case
 * Handles special cases like B2B, AI, CMO
 * @param {string} slug - Service slug (e.g., 'b2b-lead-generation')
 * @returns {string} - Title case string (e.g., 'B2B Lead Generation')
 */
export function getServiceTitle(slug) {
  if (!slug) return '';

  // Handle special cases
  const specialCases = {
    'b2b-lead-generation': 'B2B Lead Generation',
    'ai': 'AI',
    'outsourced-cmo': 'Outsourced CMO',
  };

  if (specialCases[slug]) return specialCases[slug];

  // Default: capitalize each word
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
