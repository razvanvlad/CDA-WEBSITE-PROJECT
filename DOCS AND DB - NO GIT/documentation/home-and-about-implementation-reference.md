# Home and About Implementation Reference

This document describes the shared structure and workflow used to implement the Homepage and About pages using ACF JSON, WPGraphQL, and Next.js components. Use it as the reference blueprint for the remaining pages.

## Source of truth and data flow
- ACF JSON exports define the content model for pages and global blocks.
- WPGraphQL exposes ACF fields to the frontend.
- Next.js fetches:
  - Global content once, from Global Options → Global Content Blocks.
  - Page-specific content by Page database ID (Homepage: 289; About: 317).
  - Page-level global block toggles control which global sections render on a page.

Data flow:
ACF JSON → WPGraphQL → Next.js GraphQL queries → normalize → React components

## Global content blocks
Location in GraphQL: globalOptions.globalContentBlocks

Implemented blocks (field names as used by the frontend):
- imageFrameBlock
- servicesAccordion
- technologiesSlider
- valuesBlock
- showreel
- locationsImage
- newsCarousel
- newsletterSignup
- statsImage
  - Note: some backends may expose this as image. Frontend normalizes: statsImage = raw.statsImage || raw.image

Common image shape exposed by WPGraphQL for ACF:
- Images are typically wrapped: fieldName { node { sourceUrl altText } }

## Page-level global content toggles
- Homepage: toggles live under page.homepageContentClean.globalContentSelection
- About: toggles live under page.aboutUsContent.globalContentSelection
- Other standard pages: there is a general Page.globalContentSelection available (About uses its own nested group)

Common toggle keys (subset):
- enableImageFrame
- enableServicesAccordion
- enableWhyCda
- enableShowreel
- enableCultureGallerySlider
- enableApproach
- enableTechnologiesSlider
- enableValues
- enableStatsImage
- enableLocationsImage
- enableNewsCarousel
- enableNewsletterSignup
- enableFullVideo
- enableJoinOurTeam

A block renders only if: Toggle = On AND Global data exists.

## Homepage structure
- WP Page ID: 289 (DATABASE_ID)
- ACF group: homepageContentClean
  - headerSection: title, text, button1, button2, illustration (image)
  - projectsSection: title, subtitle, link
  - caseStudiesSection: subtitle, title, knowledgeHubLink, selectedStudies (Case Studies CPT)
  - globalContentSelection: per-page toggles for global blocks

Example GraphQL (trimmed to essentials):
```graphql path=null start=null
{
  globalOptions {
    globalContentBlocks {
      imageFrameBlock { title subtitle text button { url title target } contentImage { node { sourceUrl altText } } frameImage { node { sourceUrl altText } } arrowImage { node { sourceUrl altText } } }
      servicesAccordion { title subtitle illustration { node { sourceUrl altText } } services { nodes { ... on Service { id title uri } } } }
      technologiesSlider { title subtitle logos { nodes { ... on Technology { id title uri featuredImage { node { sourceUrl altText } } } } } }
      valuesBlock { title subtitle values { title text } illustration { node { sourceUrl altText } } }
      showreel { title subtitle button { url title target } largeImage { node { sourceUrl altText } } logos { logo { node { sourceUrl altText } } } }
      locationsImage { title subtitle countries { countryName offices { name address email phone } } illustration { node { sourceUrl altText } } }
      newsCarousel { title subtitle articleSelection category { nodes { name slug } } manualArticles { nodes { ... on Post { id title excerpt uri featuredImage { node { sourceUrl altText } } } } } }
      newsletterSignup { title subtitle hubspotScript termsText }
      image { __typename }
    }
  }

  page(id: 289, idType: DATABASE_ID) {
    title
    homepageContentClean {
      headerSection { title text button1 { url title target } button2 { url title target } illustration { node { sourceUrl altText } } }
      projectsSection { title subtitle link { url title target } }
      caseStudiesSection {
        subtitle
        title
        knowledgeHubLink { url title target }
        selectedStudies { nodes { ... on CaseStudy { id title uri excerpt } } }
      }
      globalContentSelection {
        enableValues
        enableImageFrame
        enableTechnologiesSlider
        enableServicesAccordion
        enableShowreel
        enableStatsImage
        enableLocationsImage
        enableNewsCarousel
        enableNewsletterSignup
      }
    }
  }
}
```

Frontend mapping highlights:
- Normalize global blocks:
  - statsImage: raw.statsImage || raw.image
  - technologiesSlider.logos: flatten logos.nodes to an array of { url, alt, title }
- Render global blocks only if toggle is enabled and data exists.
- Header/Projects/Case Studies come from homepageContentClean.

## About page structure
- WP Page ID: 317 (DATABASE_ID)
- ACF group: aboutUsContent
  - contentPageHeader: title (wysiwyg), text (wysiwyg), cta (link)
  - whoWeAreSection: imageWithFrame (image), sectionTitle, sectionText, cta (link)
  - leadershipSection: image (image), name, position, bio (wysiwyg)
  - globalContentSelection: per-page toggles for global blocks (nested under aboutUsContent)

