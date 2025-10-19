# CDA-5: Immediate Fixes - Exact Specifications

**Based on visual inspection of current state vs. design requirements**

---

## 🔴 **CRITICAL ISSUE 1: Service Section Title Too Large**

### **Current State (WRONG):**
- Title: "Outsourced CMO" 
- Font Size: Appears to be 88px or larger (TOO BIG)
- Taking up excessive vertical space

### **Required (EXACT):**
- Font Size: **50px** (NOT 88px)
- Font Family: `'Poppins', sans-serif`
- Font Weight: `700` (Bold)
- Line Height: `1.2` (60px)
- Margin Bottom: `24px`

**The 88px size is ONLY for special emphasis titles like "B2B Lead Generation" standalone headings, NOT for all section titles.**

### **CSS Fix:**
```css
/* Service section titles - DEFAULT size */
.service-section h2,
.service-card-title,
[class*="service"] h2 {
  font-size: 50px !important;
  font-family: 'Poppins', sans-serif !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  margin-bottom: 24px !important;
}

/* Only specific large titles use 88px */
.hero-title-large,
.emphasis-title-large {
  font-size: 88px !important;
}
```

**Files to Check:**
- `src/app/services/ServicesClient.jsx`
- `src/components/GlobalBlocks/ServicesSlider.jsx`
- `src/app/globals.css`

---

## 🔴 **CRITICAL ISSUE 2: Button Spacing Too Close**

### **Current State (WRONG):**
- "Find Out More" and "Speak To Us" buttons are too close together
- Gap appears to be ~8px or 16px

### **Required (EXACT):**
- Horizontal Gap Between Buttons: **32px**
- Vertical alignment: Center
- Both buttons should be inline (flex row)

### **CSS Fix:**
```css
/* Button container */
.button-group,
.cta-buttons,
[class*="button-container"] {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 32px !important;  /* CRITICAL: 32px gap between buttons */
  flex-wrap: wrap !important;
}

/* Individual button spacing */
.button + .button,
.cta-button + .cta-button {
  margin-left: 0 !important;  /* Gap handles spacing */
}
```

**Responsive:**
```css
@media (max-width: 768px) {
  .button-group {
    gap: 16px !important;  /* Smaller gap on mobile */
    flex-direction: column !important;  /* Stack on mobile */
    align-items: stretch !important;
  }
}
```

---

## 🔴 **CRITICAL ISSUE 3: Approach Block - Remove Animation, Use SVG Arrows**

### **Current Implementation (WRONG):**
- Animated dotted line connecting steps
- Custom animation not in design
- Not matching design layout

### **Required (EXACT):**
- NO animation
- Use static SVG arrow images from design
- Arrows positioned between step boxes
- Layout matches design exactly (Images 2 & 3)

### **SVG Arrow Files (Already Available):**
```
CDA-WEBSITE/cda-frontend/public/images/approach/step1.svg
CDA-WEBSITE/cda-frontend/public/images/approach/step2.svg
CDA-WEBSITE/cda-frontend/public/images/approach/step3.svg
CDA-WEBSITE/cda-frontend/public/images/approach/step4.svg
```

### **Implementation:**

**In `src/components/GlobalBlocks/ApproachBlock.js`:**

**REMOVE:**
- Any animated dotted line SVG
- CSS animations
- JavaScript animation logic

