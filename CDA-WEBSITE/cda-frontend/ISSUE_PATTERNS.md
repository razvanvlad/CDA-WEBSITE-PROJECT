# Common Issue Patterns & Solutions

## Metadata
- **Status**: ACTIVE
- **Category**: GUIDE
- **Last Modified**: November 14, 2025
- **Last Verified**: November 14, 2025 (Created during Documentation Audit)
- **Related Files**: PROJECT_REQUIREMENTS.md, tasks/CDA-5/CDA-5-TASKS.md
- **Code Dependencies**: Various components across the codebase

---

## Overview

This document catalogs common bug patterns identified in the CDA website project, particularly from Jira tickets CDA-56 through CDA-65. Understanding these patterns helps prevent similar issues and speeds up debugging.

---

## Pattern 1: Mobile Padding Inconsistency

### Frequency
**Very High** - Affects 8+ pages across the site

### Symptoms
- Sections have varying padding on mobile (some 20px, others 16px, others custom values)
- Content doesn't align properly across sections
- Visual inconsistency creates unprofessional appearance
- Some content too close to screen edges, others too far

### Root Cause
```jsx
// ❌ Problem: Hardcoded padding values
<section style={{ padding: '20px' }}>

// ❌ Problem: Inline styles
<div style={{ paddingLeft: '15px', paddingRight: '15px' }}>

// ❌ Problem: Inconsistent Tailwind classes
<section className="px-5">  // 20px
<section className="px-4">  // 16px
```

### Solution
**Use consistent mobile padding across ALL sections:**

```jsx
// ✅ Correct: Consistent 16px padding on mobile
<section className="px-4 lg:px-20">
  {/* Content */}
</section>

// ✅ Better: Create SectionWrapper component
// src/components/Layout/SectionWrapper.jsx
export function SectionWrapper({ children, className = '' }) {
  return (
    <section className={`px-4 lg:px-20 ${className}`}>
      <div className="max-w-[1440px] mx-auto">
        {children}
      </div>
    </section>
  );
}
```

### Implementation Steps
1. Audit all page files for padding values
2. Replace custom padding with `px-4` for mobile
3. Ensure desktop padding is `px-20` (80px)
4. Test on 390px and 375px viewports
5. Verify content width is 358px (390px - 32px padding)

### Related Jira Tickets
- CDA-56: Homepage hero padding
- CDA-58: Services page sections
- CDA-60: About page mobile layout

### Files Commonly Affected
- `src/app/page.js` (Homepage)
- `src/app/about/page.js`
- `src/app/services/page.js`
- `src/app/team/page.js`
- All global block components

---

## Pattern 2: Section Spacing Inconsistency

### Frequency
**High** - Particularly affects Homepage and Services pages

### Symptoms
- Vertical spacing between sections varies (some 40px, 60px, 80px, or custom)
- Page feels disjointed or cramped
- Inconsistent rhythm throughout the page
- Some sections too close together, others have excessive space

### Root Cause
```jsx
// ❌ Problem: Hardcoded margins
<section style={{ marginBottom: '60px' }}>

// ❌ Problem: Arbitrary spacing values
<div className="mb-12">  // 48px
<div className="mb-16">  // 64px
<div className="mb-20">  // 80px
```

### Solution
**Use consistent spacing scale:**

```jsx
// ✅ Correct: Use spacing scale variables
// Desktop: 80px between sections
// Mobile: 48px between sections

<section className="mb-12 lg:mb-20">  // 48px mobile, 80px desktop
  {/* Section content */}
</section>

// ✅ Alternative: CSS custom properties
// In globals.css
:root {
  --section-spacing-mobile: 48px;
  --section-spacing-desktop: 80px;
}

// In component
<section style={{ marginBottom: 'var(--section-spacing-mobile)' }}
         className="lg:mb-[var(--section-spacing-desktop)]">
```

### Spacing Scale Reference
| Element | Mobile | Desktop | Tailwind Class |
|---------|---------|---------|----------------|
| Between major sections | 48px | 80px | `mb-12 lg:mb-20` |
| Heading to content | 24px | 32px | `mb-6 lg:mb-8` |
| Between content blocks | 16px | 24px | `mb-4 lg:mb-6` |
| Between related items | 8px | 16px | `mb-2 lg:mb-4` |

