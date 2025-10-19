# CDA-5: Services Page Bugs - Complete Task Tracker

**Project:** CDA Website  
**Component:** cda-frontend (Next.js)  
**Status:** In Progress  
**Priority:** Medium  
**Assignee:** Razvan Vlad Pop  
**Reporter:** Paula Lupes  
**Created:** Oct 15, 2025  
**Updated:** Oct 16, 2025

---

## 📁 **Task Organization**

**Task Directory:** `C:\xampp\htdocs\CDA-WEBSITE-PROJECT\CDA-WEBSITE\cda-frontend\tasks\CDA-5\`

**Resources:**
- **PDF Documentation:** `[#CDA-5] Services page bugs.pdf`
- **Attachments Folder:** `CDA-5_attachments\` (14 reference images)
- **Attachment Archive:** `CDA-5_attachments.zip`

**Reference Images:**
- `image-20251015-192628.png` - List bullets (actual)
- `image-20251015-192711.png` - List bullets (expected)
- `image-20251015-192953.png` - Typography issues
- `image-20251015-193040.png` - Font sizes
- `image-20251015-193726.png` - Button labels (expected)
- `image-20251015-193754.png` - Button labels (actual)
- `image-20251015-193949.png` - Button dimensions (actual)
- `image-20251015-194041.png` - Button dimensions (expected)
- `image-20251015-194400.png` - How We Work layout (actual)
- `image-20251015-194504.png` - How We Work layout (expected)
- `image-20251015-194548.png` - Showreel spacing (expected)
- `image-20251015-194650.png` - Showreel spacing (actual)
- `image-20251015-194927.png` - Footer navigation (actual)
- `image-20251015-195009.png` - Footer navigation (expected)

---

## 🎯 **Progress Summary**

- **Total Tasks:** 10
- **Completed:** 1 ✅ (Task 10 - via WordPress)
- **In Progress:** 0 🔄
- **Pending:** 9 ⏳
- **Blocked:** 0 ❌

---

## 📂 **Project Structure Reference**

**Services Page Files:**
```
src/app/services/
├── page.js                    # Main services page (server component)
├── ServicesClient.jsx         # Client-side services component
└── ServicesFilters.jsx        # Filter functionality
```

**Global Style Files:**
```
src/app/globals.css            # Primary global styles
src/styles/global.css          # Secondary global styles
```

**Global Blocks (Reusable Components):**
```
src/components/GlobalBlocks/
├── ApproachBlock.js           # "How We Work" section
├── ServicesAccordion.js       # Services accordion component
├── ServicesSlider.jsx         # Services carousel
├── Showreel.js                # Showreel section with brand logos
├── ThreeColumnsWithIcons.jsx  # Icon-based content blocks
└── [other global blocks]
```

**Layout Components:**
```
src/components/
├── Footer.js                  # Footer with social icons, navigation
├── Header.js                  # Header component
└── HeaderClient.js            # Client-side header
```

**Configuration Files:**
```
next.config.js                 # Next.js configuration
postcss.config.mjs             # PostCSS configuration
package.json                   # Dependencies
```

---

## 📋 **Task Breakdown**

### **Task 1: Fix List Bullet Points** ⏳

**Status:** Pending  
**Priority:** Medium  
**Estimated Time:** 15 minutes

**Issue:**
Lists and subpoints use square bullets (■) instead of round bullets (•)

**Location:**
- AI Tools section - service feature lists
- Outsourced CMO section - service feature lists
- All service card components

**Current State:**
- Bullet style: Squares (`list-style-type: square` or custom)
- Reference: `image-20251015-192628.png`

**Expected State:**
- Bullet style: Round/disc bullets
- Reference: `image-20251015-192711.png`

**Files to Modify:**
- [ ] `src/app/services/ServicesClient.jsx`
- [ ] `src/app/globals.css` (global list styles)
- [ ] `src/styles/global.css` (if list styles defined here)
- [ ] `src/components/GlobalBlocks/ServicesAccordion.js` (if lists are in accordion)

**CSS Investigation:**
```css
/* Look for these patterns: */
ul { list-style-type: square; }
li::marker { content: '■'; }
```

**Acceptance Criteria:**
- [ ] All list items use round bullets (disc)
- [ ] Consistent across all service sections
- [ ] Matches design specifications

---

### **Task 2: Fix Typography - Font Families** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 30 minutes

**Issue:**
All text renders with SFNS-Regular font instead of design-specified fonts

**Current State:**
- Titles: SFNS-Regular
- Body text: SFNS-Regular  
- Button labels: SFNS-Regular
- Reference: `image-20251015-192953.png`

**Expected State:**
- Titles: **Poppins, Bold (700 weight)**
- Body text: **Inter, Regular (400 weight)**
- Button labels: **Inter, Regular (400 weight)**

**Files to Investigate & Modify:**
- [ ] `src/app/globals.css` - Primary global styles, font imports
- [ ] `src/styles/global.css` - Secondary global styles
- [ ] `src/app/layout.js` - Check for font imports in head
- [ ] `src/app/services/page.js` - Services page component
- [ ] `src/app/services/ServicesClient.jsx` - Client component
- [ ] `src/components/GlobalBlocks/ApproachBlock.js` - "How We Work" section
- [ ] `src/components/GlobalBlocks/ServicesSlider.jsx` - Services carousel

**Implementation Steps:**

1. **Add Google Fonts Import** (if not present):
   ```css
   /* In src/app/globals.css or src/styles/global.css */
   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400&display=swap');
   ```

2. **Define Font Variables:**
   ```css
   :root {
     --font-heading: 'Poppins', sans-serif;
     --font-body: 'Inter', sans-serif;
   }
   ```

3. **Apply to Elements:**
   ```css
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

4. **Check for Tailwind Classes** (if using Tailwind):
   - Update utility classes like `font-sans` to use custom fonts

**Acceptance Criteria:**
- [ ] Titles use Poppins Bold (weight 700)
- [ ] Body text uses Inter Regular (weight 400)
- [ ] Button labels use Inter Regular (weight 400)
- [ ] Fonts load correctly without FOUT/FOIT
- [ ] Inspect in DevTools shows correct font-family

---

### **Task 3: Fix Typography - Font Sizes** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 45 minutes

**Issue:**
Multiple text elements have incorrect font sizes

**Size Corrections Needed:**

| Element | Current | Expected | Location |
|---------|---------|----------|----------|
| Main section title | 36px | 50px | Services page hero |
| Service shortcuts/items | 14px | 18px | Service feature lists |
| "B2B Lead Generation" title | ~40px | 88px | Service section heading |
| Body text | Various | Verify | Service descriptions |

**References:**
- `image-20251015-193040.png` - Shows size comparisons
- DevTools inspector showing 36px instead of 50px

**Files to Modify:**
- [ ] `src/app/globals.css` - Typography scale definitions
- [ ] `src/styles/global.css` - Additional typography
- [ ] `src/app/services/ServicesClient.jsx` - Service section text
- [ ] `src/components/GlobalBlocks/ApproachBlock.js` - Section titles
- [ ] `src/components/GlobalBlocks/ServicesSlider.jsx` - Slider text

**Implementation:**
```css
/* Update heading sizes */
h1 { font-size: 50px; }
h2 { font-size: 88px; } /* For special titles like "B2B Lead Generation" */
h3 { font-size: 36px; }

/* Service items */
.service-item { font-size: 18px; }
```

**Responsive Breakpoints:**
```css
/* Desktop: 1920px */
h1 { font-size: 50px; }

/* Laptop: 1440px */
@media (max-width: 1440px) {
  h1 { font-size: 42px; }
}

/* Tablet: 768px */
@media (max-width: 768px) {
  h1 { font-size: 32px; }
}
```

**Acceptance Criteria:**
- [ ] Main titles are 50px on desktop
- [ ] Service items are 18px
- [ ] Large section titles are 88px where specified
- [ ] Responsive scaling works correctly
- [ ] Consistent sizing across all sections

---

### **Task 4: Fix Button Labels** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 10 minutes

**Issue:**
Wrong button text labels throughout the page

**Changes Required:**

| Current | Expected |
|---------|----------|
| "Get Started" | "Find Out More" |
| "Learn more" | "Speak To Us" |

**Location:**
- All service section CTAs
- "Our Approach - How We Work" section  
- Bottom of each service card

**References:**
- Actual: `image-20251015-193754.png`
- Expected: `image-20251015-193726.png`

**Files to Modify:**
- [ ] `src/app/services/ServicesClient.jsx` - Button text props
- [ ] `src/components/GlobalBlocks/ApproachBlock.js` - CTA buttons
- [ ] `src/components/GlobalBlocks/ServicesSlider.jsx` - Carousel buttons
- [ ] `src/components/ServiceCTAButton.js` - CTA button component

**Search for:**
```jsx
// Find and replace:
"Get Started" → "Find Out More"
"Learn more" → "Speak To Us"
```

**Acceptance Criteria:**
- [ ] All "Get Started" replaced with "Find Out More"
- [ ] All "Learn more" replaced with "Speak To Us"
- [ ] Arrow icons still present and functioning
- [ ] Consistent across all service sections
- [ ] Links/buttons still work correctly

---

### **Task 5: Fix Arrow Position** ⏳

**Status:** Pending  
**Priority:** Medium  
**Estimated Time:** 15 minutes

**Issue:**
Arrow icon appears below button text instead of inline next to it

**Current State:**
- Arrow displays on new line below text
- Vertical layout (flex-column or block)

**Expected State:**
- Arrow inline with text (horizontal)
- Proper spacing between text and arrow
- Reference: `image-20251015-194041.png`

**Files to Modify:**
- [ ] `src/components/ServiceCTAButton.js` - Button component
- [ ] `src/app/globals.css` - Button styles
- [ ] `src/styles/global.css` - Additional button styles
- [ ] Any button wrapper components

**Implementation:**
```css
/* Fix button layout */
.button, .cta-button, [class*="button"] {
  display: flex;
  flex-direction: row; /* NOT column */
  align-items: center;
  gap: 8px; /* spacing between text and arrow */
  justify-content: center; /* or space-between */
}

.button-text {
  flex-shrink: 0;
}

.button-arrow {
  flex-shrink: 0;
}
```

**Acceptance Criteria:**
- [ ] Arrow appears next to text, not below
- [ ] Proper spacing (8px gap) between text and arrow
- [ ] Maintains alignment on hover
- [ ] Works on all button sizes
- [ ] Responsive behavior preserved

---

### **Task 6: Fix Button Fonts and Dimensions** ⏳

**Status:** Pending  
**Priority:** Medium  
**Estimated Time:** 20 minutes

**Issue:**
Buttons have incorrect fonts, sizes, and dimensions

**References:**
- Actual: `image-20251015-193949.png`
- Expected: `image-20251015-194041.png`

**Corrections Needed:**
- Font family: Inter Regular (not SFNS-Regular)
- Font size: Verify from design (likely 16-18px)
- Button padding: Match design specifications
- Button height: Consistent across all variants
- Border styling: Check thickness and color

**Files to Modify:**
- [ ] `src/components/ServiceCTAButton.js` - Primary button component
- [ ] `src/app/globals.css` - Button base styles
- [ ] `src/styles/global.css` - Additional button styles
- [ ] Primary button variant styles
- [ ] Secondary button variant styles

**Expected Button Styles:**
```css
.button-primary {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 18px;
  padding: 16px 32px;
  border-radius: 4px;
  /* Other properties from design */
}

.button-secondary {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 18px;
  padding: 14px 30px;
  border: 2px solid currentColor;
  /* Other properties */
}
```

**Acceptance Criteria:**
- [ ] Correct font (Inter Regular, 400 weight)
- [ ] Correct font size (match design)
- [ ] Correct padding and dimensions
- [ ] Proper border styling
- [ ] Hover states work correctly
- [ ] Pixel-perfect match to design

---

### **Task 7: Fix Images and Dotted Line Layout** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 45 minutes

**Issue:**
"How We Work" section has multiple layout problems:
1. Images have unwanted gaps between tiles
2. Blue dotted line doesn't match design position/style
3. Step numbers positioned incorrectly
4. Overall spacing is off

**References:**
- Actual: `image-20251015-194400.png`
- Expected: `image-20251015-194504.png`

**Files to Modify:**
- [ ] `src/components/GlobalBlocks/ApproachBlock.js` - Main "How We Work" component
- [ ] `src/app/globals.css` - Layout styles
- [ ] `src/styles/global.css` - Grid/flex definitions
- [ ] SVG dotted line (might be inline in component)

**Problems to Fix:**

1. **Image Grid Gaps:**
   ```css
   /* Remove gaps */
   .approach-grid, .how-we-work-grid {
     display: grid;
     gap: 0; /* Currently has gap, should be 0 */
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   }
   ```

2. **Dotted Line Path:**
   - Check SVG path coordinates
   - Adjust connector positions
   - Match exact curve from design

3. **Step Numbers:**
   - Position relative to their sections
   - Verify z-index layering
   - Check exact positioning values

**Implementation Notes:**
- Use CSS Grid for image layout
- Consider using `gap: 0` and negative margins if needed
- Dotted line might be an SVG overlay
- Step numbers might use absolute positioning

**Acceptance Criteria:**
- [ ] No gaps between image tiles
- [ ] Dotted line connects step icons correctly
- [ ] Step numbers positioned as in design
- [ ] Layout matches design pixel-perfect
- [ ] Responsive behavior maintained

---

### **Task 8: Fix Brand Logo Spacing** ⏳

**Status:** Pending  
**Priority:** Medium  
**Estimated Time:** 20 minutes

**Issue:**
Brand logos below showreel don't have proper spacing and alignment

**Current State:**
- Logos don't align with showreel image width
- Insufficient horizontal spacing between logos
- Container width mismatch
- Reference: `image-20251015-194650.png`

**Expected State:**
- Logo container width matches showreel width above
- Even spacing between logos
- Proper alignment
- Reference: `image-20251015-194548.png`

**Files to Modify:**
- [ ] `src/components/GlobalBlocks/Showreel.js` - Showreel component
- [ ] Logo container styles
- [ ] Grid/flex layout for logos

**Implementation:**
```css
/* Logo container should match showreel width */
.showreel-container {
  max-width: 1200px; /* Or whatever showreel uses */
  margin: 0 auto;
}

.logo-grid {
  display: flex;
  justify-content: space-between; /* or space-evenly */
  align-items: center;
  gap: 40px; /* Adjust to match design */
  margin-top: 48px; /* Space from showreel */
}
```

**Acceptance Criteria:**
- [ ] Logo container width matches showreel exactly
- [ ] Even spacing between all logos
- [ ] Centered alignment maintained
- [ ] Responsive on all screen sizes
- [ ] No overflow on mobile

---

### **Task 9: Fix Social Media Icons** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 25 minutes

**Issue:**
Multiple problems in "Let's Connect" footer section:
1. Wrong icon order
2. Different/incorrect icon designs used
3. Insufficient spacing between title and icons
4. Insufficient spacing between "Have a Browse" heading and links

**Current Icon Order:**
Facebook, Instagram, LinkedIn, YouTube, TikTok

**Expected Icon Order:**
Facebook, TikTok, Instagram, LinkedIn, YouTube

**References:**
- Actual: `image-20251015-194927.png`
- Expected: `image-20251015-195009.png`

**Spacing Corrections:**
- Between "Let's Connect" heading and icons: Increase to min 32px
- Between "Have a Browse" heading and nav links: Increase to min 24px

**Files to Modify:**
- [ ] `src/components/Footer.js` - Footer component with social icons
- [ ] Icon array/object ordering
- [ ] Icon imports (may need different icons)
- [ ] Spacing utilities

**Implementation:**

1. **Reorder Icons:**
```jsx
// In Footer.js, update icon array:
const socialIcons = [
  { name: 'Facebook', icon: FacebookIcon, url: '...' },
  { name: 'TikTok', icon: TikTokIcon, url: '...' },      // Moved up
  { name: 'Instagram', icon: InstagramIcon, url: '...' },
  { name: 'LinkedIn', icon: LinkedInIcon, url: '...' },
  { name: 'YouTube', icon: YouTubeIcon, url: '...' }
];
```

2. **Fix Spacing:**
```css
.lets-connect-heading {
  margin-bottom: 32px; /* Increase from current */
}

.have-a-browse-heading {
  margin-bottom: 24px; /* Increase from current */
}
```

3. **Check Icon Designs:**
   - Compare actual icons with design
   - May need to import from different icon library
   - Ensure all icons are same size/weight

**Note from Task Tracker:**
- Check Sidemenu implementation for correct icon usage
- Copy icon styles from working implementation

**Acceptance Criteria:**
- [ ] Icons in correct order: FB, TikTok, IG, LinkedIn, YT
- [ ] Using correct icon designs (match other pages)
- [ ] Proper spacing from "Let's Connect" (32px+)
- [ ] Proper spacing from "Have a Browse" (24px+)
- [ ] All icons link correctly
- [ ] Hover states work

---

### **Task 10: Fix Footer Navigation Order** ✅

**Status:** DONE (via WordPress Menu)  
**Priority:** High  
**Completed:** Via WordPress Admin

**Issue:**
"Have a Browse" navigation sections were in wrong order

**Previous Order:**
Services, Teams, Jobs, Policies

**Corrected Order:**
Work, Services, Careers, Policies

**References:**
- Actual: `image-20251015-194927.png`
- Expected: `image-20251015-195009.png`

**Changes Made:**
- Renamed "Teams" → "Work"
- Renamed "Jobs" → "Careers"
- Reordered menu items via WordPress admin

**Follow-up Required:**
- [ ] Verify `src/app/jobs/` folder still works
- [ ] Update route if needed: `/jobs` → `/careers`
- [ ] Check links in `src/components/Footer.js` point to correct URLs
- [ ] Test navigation from all pages

**Files That May Need Updates:**
- [ ] `src/app/jobs/page.js` - May need to rename folder to `careers`
- [ ] `src/components/Footer.js` - Update link URLs if needed

---

## 🔄 **Workflow Process**

### **For Each Task:**

1. **Update status** to "🔄 In Progress" in this file
2. **Locate files** using paths above
3. **Make changes** according to specifications
4. **Test visually** at http://localhost:3000/services
5. **Compare with design** using reference images in `tasks\CDA-5\CDA-5_attachments\`
6. **Use browser DevTools** (F12) to inspect:
   - Font family, size, weight
   - Element dimensions
   - Spacing/margins/padding
7. **Verify responsive** behavior (1920px, 1440px, 768px, 375px)
8. **Update status** to "✅ Done"
9. **Update Task Completion Log** below
10. **Commit changes:**
    ```bash
    git add .
    git commit -m "Fix: [Task description] (CDA-5 Task #X)"
    ```

### **Testing Checklist Per Task:**

- [ ] Desktop 1920px
- [ ] Laptop 1440px  
- [ ] Tablet 768px
- [ ] Mobile 375px
- [ ] Chrome
- [ ] Firefox
- [ ] Hover states
- [ ] Animations

---

## 🚀 **Getting Started**

### **Before Starting:**

1. **Navigate to project:**
   ```bash
   cd C:\xampp\htdocs\CDA-WEBSITE-PROJECT\CDA-WEBSITE\cda-frontend
   ```

2. **Create git branch:**
   ```bash
   git checkout -b fix/cda-5-services-page-bugs
   git status
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - http://localhost:3000/services

5. **Open DevTools:**
   - Press F12
   - Keep Elements and Computed tabs visible

6. **Open reference images:**
   - Navigate to `tasks\CDA-5\CDA-5_attachments\`
   - Have images ready for comparison

### **Recommended Task Order:**

**Phase 1 - Foundation:**
1. ✅ Task 2: Fix fonts (affects everything else)
2. ✅ Task 3: Fix font sizes

**Phase 2 - Quick Wins:**
3. ✅ Task 4: Button labels
4. ✅ Task 1: List bullets
5. ✅ Task 10: Footer navigation (already done)

**Phase 3 - Layout Fixes:**
6. ✅ Task 5: Arrow position
7. ✅ Task 6: Button dimensions
8. ✅ Task 8: Brand logo spacing
9. ✅ Task 7: How We Work layout (most complex)

**Phase 4 - Polish:**
10. ✅ Task 9: Social media icons

---

## ✅ **Task Completion Log**

| Task | Started | Completed | Commit Hash | Notes |
|------|---------|-----------|-------------|-------|
| 1 | - | - | - | List bullets |
| 2 | - | - | - | Font families |
| 3 | - | - | - | Font sizes |
| 4 | - | - | - | Button labels |
| 5 | - | - | - | Arrow position |
| 6 | - | - | - | Button dimensions |
| 7 | - | - | - | How We Work layout |
| 8 | - | - | - | Brand logo spacing |
| 9 | - | - | - | Social media icons |
| 10 | Oct 16 | Oct 16 | N/A | Done via WordPress |

---

## 🐛 **Known Issues / Blockers**

*None currently*

---

## 📚 **Additional Resources**

- **Jira Ticket:** [CDA-5] Services page bugs
- **Live Site:** cda-frontend-nine.vercel.app/services
- **Local Dev:** http://localhost:3000/services
- **WordPress Admin:** (for menu/content changes)

---

## 📝 **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint

# Git workflow
git status
git add .
git commit -m "Fix: description (CDA-5 Task #X)"
git push origin fix/cda-5-services-page-bugs
```

---

**Last Updated:** Oct 16, 2025 - 16:30  
**Next Review:** After Task 2 completion  
**Current Task:** Ready to start Task 2 (Typography - Font Families)
