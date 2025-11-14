# CDA Website - Product Requirements Document (PRD)

## Metadata
- **Status**: ACTIVE
- **Category**: PLANNING
- **Last Modified**: November 14, 2025
- **Last Verified**: November 14, 2025 (Created during Documentation Audit)
- **Related Files**: PROJECT-OVERVIEW.md, SIZING_REFERENCE.md, UNDERLINE_GUIDE.md
- **Code Dependencies**: All project files

---

## Project Context

### Overview
The CDA Website is a professional business website for CDA Digital Agency, built using a modern headless CMS architecture. The project emphasizes high performance, custom development, and exceptional user experience.

### Key Objectives
- **Client**: CDA Digital Agency
- **Goal**: High-performance custom website showcasing services, portfolio, and team
- **Approach**: No page builders - fully custom ACF implementation with Next.js frontend
- **Timeline**: Ongoing development with iterative improvements
- **Current Phase**: UI/UX refinement and bug fixes (Jira CDA-56 through CDA-65)

---

## Technical Requirements

### Technology Stack

**Frontend:**
- **Framework**: Next.js 15.4.7 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Type Safety**: TypeScript 5
- **Data Layer**: Apollo Client 4.0.3 (GraphQL)
- **Image Optimization**: Next.js Image component

**Backend:**
- **CMS**: WordPress (headless)
- **API**: WPGraphQL
- **Custom Fields**: Advanced Custom Fields (ACF) Pro
- **Custom Post Types**: Services, Case Studies, Team Members, Job Listings, Technologies, Policies

**Deployment:**
- **Frontend Hosting**: Vercel
- **Backend Hosting**: WP Engine
- **Environment Management**: Multiple environments (local, staging, production)

### Performance Targets

| Metric | Target | Current Status |
|--------|--------|----------------|
| Lighthouse Performance | 90+ | ✅ Achieved |
| Lighthouse Accessibility | 90+ | ✅ Achieved |
| Lighthouse Best Practices | 90+ | ✅ Achieved |
| Lighthouse SEO | 90+ | ✅ Achieved |
| Core Web Vitals - LCP | < 2.5s | ✅ Green |
| Core Web Vitals - FID | < 100ms | ✅ Green |
| Core Web Vitals - CLS | < 0.1 | ✅ Green |
| Time to Interactive (TTI) | < 3.5s | ✅ Achieved |
| First Contentful Paint (FCP) | < 1.8s | ✅ Achieved |

---

## Design Specifications

### Layout System

#### Breakpoints
```javascript
const breakpoints = {
  mobile: '0px',       // 0-767px
  tablet: '768px',     // 768-1023px
  laptop: '1024px',    // 1024-1439px
  desktop: '1440px',   // 1440px+
  wide: '1920px'       // 1920px+
};
```

#### Container Specifications
- **Desktop Max Width**: 1440px
- **Desktop Padding**: 80px (left/right)
- **Mobile Padding**: 16px (all sections - **CRITICAL**: Consistent across all pages)
- **Mobile Content Width**: 358px (390px viewport - 32px total padding)
- **Center Alignment**: All containers centered with `margin: 0 auto`

#### Spacing Scale
```css
--spacing-xs: 8px;
--spacing-sm: 16px;
--spacing-md: 24px;
--spacing-lg: 32px;
--spacing-xl: 48px;
--spacing-2xl: 64px;
--spacing-3xl: 80px;
--spacing-4xl: 120px;
```

### Typography Scale

#### Font Families
- **Headings**: Poppins Bold (700 weight)
- **Body Text**: Inter Regular (400 weight)
- **Buttons**: Inter Regular (400 weight)

#### Font Sizes

| Element | Desktop | Mobile | Line Height | Weight | Notes |
|---------|---------|---------|-------------|---------|-------|
| **H1 (Hero)** | 50px | 32px | 1.2 (60px/38.4px) | 700 | Page titles, hero sections |
| **H2 (Section)** | 38px | 28px | 1.3 (49.4px/36.4px) | 700 | Major section headings |
| **H3 (Subsection)** | 28px | 24px | 1.4 (39.2px/33.6px) | 700 | Subsection titles |
| **Body Large** | 18px | 16px | 1.5 (27px/24px) | 400 | Large body text, intros |
| **Body** | 16px | 14px | 1.5 (24px/21px) | 400 | Standard body text |
| **Body Small** | 14px | 12px | 1.5 (21px/18px) | 400 | Small text, captions |
| **Button** | 16px | 16px | 1 (16px) | 400 | Button labels |

