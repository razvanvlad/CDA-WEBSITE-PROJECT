# Service Pages Implementation Guide

This document provides a comprehensive guide for implementing and maintaining service pages with ACF (Advanced Custom Fields) content in the CDA website project.

## Overview

Service pages are dynamic content pages that display detailed information about CDA's services. They utilize WordPress ACF fields for flexible content management and GraphQL for data fetching in the Next.js frontend.

## Architecture

### Backend (WordPress)
- **Post Type**: `services`
- **ACF Field Group**: "Service Content" (`group_services_content`)
- **GraphQL Field Name**: `serviceFields`
- **Location**: Applied to all posts of type "services"

### Frontend (Next.js)
- **Route**: `/services/[slug]`
- **Component**: `src/app/services/[slug]/page.js`
- **GraphQL Query**: `GET_SERVICE_BY_SLUG` in `src/lib/graphql-queries.js`

## ACF Field Structure

Based on the ACF export file `acf-export-2025-09-10-service-content.json`, the service content includes:

### 1. Hero Section (`heroSection`)
```json
{
  "subtitle": "string",
  "description": "textarea",
  "heroImage": {
    "node": {
      "sourceUrl": "string",
      "altText": "string"
    }
  },
  "cta": {
    "url": "string",
    "title": "string"
  }
}
```

### 2. Key Statistics (`keyStatistics`)
```json
{
  "number": "string",
  "label": "string",
  "description": "string"
}
```
*Note: Currently not implemented in GraphQL due to schema mismatch*

### 3. Service Features (`serviceFeatures`)
```json
[
  {
    "icon": {
      "node": {
        "sourceUrl": "string",
        "altText": "string"
      }
    },
    "title": "string",
    "description": "textarea"
  }
]
```
*Note: Currently not implemented in GraphQL due to schema mismatch*

### 4. Service Bullet Points (`serviceBulletPoints`)
```json
{
  "title": "string",
  "bullets": [
    {
      "text": "string"
    }
  ]
}
```

### 5. Value Description (`valueDescription`)
```json
{
  "title": "string",
  "description": "textarea",
  "cta": {
    "url": "string",
    "title": "string"
  }
}
```

### 6. Client Logos (`clientsLogos`)
```json
{
  "title": "string",
  "description": "textarea",
  "largeImage": {
    "node": {
      "sourceUrl": "string",
      "altText": "string"
    }
  },
  "logos": [
    {
      "logo": {
        "node": {
          "sourceUrl": "string",
          "altText": "string"
        }
      }
    }
  ]
}
```
*Note: Currently not implemented in GraphQL due to schema complexity*

## Current Implementation Status

### ✅ Working Fields
1. **Hero Section** - Fully implemented
   - Subtitle, description, hero image, CTA button
   - Responsive layout with image on right side
   - Fallback to featured image if hero image not set

2. **Service Bullet Points** - Fully implemented
   - Dynamic title
   - Bulleted list with custom styling
   - Grid layout for better readability

3. **Value Description** - Fully implemented
   - Custom title and description
   - CTA button with proper styling
   - Gradient background for visual appeal

### ❌ Not Yet Implemented
1. **Key Statistics** - Schema mismatch (field name should be `statistics`)
2. **Service Features** - Schema complexity with repeater fields
3. **Client Logos** - Schema complexity with nested repeater fields

## GraphQL Query

### Current Working Query
```graphql
query GetServiceBySlug($slug: ID!) {
  service(id: $slug, idType: SLUG) {
    id
    title
    slug
    date
    content
    excerpt
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    serviceFields {
      heroSection {
        subtitle
        description
        heroImage {
          node {
            sourceUrl
            altText
          }
        }
        cta {
          url
          title
        }
      }
      serviceBulletPoints {
        title
        bullets {
          text
        }
      }
      valueDescription {
        title
        description
        cta {
          url
          title
        }
      }
    }
  }
}
```

## Component Structure

### File: `src/app/services/[slug]/page.js`

#### Key Features:
1. **SEO Metadata Generation**
   - Dynamic title and description
   - Open Graph tags
   - Fallback descriptions

2. **Responsive Layout**
   - Hero section with image and content side-by-side
   - Mobile-first responsive design
   - Consistent spacing and typography

3. **Conditional Rendering**
   - All sections render only when content is available
   - Graceful fallbacks for missing content
   - Error handling for undefined fields

