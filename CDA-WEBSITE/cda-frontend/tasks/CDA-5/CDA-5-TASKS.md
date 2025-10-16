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

**Task Directory:** `CDA-WEBSITE\cda-frontend\tasks\CDA-5\`

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
- **Completed:** 0 ✅
- **In Progress:** 0 🔄
- **Pending:** 10 ⏳
- **Blocked:** 0 ❌

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
- [ ] Service card component CSS
- [ ] Global list styles
- [ ] Tailwind config (if using custom markers)

**Acceptance Criteria:**
- [ ] All list items use round bullets
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
- Titles: **Poppins, Bold**
- Body text: **Inter, Regular**
- Button labels: **Inter, Regular**

**Files to Modify:**
- [ ] `CDA-WEBSITE\cda-frontend\src\styles\global.css` or `CDA-WEBSITE\cda-frontend\src\app\globals.css` or`tailwind.config.js`
- [ ] Font imports (Google Fonts or local)
- [ ] Typography utility classes
- [ ] Service page component styles

**Implementation Steps:**
1. Import Poppins (Bold) and Inter (Regular) fonts
2. Define font families in global styles
3. Update component class names
4. Test font rendering across all sections

**Acceptance Criteria:**
- [ ] Titles use Poppins Bold
- [ ] Body text uses Inter Regular
- [ ] Button labels use Inter Regular
- [ ] Fonts load correctly without FOUT/FOIT

---

### **Task 3: Fix Typography - Font Sizes** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 45 minutes

**Issue:**
Multiple text elements have incorrect font sizes

**Size Corrections Needed:**

| Element | Current | Expected |
|---------|---------|----------|
| Main section title | 36px | 50px |
| Service shortcuts/items | 14px | 18px |
| "B2B lead generation" title | Not specified | 88px |
| Body text | Various | Verify against design |

**References:**
- `image-20251015-193040.png` - Shows size comparisons

**Files to Modify:**
- [ ] Typography scale definitions
- [ ] Service section components
- [ ] Heading components
- [ ] Responsive breakpoints

**Acceptance Criteria:**
- [ ] All titles are 50px (desktop)
- [ ] Service items are 18px
- [ ] Consistent sizing across sections
- [ ] Responsive scaling works correctly

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
- [ ] Button component props
- [ ] Service section content
- [ ] CTA component text

**Acceptance Criteria:**
- [ ] All instances updated consistently
- [ ] No "Get Started" or "Learn more" remain
- [ ] Arrow icons still present and correct

---

### **Task 5: Fix Arrow Position** ⏳

**Status:** Pending  
**Priority:** Medium  
**Estimated Time:** 15 minutes

**Issue:**
Arrow icon appears below the button text instead of inline next to it

**Current State:**
- Arrow on new line below text
- Vertical layout

**Expected State:**
- Arrow inline with text
- Horizontal layout with proper spacing
- Reference: `image-20251015-194041.png`

**Files to Modify:**
- [ ] Button component CSS
- [ ] Flexbox alignment
- [ ] Icon positioning styles

**Implementation:**
```css
/* Expected structure */
.button {
  display: flex;
  align-items: center;
  gap: 8px; /* spacing between text and arrow */
}
```

**Acceptance Criteria:**
- [ ] Arrow appears next to text, not below
- [ ] Proper spacing between text and arrow
- [ ] Maintains alignment on hover

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
- Font family: Should be Inter Regular
- Font size: Verify against design
- Button padding: Adjust to match design
- Button width/height: Match specifications
- Border styling: Check thickness and color

**Files to Modify:**
- [ ] Button component styles
- [ ] Primary button variant
- [ ] Secondary button variant
- [ ] Hover states

**Acceptance Criteria:**
- [ ] Correct font (Inter Regular)
- [ ] Correct dimensions
- [ ] Proper padding and spacing
- [ ] Matches design pixel-perfect

---

### **Task 7: Fix Images and Dotted Line Layout** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 45 minutes

**Issue:**
"How We Work" section has layout problems:
- Images have unwanted gaps between tiles
- Blue dotted line doesn't match design
- Overall spacing is incorrect

**References:**
- Actual: `image-20251015-194400.png`
- Expected: `image-20251015-194504.png`

**Problems:**
1. Image grid has gaps (should be seamless)
2. Dotted connector line position/styling wrong
3. Step numbers position incorrect
4. Overall container spacing off

**Files to Modify:**
- [ ] How We Work component
- [ ] Image grid/carousel layout
- [ ] SVG dotted line component
- [ ] Grid gap properties
- [ ] Container max-width

**Implementation Notes:**
- Remove grid gaps between images
- Adjust dotted line SVG path
- Ensure line connects step icons correctly
- Match exact positions from design

**Acceptance Criteria:**
- [ ] No gaps in image grid
- [ ] Dotted line connects correctly
- [ ] Layout matches design exactly
- [ ] Responsive behavior preserved

---

### **Task 8: Fix Brand Logo Spacing** ⏳

**Status:** Pending  
**Priority:** Medium  
**Estimated Time:** 20 minutes

**Issue:**
Brand logos below showreel don't have proper spacing and alignment

**Current State:**
- Logos don't align with showreel image width above
- Insufficient spacing
- Reference: `image-20251015-194650.png`

**Expected State:**
- Logos container aligns with showreel width
- Proper horizontal spacing between logos
- Reference: `image-20251015-194548.png`

**Files to Modify:**
- [ ] Showreel component
- [ ] Logo container component
- [ ] Grid/flex layout
- [ ] Container max-width

**Acceptance Criteria:**
- [ ] Logo container width matches showreel
- [ ] Even spacing between logos
- [ ] Centered alignment
- [ ] Responsive on all screens

---

### **Task 9: Fix Social Media Icons** ⏳

**Status:** Pending  
**Priority:** High  
**Estimated Time:** 25 minutes

**Issue:**
Multiple problems in "Let's Connect" section:
1. Wrong icon order
2. Different/incorrect icons used
3. Insufficient spacing between title and icons
4. Insufficient spacing between "Have a Browse" and subtext

**Current Order:**
Facebook, Instagram, LinkedIn, YouTube, TikTok

**Expected Order:**
Facebook, TikTok, Instagram, LinkedIn, YouTube

**References:**
- Actual: `image-20251015-194927.png`
- Expected: `image-20251015-195009.png`

**Spacing Issues:**
- Add more gap between "Let's Connect" heading and icon row
- Add more gap between "Have a Browse" and navigation links below

**Files to Modify:**
- [ ] Footer/Connect section component
- [ ] Social media icon component
- [ ] Icon imports/library
- [ ] Spacing utilities

**Acceptance Criteria:**
- [ ] Icons in correct order
- [ ] Using correct icon designs
- [ ] Proper spacing from heading (min 24px)
- [ ] Proper spacing between sections (min 32px)
- [ ] All icons link correctly
**Solution from other Component
- [ ] Check Sidemenu implementation for icons and copy the icons and style.
---

### **Task 10: Fix Footer Navigation Order** ⏳

**Status:** DONE via Wordpres Menu   
**Priority:** High  
**Estimated Time:** 10 minutes

**Issue:**
"Have a Browse" navigation sections in wrong order

**Current Order:**
Services, Teams, Jobs, Policies

**Expected Order:**
Work, Services, Careers, Policies

**References:**
- Actual: `image-20251015-194927.png`
- Expected: `image-20251015-195009.png`

**Changes because of this Task
- 'Jobs' page url now should have 'Careers' page url and page name.

---

## 🔄 **Workflow Process**

### **For Each Task:**

1. **Update status** to "🔄 In Progress"
2. **Locate files** that need modification
3. **Make changes** according to specifications
4. **Test visually** in browser at http://localhost:3000/services
5. **Compare with design** using reference images
6. **Use browser DevTools** (F12) to inspect:
   - Font family, size, weight
   - Element dimensions
   - Spacing/margins/padding
7. **Verify responsive** behavior
8. **Update status** to "✅ Done"
9. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: [Task description] (CDA-5 Task #X)"
   ```