**Typography Notes:**
- All font sizes are in pixels for precision
- Line heights maintain readability across devices
- Responsive sizing uses Tailwind's responsive classes
- All headings use Poppins Bold
- All body text and UI elements use Inter Regular

### Brand Colors

#### Primary Palette
```javascript
const brandColors = {
  blue: '#3CBEEB',        // Primary blue
  green: '#01E486',       // Success, highlights
  orange: '#FD8721',      // CTA, emphasis
  pink: '#FF60DF',        // Accents, links
  redishPink: '#FF5C8A',  // Default underline color
  purple: '#AD80F9'       // Secondary accents
};
```

#### Tailwind Configuration
```css
/* In globals.css @theme block */
@theme {
  --color-brand-blue: #3CBEEB;
  --color-brand-green: #01E486;
  --color-brand-orange: #FD8721;
  --color-brand-pink: #FF60DF;
  --color-brand-redish-pink: #FF5C8A;
  --color-brand-purple: #AD80F9;
}
```

#### Color Usage Guidelines
| Color | Primary Use | Examples |
|-------|-------------|----------|
| Blue | Services, trust elements | Service cards, tech icons |
| Green | Success states, growth | Knowledge hub, positive metrics |
| Orange | CTAs, case studies | Case study headers, CTAs |
| Pink | About, values | About sections, values |
| Redish Pink | Default accents | Default underlines, highlights |
| Purple | Services, technology | Services accordion, tech pages |

### Component Standards

#### UnderlinedTitle Component

**Implementation:**
- **Type**: SVG curved underlines with quadratic bezier paths
- **Formula**: `M 0 ${startY} Q ${lineWidth / 2} ${controlY} ${lineWidth} ${endY}`
- **Technology**: Dynamic SVG rendering with ResizeObserver
- **Multi-line Support**: Yes - automatically measures and curves each line

**Default Props:**
```typescript
{
  underlineColor: '#FF5C8A',    // Redish pink
  size: 'large',                 // Options: 'small' | 'medium' | 'large'
  curveIntensity: 0.01,          // Curve depth multiplier
  underlineOffset: 48,           // Distance from text baseline
  as: 'h2'                       // HTML element to render
}
```

**Size Mappings:**
| Size | Stroke Width | Best For |
|------|--------------|----------|
| small | 7px | H3 titles (18px text) |
| medium | 9px | H2 titles (38px text) |
| large | 11px | H1 titles (50px text) |

**Usage Pattern:**
```jsx
<UnderlinedTitle
  as="h1"
  className="text-5xl font-bold"
  underlineColor="#FF60DF"
  size="large"
>
  Your Title Here
</UnderlinedTitle>
```

**Reference Files:**
- Component: `src/components/UnderlinedTitle.tsx`
- Guide: [UNDERLINE_GUIDE.md](UNDERLINE_GUIDE.md)
- Sizing: [SIZING_REFERENCE.md](SIZING_REFERENCE.md)

#### Button Specifications

**Primary Button:**
- Font: Inter Regular, 16px
- Padding: 16px 32px
- Border Radius: 4px
- Min Width: 160px
- Gap between text and arrow: 8px
- Hover: Scale 1.05, transition 200ms

**Secondary Button:**
- Font: Inter Regular, 16px
- Padding: 14px 30px
- Border: 2px solid currentColor
- Border Radius: 4px
- Background: Transparent
- Hover: Background fill with color

**Button Spacing:**
- Horizontal gap between buttons: **32px** (CRITICAL)
- Mobile: Stack vertically with 16px gap
- Alignment: Center aligned in button groups

#### Responsive Images

**Specifications:**
- Use Next.js Image component for all images
- Define explicit width/height for each breakpoint
- Implement proper aspect ratios
- Use `priority` for above-fold images
- Use `loading="lazy"` for below-fold images

**Example:**
```jsx
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  className="w-full h-auto"
  priority={isAboveFold}
/>
```

### Section Spacing

