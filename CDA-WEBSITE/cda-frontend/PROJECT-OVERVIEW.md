# CDA Website Project - Complete Overview

## Project Introduction

The **CDA Website** is a modern, headless WordPress-powered website built with **Next.js 15** and **React 19**. This is a professional business website that showcases services, case studies, team members, job listings, and more. The architecture follows a headless CMS approach where WordPress serves as the content management backend via GraphQL, while Next.js provides the frontend user experience.

## Technology Stack

### Frontend
- **Next.js 15.4.7** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Apollo Client 4.0.3** - GraphQL client
- **Next.js Image Optimization** - Automatic image optimization

### Backend Integration
- **WordPress** - Headless CMS (GraphQL endpoint)
- **WPGraphQL** - WordPress GraphQL plugin
- **Advanced Custom Fields (ACF)** - Custom content fields

### Development & Build Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel/WP Engine** - Deployment platforms

## Project Architecture

```
┌─────────────────────┐    GraphQL     ┌─────────────────────┐
│                     │◄─────────────► │                     │
│    Next.js 15       │                │   WordPress CMS     │
│   (Frontend)        │                │   (Backend)         │
│                     │                │                     │
└─────────────────────┘                └─────────────────────┘
          │                                        │
          │                                        │
    ┌─────▼─────┐                            ┌─────▼─────┐
    │  Vercel   │                            │ WP Engine │
    │(Frontend) │                            │(Backend)  │
    └───────────┘                            └───────────┘
```

## Directory Structure

```
cda-frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.js                 # Root layout
│   │   ├── page.js                   # Homepage
│   │   ├── about/                    # About page
│   │   ├── services/                 # Services pages
│   │   │   ├── page.js               # Services overview
│   │   │   ├── ServicesClient.jsx    # Client-side services
│   │   │   └── [slug]/page.js        # Individual service
│   │   ├── case-studies/             # Case studies
│   │   │   ├── page.js               # Case studies overview
│   │   │   ├── CaseStudiesClient.jsx # Client-side case studies
│   │   │   └── [slug]/page.js        # Individual case study
│   │   ├── jobs/                     # Job listings
│   │   │   ├── page.js               # Jobs overview
│   │   │   ├── JobListingsClient.jsx # Client-side jobs
│   │   │   └── [slug]/page.js        # Individual job
│   │   ├── news/[slug]/              # News articles
│   │   ├── policies/[slug]/          # Policy pages
│   │   ├── contact/                  # Contact page
│   │   ├── technologies/             # Technologies page
│   │   ├── knowledge-hub/            # Knowledge hub
│   │   └── roi/                      # ROI calculator
│   ├── components/                   # Reusable components
│   │   ├── Header.js                 # Site header
│   │   ├── Footer.js                 # Site footer
│   │   ├── SEO.js                    # SEO meta tags
│   │   ├── GlobalBlocks/             # Content blocks
│   │   │   ├── ApproachBlock.js      # Our approach section
│   │   │   ├── CaseStudies.js        # Case studies block
│   │   │   ├── NewsCarousel.js       # News carousel
│   │   │   ├── ServicesAccordion.js  # Services accordion
│   │   │   ├── TechnologiesSlider.js # Tech logos slider
│   │   │   ├── ValuesBlock.js        # Company values
│   │   │   └── WhyCdaBlock.js        # Why choose CDA
│   │   └── Sections/                 # Page sections
│   │       ├── ContactForm.js        # Contact form
│   │       ├── ServicesProcess.js    # Services process
│   │       └── ServicesStats.js      # Services statistics
│   ├── lib/                          # Utilities & GraphQL
│   │   ├── graphql-queries.js        # All GraphQL queries
│   │   ├── apollo-client.js          # Apollo GraphQL client
│   │   └── sanitizeTitleHtml.js      # HTML sanitization
│   ├── hooks/                        # Custom React hooks
│   │   └── useErrorHandler.js        # Error handling hook
│   └── styles/                       # Global styles
│       └── global.css                # Global CSS
├── public/                           # Static assets
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies & scripts
└── README-ENVIRONMENT.md             # Environment setup guide
```

## Custom Post Types

The website uses several custom post types managed in WordPress:

