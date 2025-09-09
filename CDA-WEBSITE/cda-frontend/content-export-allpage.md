# CDA Website – Content Export (All Pages)

Note: This export lists Page, Section, Field Name, Field Type, Content on Field, and Content Type. Actual “Content on Field” values come from WordPress entries and design text; where not available in code, they are left as “—”. Repeated fields/sections are noted inline.

---

Page: 1.0 CDA - Homepage.png
- Rendering Source: Global Shared Content (ACF Options) — GraphQL path: globalOptions.globalSharedContent — Status: Live/Working
- Section: Header Section (reused pattern: Page headers) [optional/not currently used]
  - Title — wysiwyg — — Text/HTML
  - Subtitle — text — — Text
  - Primary CTA — link — — Link
  - Secondary CTA — link — — Link
  - Desktop Image — image — — Image
- Section: Content Blocks (Flexible) (reuses Global Blocks) [optional]
  - Global Block Type — select — — Text
  - Use Global Content — true_false — — Boolean
- Section: Case Studies (Individual) [optional]
  - Subtitle — text — — Text
  - Title — text — — Text
  - Knowledge Hub Link — url — — URL
  - Selected Case Studies — relationship — — Post Object(s)
- Global Blocks rendered on Homepage (from Global library, via globalOptions.globalSharedContent):
  - Why CDA — title, subtitle, cards (title, description, icon)
  - Our Approach — title, subtitle, steps (image, title)
  - Technologies Slider — title, subtitle, logos
  - Values — title, subtitle, values (title, text)
  - Showreel — title, subtitle, button, images/logos/video
  - Stats & Image — text, button, stats (number, text), illustration
  - Locations with Image — title, subtitle, countries/offices, illustration
  - News Carousel — title, subtitle, article selection (latest/category/manual)
  - Newsletter Signup — title, subtitle, hubspot_script, terms text

Page: 2.0 CDA - About.png
- GraphQL Path: page(id: "/about", idType: URI) → aboutUsContent
- Sections (page-specific) [completed]
  - Content Page Header — title (wysiwyg), text (wysiwyg), cta (link)
  - Who We Are – Your Digital Partner — image_with_frame (image), section_title (wysiwyg), section_text (wysiwyg), cta (link)
  - Leadership Team — image (image), name (text), position (text), bio (wysiwyg)
- Global Content Selection (toggles) [completed]
  - enableImageFrame, enableServicesAccordion, enableWhyCda, enableShowreel
  - enableCultureGallerySlider, enableApproach, enableFullVideo, enableJoinOurTeam
  - enableThreeColumnsWithIcons, enableContactFormLeftImageRight
  - enableTechnologiesSlider, enableValues, enableStatsImage, enableLocationsImage, enableNewsCarousel, enableNewsletterSignup
- Notes:
  - The old page-specific "Why CDA (About Page)" repeater is deprecated. Use the global Why CDA block via the toggle instead.
  - About may render any global block based on the toggles above.

Page: 3.0 CDA - Team Listing.png
- Section: Hero Section [completed]
  - Page Title — text — — Text
  - Page Description — textarea — — Text
  - Decorative Elements — image — — Image
- Section: Founder Spotlight [not completed]
  - Section Heading — text — — Text
  - Name — text — — Text
  - Title — text — — Text
  - Bio — textarea — — Text
  - Photo — image — — Image
  - Profile Link — url — — URL
- Section: Leadership Team [completed]
  - Section Heading — text — — Text
  - Team Members — relationship — — Post Object(s)
- Section: Join Our Team CTA (reused CTA pattern) [not completed]
  - Section Heading — text — — Text
  - Description — textarea — — Text
  - CTA Button — link — — Link
  - Decorative Elements — image — — Image

Page: 3.1 CDA - Team Profile.png
- Section: Profile Header (maps to Team Member fields) [completed]
  - Name — text — — Text
  - Job Title — text — — Text
  - Short/Full Bio — textarea/wysiwyg — — Text/HTML
  - Email — email — — Email
  - LinkedIn URL — url — — URL
  - Profile Photo — image — — Image
- Section: Booking Section (design-only; custom form) [not completed]
  - Section Heading — text — — Text
  - Name — text — — Text
  - Email — email — — Email
  - Time Preferences — select — — Text
  - Message — textarea — — Text
- Section: Other Team Members [not completed]
  - Related Team Members — relationship — — Post Object(s)

Page: 4.2 CDA - Service Overview.png
- Section: Hero Section (services) [completed]
  - Page Title — text — — Text
  - Description — textarea — — Text
  - Service Illustration — image — — Image