**Consistent vertical spacing between sections:**
- Desktop: 80px (--spacing-3xl)
- Mobile: 48px (--spacing-xl)

**Within sections:**
- Heading to content: 32px (--spacing-lg)
- Between content blocks: 24px (--spacing-md)
- Between related items: 16px (--spacing-sm)

---

## Functional Requirements

### Content Management

#### Custom Post Types

1. **Services** (`services`)
   - Hero section with title, description, image, CTA
   - Service bullet points (repeater)
   - Statistics section
   - Features grid (icon, title, description)
   - Process steps
   - Related case studies
   - Taxonomy: Service Types

2. **Case Studies** (`caseStudies`)
   - Project overview (client, logo, URL, completion date)
   - Challenge description
   - Solution explanation
   - Results achieved
   - Featured flag
   - Taxonomy: Project Types

3. **Team Members** (`teamMembers`)
   - Personal information (name, title, bio)
   - Contact (email, LinkedIn)
   - Skills with proficiency levels
   - Public profile toggle
   - Taxonomy: Departments

4. **Job Listings** (`jobListings`)
   - Job details (location, salary, experience level)
   - Requirements and qualifications
   - Application form integration
   - Job status (active/inactive)

5. **Blog Posts** (`blog_posts`)
   - Standard WordPress post fields
   - Custom ACF fields for layout options
   - Featured image
   - Taxonomy: Blog Categories
   - GraphQL names: `blogPost` (singular), `blogPosts` (plural)
   - Frontend route: `/news/[slug]`

6. **Technologies** (`technologies`)
   - Technology name
   - Logo (featured image)
   - Description
   - Used in technology sliders

7. **Policies** (`policies`)
   - Policy title
   - Content (WYSIWYG editor)
   - Last updated date
   - Effective date
   - Frontend route: `/policies/[slug]`

#### Global Content Blocks

Reusable content sections managed in WordPress Global Options:

- **Approach Block**: Company methodology steps
- **Values Block**: Core company values
- **Newsletter Signup**: Email subscription form
- **Services Accordion**: Interactive services display
- **Technologies Slider**: Technology logos carousel
- **Showreel**: Video/media showcase
- **Locations Image**: Office locations with tabs
- **News Carousel**: Latest blog posts
- **Why CDA Block**: Value propositions
- **Stats Block**: Company statistics (4 numbers with colors)

### Page Structure

#### Homepage
- Hero section
- Stats block
- Services accordion
- Approach block
- Case studies section
- Showreel
- Technology slider
- News carousel
- Newsletter signup

#### About Page
- Hero section
- "Behind CDA" section
- Values block
- Stats block
- Team preview
- Locations image
- Culture gallery slider

#### Services Pages
- **Overview** (`/services`):
  - Hero section
  - Services grid with filtering
  - Featured case study
  - Values block
  - Approach block

- **Individual Service** (`/services/[slug]`):
  - Hero section
  - Statistics
  - Features grid
  - Process steps
  - Case studies
  - Newsletter signup

#### Team Pages
- **Listing** (`/team`):
  - Hero section
  - Leadership team
  - All team members grid
  - Filters by department

- **Profile** (`/team/[slug]`):
  - Member details
  - Bio
  - Skills
  - Contact information
  - Other team members

---

## Known Issues & Patterns

### Common Bug Patterns (from Jira CDA-56 through CDA-65)

#### Pattern 1: Mobile Padding Inconsistency
- **Frequency**: 8+ pages affected
- **Root Cause**: Hardcoded padding values instead of consistent utility classes
- **Symptom**: Some sections have 20px, others 16px, creating visual inconsistency
- **Solution**: Use consistent `px-4` (16px) on all mobile sections
- **Priority**: HIGH
- **Related Tickets**: CDA-56, CDA-58, CDA-60

#### Pattern 2: Section Spacing Variation
- **Frequency**: Homepage sections (CDA-56, 57, 58)
- **Root Cause**: Inline styles and hardcoded values
- **Symptom**: Inconsistent vertical spacing between sections
- **Solution**: Use spacing scale variables (`--spacing-xl`, `--spacing-3xl`)
- **Priority**: MEDIUM
- **Component**: Consider creating `SectionWrapper` component