### Related Jira Tickets
- CDA-56: Homepage section spacing
- CDA-57: Services page flow
- CDA-58: Case studies layout

### Files Commonly Affected
- Homepage sections
- Global block components
- Service detail pages

---

## Pattern 3: Responsive Image Positioning

### Frequency
**Medium-High** - Affects hero sections, team photos, and case study images

### Symptoms
- Images overflow container on mobile
- Fixed positioning causes misalignment
- Images cut off at certain breakpoints
- Aspect ratio distortion on smaller screens

### Root Cause
```jsx
// ❌ Problem: Fixed positioning
<Image
  src={imageUrl}
  style={{ position: 'absolute', top: '100px', right: '50px' }}
  width={800}
  height={600}
/>

// ❌ Problem: No responsive sizing
<img src={imageUrl} width="800" />

// ❌ Problem: Missing aspect ratio container
<Image src={imageUrl} layout="fill" />
```

### Solution
**Use responsive positioning and proper containers:**

```jsx
// ✅ Correct: Responsive positioning
<div className="relative w-full aspect-[16/9]">
  <Image
    src={imageUrl}
    alt={altText}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>

// ✅ Better: ResponsiveImage component
// src/components/ResponsiveImage.jsx
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  priority = false
}) {
  return (
    <div className={`relative w-full aspect-[${aspectRatio}] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        priority={priority}
      />
    </div>
  );
}
```

### Implementation Guidelines
1. Always define aspect ratio containers
2. Use `fill` layout with `object-cover` for flexibility
3. Specify responsive `sizes` attribute
4. Use `priority` for above-fold images
5. Test on all breakpoints (390px, 768px, 1024px, 1440px)

### Related Jira Tickets
- CDA-61: Hero image overflow on mobile
- CDA-63: Team member photos misaligned

### Files Commonly Affected
- Hero sections across all pages
- Team member profile pages
- Case study detail pages
- About page images

---

## Pattern 4: Button Layout & Spacing

### Frequency
**Medium** - Affects CTA sections across the site

### Symptoms
- Buttons too close together (8px or 16px instead of required 32px)
- Arrow icons below button text instead of inline
- Buttons don't stack properly on mobile
- Inconsistent button dimensions

### Root Cause
```jsx
// ❌ Problem: Insufficient gap
<div className="flex gap-2">  // Only 8px
  <button>Find Out More</button>
  <button>Speak To Us</button>
</div>

// ❌ Problem: Vertical layout for arrow
<button className="flex flex-col">
  <span>Find Out More</span>
  <ArrowIcon />
</button>
```

### Solution
**Use consistent button spacing and layout:**

```jsx
// ✅ Correct: Desktop horizontal with 32px gap, mobile stacked
<div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
  <button className="flex items-center gap-2">
    <span>Find Out More</span>
    <ArrowIcon />
  </button>
  <button className="flex items-center gap-2">
    <span>Speak To Us</span>
    <ArrowIcon />
  </button>
</div>

// ✅ Button specifications
{
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  padding: '16px 32px',
  borderRadius: '4px',
  gap: '8px'  // Between text and arrow
}
```

### Button Spacing Rules
| Context | Gap | Tailwind Class |
|---------|-----|----------------|
| Between buttons (desktop) | 32px | `gap-8` |
| Between buttons (mobile) | 16px | `gap-4` |
| Text to arrow | 8px | `gap-2` |
| Button group to content | 24px | `mt-6` |

### Related Jira Tickets
- CDA-59: Service page CTA buttons
- CDA-62: Contact page button spacing

### Files Commonly Affected
- Service detail pages
- Hero sections with multiple CTAs
- Contact forms
- Global CTA components

---

## Pattern 5: Font Family Rendering

### Frequency
**Low-Medium** - Affects pages where custom fonts aren't loading

### Symptoms
- Text renders in SFNS-Regular or system fonts instead of Poppins/Inter
- Inconsistent typography across pages
- Flash of unstyled text (FOUT)

### Root Cause
```jsx
// ❌ Problem: Font not imported
<h1 className="font-bold">Title</h1>  // Falls back to system font

// ❌ Problem: Incorrect font family reference
<h1 style={{ fontFamily: 'Poppins' }}>  // Missing fallback
```

### Solution
**Proper font loading and configuration:**

```css
/* ✅ In globals.css or layout.tsx */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400&display=swap');