- Section: Services Grid [completed]
  - Section Heading — text — — Text
  - Service (repeater item): Name — text; Description — text; Icon — image; URL — url — — Mixed
- Section: Process Section [not completed]
  - Section Heading — text — — Text
  - Steps (repeater): Number — text; Title — text; Description — textarea — — Mixed
- Section: Statistics Section [not completed]
  - Stat (repeater): Number — text; Label — text; Description — text — — Mixed
- Section: Case Studies Preview [not completed]
  - Section Heading — text — — Text
  - Featured Case Study — relationship — — Post Object

Pages: 4.3 – 4.9 Service Details (Ecommerce, Outsourced CMO, B2B Lead Gen, Software Dev, Booking Systems, Digital Marketing, AI)
- Field Group: Service Content [completed]
- Hero Section (group) [completed]
    - Subtitle — text — — Text
    - Description — textarea — — Text
    - Hero Image — image — — Image
    - Call to Action — link — — Link
- Key Statistics (repeater) [completed]
    - Number — text — — Text
    - Label — text — — Text
    - Description — text — — Text
- Service Features (repeater) [completed]
    - Icon — image — — Image
    - Title — text — — Text
    - Description — textarea — — Text
- Featured Case Studies — post_object (multiple) — — Post Object(s) [completed]

Page: 5.0 CDA - Resource Center.png [in progress]
- GraphQL Path: page(id: "/knowledge-hub", idType: URI) → knowledgeHubContent
- Section: Header [completed]
  - Title — text — — Text
  - Intro — wysiwyg — — Text/HTML
- Section: Featured Posts [completed]
  - featured_posts — post_object (multiple: post/blog_posts) — — Post Object(s)
- Listing/Grid [planned]
  - Filters/Categories — taxonomy/query (frontend)
  - Items (cards) — WP posts feed (frontend)

Page: 5.1 CDA - Case Study Details.png [completed]
- Field Group: Case Study Content [completed]
  - Project Overview (group)
    - Client Name — text — — Text
    - Client Logo — image — — Image
    - Project URL — url — — URL
    - Completion Date — date_picker — — Date (Y-m-d)
  - The Challenge — wysiwyg — — Text/HTML
  - Our Solution — wysiwyg — — Text/HTML
  - The Results — wysiwyg — — Text/HTML
  - Key Metrics (repeater)
    - Number — text — — Text
    - Metric Label — text — — Text
  - Project Gallery — gallery — — Images
  - Featured Case Study — true_false — — Boolean

Page: 5.2 CDA - News Article.png [not completed]
- Field Group: Blog Post Content
  - Article Meta (group)
    - Estimated Read Time — number — — Number (minutes)
    - Featured Article — true_false — — Boolean
    - External URL — url — — URL
  - Social Sharing (group)
    - Social Title — text — — Text
    - Social Description — textarea — — Text
    - Social Image — image — — Image

Page: 6.0 CDA - Contact Us.png [in progress]
- GraphQL Path: page(id: "/contact", idType: URI) → contactContent
- Sections [completed]
  - Header — title (text), text (wysiwyg)
  - HubSpot Form Code — form_code (textarea)
  - Details — details (wysiwyg)
- Optional (future) [planned]
  - Contact Methods — address/phone/email fields
  - Map/Locations — image or embed

Page: 7.0 CDA - Job Listings.png [not completed]
- Section: Jobs Index
  - Listing (cards) — post data — — Mixed
  - Filters — taxonomy/query — — Mixed

Page: 7.1 CDA - Job Details.png [not completed]
- Field Group: Job Listing Details
  - Job Details (group)
    - Location — text — — Text
    - Salary Range — text — — Text
    - Experience Level — select — — Text
    - Application Deadline — date_picker — — Date (Y-m-d)
  - Requirements & Qualifications (group)
    - Required Skills (repeater): Skill — text; Level — select — — Mixed
    - Key Responsibilities — wysiwyg — — Text/HTML
  - Application Process (group)
    - Application Email — email — — Email
    - Application URL — url — — URL
    - Application Instructions — textarea — — Text
  - Job Status — select — — Text

Page: 8.0 CDA - Technologies.png [not completed]
- Field Group: Technology Information
  - Technology Details (group)
    - Logo/Icon — image — — Image
    - Official Website — url — — URL
    - Version We Use — text — — Text
    - Our Proficiency Level — select — — Text
  - Usage Information (group)
    - What We Use It For — textarea — — Text
    - Key Benefits (repeater): Benefit — text — — Text
  - Related Projects — post_object (multiple) — — Post Object(s)
  - Featured Technology — true_false — — Boolean