#### Pattern 3: Responsive Image Positioning
- **Frequency**: Hero sections, team photos
- **Root Cause**: Fixed positioning not responsive
- **Symptom**: Images overflow or misalign on mobile
- **Solution**: Use responsive positioning classes and aspect ratio containers
- **Priority**: HIGH
- **Related Tickets**: CDA-61, CDA-63

#### Pattern 4: Button Layout on Mobile
- **Frequency**: CTA sections across site
- **Root Cause**: Insufficient gap between buttons
- **Symptom**: Buttons too close together (8-16px instead of required 32px)
- **Solution**: Use `gap-8` (32px) on button containers, stack on mobile
- **Priority**: MEDIUM
- **Related Tickets**: CDA-59

---

## SEO Requirements

### Meta Tags
- Dynamic title tags from WordPress content
- Meta descriptions from ACF fields
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs

### Structured Data
- Organization schema
- Article schema for blog posts
- JobPosting schema for job listings
- Service schema for services

### Sitemap
- Auto-generated sitemap at `/sitemap.xml`
- Include all pages, posts, services, case studies
- Exclude admin pages and draft content

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Indicators**: Visible focus states on all interactive elements
- **Alt Text**: All images have descriptive alt text
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **ARIA Labels**: Used where needed for screen readers
- **Form Validation**: Clear error messages and validation feedback

---

## Browser Support

### Supported Browsers
- **Desktop**:
  - Chrome (last 2 versions)
  - Firefox (last 2 versions)
  - Safari (last 2 versions)
  - Edge (last 2 versions)

- **Mobile**:
  - iOS Safari (last 2 versions)
  - Chrome for Android (last 2 versions)

### Progressive Enhancement
- Core functionality works in all supported browsers
- Enhanced features gracefully degrade
- SVG underlines fallback to no underline if not supported

---

## Development Standards

### Code Quality
- **TypeScript**: Use for all new components where possible
- **ESLint**: Follow Next.js recommended config
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **CSS**: Tailwind utilities preferred over custom CSS

### Git Workflow
- Feature branches from `main`
- Descriptive commit messages
- Pull requests for all changes
- Code review before merge

### Documentation
- All new components documented
- Complex logic commented
- README files for major features
- Keep this PRD updated with changes

---

## Testing Requirements

### Manual Testing Checklist
- [ ] Desktop (1920px, 1440px, 1024px)
- [ ] Tablet (768px)
- [ ] Mobile (390px, 375px)
- [ ] Chrome, Firefox, Safari, Edge
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

### Performance Testing
- [ ] Lighthouse audit (all categories 90+)
- [ ] Core Web Vitals
- [ ] Image optimization verification
- [ ] Bundle size analysis

---

## Deployment Requirements

### Environment Configuration

**Local Development:**
```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production:**
```env
NEXT_PUBLIC_WORDPRESS_URL=https://cdanewwebsite.wpenginepowered.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://cdanewwebsite.wpenginepowered.com/graphql
NEXT_PUBLIC_SITE_URL=https://cda-frontend-nine.vercel.app
```

### Build Process
1. Run `npm run build` locally to verify
2. Fix any TypeScript/ESLint errors
3. Test production build with `npm run start`
4. Deploy to Vercel (automatic from Git)
5. Verify deployment in production environment

---

## Success Metrics

### Technical Metrics
- Lighthouse scores: 90+ (all categories)
- Core Web Vitals: All green
- Build time: < 2 minutes
- Page load time: < 2 seconds

### User Experience Metrics
- Bounce rate: < 40%
- Average session duration: > 2 minutes
- Pages per session: > 3
- Mobile vs Desktop ratio: 50/50

---

## Future Enhancements

### Planned Features
1. **Analytics Integration**: Google Analytics 4
2. **Search Functionality**: Site-wide search
3. **Blog Filtering**: Advanced filtering and categories
4. **Performance Monitoring**: Real-time performance tracking
5. **A/B Testing**: Conversion rate optimization

### Technical Debt
1. Standardize all mobile padding to 16px
2. Create `SectionWrapper` component for consistent spacing
3. Implement `ResponsiveImage` component
4. Consolidate button styles into reusable component
5. Add comprehensive TypeScript types across entire codebase

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Next Review**: When major features are added
**Maintained By**: Development Team
