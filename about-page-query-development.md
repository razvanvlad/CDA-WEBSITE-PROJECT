# About Us Page Query Development

## Overview
This document outlines the development and fixes applied to the About Us page GraphQL queries to resolve issues with global content sections not displaying correctly.

## Issues Identified

### 1. Culture Gallery Slider Not Loading
**Problem**: The Culture Gallery Slider section was not displaying on the About Us page.

**Root Cause**: 
- GraphQL query was using incorrect syntax `images { node { ... } }` instead of `images { nodes { ... } }`
- Gallery fields in WordPress GraphQL return connections with `nodes` array, not single `node`

**Error Message**:
```
Cannot query field "node" on type "AcfMediaItemConnection". Did you mean "nodes"?
```

### 2. Why CDA Section Missing Content
**Problem**: Why CDA block was displaying title/subtitle but no content cards.

**Root Cause**:
- Component expected `cards` field but ACF structure uses `usp` (Unique Selling Points)
- Image references used `image` field instead of `icon` field
- GraphQL query was incomplete - missing the actual content fields

### 3. Missing Toggle Fields
**Problem**: `enableCultureGallerySlider` toggle was missing from About page query.

**Root Cause**: The field was not included in the `globalContentSelection` GraphQL query.

## Solutions Implemented

### 1. Fixed Culture Gallery Slider GraphQL Query

**File**: `src/app/about/page.js`
```graphql
# BEFORE (Incorrect)
cultureGallerySlider {
  title
  subtitle
  useGlobalSocialLinks
  images {
    node {  # ❌ Wrong syntax
      sourceUrl
      altText
    }
  }
}

# AFTER (Fixed)
cultureGallerySlider {
  title
  subtitle
  useGlobalSocialLinks
  images {
    nodes {  # ✅ Correct for gallery connections
      sourceUrl
      altText
    }
  }
}
```

**File**: `src/lib/graphql/queries.js`
```graphql
# Updated global query structure
cultureGallerySlider {
  title
  subtitle
  useGlobalSocialLinks
  images {
    nodes {
      sourceUrl
      altText
    }
  }
}
```

### 2. Fixed Why CDA Block Data Structure

**ACF Structure Analysis**:
Based on `acf-export-2025-09-16-global-content-blocks.json`:
- Field name: `why_cda_block`
- GraphQL name: `whyCda`
- Content field: `usp` (not `cards`)
- Image field: `icon` (not `image`)

**GraphQL Query Updates**:
```graphql
# BEFORE (Incomplete)
whyCda {
  title
  subtitle
}

# AFTER (Complete)
whyCda {
  title
  subtitle
  usp {
    title
    description
    icon { node { sourceUrl altText } }
  }
}
```

**Component Updates** (`src/components/GlobalBlocks/WhyCdaBlock.js`):
```javascript
// BEFORE
const cards = Array.isArray(globalData?.cards) ? globalData.cards.filter(Boolean) : [];

// AFTER  
const cards = Array.isArray(globalData?.usp) ? globalData.usp.filter(Boolean) : [];
```

```javascript
// BEFORE
{card?.image?.node?.sourceUrl && (
  <Image src={card.image.node.sourceUrl} ... />
)}

// AFTER
{card?.icon?.node?.sourceUrl && (
  <Image src={card.icon.node.sourceUrl} ... />
)}
```

### 3. Added Missing Toggle Field

**File**: `src/app/about/page.js`
```graphql
globalContentSelection {
  enableImageFrame
  enableServicesAccordion
  enableWhyCda
  enableShowreel
  enableApproach
  enableTechnologiesSlider
  enableValues
  enableStatsImage
  enableLocationsImage
  enableNewsCarousel
  enableNewsletterSignup
  enableCultureGallerySlider  # ✅ Added missing field
}
```

## Files Modified

### Core Files
1. **`src/app/about/page.js`**
   - Fixed Culture Gallery Slider `images.nodes` structure
   - Added complete Why CDA `usp` fields with icons
   - Added missing `enableCultureGallerySlider` toggle

2. **`src/lib/graphql/queries.js`**
   - Updated global Culture Gallery Slider query structure
   - Fixed Why CDA block query to use `usp` instead of `cards`

3. **`src/components/GlobalBlocks/WhyCdaBlock.js`**
   - Updated component to use `usp` field instead of `cards`
   - Changed image references from `image` to `icon`

## ACF Field Structure Reference

Based on the ACF export file analysis:

### Culture Gallery Slider
```json
{
  "name": "culture_gallery_slider",
  "graphql_field_name": "cultureGallerySlider",
  "sub_fields": [
    {"name": "title"},
    {"name": "subtitle"},
    {"name": "use_global_social_links"},
    {"name": "images", "type": "gallery"}
  ]
}
```

### Why CDA Block  
```json
{
  "name": "why_cda_block", 
  "graphql_field_name": "whyCda",
  "sub_fields": [
    {"name": "title"},
    {"name": "subtitle"},
    {
      "name": "usp",
      "type": "repeater",
      "sub_fields": [
        {"name": "title"},
        {"name": "description"},
        {"name": "icon", "type": "image"}
      ]
    }
  ]
}
```

## Testing & Verification

### Test Results
- ✅ **Culture Gallery Slider**: 6 images loading correctly
- ✅ **Why CDA Block**: 6 USP items with icons displaying
- ✅ **GraphQL Queries**: No syntax errors
- ✅ **Build Process**: Successful compilation

### Test Data Retrieved
```javascript
// Culture Gallery Slider
{
  title: "Life At CDA",
  subtitle: "Culture", 
  images: { nodes: [6 images] },
  useGlobalSocialLinks: true
}

// Why CDA Block
{
  title: "Why CDA",
  subtitle: "What Makes Us The Right Choice?",
  usp: [
    {
      title: "Fully Bespoke Websites Builds",
      description: "Lorem ipsum dolor sit amet...",
      icon: { node: { sourceUrl: "...", altText: "" } }
    }
    // ... 5 more USP items
  ]
}
```

## Key Learnings

1. **WordPress GraphQL Gallery Fields**: Always use `nodes` for gallery/relationship connections
2. **ACF Field Mapping**: Verify field names in ACF exports vs. component expectations  
3. **GraphQL Query Completeness**: Ensure all required fields are included in queries
4. **Component Data Structure**: Match component expectations with actual ACF structure

## Future Considerations

1. **Field Validation**: Add runtime validation for expected data structures
2. **Error Handling**: Improve error messages for missing or malformed data
3. **Documentation**: Keep ACF field documentation in sync with component expectations
4. **Testing**: Implement automated tests for GraphQL query structure validation

## Build Status
- ✅ Next.js build successful
- ✅ No GraphQL syntax errors
- ✅ All global sections rendering correctly
- ✅ Production-ready deployment

---

**Development Date**: September 16, 2025  
**Developer**: AI Assistant  
**Status**: Complete ✅