Page: 9.0 CDA - ROI.png [not completed]
- Section: ROI Calculator
  - Inputs (various) — number/select — — Mixed
  - Results/Outputs — number/text — — Mixed

Page: 10.0 CDA - Policies Landing.png [not completed]
- Section: Policies Index
  - Listing — post data — — Mixed
  - Categories/Filters — taxonomy/query — — Mixed

Page: 10.1 CDA - Policies - Details Page.png [not completed]
- Section: Policy Content [not completed]
  - Title — text — — Text
  - Content — wysiwyg — — Text/HTML
  - Last Updated — date — — Date

Page: 11.0 CDA - 404 Error Page.png [completed]
- Section: Error Content
  - Title — text — — Text
  - Description — textarea — — Text
  - CTA — link — — Link

---

Global/Reusable Blocks (used across multiple pages) [completed]
- Why CDA Block — Section Title (text/wysiwyg), Description (textarea/wysiwyg), Cards (repeater: title, description, icon) — Content Types: Text/HTML/Image
- Our Approach Block — Section Title (text), Description (textarea), Steps (repeater: image, title) — Content Types: Text/Image
- Showreel Block — Title, Subtitle, Video Thumbnail (image), Video URL (url/oEmbed), Client Logos (repeater: image) — Content Types: Text/Image/URL
- Technologies Slider — Title, Subtitle, Technologies (post_object logos) — Content Types: Text/Image
- Values Block — Title, Subtitle, Values (repeater: title, description) — Content Types: Text
- Stats & Image — Text, Button (link), Statistics (repeater: number, text), Illustration (image) — Content Types: Text/Image
- Locations with Image — Title, Subtitle, Countries→Offices (repeaters), Illustration (image) — Content Types: Text/Image
- News Carousel — Title, Subtitle, Article Selection (latest/category/manual) — Content Types: Text/Post Objects
- Newsletter Signup — Title, Subtitle, HubSpot Form Script, Terms Text — Content Types: Text
- Ready To Start CTA — Subtitle, Title, CTA Button (text+url), Illustration/Image — Content Types: Text/Image/Link
- Photo Frame Block — Frame Image, Inner Image, Subtitle, Title, Text Content, Button (text+url), Arrow Illustration — Content Types: Text/Image/Link
- Planned Global Blocks — Culture Gallery Slider; Approach (steps); Full Video; Join Our Team; 3 x Columns with Icons; Contact Form Left, Image Right

SEO (applies to all Pages) [completed]
- SEO Title — text — — Text
- Meta Description — textarea — — Text
- Meta Keywords — text — — Text
- No Index — true_false — — Boolean
- No Follow — true_false — — Boolean
- Canonical URL — url — — URL

---

GraphQL Path Summary (primary pages)
- Homepage: globalOptions.globalSharedContent (ACF Options)
- About: page(id: "/about", idType: URI) → aboutUsContent
- Services Overview: page(id: "/services", idType: URI) → serviceOverviewContent (or frontend listing of Services CPT)
- Service Detail: service(id: $slug, idType: SLUG) → serviceFields
- Contact: page(id: "/contact", idType: URI) → contactContent
- Knowledge Hub: page(id: "/knowledge-hub", idType: URI) → knowledgeHubContent
- Case Study Detail: caseStudy(id: $slug, idType: SLUG) → caseStudyFields
- Team Member: teamMember(id: $slug, idType: SLUG) → teamMemberFields
- Blog Post: blogPost(id: $slug, idType: SLUG) → blogPostFields

Repeated Fields/Sections (where used)
- Page Header (Title/Subtitle/Image/CTA) — repeated on About, Services (overview), and other standard pages as needed
- Global Blocks — Why CDA, Our Approach, Showreel, etc. — reused via globalOptions.globalSharedContent
- Newsletter Signup — reused on Homepage, Knowledge Hub, and footer CTA areas
- Ready To Start CTA — reused on Homepage and Services
- Case Studies Preview — reused on Homepage and Services Overview
- SEO Settings — repeated on all pages

---

## ACF/GraphQL Implementation Matrix — per route

This matrix is the canonical reference for each route: where content comes from, the GraphQL path to fetch, the ACF group/field names, and the minimum required fields for a page to render without warnings.

- Route: /
  - Status: Live / Working
  - Source: ACF Options → Global Shared Content
  - GraphQL Path: globalOptions.globalSharedContent
  - ACF: Global blocks (see reference below)
  - Minimum content: at least one global block populated (e.g., Why CDA); homepage renders even with partial blocks
  - QA: run simple global query; verify all blocks return arrays (no GraphQL errors)

