# ACF Audit Report - Based on Actual JSON Exports
**Date:** 2025-09-09
**Source:** WORKING-ACF JSON exports

## Executive Summary
This audit compares the actual ACF setup (from JSON exports) against the content-export-allpage.md requirements. The setup is using ACF UI with JSON exports, NOT PHP registration.

---

## 1. HOMEPAGE ✅ COMPLETE
**GraphQL Path:** `page.homepageContentClean`
**Location Rule:** `page_template == template-homepage.php`
**Status:** ✅ FULLY IMPLEMENTED

### Fields Present:
✅ **Header Section** (`header_section`)
- title (text)
- text (textarea) 
- button1 (link)
- button2 (link)
- illustration (image)

✅ **Projects Section** (`projects_section`)
- title (text)
- subtitle (text)
- link (link)

✅ **Case Studies Section** (`case_studies_section`)
- subtitle (text)
- title (text)
- knowledge_hub_link (link)
- selected_studies (post_object for case_studies CPT)

✅ **Global Content Selection** (`global_content_selection`)
All toggles properly configured:
- enable_image_frame (8.3)
- enable_services_accordion (8.4)
- enable_technologies_slider (8.5)
- enable_values (8.6)
- enable_showreel (8.7)
- enable_stats_image (8.8)
- enable_locations_image (8.10)
- enable_news_carousel (8.11)
- enable_newsletter_signup (8.12)

---

## 2. GLOBAL CONTENT BLOCKS ✅ COMPLETE
**GraphQL Path:** Via ACF Options Page
**Status:** ✅ ALL MAJOR BLOCKS IMPLEMENTED

### Blocks Present:
✅ **Image Frame Block** (`image_frame_block`)
- title, subtitle, text, button, content_image, frame_image, arrow_image

✅ **Services Accordion** (`servicesAccordion`)
- title, subtitle, illustration, services (post_object)

✅ **Technologies Slider** (`technologies_slider`)
- title, subtitle, logos (post_object to technologies CPT)

✅ **Values Block** (`values_block`)
- title, subtitle, values (repeater with title/text), illustration

✅ **Why CDA** (`whyCda`)
- title, subtitle, usp (repeater with title/description/icon)

✅ **Showreel** (`showreel`)
- title, subtitle, button, large_image, logos (repeater)

✅ **Stats & Image** (`stats_image`)
- text, button, stats (repeater with number/text), illustration

✅ **Locations with Image** (`locations_image`)
- title, subtitle, countries (repeater with offices sub-repeater), illustration

✅ **News Carousel** (`news_carousel`)
- title, subtitle, article_selection (latest/category/manual), category, manual_articles

✅ **Newsletter Signup** (`newsletter_signup`)
- title, subtitle, hubspot_script, terms_text

### NEW Blocks Added (Beyond MD spec):
✅ **Culture Gallery Slider** (`cultureGallerySlider`)
- subtitle, title, use_global_social_links, images (gallery)

✅ **Approach** (`approach`)
- subtitle, title, steps (repeater with image/title - exactly 5 steps)

✅ **Full Video** (`fullVideo`)
- url (oembed for YouTube/Vimeo), file (video file upload)

✅ **Join Our Team** (`joinOurTeam`)
- left_media_type, left_image/video/gif, title, text (wysiwyg), button
- right_media_type, right_image/video/gif

---

## 3. MISSING PAGES/GROUPS

### ❌ About Page
- No JSON export found
- Needs: contentPageHeader, whoWeAreSection, leadershipTeam
- Global content selection exists separately

### ❌ Services Overview Page
- No specific ACF group
- Using Services CPT listing

### ❌ Individual Service Pages
- Need serviceFields group for CPT
- Required: heroSection, keyStatistics, serviceFeatures, featuredCaseStudies

### ❌ Knowledge Hub
- No knowledgeHubContent group
- Needs: headerSection, featuredPosts

### ❌ Contact Page
- No contactContent group
- Needs: headerSection, formCode, details

### ❌ Team Pages
- No team listing or profile fields
- Needs teamMemberFields for CPT

### ❌ Case Studies
- CPT exists but no caseStudyFields group
- Needs: projectOverview, challenge, solution, results, keyMetrics, projectGallery

### ❌ Other Missing:
- Blog Post fields
- Job Listings fields
- Technologies fields
- 404 Error page
- Terms & Conditions
- Policies pages
- ROI Calculator

---

## 4. CUSTOM POST TYPES STATUS

### Confirmed in PHP:
✅ services
✅ case_studies
✅ team_members
✅ blog_posts
✅ job_listings
✅ technologies

### Missing Service Posts (need creation):
- ecommerce
- b2b
- software-development
- outsourced-cmo

---

## 5. KEY FINDINGS

### Strengths:
1. **Homepage is 100% complete** with all sections and toggles
2. **Global content blocks exceed requirements** - have MORE than specified in MD
3. **GraphQL integration properly configured** with show_in_graphql flags
4. **Field naming is consistent** - using underscores for ACF, camelCase for GraphQL

### Issues to Address:
1. **Missing page-specific ACF groups** for About, Services, Contact, Knowledge Hub
2. **Missing CPT field groups** for Services, Case Studies, Team Members
3. **Need to create Service posts** with correct slugs
4. **SEO fields group not found** in exports

---

## 6. RECOMMENDED ACTIONS

### Immediate (Today):
1. ✅ Homepage ready - no action needed
2. Create About page ACF group
3. Create Contact page ACF group
4. Create Knowledge Hub ACF group
5. Create Service posts with correct slugs

### Tomorrow:
1. Create Service CPT fields group
2. Create Case Study CPT fields group
3. Create Team Member CPT fields group
4. Add SEO fields group (attach to all post types)

### This Week:
1. Create remaining page groups as needed
2. Test all GraphQL queries
3. Update frontend to use correct field names

---

## 7. GRAPHQL PATH REFERENCE

Based on actual exports:

```graphql
# Homepage
page(id: "289", idType: DATABASE_ID) {
  homepageContentClean {
    headerSection { ... }
    projectsSection { ... }
    caseStudiesSection { ... }
    globalContentSelection { ... }
  }
}

# Global Content (via Options)
globalOptions {
  globalContentBlocks {
    imageFrameBlock { ... }
    servicesAccordion { ... }
    technologiesSlider { ... }
    valuesBlock { ... }
    whyCda { ... }
    showreel { ... }
    statsImage { ... }
    locationsImage { ... }
    newsCarousel { ... }
    newsletterSignup { ... }
    cultureGallerySlider { ... }
    approach { ... }
    fullVideo { ... }
    joinOurTeam { ... }
  }
}
```

---

## 8. MIGRATION PATH

Since you're using ACF UI with JSON exports:

1. **Keep using ACF UI** - Don't switch to PHP
2. **Import missing groups** via ACF Tools
3. **Use JSON version control** - commit JSON files
4. **Sync across environments** using JSON import/export

---

## 9. TESTING CHECKLIST

- [x] Homepage queries work
- [x] Global content blocks accessible
- [ ] About page fields created and tested
- [ ] Services pages have content
- [ ] Contact page fields work
- [ ] Knowledge Hub configured
- [ ] All CPT field groups created
- [ ] SEO fields attached to all types
- [ ] Frontend pages use correct queries
