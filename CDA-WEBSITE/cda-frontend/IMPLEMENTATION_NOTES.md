# UnderlinedTitle Implementation Notes

## Current Status

### Pages Found:
- ✅ About Us Page: `src/app/about/page.js`
- ✅ Team Page: `src/app/team/page.js`
- ✅ Homepage: `src/app/page.js`
- ✅ Services: `src/app/services/page.js`
- ✅ Contact: `src/app/contact/page.js`
- ✅ Jobs/Careers: `src/app/jobs/page.js`
- ✅ Case Studies: `src/app/case-studies/page.js`
- ✅ Knowledge Hub: `src/app/knowledge-hub/page.js`
- ✅ Technologies: `src/app/technologies/page.js`
- ✅ Policies: `src/app/policies/page.js`

### Global Components That Need Updates:
These components are reused across multiple pages and contain the titles specified in the requirements:

1. **ServicesAccordion** (`src/components/GlobalBlocks/ServicesAccordion.js`)
   - Contains: "What We Excel At" or similar service section title
   - Color: Purple (#AD80F9)

2. **StatsBlock** (`src/components/GlobalBlocks/StatsBlock.js`)
   - Contains: 4 stat numbers
   - Colors: Pink, Purple, Blue, RedishPink (one per stat)

3. **ApproachBlock** (`src/components/GlobalBlocks/ApproachBlock.js`)
   - Contains: "The Foundation Of Our Work" or similar
   - Color: Pink (#FF60DF)

4. **CaseStudiesBlock** or similar
   - Contains: "Some Of Our Case Studies"
   - Color: Orange (#FD8721)

5. **LocationsImage** (`src/components/GlobalBlocks/LocationsImage.js`)
   - Contains: "Where You Can Find Us"
   - Country tabs: UK, USA, UAE
   - Color: Pink (#FF60DF)

6. **NewsCarousel** or **LatestNews**
   - Contains: News tags (Featured, New)
   - Colors: Pink, Orange

### Page-Specific Title Updates Needed:

#### Homepage (`src/app/page.js`)
- Hero title uses `HeroSection` component with `title-large-light-blue` class
- Need to replace with UnderlinedTitle with Blue color

#### About Page (`src/app/about/page.js`)
- Hero title uses pink color
- "Behind CDA" section title (line 219)
- Need UnderlinedTitle integration

#### Team Page (`src/app/team/page.js`)
- Main hero title
- Leadership section
-Individual team member profiles

#### Services Page (`src/app/services/page.js`)
- Main title: Purple
- Individual service cards with specific colors

#### Contact Page (`src/app/contact/page.js`)
- Main title: Orange

#### Jobs Page (`src/app/jobs/page.js`)
- Main title: RedishPink
- Job listings
- "Looking for Another Role" card

#### Case Studies Detail Page
- Project title
- "Our Solution" section
- "Similar Projects" section

#### Knowledge Hub Page
- Main title: Green
- Article tags with cycling colors

#### Technologies Page
- Main title: Purple

#### Policies Pages
- Landing page title: Orange
- Individual policy titles: Purple

#### 404 Page
- Error message title: Pink

## Implementation Strategy

Since many titles are rendered through global components that receive data from WordPress GraphQL, the implementation needs to happen in TWO places:

### Strategy 1: Update Global Block Components
Update the components that render titles from CMS data:
- Add UnderlinedTitle import
- Wrap title rendering with UnderlinedTitle component
- Use appropriate colors

### Strategy 2: Update Page-Level Titles
For page-specific titles (like "Behind CDA" section):
- Add UnderlinedTitle import to page file
- Replace `<h2 className="cda-title">` with `<UnderlinedTitle as="h2">`

### Strategy 3: Update HeroSection Component
The HeroSection component is used across multiple pages:
- It currently accepts `titleClassName` prop
- Need to integrate UnderlinedTitle while maintaining backward compatibility
- OR update each page to pass titleHtml already wrapped

## Files Not Found

The following sections/titles were NOT found in the codebase:
- ❌ "What We Excel At" (exact phrase)
- ❌ "The Foundation Of Our Work" (exact phrase)
- ❌ "Some Of Our Case Studies" (exact phrase)
- ❌ "Where You Can Find Us" (exact phrase)

**Reason**: These titles likely come from WordPress CMS and are dynamically rendered. The actual text is in the database, not hardcoded.

## Recommendation

To implement UnderlinedTitle across the site, I recommend:

1. **Start with BookingModal** ✅ DONE
   - Already has UnderlinedTitle

2. **Update Global Block Components** (High Priority)
   - ServicesAccordion.js
   - StatsBlock.js
   - ApproachBlock.js
   - LocationsImage.js
   - Any CaseStudies component
   - Any News/Blog listing component

3. **Update HeroSection Component** (High Priority)
   - Used on every page for main titles
   - Integrate UnderlinedTitle rendering

4. **Update Page-Specific Sections** (Medium Priority)
   - "Behind CDA" section on About page
   - Team profile pages
   - Job detail pages
   - Case study detail pages

5. **Update Error Pages** (Low Priority)
   - 404 page
   - Other error states

## Next Steps

Would you like me to:
1. **Start updating global components** (ServicesAccordion, StatsBlock, etc.)
2. **Update HeroSection component** to use UnderlinedTitle
3. **Provide specific file-by-file implementation plan**
4. **Create a script to find all h1/h2/h3 tags across the codebase**

Let me know which approach you'd prefer!
