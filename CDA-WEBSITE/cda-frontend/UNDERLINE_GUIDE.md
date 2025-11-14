# UnderlinedTitle Component - Quick Reference Guide

## Metadata
- **Status**: ACTIVE
- **Category**: GUIDE
- **Last Modified**: October 28, 2025, 1:33:19 PM
- **Last Verified**: November 14, 2025 (Documentation Audit - Corrected SVG implementation info)
- **Related Files**: IMPLEMENTATION_PROGRESS.md, SIZING_REFERENCE.md, CURRENT_STATUS.md
- **Code Dependencies**: `src/components/UnderlinedTitle.tsx`, `src/constants/colors.ts`

## Last Modified
Tuesday, October 28, 2025, 1:33:19 PM

## Overview
The `UnderlinedTitle` component provides a simple, consistent way to add curved SVG underlines to titles across the site.

## Default Values
- **Color:** `#FF5C8A` (brand-redish-pink)
- **Thickness:** `4px`
- **Offset:** `3px` (close to text)
- **Element:** `<h2>`

---

## Basic Usage

### 1. Default (Most Common)
```jsx
<UnderlinedTitle className="text-2xl font-bold">
  Section Title
</UnderlinedTitle>
```
Output: H2 with redish-pink underline, 4px thick, 3px offset

---

### 2. Different Heading Level
```jsx
<UnderlinedTitle
  as="h1"
  className="text-4xl font-bold"
>
  Page Title
</UnderlinedTitle>
```

```jsx
<UnderlinedTitle
  as="h3"
  className="text-xl font-semibold"
>
  Subsection
</UnderlinedTitle>
```

---

### 3. Different Color
```jsx
import { COLORS } from '@/constants/colors';

<UnderlinedTitle
  className="text-2xl font-bold"
  underlineColor={COLORS.BLUE}
>
  Blue Title
</UnderlinedTitle>
```

Or with hex directly:
```jsx
<UnderlinedTitle
  className="text-2xl font-bold"
  underlineColor="#3CBEEB"
>
  Blue Title
</UnderlinedTitle>
```

---

### 4. Custom Thickness/Offset
```jsx
<UnderlinedTitle
  className="text-3xl font-bold"
  underlineThickness={5}
  underlineOffset={2}
>
  Custom Underline
</UnderlinedTitle>
```

---

## Available Colors

### Import from constants:
```jsx
import { COLORS } from '@/constants/colors';

COLORS.BLUE          // #3CBEEB
COLORS.GREEN         // #01E486
COLORS.ORANGE        // #FD8721
COLORS.PINK          // #FF60DF
COLORS.REDISH_PINK   // #FF5C8A (default)
```

### Tailwind classes (for text/background):
```jsx
className="text-brand-blue"         // #3CBEEB
className="text-brand-green"        // #01E486
className="text-brand-orange"       // #FD8721
className="text-brand-pink"         // #FF60DF
className="text-brand-redish-pink"  // #FF5C8A

className="bg-brand-blue"           // Background colors
className="border-brand-green"      // Border colors
```

---

## Common Use Cases

### Hero Section
```jsx
<UnderlinedTitle
  as="h1"
  className="text-4xl lg:text-5xl font-bold mb-6"
>
  Welcome to CDA
</UnderlinedTitle>
```

### Section Header
```jsx
<UnderlinedTitle
  as="h2"
  className="text-3xl font-bold mb-8"
  underlineColor="#3CBEEB"
>
  Our Services
</UnderlinedTitle>
```

### Card Title
```jsx
<UnderlinedTitle
  as="h3"
  className="text-xl font-semibold mb-4"
>
  Software Development
</UnderlinedTitle>
```

### Modal Title
```jsx
<UnderlinedTitle className="text-2xl font-bold text-gray-900 mb-4">
  Book Time With Us
</UnderlinedTitle>
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required.** Title text |
| `className` | `string` | `''` | Additional CSS classes |
| `underlineColor` | `string` | `'#FF5C8A'` | Hex color for underline |
| `underlineThickness` | `number` | `4` | Thickness in pixels |
| `underlineOffset` | `number` | `3` | Distance from text in pixels |
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'span' \| 'div'` | `'h2'` | HTML element to render |

---

## Examples

### Example 1: Homepage Hero (Blue)
```jsx
<UnderlinedTitle
  as="h1"
  className="text-5xl font-bold"
  underlineColor="#3CBEEB"
>
  Digital Marketing Solutions
</UnderlinedTitle>
```

### Example 2: About Page (Pink)
```jsx
<UnderlinedTitle
  as="h1"
  className="text-5xl font-bold"
  underlineColor="#FF60DF"
>
  About Our Agency
</UnderlinedTitle>
```

### Example 3: Service Card (Green)
```jsx
<UnderlinedTitle
  as="h3"
  className="text-2xl font-bold mb-4"
  underlineColor="#01E486"
>
  Web Development
</UnderlinedTitle>
```

### Example 4: Default Styling
```jsx
<UnderlinedTitle className="text-2xl font-bold mb-6">
  Contact Us Today
</UnderlinedTitle>
```

---

## Migration from Old System

### Before (Old curved underline):
```jsx
<h2 className="cda-page-title title-large-pink">
  Section Title
</h2>
```

### After (New straight underline):
```jsx
<UnderlinedTitle
  as="h2"
  className="text-3xl font-bold"
  underlineColor="#FF5FA0"
>
  Section Title
</UnderlinedTitle>
```

---

## Notes

- The component uses **SVG curved underlines** with quadratic bezier paths (NOT CSS text-decoration)
- Underlines feature **smooth curves** for visual appeal (not straight lines)
- Fully responsive with multi-line support - uses ResizeObserver for dynamic measurements
- Automatically measures text width and adjusts curves for each line
- Accessible - maintains semantic HTML heading structure
- Works with all Tailwind utility classes
- Technical implementation: SVG path formula `M 0 ${startY} Q ${lineWidth / 2} ${controlY} ${lineWidth} ${endY}`
- Curve intensity controlled via `curveIntensity` prop (default: 0.01)

---

## Need Help?

- Check [src/components/UnderlinedTitle.tsx](src/components/UnderlinedTitle.tsx) for implementation
- Check [src/constants/colors.ts](src/constants/colors.ts) for color values
- See [BookingModal.js](src/components/BookingModal.js) for real-world example
