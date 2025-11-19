# ClientShowcase Component

A reusable client showcase section with two-area layout: centered top section and left-aligned bottom section with decorative paper plane.

## Features

- ✅ Two-area layout: TOP (centered) and BOTTOM (left-aligned)
- ✅ Clean H2 title typography (NO underline - plain text)
- ✅ HUGE spacing between top and bottom areas (192px/128px)
- ✅ Standard CDA container with proper spacing
- ✅ Light background (bg-gray-50)
- ✅ Text link buttons with arrow icons
- ✅ Client logo grid (3 columns × 2 rows, left-aligned)
- ✅ Full-color logos (no grayscale) with hover opacity effect
- ✅ Decorative paper plane (400×400px, desktop only, right side)
- ✅ Fully responsive design

## Usage

```jsx
import ClientShowcase from '@/components/ClientShowcase';

// In your page component
<ClientShowcase />
```

## Location

Currently implemented in:
- `/services/[slug]/page.js` - Section 3 (after Services Grid)

## Customization

### Changing the Title

⚠️ **IMPORTANT**: The title is plain text with NO underline!

Edit the title in [ClientShowcase.jsx](./ClientShowcase.jsx):

```jsx
<h2 className="cda-title text-center mb-6 lg:mb-8">
  Your First Line Text Here,
  <br />
  Your Second Line Text Here
</h2>
```

Simply use a plain `<h2>` tag with a `<br />` for line breaks. No ResponsiveUnderlinedTitle component needed.

### Changing the CTA Link

Edit the `TextLinkButton` href and text:

```jsx
<TextLinkButton href="/your-custom-link" className="text-lg">
  Your Custom CTA Text
</TextLinkButton>
```

### Adding/Removing Client Logos

Edit the `clients` array in the component:

```jsx
const clients = [
  { name: 'Client Name', logo: '/images/clients/client-logo.svg' },
  // Add more clients here
];
```

### Logo Requirements

- **Format**: SVG or PNG recommended
- **Max Width**: 140px
- **Location**: `/public/images/clients/`
- **Naming**: Use kebab-case (e.g., `client-name.svg`)

### Changing Background Color

The component uses `bg-gray-50` by default. To change:

```jsx
<section className="client-showcase-section bg-white py-16 lg:py-20 relative overflow-hidden">
```

Replace `bg-gray-50` with any CDA color class:
- `bg-white`
- `bg-gray-50`
- `bg-gray-100`

## Design System Compliance

### Typography
- **Main Title**: H2 with ResponsiveUnderlinedTitle
  - Desktop: 38px
  - Mobile: 28px
- **Section Label**: Uppercase with letter-spacing
- **Section Heading**: H3 (text-2xl lg:text-3xl)

### Spacing
- **Section Padding**: py-16 lg:py-20
- **Container**: Uses `.cda-container` (1620px max-width, 38px horizontal padding)
- **Grid Gap**: gap-8 lg:gap-12

### Colors
- **Underline**: #FF60DF (brand-pink)
- **Label**: text-gray-500
- **Heading**: text-gray-900
- **Decoration**: #3CBEEB (brand-blue)

### Effects
- **Logo Hover**: Grayscale to full color transition (0.3s ease)
- **Opacity**: 0.6 default, 1.0 on hover

## Responsive Behavior

### Mobile (≤768px)
- 2-column logo grid
- Smaller gaps (gap-8)
- No decorative paper plane
- Stacked header (label, heading, link)

### Desktop (>768px)
- 3-column logo grid
- Larger gaps (gap-12)
- Decorative paper plane visible
- Horizontal header layout

## File Structure

```
src/
├── components/
│   ├── ClientShowcase.jsx           # Main component
│   ├── ClientShowcase.README.md     # This file
│   ├── ResponsiveUnderlinedTitle.js # Title component
│   └── ui/
│       └── TextLinkButton.jsx       # Link button component
public/
└── images/
    └── clients/
        ├── birkdale.svg
        ├── artisan-coffee.svg
        ├── segway.svg
        ├── braingain.svg
        ├── sentia.svg
        └── pro-gmn.svg
```

## Integration Example

```jsx
import ClientShowcase from '../../../components/ClientShowcase';

export default async function ServicePage({ params }) {
  return (
    <>
      <Header />
      <main>
        {/* Other sections */}

        {/* Section 3: Client Showcase */}
        <ClientShowcase />

        {/* More sections */}
      </main>
      <Footer />
    </>
  );
}
```

## Props (Future Enhancement)

The component can be extended to accept props:

```jsx
export default function ClientShowcase({
  title = "Default Title",
  clients = [],
  ctaText = "Default CTA",
  ctaHref = "/contact",
  backgroundColor = "bg-gray-50"
}) {
  // Component logic
}
```

## Notes

- Logo placeholders are SVG text. Replace with actual client logos when available.
- The decorative paper plane is a simple SVG illustration. Replace with actual design asset if needed.
- All transitions use CDA standard timing (0.3s ease).
- Component is client-side rendered (`'use client'`) for hover effects.