/* ✅ Define font families */
:root {
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}

/* ✅ Apply to elements */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
}

body, p, span, div {
  font-family: var(--font-body);
  font-weight: 400;
}

button {
  font-family: var(--font-body);
}
```

```jsx
// ✅ Alternative: Next.js font optimization
// In layout.tsx
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Related Jira Tickets
- CDA-64: Services page typography
- CDA-65: About page font rendering

### Files Commonly Affected
- `src/app/globals.css`
- `src/app/layout.js` / `src/app/layout.tsx`
- Any component with custom styling

---

## Pattern 6: List Bullet Styles

### Frequency
**Low** - Specific to service feature lists

### Symptoms
- Lists use square bullets (■) instead of round bullets (•)
- Inconsistent bullet styling across pages
- Custom bullets not rendering correctly

### Root Cause
```css
/* ❌ Problem: Square bullets */
ul {
  list-style-type: square;
}

/* ❌ Problem: Custom marker content */
li::marker {
  content: '■';
}
```

### Solution
**Use standard round bullets:**

```css
/* ✅ Correct: Round bullets */
ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

/* ✅ Alternative: Tailwind classes */
<ul className="list-disc pl-6">
  <li>Feature one</li>
  <li>Feature two</li>
</ul>
```

### Related Jira Tickets
- CDA-5 Task 1: List bullet points

### Files Commonly Affected
- Service detail pages
- Feature lists
- Global styles

---

## Debugging Workflow

### Step 1: Identify the Pattern
1. Check which category the bug falls into (layout, spacing, typography, etc.)
2. Review similar issues in this document
3. Verify if it's a known pattern

### Step 2: Locate the Problem
1. Use browser DevTools to inspect the element
2. Check computed styles for unexpected values
3. Identify the source (inline styles, CSS file, Tailwind class)
4. Review file history if recently changed

### Step 3: Apply the Solution
1. Follow the documented solution for that pattern
2. Test on all breakpoints (390px, 768px, 1024px, 1440px)
3. Verify on multiple browsers
4. Check for regression in other areas

### Step 4: Prevent Recurrence
1. Update component to use standard patterns
2. Consider creating reusable component if pattern repeats
3. Document any new patterns discovered
4. Add to code review checklist

---

## Prevention Checklist

### Before Committing Code
- [ ] Mobile padding is 16px (`px-4`) on all sections
- [ ] Desktop padding is 80px (`px-20`) on all sections
- [ ] Section spacing uses standard scale (48px/80px)
- [ ] Buttons have 32px gap on desktop, 16px on mobile
- [ ] Images have aspect ratio containers
- [ ] Fonts are Poppins (headings) and Inter (body/UI)
- [ ] All typography sizes match specifications
- [ ] Tested on mobile (390px, 375px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1440px, 1920px)

### Code Review Focus Areas
- Consistent use of Tailwind utility classes
- No hardcoded padding/margin values
- Proper responsive classes (sm:, md:, lg:)
- Image components have proper sizing
- Button groups have correct spacing
- No inline styles unless absolutely necessary

---

## Quick Reference

### Common Fixes

| Issue | Quick Fix |
|-------|-----------|
| Mobile padding wrong | Change to `px-4 lg:px-20` |
| Section spacing off | Use `mb-12 lg:mb-20` |
| Buttons too close | Use `gap-8` on button container |
| Image overflow | Wrap in `aspect-[16/9]` container |
| Wrong font | Check font imports and CSS variables |
| Square bullets | Change to `list-disc` |

### Testing Viewport Sizes
- **Mobile Small**: 375px
- **Mobile Large**: 390px
- **Tablet**: 768px
- **Laptop**: 1024px
- **Desktop**: 1440px
- **Wide**: 1920px

---

## Related Documentation
- [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) - Complete specifications
- [tasks/CDA-5/CDA-5-TASKS.md](tasks/CDA-5/CDA-5-TASKS.md) - Detailed task breakdown
- [SIZING_REFERENCE.md](SIZING_REFERENCE.md) - Typography specifications
- [UNDERLINE_GUIDE.md](UNDERLINE_GUIDE.md) - UnderlinedTitle usage

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Next Review**: After completing CDA-56 through CDA-65 fixes
**Maintained By**: Development Team
