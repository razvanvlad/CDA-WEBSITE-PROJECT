# CDA Website - Complete Content Architecture Mapping

*Generated from all Adobe XD design files analysis - This is the definitive guide for ACF field creation*

## Overview
This document maps every section, field, and content type identified from analyzing all 23 Adobe XD design files. Use this as the master reference for creating ACF field groups and WordPress content structure.

---

## GLOBAL BLOCKS (Reusable Across Pages)

### 1. Header/Navigation
**Used on**: All pages
**Fields needed**:
- Logo (image)
- Main navigation items (repeater)
  - Menu item label (text)
  - Menu item URL (URL)
  - Submenu items (repeater)
- Secondary navigation (Services dropdown with 7 items)
- Mobile menu toggle

### 2. Why CDA Block ✅ (Already Working)
**Used on**: Homepage, About, Service pages
**Fields needed** (reference for other blocks):
- Section heading (text)
- Description (textarea)
- Statistics (repeater)
  - Number (text)
  - Label (text)
  - Description (text)

### 3. Our Approach Block ⚠️ (Needs Fixing)
**Used on**: Homepage, About, Service pages  
**Fields needed**:
- Section heading (text)
- Description (textarea)
- Process steps (repeater)
  - Step number (text)
  - Step title (text)
  - Step description (textarea)
  - Step icon/image (image)

### 4. Showreel Block
**Used on**: Homepage, About, Service pages, Resource Center
**Fields needed**:
- Section heading (text)
- Video thumbnail (image)
- Video URL (URL/oEmbed)
- Play button text (text)
- Client logos (repeater)
  - Client logo (image)
  - Client name (text)

### 5. Technologies Showcase
**Used on**: Homepage, About, Service pages
**Fields needed**:
- Section heading (text)
- Technology categories (repeater)
  - Category icon (image)
  - Category name (text)
  - Category description (text)
  - Link URL (URL)

### 6. Newsletter Signup
**Used on**: Contact, Resource Center
**Fields needed**:
- Section heading (text)
- Description (text)
- Form placeholder texts (text fields)
- Submit button text (text)
- Terms and conditions link (URL)
- Privacy notice (textarea)

### 7. Ready To Start Your Project CTA
**Used on**: All pages (footer area)
**Fields needed**:
- Main heading (text)
- CTA button text (text)
- CTA button URL (URL)
- Background decorative elements (image)

### 8. Footer
**Used on**: All pages
**Fields needed**:
- Company info section
  - Copyright text (text)
  - Links (repeater)
    - Link text (text)
    - Link URL (URL)
- Navigation sections (repeater)
  - Section title (text)
  - Links (repeater)
    - Link text (text)
    - Link URL (URL)
- Social media links (repeater)
  - Platform name (text)
  - Icon (image)
  - URL (URL)
- Contact information
  - Phone number (text)
  - Email (email)

---

## PAGE TEMPLATES

### 1. Homepage Template
**File**: `1.0 CDA - Homepage.png`
**Sections identified**:

#### Hero Section
- Main headline (text)
- Subheadline (text)  
- CTA button (text + URL)
- Hero image/animation (image)
- Decorative elements (image)

#### Services Grid
- Section heading (text)
- Services (repeater - 6 services shown)
  - Service icon (image)
  - Service title (text)
  - Service description (text)
  - Service URL (URL)

#### Company Stats
- Statistics (repeater - 4 stats shown)
  - Number (text)
  - Label (text)
  - Icon (image)

#### Case Study Preview
- Section heading (text)
- Featured case study (relationship to case studies)
  - Title (text)
  - Description (text)
  - Image (image)
  - Read more URL (URL)

#### Client Testimonial
- Quote text (textarea)
- Client name (text)
- Client company (text)
  - Client photo (image)

### 2. About Page Template  
**File**: `2.0 CDA - About.png`
**Sections identified**:

#### Hero Section
- Page title (text)
- Subtitle/description (textarea)
- Hero image (image)

#### Company Story Section
- Section heading (text)
- Story content (textarea)
- Company image (image)

#### Values/Benefits Section
- Section heading (text) 
- Values grid (repeater - 6 items shown)
  - Value icon (image)
  - Value title (text)
  - Value description (text)

#### Team Preview
- Section heading (text)
- Featured team members (relationship to team members - 4 shown)

#### Office Locations
- Section heading (text)
- Location images/graphics (image)