Example GraphQL (trimmed to essentials):
```graphql path=null start=null
{
  globalOptions {
    globalContentBlocks {
      imageFrameBlock { title subtitle text button { url title target } contentImage { node { sourceUrl altText } } frameImage { node { sourceUrl altText } } arrowImage { node { sourceUrl altText } } }
      servicesAccordion { title subtitle illustration { node { sourceUrl altText } } services { nodes { ... on Service { id title uri } } } }
      technologiesSlider { title subtitle logos { nodes { ... on Technology { id title uri featuredImage { node { sourceUrl altText } } } } } }
      valuesBlock { title subtitle values { title text } illustration { node { sourceUrl altText } } }
      showreel { title subtitle button { url title target } largeImage { node { sourceUrl altText } } logos { logo { node { sourceUrl altText } } } }
      locationsImage { title subtitle countries { countryName offices { name address email phone } } illustration { node { sourceUrl altText } } }
      newsCarousel { title subtitle }
      newsletterSignup { title subtitle hubspotScript termsText }
      image { __typename }
    }
  }

  page(id: 317, idType: DATABASE_ID) {
    id
    title
    aboutUsContent {
      contentPageHeader {
        title
        text
        cta { url title target }
      }
      whoWeAreSection {
        imageWithFrame { node { sourceUrl altText } }
        sectionTitle
        sectionText
        cta { url title target }
      }
      leadershipSection {
        image { node { sourceUrl altText } }
        name
        position
        bio
      }
      globalContentSelection {
        enableImageFrame
        enableServicesAccordion
        enableWhyCda
        enableShowreel
        enableCultureGallerySlider
        enableApproach
        enableFullVideo
        enableJoinOurTeam
        enableThreeColumnsWithIcons
        enableContactFormLeftImageRight
        enableTechnologiesSlider
        enableValues
        enableStatsImage
        enableLocationsImage
        enableNewsCarousel
        enableNewsletterSignup
      }
    }
  }
}
```

Frontend mapping highlights:
- The page renders three About-specific sections from aboutUsContent.
- For Image Frame, the page can either:
  - Use the global Image Frame block with contentOverride from whoWeAreSection, OR
  - Render a simple local section if the toggle is Off.
- All other global blocks are controlled by toggles under aboutUsContent.globalContentSelection.
- Images are accessed via imageField.node.sourceUrl / .altText.

## Environment configuration
- NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
  - Example: http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
- Page IDs (DATABASE_IDs)
  - Homepage: 289 (hardcoded in src/app/page.js)
  - About: 317 (configurable with NEXT_PUBLIC_ABOUT_PAGE_ID, default 317)

Recommended overrides in cda-frontend/.env.local:
```bash path=null start=null
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
# Optional — overrides About page ID across environments
NEXT_PUBLIC_ABOUT_PAGE_ID=317
```

## Editor workflow (per page)
1) Ensure the page uses the correct template in WordPress:
   - Homepage: template-homepage.php
   - About: template-about-us.php
2) Fill page-specific fields in the page’s ACF group.
3) Toggle global blocks in the page’s Global Content Selection group.
4) Save and refresh the frontend.

## Debugging and validation
- Frontend debug panels list each global block’s Toggle, Data, and Status (Showing/Hidden).
- Typical issues:
  - Image fields: if you see GraphQL errors like “Cannot query field sourceUrl on type AcfMediaItemConnectionEdge”, ensure you query imageField { node { sourceUrl altText } }.
  - statsImage vs image: backend may expose as image; the frontend normalizes to statsImage.
  - Empty page-specific content: the UI shows a gentle fallback message to prompt editors.

## Blueprint for the next pages
Follow the same pattern:
1) Define page-specific ACF group via UI/JSON export and ensure show_in_graphql is enabled.
2) Decide where the per-page global toggles live:
   - Use Page.globalContentSelection (default) or a nested group under the page’s ACF group (like About).
3) Query shape:
   - Fetch globalOptions.globalContentBlocks once.
   - Fetch page(id: <DB_ID>, idType: DATABASE_ID) and its ACF group.
4) Normalize any minor field shape differences (e.g., images with node wrappers, aliasing).
5) Render blocks only when Toggle is On AND data exists.
6) Add/update the page’s debug panel to show Toggle/Data/Status.

## References to ACF JSON exports in repo
- documentation/acf-exports/WORKING-ACF/acf-export-2025-09-09-homepage.json
- documentation/acf-exports/WORKING-ACF/acf-export-2025-09-09-about-us.json
- documentation/acf-exports/WORKING-ACF/acf-export-2025-09-09 global-content.json

## Notes
- About uses nested global toggles under aboutUsContent to keep About-specific logic self-contained.
- Homepage uses homepageContentClean.globalContentSelection.
- Consider extracting common GraphQL fragments and mapping utilities as schemas stabilize.

