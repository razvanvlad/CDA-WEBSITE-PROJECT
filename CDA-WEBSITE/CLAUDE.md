# CDA Website - Complete WordPress Headless CMS Implementation

## Project Structure
```
CDA-WEBSITE-PROJECT/CDA-WEBSITE/
├── cda-frontend/              # Next.js frontend
├── wordpress-backend/         # WordPress with ACF + WPGraphQL
├── db/                       # Database files
├── documentation/            # Complete project documentation
│   ├── client specs/         # Client requirements and designs
│   │   ├── Design Exports full page from Adobe XD/  # All page designs
│   │   ├── CDA - Website Spec (1).docx             # Technical specifications
│   │   ├── CDA new site - sitemap.xlsx             # Site structure
│   │   ├── CDA Website - Animation Specification Final.docx
│   │   └── eCommerce Calculator (1).xlsx           # Calculator functionality
│   └── development guide/    # Technical documentation
└── CLAUDE.md                # This file
```

## Your Mission: Complete WordPress Backend Implementation

### Current Status
- **Working**: Homepage basic structure, About page, Why CDA global block
- **Issue**: Approach block missing from GraphQL schema
- **Goal**: Complete all content structures in 1 hour

### Phase 1: Comprehensive Design Analysis
Analyze ALL design files in `documentation/client specs/Design Exports full page from Adobe XD/`:

#### Page Templates to Create:
1. **1.0 CDA - Homepage.png** - Main landing page
2. **2.0 CDA - About.png** - About us page
3. **3.0 CDA - Team Listing.png** - Team overview
4. **3.1 CDA - Team Profile.png** - Individual team member
5. **4.2 CDA - Service Overview.png** - Services landing
6. **4.3-4.9 CDA - Service Details** - Individual service pages (7 different services)
7. **5.0 CDA - Resource Center.png** - Knowledge hub
8. **5.1 CDA - Case Study Details.png** - Individual case studies
9. **5.2 CDA - News Article.png** - Blog/news posts
10. **6.0 CDA - Contact Us.png** - Contact page
11. **7.0-7.1 CDA - Job** - Career pages
12. **8.0 CDA - Technologies.png** - Technologies showcase
13. **9.0 CDA - ROI.png** - ROI calculator page
14. **10.0-10.1 CDA - Policies** - Legal pages
15. **11.0 CDA - 404 Error Page.png** - Error page

#### Documents to Analyze:
- **CDA - Website Spec (1).docx** - Detailed technical requirements
- **CDA new site - sitemap.xlsx** - Site structure and navigation
- **CDA Website - Animation Specification Final.docx** - Animation requirements
- **eCommerce Calculator (1).xlsx** - Calculator functionality

### Phase 2: Content Architecture Analysis

#### Identify Global Blocks (Reusable Across Pages):
From the designs, identify which sections appear multiple times:
- Header/Navigation
- Why CDA block (already working)
- Approach/How We Work block (needs fixing)
- Technologies showcase
- Locations/Contact info
- Case studies preview
- Newsletter signup
- Footer content
- Call-to-action sections

#### Identify Page-Specific Content:
Analyze each design to determine unique content structures needed.

#### Identify Custom Post Types:
- Services (7 different types)
- Case Studies
- Team Members
- News/Blog Posts
- Job Listings
- Technologies
- Testimonials

### Phase 3: Technical Implementation Plan

#### 1. Fix Current Issues
- Resolve approach block missing from GraphQL schema
- Debug field registration problems
- Test Why CDA block as working template

#### 2. Generate Complete ACF Structure
Create PHP field definitions for:
- All global blocks identified
- All page templates
- All custom post types
- Proper GraphQL integration

#### 3. Create GraphQL Queries
- Query for each page template
- Global blocks query
- Custom post type queries
- Combined queries for efficiency

#### 4. Build React Components
- Global block components with proper styling
- Page template components
- Custom post type display components
- Reusable UI components

### Current Technical Setup
- **WordPress Backend**: Working with ACF + WPGraphQL
- **Global Options**: `globalOptions.globalSharedContent` structure
- **Working Example**: Why CDA block (use as template)
- **GraphQL Endpoint**: Available and tested
- **Frontend**: Next.js with Apollo Client

### Key Technical Requirements
- All ACF fields: `show_in_graphql => 1`
- Image fields: `node { sourceUrl altText }` structure
- Consistent naming conventions
- Responsive design patterns
- Animation specifications compliance
- Calculator functionality integration

### Success Criteria
1. **All designs have corresponding WordPress content structure**
2. **Complete GraphQL schema for all content**
3. **All global blocks working and reusable**
4. **Clean, maintainable code structure**
5. **No GraphQL field errors**
6. **Ready for frontend design implementation**

### Deliverables Needed

#### 1. Content Architecture Document
- Complete mapping of designs to content structure
- Field definitions for each section
- Relationships between content types
- Global vs page-specific content breakdown

#### 2. Complete ACF PHP Implementation
- All field groups in single, clean PHP file
- Proper field keys and naming
- GraphQL integration for all fields
- Custom post type definitions

#### 3. GraphQL Query Library
- Query for each page template
- Global content queries
- Custom post type queries
- Testing queries for debugging

#### 4. React Component Structure
- Global block components
- Page template components
- Utility components
- Proper data flow patterns

#### 5. Implementation Guide
- Step-by-step setup instructions
- Testing procedures
- Debugging guide
- Design implementation roadmap

### Priority Implementation Order
1. **Analyze all designs** and create content map
2. **Fix approach block issue** using working Why CDA pattern
3. **Generate all global blocks** needed across designs
4. **Create page template structures** for main pages
5. **Set up custom post types** for dynamic content
6. **Test complete GraphQL schema**
7. **Generate React components** for immediate design work

### Animation & Interaction Requirements
Reference `CDA Website - Animation Specification Final.docx` for:
- Scroll-triggered animations
- Hover effects
- Page transitions
- Loading states
- Interactive elements

### Calculator Integration
Reference `eCommerce Calculator (1).xlsx` for:
- ROI calculator functionality
- Form structure and logic
- Results display format
- Integration with contact forms

## Start Here
1. **Analyze all design files** to understand complete scope
2. **Map designs to content structures** needed
3. **Generate complete ACF field definitions** 
4. **Create all GraphQL queries** required
5. **Build React component library** for rapid design implementation

The goal: Complete WordPress backend that supports ALL designs and enables rapid frontend development focused purely on styling and animations.
