# CDA Website – Content Export (All Pages)

Note: This export lists Page, Section, Field Name, Field Type, Content on Field, and Content Type. Actual “Content on Field” values come from WordPress entries and design text; where not available in code, they are left as “—”. Repeated fields/sections are noted inline.

---

Page: 1.0 CDA - Homepage.png
- Section: Header Section (reused pattern: Page headers) [completed]
  - Title — wysiwyg — — Text/HTML
  - Subtitle — text — — Text
  - Primary CTA — link — — Link
  - Secondary CTA — link — — Link
  - Desktop Image — image — — Image
- Section: Content Blocks (Flexible) (reuses Global Blocks) [completed]
  - Global Block Type — select — — Text
  - Use Global Content — true_false — — Boolean
- Section: Case Studies (Individual) [completed]
  - Subtitle — text — — Text
  - Title — text — — Text
  - Knowledge Hub Link — url — — URL
  - Selected Case Studies — relationship — — Post Object(s)
- Global Blocks seen on design (from Global library, reused across pages): Why CDA, Our Approach, Showreel, Technologies Showcase, Values, Stats & Image, Locations with Image, News Carousel — various field sets — — Mixed [completed]

Page: 2.0 CDA - About.png
- Section: Content Page Header (reused pattern: Page headers) [completed]
  - Title — wysiwyg — — Text/HTML
  - Text — wysiwyg — — Text/HTML
  - CTA — link — — Link
- Section: Who We Are - Your Digital Partner (reuses Photo Frame pattern) [completed]
  - Image with Frame — image — — Image
  - Section Title — wysiwyg — — Text/HTML
  - Section Text — wysiwyg — — Text/HTML
  - CTA — link — — Link
- Section: Why CDA (About Page) (page-specific repeater) [completed]
  - Repeater Row:
    - Title — wysiwyg — — Text/HTML
    - Description — wysiwyg — — Text/HTML
    - Icon — image — — Image
- May reuse Global Blocks (Why CDA, Approach, Showreel, etc.) as per design — — — Mixed [completed]

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

Page: 5.0 CDA - Resource Center.png [not completed]
- Section: Listing/Grid [not completed]
  - Filters/Categories — taxonomy/query (frontend) — — Text
  - Items (cards) — post data — — Mixed
- Section: Featured/Highlighted Content (optional) [not completed]
  - Title — text — — Text
  - Items — relationship/query — — Post Object(s)

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

Page: 6.0 CDA - Contact Us.png [not completed]
- Section: Contact Header [completed]
  - Title — text — — Text
  - Description — textarea — — Text
- Section: Contact Methods [not completed]
  - Address/Phone/Email — text — — Text
- Section: Contact Form [not completed]
  - Name/Email/Message — text/email/textarea — — Mixed
- Section: Map/Locations — image/embed — — Image/Embed [not completed]

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
- Why CDA Block — Section Title (text/wysiwyg), Description (textarea/wysiwyg), Cards/Stats (repeater: title, description, icon/number/label) — Content Types: Text/HTML/Image
- Our Approach Block — Section Title (text), Description (textarea), Steps (repeater: title, description, icon) — Content Types: Text/Image
- Showreel Block — Title, Subtitle, Video Thumbnail (image), Video URL (url/oEmbed), Client Logos (repeater: image) — Content Types: Text/Image/URL
- Technologies Showcase — Title, Subtitle, Technologies (repeater: logo/image, name/text) — Content Types: Text/Image
- Values Block — Title, Subtitle, Values (repeater: title, description, icon/image) — Content Types: Text/Image
- Stats & Image — Title, Subtitle, Image (image), Stats (repeater: number, label, description/icon) — Content Types: Text/Image
- Locations with Image — Title, Subtitle, Image — Content Types: Text/Image
- News Carousel — Title, Items (relationship/query) — Content Types: Text/Post Objects
- Newsletter Signup — Title, Subtitle, Description, Submit Button Text, Privacy Notice — Content Types: Text
- Ready To Start CTA — Subtitle, Title, CTA Button (text+url), Illustration/Image — Content Types: Text/Image/Link
- Photo Frame Block — Frame Image, Inner Image, Subtitle, Title, Text Content, Button (text+url), Arrow Illustration — Content Types: Text/Image/Link

SEO (applies to all Pages) [completed]
- SEO Title — text — — Text
- Meta Description — textarea — — Text
- Meta Keywords — text — — Text
- No Index — true_false — — Boolean
- No Follow — true_false — — Boolean
- Canonical URL — url — — URL

---

Repeated Fields/Sections (where used)
- Page Header (Title/Subtitle/Image/CTA) — repeated on Homepage, About, Services, Contact, Policies, etc.
- Why CDA — repeated on Homepage, About, Services
- Our Approach — repeated on Homepage, About, Services
- Newsletter Signup — repeated on Homepage, Resource Center, Footer/CTA areas
- Ready To Start CTA — repeated on Homepage, Services
- Case Studies Preview — repeated on Homepage, Services Overview
- SEO Settings — repeated on all pages