**📝 WordPress Backend Configuration**:
Custom post types are defined in: `wp-content/mu-plugins/cda-cms/post-types/`
- `services.php` → Services post type
- `case-studies.php` → Case Studies post type  
- `team-members.php` → Team Members post type
- `job-listings.php` → Job Listings post type
- `blog-posts.php` → Blog Posts post type
- `technologies.php` → Technologies post type
- `policies.php` → Policies post type

### 1. Services (`services`)
**Purpose**: Showcase business services and solutions
**Fields**: 
- Hero section (title, subtitle, description, image, CTA)
- Service bullet points
- Statistics
- Features (icon, title, description)
- Process steps
- Values section
- Case studies section
- Newsletter section

**Taxonomies**: Service Types
**Frontend**: `/services/[slug]`

### 2. Case Studies (`caseStudies`)
**Purpose**: Portfolio of client success stories
**Fields**:
- Project overview (client name, logo, URL, completion date)
- Challenge description
- Solution explanation
- Results achieved
- Featured flag

**Taxonomies**: Project Types
**Frontend**: `/case-studies/[slug]`

### 3. Team Members (`teamMembers`)
**Purpose**: Company team showcase
**Fields**:
- Job title
- Short & full bio
- Email & LinkedIn
- Skills with proficiency levels
- Featured flag
- Public profile flag

**Taxonomies**: Departments
**Frontend**: `/team/[slug]` (if public profile enabled)

### 4. Job Listings (`jobListings`)
**Purpose**: Career opportunities
**Fields**:
- Job details (location, salary, experience level, publish date)
- Requirements (position description, ideal candidate, skills, qualifications)
- Job status

**Frontend**: `/jobs/[slug]`

### 5. Blog Posts (`blog_posts`)
**Purpose**: News articles and blog content
**Fields**: Standard WordPress post fields + ACF custom fields
**Taxonomies**: Blog Categories
**GraphQL Names**: `blogPost` (singular), `blogPosts` (plural)
**Frontend**: `/news-article/[slug]`

### 6. Technologies (`technologies`)
**Purpose**: Technology logos and descriptions
**Fields**: Featured image (logo), description
**Usage**: Used in technology sliders across the site

### 7. Policies (`policies`)
**Purpose**: Legal pages (privacy policy, terms, etc.)
**Fields**:
- Policy title
- Policy description (WYSIWYG editor)
- Last updated date
- Effective date

**GraphQL Names**: `policy` (singular), `policies` (plural)
**Frontend**: `/policies/[slug]`


## Global Content Management

The site uses a **Global Options** system for reusable content blocks:

### Global Content Blocks
- **Approach Block**: Company methodology steps
- **Values Block**: Core company values
- **Newsletter Signup**: Email subscription form
- **Photo Frame Block**: Decorative content sections
- **Services Accordion**: Interactive services display
- **Technologies Slider**: Partner/technology logos
- **Showreel**: Video/media showcase
- **Locations Image**: Office locations
- **News Carousel**: Latest blog posts
- **Why CDA Block**: Value propositions

## Page Structure & Working Process

### Homepage (`src/app/page.js`)
**Process**:
1. Fetches global content blocks via GraphQL
2. Fetches homepage-specific content
3. Uses toggle system to enable/disable content blocks
4. Renders dynamic content based on WordPress configuration

**Content Sources**:
- Header section from homepage ACF fields
- Global content blocks from Global Options
- Case studies section from homepage ACF fields

### Services Pages
**Overview Page** (`/services`):
1. Fetches all services with pagination
2. Gets service types for filtering
3. Displays overview content from ACF fields
4. Shows featured case study
5. Includes global blocks (Values, Approach)

**Individual Service** (`/services/[slug]`):
1. Uses `generateStaticParams()` for static generation
2. Fetches service by slug from WordPress
3. Renders rich content including:
   - Hero section
   - Statistics
   - Features grid
   - Process steps
   - Case studies
   - Newsletter signup

### Case Studies Pages
**Overview Page** (`/case-studies`):
1. Fetches case studies with pagination (100 items for client filtering)
2. Gets project types for filtering
3. Client-side filtering and search

**Individual Case Study** (`/case-studies/[slug]`):
1. Static generation with slug parameters
2. Displays project overview, challenge, solution, results
3. Shows client information and project details