**ADD:**
```jsx
// Structure should be:
<div className="approach-grid">
  {/* Step 1 */}
  <div className="step-box">
    <span className="step-number">01</span>
    <img src="/images/approach/globe.svg" alt="" />
    <h3>Discovery & Strategy</h3>
  </div>

  {/* Arrow 1 → 2 */}
  <img 
    src="/images/approach/step1.svg" 
    alt="" 
    className="step-arrow arrow-1-2"
  />

  {/* Step 2 */}
  <div className="step-box">
    <span className="step-number">02</span>
    <img src="/images/approach/pen.svg" alt="" />
    <h3>Creative Design</h3>
  </div>

  {/* Arrow 2 → 3 */}
  <img 
    src="/images/approach/step2.svg" 
    alt="" 
    className="step-arrow arrow-2-3"
  />

  {/* Step 3 */}
  <div className="step-box">
    <span className="step-number">03</span>
    <img src="/images/approach/mouse.svg" alt="" />
    <h3>Development & Integration</h3>
  </div>

  {/* Arrow 3 → 4 */}
  <img 
    src="/images/approach/step3.svg" 
    alt="" 
    className="step-arrow arrow-3-4"
  />

  {/* Step 4 */}
  <div className="step-box">
    <span className="step-number">04</span>
    <img src="/images/approach/target.svg" alt="" />
    <h3>Launch & Optimisation</h3>
  </div>

  {/* Arrow 4 → 5 */}
  <img 
    src="/images/approach/step4.svg" 
    alt="" 
    className="step-arrow arrow-4-5"
  />

  {/* Step 5 */}
  <div className="step-box">
    <span className="step-number">05</span>
    <img src="/images/approach/plant.svg" alt="" />
    <h3>Growth & Support</h3>
  </div>
</div>
```

### **CSS for Layout:**
```css
.approach-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr auto 1fr;
  /* Pattern: box, arrow, box, arrow, box, arrow, box, arrow, box */
  align-items: center;
  gap: 0;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* Remove any animation classes */
.dotted-line,
.animated-line,
[class*="animation"] {
  display: none !important;  /* Hide animated elements */
}

/* Step boxes */
.step-box {
  position: relative;
  background: #F5F5F5;
  padding: 40px 20px;
  text-align: center;
  border-radius: 8px;
}

.step-number {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 32px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #E0E0E0;
}

/* Arrow images */
.step-arrow {
  width: 80px;
  height: auto;
  object-fit: contain;
  margin: 0 -10px;  /* Slight overlap for connection */
}

/* Responsive */
@media (max-width: 1024px) {
  .approach-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .step-arrow {
    transform: rotate(90deg);  /* Vertical arrows on mobile */
    width: 40px;
    margin: 0 auto;
  }
}
```

### **CRITICAL ACTIONS:**
1. **Delete all animation CSS**
2. **Delete animated SVG line code**
3. **Use only the static SVG arrows from `/public/images/approach/`**
4. **Match design layout EXACTLY** (see Images 2 & 3)

---

## 🔴 **CRITICAL ISSUE 4: Showreel Logos - Fit 6 in One Row**

### **Current State (WRONG):**
- Last logo wrapping to second row
- Logos too wide to fit 6 in one row

### **Required (EXACT):**
- Max Width per Logo: **220px**
- All 6 logos in one row on desktop
- Even spacing between logos
- Container matches showreel width

### **CSS Fix:**
```css
/* Showreel logos container */
.showreel-logos,
.brand-logos-container,
.logos-grid {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 24px !important;
  max-width: 1400px !important;
  margin: 48px auto 0 !important;
  padding: 0 20px !important;
  flex-wrap: wrap !important;
}

/* Individual logo */
.brand-logo,
.logo-item {
  max-width: 220px !important;  /* CRITICAL: 220px max */
  width: auto !important;
  height: 50px !important;
  object-fit: contain !important;
  flex-shrink: 1 !important;
}

/* Ensure 6 logos fit */
@media (min-width: 1200px) {
  .brand-logo {
    flex: 0 1 calc(16.666% - 20px) !important;  /* 6 logos = 16.666% each */
    max-width: 220px !important;
  }
}

/* Responsive - stack on smaller screens */
@media (max-width: 1024px) {
  .brand-logo {
    flex: 0 1 calc(33.333% - 20px) !important;  /* 3 per row */
  }
}

@media (max-width: 768px) {
  .brand-logo {
    flex: 0 1 calc(50% - 20px) !important;  /* 2 per row */
  }
}
```

**Files to Modify:**
- `src/components/GlobalBlocks/Showreel.js`
- Check for any inline styles that might override

---

## 🔴 **CRITICAL ISSUE 5: Footer Icons - Copy from Sidemenu**

### **Implementation:**

**DO NOT create new icon implementations.**

**Instead:**

1. **Find the sidemenu component** (likely `src/components/Header.js` or `src/components/HeaderClient.js`)

2. **Locate the social icons implementation** that is ALREADY working

3. **Copy the EXACT code** for:
   - Icon imports
   - Icon components
   - Icon styling
   - Icon order: Facebook, TikTok, Instagram, LinkedIn, YouTube