### **Testing Checklist Per Task:**

- [ ] Desktop (1920px width)
- [ ] Laptop (1440px width)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width)
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Hover states work
- [ ] Animations smooth

---

## 📝 **Development Notes**

### **Tech Stack:**
- **Framework:** Next.js 15.4.7
- **React:** 19.1.0
- **Styling:** Tailwind CSS (likely)
- **Fonts:** Google Fonts (Poppins, Inter)

### **Key Directories:**
```
cda-frontend/
├── src/
│   ├── app/
│   │   └── services/
│   │       └── page.tsx (or page.js)
│   ├── components/
│   │   ├── services/
│   │   ├── buttons/
│   │   └── layout/
│   └── styles/
│       ├── globals.css
│       └── typography.css
├── public/
│   └── fonts/ (if using local fonts)
└── tailwind.config.js
```

### **Common Files to Check:**
- `src/styles/globals.css` - Global styles, font imports
- `tailwind.config.js` - Font families, typography scale
- `src/app/services/page.tsx` - Services page main component
- `src/components/services/ServiceCard.tsx` - Individual service cards
- `src/components/services/HowWeWork.tsx` - How We Work section
- `src/components/layout/Footer.tsx` - Footer with social icons

---

## 🚀 **Getting Started**

### **Before Starting:**

1. **Start dev server:**
   ```bash
   cd C:\xampp\htdocs\CDA-WEBSITE-PROJECT\CDA-WEBSITE\cda-frontend
   npm run dev
   ```

2. **Open page in browser:**
   - http://localhost:3000/services

3. **Open DevTools:**
   - Press F12
   - Keep Elements and Computed tabs visible

4. **Open reference images:**
   - Have `CDA-5_attachments` folder open for comparison

5. **Create git branch:**
   ```bash
   git checkout -b fix/cda-5-services-page-bugs
   ```

### **Recommended Order:**

**Phase 1 - Foundation (Tasks 2, 3):**
1. Task 2: Fix fonts first (affects everything)
2. Task 3: Fix font sizes

**Phase 2 - Content (Tasks 4, 10, 1):**
3. Task 4: Button labels (quick win)
4. Task 10: Footer navigation (quick win)
5. Task 1: List bullets (quick win)

**Phase 3 - Layout (Tasks 5, 6, 7, 8):**
6. Task 5: Arrow position
7. Task 6: Button dimensions
8. Task 7: How We Work layout (most complex)
9. Task 8: Brand logo spacing

**Phase 4 - Polish (Task 9):**
10. Task 9: Social media icons and spacing

---

## ✅ **Task Completion Log**

| Task | Started | Completed | Commit Hash | Notes |
|------|---------|-----------|-------------|-------|
| 1 | - | - | - | - |
| 2 | - | - | - | - |
| 3 | - | - | - | - |
| 4 | - | - | - | - |
| 5 | - | - | - | - |
| 6 | - | - | - | - |
| 7 | - | - | - | - |
| 8 | - | - | - | - |
| 9 | - | - | - | - |
| 10 | - | - | - | - |

---

## 🐛 **Known Issues / Blockers**

*None currently*

---

## 📚 **Additional Resources**

- **Jira Ticket:** [CDA-5] Services page bugs
- **Figma Design:** (link if available)
- **Staging URL:** cda-frontend-nine.vercel.app/services

---

**Last Updated:** Oct 16, 2025  
**Next Review:** After Task 2 completion