- Route: /about
  - Status: In progress (content OK; About runtime fixed by clearing Next build)
  - Source: Page → aboutUsContent; plus Global Content Selection toggles
  - GraphQL Path: page(id: "/about", idType: URI) → aboutUsContent
  - ACF Group: group_about_us_page → aboutUsContent
  - Minimum content: content_page_header.title (wysiwyg) OR at least one global toggle enabled and corresponding global block populated
  - QA: introspect AboutUsContent fields; fetch aboutUsContent.globalContentSelection

- Route: /services (overview)
  - Status: Working
  - Source: Usually a listing of Services CPT or a dedicated ACF group if required by design
  - GraphQL Path (listing): services { nodes { id title slug } }
  - Alternative ACF: serviceOverviewContent (if we choose to add an ACF header/intro for the overview page)
  - Minimum content: at least 1 Service CPT published

- Route: /services/<slug> (detail pages)
  - Status: Mixed (AI/Digital/Booking OK; others missing posts or slugs)
  - Source: Service CPT → serviceFields
  - GraphQL Path: service(id: $slug, idType: SLUG) → serviceFields
  - ACF Group: group_services_content → serviceFields
  - Required slugs (lowercase): ecommerce, b2b, software-development, booking-systems, digital-marketing, outsourced-cmo, ai
  - Minimum content: heroSection.subtitle OR heroSection.description; page will render once heroSection exists
  - QA: query each slug; ensure nodes exist; ensure heroSection present

- Route: /case-studies (overview)
  - Status: Working
  - Source: Case Studies CPT archive/listing
  - GraphQL Path: caseStudies { nodes { id title slug caseStudyFields { projectOverview { clientName } } } }
  - Minimum content: at least 1 case study published

- Route: /case-studies/<slug>
  - Status: Working
  - Source: Case Study CPT → caseStudyFields
  - GraphQL Path: caseStudy(id: $slug, idType: SLUG) → caseStudyFields
  - ACF Group: group_case_studies_content → caseStudyFields
  - Minimum content: projectOverview.clientName OR challenge/solution/results (one section)

- Route: /knowledge-hub (Resource Center)
  - Status: In progress (minimal group ready)
  - Source: Page → knowledgeHubContent
  - GraphQL Path: page(id: "/knowledge-hub", idType: URI) → knowledgeHubContent
  - ACF Group: group_knowledge_hub_page_content → knowledgeHubContent
  - Minimum content: header.title OR featured_posts (some posts selected)

- Route: /contact
  - Status: In progress (minimal group ready)
  - Source: Page → contactContent
  - GraphQL Path: page(id: "/contact", idType: URI) → contactContent
  - ACF Group: group_contact_page_content → contactContent
  - Minimum content: header.title OR form_code (HubSpot)

- Route: /team (listing)
  - Status: Working
  - Source: Team Members CPT listing
  - GraphQL Path: teamMembers { nodes { id title slug teamMemberFields { jobTitle } } }

- Route: /team/<slug> (profile)
  - Status: Working
  - Source: Team Member CPT → teamMemberFields
  - GraphQL Path: teamMember(id: $slug, idType: SLUG) → teamMemberFields
  - Minimum content: jobTitle

- Route: /technologies (landing)
  - Status: Basic placeholder; planned content
  - Source: Could list Technologies CPT; optional landing header ACF to be added later

- Route: /sectors (landing)
  - Status: 404
  - Plan: Either hide route until content is ready or add a minimal sectorsContent group (title/intro/list)

- Route: /roi, /policies, /policies/<slug>
  - Status: Planned
  - Plan: add small groups where needed after client confirms scope

---

## Global Blocks Reference (ACF Options)

GraphQL Path: globalOptions.globalSharedContent

- whyCda — title, subtitle, usp (title, description, icon)
- approach — title, subtitle, steps (image, title)
- technologiesSlider — title, subtitle, logos (post_object)
- valuesBlock — title, subtitle, values (title, text)
- showreel — title, subtitle, button, large_image, logos[]
- statsImage — text, button, stats[] (number, text), illustration
- locationsImage — title, subtitle, countries[] → offices[]; illustration
- newsCarousel — title, subtitle, selection (latest/category/manual), category/taxonomy/manual_articles
- newsletterSignup — title, subtitle, hubspot_script, terms_text