### Job Listings
**Overview Page** (`/jobs`):
1. Fetches active job listings
2. Displays job cards with key details
3. Filters by location and experience level

**Individual Job** (`/jobs/[slug]`):
1. Shows complete job description
2. Displays requirements and qualifications
3. Includes application form integration

## GraphQL Integration

### Query Organization
All GraphQL queries are centralized in `src/lib/graphql-queries.js`:

- **Services Queries**: `GET_ALL_SERVICES`, `GET_SERVICE_BY_SLUG`, etc.
- **Case Studies Queries**: `GET_ALL_CASE_STUDIES`, `GET_CASE_STUDY_BY_SLUG`, etc.
- **Team Members Queries**: `GET_ALL_TEAM_MEMBERS`, `GET_TEAM_MEMBER_BY_SLUG`, etc.
- **Job Listings Queries**: `GET_ALL_JOB_LISTINGS`, `GET_JOB_LISTING_BY_SLUG`, etc.
- **Global Content Queries**: `GET_GLOBAL_CONTENT`

### Data Fetching Strategy
- **Static Generation**: Most pages use `generateStaticParams()` for SEO
- **Incremental Static Regeneration (ISR)**: 5-minute revalidation in development, 1-hour in production
- **Client-side Filtering**: Large datasets fetched server-side, filtered client-side
- **Error Handling**: Comprehensive error boundaries and fallbacks

## Environment Configuration

### Development
```bash
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production
```bash
NEXT_PUBLIC_WORDPRESS_URL=https://cdanewwebsite.wpenginepowered.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://cdanewwebsite.wpenginepowered.com/graphql
NEXT_PUBLIC_SITE_URL=https://cda-frontend-nine.vercel.app
```

### Auto-Detection
The `next.config.js` automatically detects:
- Local development vs production
- Vercel deployment URLs
- WordPress endpoint configuration

## Image Optimization

### Remote Patterns
Configured for WordPress image optimization:
- Local XAMPP: `http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/wp-content/uploads/**`
- WP Engine: `https://cdanewwebsite.wpenginepowered.com/wp-content/uploads/**`

### Optimization Features
- Next.js automatic image optimization
- WebP/AVIF format support
- Responsive image sizing
- Lazy loading
- Priority loading for above-fold images

## SEO & Performance

### SEO Features
- Dynamic meta tags from WordPress
- Open Graph and Twitter Card support
- Canonical URLs
- Structured data ready
- Sitemap generation (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)

### Performance Optimizations
- Static generation where possible
- Image optimization
- Font optimization (Inter, Poppins)
- CSS-in-JS with Tailwind
- GraphQL query optimization
- ISR caching strategy

## Deployment

### Frontend (Vercel)
- Automatic deployments from Git
- Edge functions support
- Global CDN
- Environment variables management

### Backend (WP Engine)
- Managed WordPress hosting
- GraphQL plugin active
- ACF Pro installed
- Media optimization

### Build Process
```bash
npm run build        # Production build
npm run start        # Production server
npm run dev          # Development server
npm run lint         # Code linting
```

## Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm run dev`
5. Access at `http://localhost:3000`

### Content Management
1. Access WordPress admin (backend)
2. Create/edit posts using custom post types
3. Configure global content blocks
4. Content automatically appears on frontend via GraphQL

### Adding New Features
1. Define GraphQL queries in `lib/graphql-queries.js`
2. Create React components in `components/`
3. Add pages in `app/` directory
4. Configure routing and metadata
5. Test both development and production environments

## Key Features Summary

✅ **Headless Architecture**: WordPress backend, Next.js frontend
✅ **Dynamic Content**: All content managed via WordPress
✅ **SEO Optimized**: Static generation, meta tags, sitemaps
✅ **Performance**: Image optimization, caching, CDN
✅ **Responsive Design**: Mobile-first Tailwind CSS
✅ **Type Safety**: TypeScript implementation
✅ **Error Handling**: Comprehensive error boundaries
✅ **Global Content**: Reusable content blocks system
✅ **Multi-environment**: Development/production configurations
✅ **Professional UI**: Modern design with smooth animations

This architecture provides a scalable, maintainable, and high-performance website that allows content creators to manage all content through WordPress while delivering a fast, modern user experience through Next.js.