### 3. Team Listing Template
**File**: `3.0 CDA - Team Listing.png`
**Sections identified**:

#### Hero Section
- Page title (text)
- Page description (textarea)
- Decorative elements (image)

#### Founder Spotlight
- Section heading (text)
- Founder info
  - Name (text)
  - Title (text)
  - Bio (textarea)
  - Photo (image)
  - Profile link (URL)

#### Leadership Team
- Section heading (text)
- Team members grid (relationship to team members)

#### Join Our Team CTA
- Section heading (text)
- Description (textarea)
- CTA button (text + URL)
- Decorative elements (image)

### 4. Team Profile Template
**File**: `3.1 CDA - Team Profile.png` 
**Sections identified**:

#### Profile Header
- Name (text)
- Title (text)
- Bio (textarea)
- Profile photo (image)
- LinkedIn URL (URL)

#### Booking Section
- Section heading (text)
- Booking form fields
  - Name (text)
  - Email (email)
  - Time preferences (select)
  - Message (textarea)
- Calendar widget integration
- Phone number display (text)

#### Other Team Members
- Section heading (text)
- Related team members (relationship)

### 5. Service Overview Template
**File**: `4.2 CDA - Service Overview.png`
**Sections identified**:

#### Hero Section  
- Page title (text)
- Description (textarea)
- Service icon/illustration (image)

#### Services Grid
- Section heading (text)
- Services list (repeater - 6 services)
  - Service name (text)
  - Service description (text)
  - Service icon (image)
  - Service URL (URL)

#### Process Section
- Section heading (text)
- Process steps (repeater)
  - Step number (text)
  - Step title (text)
  - Step description (text)

#### Statistics Section
- Stats (repeater - 4 shown)
  - Number (text)  
  - Label (text)
  - Description (text)

#### Case Studies Preview
- Section heading (text)
- Featured case studies (relationship)

### 6. Service Detail Templates
**Files**: `4.3` through `4.9` (7 service types)
**Sections identified** (common structure):

#### Service Hero
- Service name (text)
- Service description (textarea) 
- Service icon (image)

#### Key Benefits/Stats
- Statistics (repeater)
  - Number (text)
  - Label (text)
  - Metric type (text)

#### Service Process
- Section heading (text)
- Process steps (repeater)
  - Step title (text)
  - Step description (textarea)
  - Step image (image)

#### Case Study Integration
- Featured case studies (relationship)

### 7. Resource Center Template
**File**: `5.0 CDA - Resource Center.png`
**Sections identified**:

#### Hero Section
- Page title (text)
- Description (textarea)
- Search/filter functionality

#### Content Grid
- Filter categories (taxonomy)
- Content items (relationship to case studies/articles)
  - Item type (case study/article)
  - Title (text)
  - Description (text)
  - Featured image (image)
  - Date (date)
  - Read time (text)

#### Pagination
- Previous/Next navigation

### 8. Case Study Detail Template
**File**: `5.1 CDA - Case Study Details.png`
**Sections identified**:

#### Case Study Header
- Title (text)
- Client name (text)
- Project type (taxonomy)
- Featured image (image)

#### Project Overview
- Challenge description (textarea)
- Solution description (textarea)  
- Results description (textarea)

#### Key Metrics
- Results stats (repeater)
  - Metric number (text)
  - Metric label (text)
  - Metric description (text)

#### Technologies Used
- Technology tags (taxonomy)
- Technology icons (repeater)

#### Project Images
- Image gallery (gallery field)

#### Related Case Studies  
- Related projects (relationship)

### 9. Contact Page Template
**File**: `6.0 CDA - Contact Us.png`
**Sections identified**:

#### Contact Form
- Form heading (text)
- Form fields
  - First name (text)
  - Last name (text)
  - Email (email)
  - Phone (text)
  - Reason/subject (select)
  - Message (textarea)
- Submit button (text)
- Terms agreement (checkbox + link)

#### Contact Information
- Phone number (text)
- Social media links (repeater)

#### Locations Section
- Section heading (text)
- Office locations (repeater)
  - Country/region (text)
  - City name (text)
  - Address (textarea)
  - Email (email)
  - Phone (text)

### 10. ROI Calculator Template  
**File**: `9.0 CDA - ROI.png`
**Sections identified**:

#### Calculator Section
- Page title (text)
- Calculator description (textarea)
- Calculator form fields
  - Input labels (text fields)
  - Input types (number/select)
  - Calculate button (text)