4. **Paste into Footer component** at `src/components/Footer.js`

### **Steps for Claude Code:**

```
1. READ src/components/Header.js or src/components/HeaderClient.js
2. FIND the social media icons section (look for Facebook, Instagram, etc.)
3. COPY the icon array/component code EXACTLY
4. OPEN src/components/Footer.js
5. FIND the footer social icons section
6. REPLACE with the code from header/sidemenu
7. VERIFY icon order: Facebook, TikTok, Instagram, LinkedIn, YouTube
8. VERIFY spacing: 32px below "Let's Connect" heading
```

**DO NOT:**
- ❌ Import different icons
- ❌ Create new icon components
- ❌ Use different icon library
- ❌ Change icon sizes from sidemenu version

**DO:**
- ✅ Use EXACT same imports as sidemenu
- ✅ Use EXACT same component structure
- ✅ Use EXACT same styling
- ✅ Only update the ORDER to match spec

---

## 📋 **SUMMARY OF ALL FIXES**

### **Claude Code Action Items:**

**File: `src/app/services/ServicesClient.jsx` or equivalent**
- [ ] Change section title font-size from 88px to 50px
- [ ] Add 32px gap between button groups

**File: `src/components/GlobalBlocks/ApproachBlock.js`**
- [ ] Remove ALL animation code
- [ ] Delete animated dotted line SVG
- [ ] Add static SVG arrow images from `/public/images/approach/`
- [ ] Use layout matching design (Images 2 & 3)
- [ ] Position arrows between step boxes

**File: `src/components/GlobalBlocks/Showreel.js`**
- [ ] Set logo max-width to 220px
- [ ] Ensure 6 logos fit in one row on desktop
- [ ] Even spacing with flexbox

**File: `src/components/Footer.js`**
- [ ] Copy social icon implementation from sidemenu/header
- [ ] Verify order: FB, TikTok, IG, LinkedIn, YT
- [ ] Ensure 32px spacing below "Let's Connect"

---

## 🎯 **Prompt for Claude Code**

```
I need you to fix 5 critical issues on the services page based on visual comparison with the design.

Read these specification files:
1. C:\xampp\htdocs\CDA-WEBSITE-PROJECT\CDA-WEBSITE\cda-frontend\tasks\CDA-5\CDA-5-PRECISE-SPECS.md
2. C:\xampp\htdocs\CDA-WEBSITE-PROJECT\CDA-WEBSITE\cda-frontend\tasks\CDA-5\CDA-5-IMMEDIATE-FIXES.md

Then make these EXACT changes:

**FIX 1: Service Section Titles**
- File: src/app/services/ServicesClient.jsx
- Change: Font-size from 88px to 50px for section titles like "Outsourced CMO"
- The 88px is ONLY for special large emphasis titles

**FIX 2: Button Spacing**
- File: src/app/services/ServicesClient.jsx and src/app/globals.css
- Change: Add 32px gap between "Find Out More" and "Speak To Us" buttons
- Use CSS gap property on flex container

**FIX 3: Approach Block - Remove Animation**
- File: src/components/GlobalBlocks/ApproachBlock.js
- REMOVE: All animation code and animated dotted lines
- ADD: Static SVG arrows from /public/images/approach/step1.svg, step2.svg, step3.svg, step4.svg
- Position arrows BETWEEN step boxes
- Layout must match the design (no animations)

**FIX 4: Showreel Logos**
- File: src/components/GlobalBlocks/Showreel.js
- Change: Set max-width: 220px on each logo
- Ensure 6 logos fit in one row on desktop

**FIX 5: Footer Social Icons**
- File: src/components/Footer.js
- COPY the social icon code from src/components/Header.js or HeaderClient.js
- Use THE EXACT SAME implementation (same imports, same components)
- Only change the ORDER to: Facebook, TikTok, Instagram, LinkedIn, YouTube

After making changes, show me:
1. List of all files you modified
2. What you changed in each file
3. Confirm the changes match the specifications
```

---

**Last Updated:** Oct 16, 2025 - 18:00  
**Status:** Ready for implementation  
**Priority:** HIGH - Visual bugs affecting client presentation