Planned Global Blocks (to implement after homepage parity):
- cultureGallerySlider — subtitle/title/images
- fullVideo — url/file
- joinOurTeam — left/right media (image/video/gif), title, text, button
- threeColumnsWithIcons — section_title, columns[icon/title/text]
- contactFormLeftImageRight — title, form_code, useGlobalContactDetails/contact_details_override, right media

---

## Minimal-Content Checklists (green-state)

- Service Detail (each slug): heroSection.subtitle OR heroSection.description
- About: contentPageHeader.title OR at least one global toggle enabled with content present
- Contact: header.title OR form_code present
- Knowledge Hub: header.title OR featured_posts non-empty
- Homepage: at least one global block populated; rest may be empty

---

## Location Rules & Types

- About Us: page_template == template-about-us.php → aboutUsContent (type: Page)
- Contact: page_template == template-contact.php → contactContent (type: Page)
- Knowledge Hub: page_template == template-knowledge-hub.php → knowledgeHubContent (type: Page)
- Services Detail: post_type == services → serviceFields (type: Service)
- Case Studies Detail: post_type == case_studies → caseStudyFields (type: CaseStudy)
- Team Member Detail: post_type == team_members → teamMemberFields (type: TeamMember)
- Blog Post Detail: post_type == blog_posts → blogPostFields (type: BlogPost)
- Homepage: ACF Options → globalSharedContent (type: RootQuery → Options)

---

## Operational Runbook (caches & rebuilds)

- Next.js: delete .next, restart dev after branch switch or schema changes
- WordPress: GraphQL → Clear Schema Cache after ACF edits
- Permalinks: Settings → Permalinks → Save Changes (flush rewrite rules) after CPT/route changes

---

## Validation Queries

See documentation/Working-GraphQL-Queries.md for tested queries covering:
- Global content
- About/Contact/Knowledge Hub
- Services overview & detail
- Case Studies & Team Members
- Pagination patterns for archives

---

## Open TODOs & Decisions

- Decide PHP-first vs ACF UI for page groups (Contact, Knowledge Hub, Sectors). PHP-first is faster; ACF UI is editor-friendly.
- Create/publish missing Services posts with correct slugs: ecommerce, b2b, software-development, outsourced-cmo
- Add sectorsContent group (if Sectors route should be live) — title, intro, items[]
- Implement planned global blocks in Options once homepage parity is confirmed
- Confirm ROI and Policies scope from client spec; add groups if required

---

## Global Content Selection (Page-level)

**NEW**: As of the latest update, all pages (except About) now have access to page-level toggles to control which global content blocks appear.

- **ACF Group**: Global Content Selection (Page-level)
- **GraphQL Path**: `Page.globalContentSelection`
- **Availability**: All Pages EXCEPT About (which has its own internal toggles)
- **Purpose**: Controls which global content blocks appear on each page

### Toggle Fields:
- `enableWhyCda` - Shows Why CDA block from globalSharedContent
- `enableApproach` - Shows Approach block from globalSharedContent  
- `enableServicesAccordion` - Shows Services Accordion from globalContentBlocks
- `enableShowreel` - Shows Showreel from globalContentBlocks
- `enableTechnologiesSlider` - Shows Technologies Slider from globalContentBlocks
- `enableCultureGallerySlider` - Shows Culture Gallery from globalSharedContent
- `enableFullVideo` - Shows Full Video from globalSharedContent
- `enableJoinOurTeam` - Shows Join Our Team CTA from globalSharedContent
- `enable3XColumnsWithIcons` - Shows 3 Columns with Icons from globalSharedContent
- `enableContactFormLeftImageRight` - Shows Contact Form/Image from globalSharedContent

### Editor Usage:
1. Edit any Page in WordPress admin (except About)
2. Find "Global Content Selection" meta box on the right side
3. Toggle ON/OFF which global blocks should appear on this page
4. Save/Update the page
5. Frontend will query these toggles and conditionally render the enabled blocks

### Frontend Implementation:
Pages should query both their specific content AND the globalContentSelection toggles:

```graphql
query PageWithToggles($uri: String!) {
  page(id: $uri, idType: URI) {
    id
    title
    
    # Page-specific content (varies by page)
    contactContent { ... }  # or knowledgeHubContent, etc.
    
    # Global content toggles
    globalContentSelection {
      enableWhyCda
      enableApproach
      # ... all other toggles
    }
  }
  
  # Also fetch the actual global blocks
  globalOptions {
    globalSharedContent { ... }
    globalContentBlocks { ... }
  }
}
```

### Test Files:
- GraphQL test queries: `/documentation/graphql-tests/page-global-content-selection.graphql`
- Frontend test page: `/page-for-test-all-content` (tests 7 and 9 cover these toggles)