4. **Styling**
   - Tailwind CSS for consistent design
   - Purple accent color (`purple-600`)
   - Card-based layouts with shadows
   - Gradient backgrounds for emphasis

## Implementation Guidelines

### Adding New ACF Fields

1. **Update ACF Configuration**
   - Add fields through WordPress admin
   - Ensure `show_in_graphql` is enabled
   - Set appropriate `graphql_field_name`

2. **Test GraphQL Schema**
   - Use GraphiQL or similar tool to test field availability
   - Verify field names and structure
   - Check for required `node` wrappers on image fields

3. **Update GraphQL Query**
   - Add new fields to `GET_SERVICE_BY_SLUG` query
   - Follow existing patterns for nested fields
   - Test query in development environment

4. **Update Component**
   - Extract field data in component state
   - Add conditional rendering logic
   - Implement responsive design
   - Follow existing styling patterns

### Common Issues and Solutions

#### GraphQL Schema Mismatches
- **Problem**: Field names in ACF export don't match GraphQL schema
- **Solution**: Use GraphiQL to inspect actual schema field names
- **Example**: `keyStatistics` vs `statistics`

#### Image Field Structure
- **Problem**: Images require `node` wrapper in GraphQL
- **Solution**: Always query images as `{ node { sourceUrl altText } }`
- **Example**: `heroImage.node.sourceUrl` not `heroImage.sourceUrl`

#### Repeater Field Complexity
- **Problem**: Complex nested repeater fields cause GraphQL errors
- **Solution**: Start with simple fields, add complexity incrementally
- **Strategy**: Test each field addition individually

## Testing Checklist

### Before Deployment
- [ ] All GraphQL queries execute without errors
- [ ] Service pages load with 200 status
- [ ] Content displays correctly when populated
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] SEO metadata generates properly
- [ ] Images load with proper alt text
- [ ] CTA buttons link correctly
- [ ] Fallbacks work when content is missing

### Content Management
- [ ] WordPress admin shows all ACF fields
- [ ] Field validation works as expected
- [ ] Content saves and publishes correctly
- [ ] Preview functionality works
- [ ] GraphQL cache invalidates on content updates

## Future Enhancements

### Planned Additions
1. **Key Statistics Section**
   - Resolve schema field name mismatch
   - Implement grid layout for statistics
   - Add number formatting and animations

2. **Service Features Section**
   - Implement repeater field support
   - Add icon display functionality
   - Create feature card components

3. **Client Logos Section**
   - Implement logo grid layout
   - Add hover effects and animations
   - Support for large showcase image

### Performance Optimizations
1. **Image Optimization**
   - Implement Next.js Image component
   - Add lazy loading for below-fold content
   - Optimize image sizes and formats

2. **Caching Strategy**
   - Implement GraphQL query caching
   - Add static generation for service pages
   - Configure CDN for image delivery

## Troubleshooting

### Common Error Messages

#### "Cannot query field X on type Y"
- **Cause**: Field name mismatch between ACF and GraphQL schema
- **Solution**: Check actual GraphQL schema field names
- **Tool**: Use GraphiQL to inspect schema

#### "Field X must have a sub selection"
- **Cause**: Querying complex field without specifying sub-fields
- **Solution**: Add proper sub-field selections
- **Example**: Query `{ title description }` not just field name

#### "Cannot query field sourceUrl on type AcfMediaItemConnectionEdge"
- **Cause**: Missing `node` wrapper for image fields
- **Solution**: Use `{ node { sourceUrl altText } }` structure

### Debug Tools

1. **GraphiQL**: `http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql`
2. **Browser DevTools**: Check Network tab for GraphQL errors
3. **Next.js DevTools**: Monitor component state and props
4. **WordPress Debug**: Enable WP_DEBUG for ACF issues

## Maintenance

### Regular Tasks
1. **Content Audit**: Review and update service content quarterly
2. **Performance Monitoring**: Check page load times and Core Web Vitals
3. **SEO Review**: Ensure metadata and content optimization
4. **Accessibility Testing**: Verify WCAG compliance

### Version Control
1. **ACF Exports**: Keep ACF field exports in version control
2. **Documentation Updates**: Update this guide when making changes
3. **Testing**: Run full test suite before major releases

---

*Last Updated: January 2025*
*Version: 1.0*
*Author: Development Team*