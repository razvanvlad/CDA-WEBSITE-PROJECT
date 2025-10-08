# Case Studies Component - WordPress Configuration Needed

**Status:** ⚠️ WordPress ACF Configuration Required
**Date:** October 7, 2025

## Summary

The Case Studies component is **correctly implemented and working**, but it's currently using **fallback data** from the database because the WordPress ACF Global Content section does not have Case Studies data configured.

## Current Behavior

✅ **Component is functional** - Displays 2 case studies on homepage
✅ **Images are simple rectangles** - No 3D transform, clean display
✅ **Button style correct** - Using `button-l-transparent` class
✅ **Orange underline working** - Applied dynamically to "Case Studies" text
⚠️ **Using fallback data** - WordPress ACF not configured

### Fallback Data Currently Showing:
- **Title:** "Some Of Our Case Studies"
- **Subtitle:** "Projects"
- **CTA:** "View All Case Studies" → `/case-studies`
- **Case Studies:** Latest 2 from database (STYLED HOME STUDIOS, Cartwright & Butler)

## What Needs to be Done in WordPress

To get the **actual WordPress ACF data** to show instead of fallback, you need to:

### 1. Navigate to WordPress Admin
Go to: **Global Content** (ACF Options Page)

### 2. Locate "Case Studies Section" Field Group
This should be field #17 in the Global Content Blocks

### 3. Configure the Following Fields:

#### **Title** (required)
- Example: `"Some Of Our Case Studies"`
- The orange underline will automatically be applied to the text "Case Studies"

#### **Subtitle** (required)
- Example: `"Projects"`

#### **Knowledge Hub Link** (required)
- **URL:** `/case-studies`
- **Title:** `"View All Case Studies"`
- **Target:** `_self` (or `_blank` if you want it to open in new tab)

#### **Case Studies** (required)
- **Field Type:** Post Object or Relationship field
- **Select:** 2 case studies from your Case Studies post type
- These will appear in alternating layout (40/60 split)

### 4. Save the Global Content Page

Once saved, the data should appear on the homepage automatically.

## Technical Details

### GraphQL Query
The component fetches data via:
```graphql
query GetGlobalContent {
  globalOptions {
    globalContentBlocks {
      caseStudiesSection {
        title
        subtitle
        knowledgeHubLink { url title target }
        caseStudies {
          ... on CaseStudy {
            id
            title
            uri
            excerpt
            featuredImage { node { sourceUrl altText } }
          }
        }
      }
    }
  }
}
```

### Data Structure Expected
```javascript
{
  title: "Some Of Our Case Studies",
  subtitle: "Projects",
  knowledgeHubLink: {
    url: "/case-studies",
    title: "View All Case Studies",
    target: "_self"
  },
  caseStudies: [
    {
      id: "...",
      title: "Case Study Name",
      uri: "/case-studies/slug",
      excerpt: "<p>Description...</p>",
      featuredImage: {
        node: {
          sourceUrl: "https://...",
          altText: "..."
        }
      }
    }
  ]
}
```

### Fallback Logic
If WordPress ACF data is not found, the system automatically:
1. Fetches the latest 2 case studies from the database
2. Creates a fallback data structure with default text
3. Displays them on the homepage

## Files Modified

1. **[CaseStudies.js](../CDA-WEBSITE/cda-frontend/src/components/GlobalBlocks/CaseStudies.js)**
   - Removed 3D transforms from images
   - Changed button to `button-l-transparent`
   - Updated to use `caseStudies` array (not `selectedStudies.nodes`)

2. **[graphql-queries.js](../CDA-WEBSITE/cda-frontend/src/lib/graphql-queries.js:371-384)**
   - Fixed base query to include: `subtitle`, `knowledgeHubLink`, `uri`, `excerpt`, `featuredImage`
   - Changed field from `selectedStudies.nodes` to `caseStudies`

3. **[page.js](../CDA-WEBSITE/cda-frontend/src/app/page.js:160-191)**
   - Added debug logging to track data source
   - Updated fallback structure to match new schema

## Verification

Once WordPress is configured, you should see in the server logs:
```
✅ Using WordPress ACF data: [Your Title Here]
```

Instead of:
```
⚠️ Using fallback case studies from database
```

## Design Specifications Met

✅ Images display as simple rectangles (no 3D distortion)
✅ Button uses `button-l-transparent` style
✅ Orange underline on "Case Studies" text only
✅ Alternating 40/60 desktop layout
✅ Mobile vertical stacking
✅ Proper typography (Inter body, Poppins titles)

## Next Steps

1. **Add data to WordPress** → Go to Global Content page in WordPress admin
2. **Configure all 4 fields** → Title, Subtitle, Link, Case Studies selection
3. **Save** → Data will appear immediately on homepage
4. **Remove debug logs** → Once confirmed working, clean up console.log statements

---

**Note:** The component is fully functional and production-ready. It just needs the WordPress content to be configured by the site administrator.