- Results display area
- Calculator illustration (image)

#### Case Studies Section
- Section heading (text)
- Featured case studies (relationship)

---

## CUSTOM POST TYPES NEEDED

### 1. Team Members
**Fields needed**:
- Name (text)
- Title (text)  
- Bio (textarea)
- Profile photo (image)
- LinkedIn URL (URL)
- Email (email)
- Phone (text)
- Booking calendar integration
- Featured (yes/no - for homepage display)

### 2. Services  
**Fields needed**:
- Service name (text)
- Service description (textarea)
- Service icon (image)
- Service type (taxonomy)
- Key benefits (repeater)
- Process steps (repeater)
- Statistics (repeater)
- Featured case studies (relationship)
- SEO fields (Yoast integration)

### 3. Case Studies
**Fields needed**:
- Title (text)
- Client name (text)
- Project type (taxonomy)
- Challenge (textarea)
- Solution (textarea)
- Results (textarea)
- Key metrics (repeater)
- Technologies used (taxonomy)
- Featured image (image)
- Image gallery (gallery)
- Date completed (date)
- Featured (yes/no)

### 4. News/Blog Articles
**Fields needed**:
- Title (text)
- Content (WYSIWYG)
- Excerpt (textarea)
- Featured image (image)
- Author (relationship to team members)
- Publication date (date)
- Read time estimate (text)
- Categories (taxonomy)
- Tags (taxonomy)

### 5. Job Listings
**Fields needed**:
- Job title (text)
- Department (text)
- Location (text)
- Job type (full-time/part-time/contract)
- Description (textarea)
- Requirements (textarea)
- Benefits (textarea)
- Salary range (text)
- Application deadline (date)
- Apply URL (URL)

### 6. Technologies
**Fields needed**:
- Technology name (text)
- Category (taxonomy)
- Icon (image)
- Description (textarea)
- Proficiency level (select)
- Featured (yes/no)

---

## WORDPRESS SETTINGS PAGES NEEDED

### 1. Global Options (ACF Options Page)
**Sections**:

#### Site Settings
- Site logo (image)
- Contact phone (text)
- Contact email (email)
- Company address (textarea)

#### Global Content Blocks
- Why CDA block fields
- Our Approach block fields  
- Showreel block fields
- Technologies showcase fields
- Newsletter signup fields
- CTA block fields

#### Social Media
- Social links (repeater)
  - Platform (text)
  - URL (URL)
  - Icon (image)

#### Footer Settings
- Footer content areas (repeater)
- Copyright text (text)
- Footer links (repeater)

---

## TAXONOMIES NEEDED

1. **Service Types**
   - eCommerce
   - B2B Lead Generation
   - Software Development
   - Booking Systems
   - Digital Marketing
   - Outsourced CMO
   - AI

2. **Project Types** (for case studies)
   - Web Development
   - Marketing Campaign
   - System Integration
   - Consulting

3. **Technologies Categories**
   - Frontend
   - Backend
   - Database
   - Marketing Tools
   - Analytics

4. **Content Categories** (for articles)
   - Industry Insights
   - Case Studies
   - Company News
   - Technical Articles

---

## FIELD NAMING CONVENTIONS

### Prefix Structure
- Global blocks: `global_`
- Page sections: `page_`
- Post types: `{post_type}_`

### Field Key Structure  
- Format: `field_[section]_[field_name]`
- Example: `field_global_why_cda_heading`

### GraphQL Integration
- All fields MUST have: `'show_in_graphql' => 1`
- GraphQL names should be camelCase
- Images should include: `node { sourceUrl altText }`

---

## IMPLEMENTATION PRIORITY

### Phase 1: Fix Current Issues
1. ✅ Why CDA block (working)
2. ⚠️ Our Approach block (needs fixing)  
3. Global options structure

### Phase 2: Core Page Templates
1. Homepage template
2. About page template  
3. Contact page template

### Phase 3: Dynamic Content
1. Team members post type
2. Services post type
3. Case studies post type

### Phase 4: Additional Features
1. Resource center
2. ROI calculator
3. Job listings

---

## GRAPHQL SCHEMA REQUIREMENTS

Each content type needs queries for:
- Single item retrieval
- List/archive views
- Related content
- Featured content filters
- Search functionality

---

*This document serves as the complete blueprint for ACF field creation and WordPress content structure based on all design files analysis.*