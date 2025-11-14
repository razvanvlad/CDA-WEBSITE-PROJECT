# Changelog

All notable changes to the CDA Website project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- SectionWrapper component for consistent spacing
- ResponsiveImage component for standardized image handling
- Comprehensive TypeScript migration
- Analytics integration (Google Analytics 4)
- Site-wide search functionality

---

## [1.2.0] - 2025-11-14

### Added - Documentation System Overhaul
- **DOCUMENTATION_AUDIT.md** - Complete audit of all documentation files with code verification
- **DOCUMENTATION_INDEX.md** - Master index for navigating all documentation
- **PROJECT_REQUIREMENTS.md** - Comprehensive Product Requirements Document (PRD) with 590+ lines
- **ISSUE_PATTERNS.md** - Common bug patterns and solutions catalog (6 patterns documented)
- **GRAPHQL_API_REFERENCE.md** - Complete GraphQL API documentation with query examples
- **CONTRIBUTING.md** - Development guidelines, code standards, and workflow documentation
- **CHANGELOG.md** - This file for tracking all project changes
- **docs-archive/** folder structure with README.md and DEPRECATION_TEMPLATE.md
- Standardized metadata headers to all 11 existing documentation files
- Cross-reference system between related documentation files

### Changed
- **UNDERLINE_GUIDE.md** - Corrected to reference SVG curved underlines (was incorrectly stating CSS text-decoration)
- **IMPLEMENTATION_PROGRESS.md** - Fixed line 218 to correctly state SVG implementation
- **IMPLEMENTATION_COMPLETE_SUMMARY.md** - Updated to reflect SVG curved underlines
- All documentation files now verified against actual codebase

### Fixed
- Critical documentation misinformation about underline implementation
- Inconsistent metadata across documentation files
- Missing cross-references between related documents

---

## [1.1.0] - 2025-11-03

### Added
- **Policies Custom Post Type** - Complete implementation with GraphQL integration
- **News Route Cleanup** - Unified slug structure to /news/[slug]
- **Services Slider Component** - Reusable horizontal slider for services
- **About Page Query Fixes** - GraphQL query corrections for Culture Gallery and Why CDA sections

### Changed
- Consolidated blog/news routes from `/news-article/` to `/news/`
- Updated internal links across Knowledge Hub and News components
- Improved GraphQL query structure for gallery fields (nodes vs node)

### Fixed
- Culture Gallery Slider not loading due to incorrect GraphQL syntax
- Why CDA Block missing content cards (usp field mapping)
- Missing toggle fields in About page query

---

## [1.0.0] - 2025-10-28

### Added - UnderlinedTitle Implementation
- **UnderlinedTitle Component** - SVG curved underlines with quadratic bezier paths
- Implemented across 28 sections site-wide
- Brand color system in Tailwind (`@theme` block)
- Typography scale (H1: 50px/32px, H2: 38px/28px)
- Button specifications and standards

### Components Updated
- ServicesAccordion - Purple underlines
- StatsBlock - 4 numbers with color-coded underlines
- ApproachBlock - Pink underlines
- LocationsImage - Country tabs with underlines
- ValuesBlock - Section titles
- 20 page files updated

### Technical Details
- Component: `src/components/UnderlinedTitle.tsx`
- Multi-line support with ResizeObserver
- Responsive curve intensity (default: 0.01)
- Configurable stroke width by size (small: 7px, medium: 9px, large: 11px)

---

## [0.9.0] - 2025-09-16

### Added
- About Us page GraphQL query development
- WhyCdaBlock component
- Culture Gallery Slider component

### Fixed
- GraphQL query structure for ACF gallery fields
- Component data structure mismatches with ACF fields

---

## [0.8.0] - Earlier Development

### Added
- Initial Next.js 15 setup with App Router
- WordPress headless CMS integration
- GraphQL endpoint configuration
- Custom post types:
  - Services
  - Case Studies
  - Team Members
  - Job Listings
  - Technologies
  - Blog Posts

### Infrastructure
- Tailwind CSS 4 configuration
- TypeScript setup
- Apollo Client integration
- Image optimization with Next.js Image
- Environment configuration (local/production)

---

## Version History Summary

| Version | Date | Key Features |
|---------|------|--------------|
| 1.2.0 | 2025-11-14 | Documentation system overhaul |
| 1.1.0 | 2025-11-03 | Policies, News cleanup, Services slider |
| 1.0.0 | 2025-10-28 | UnderlinedTitle implementation (28 sections) |
| 0.9.0 | 2025-09-16 | About page queries, GraphQL fixes |
| 0.8.0 | Earlier | Initial project setup and core features |

---

## Change Categories

### Added
For new features or files.

### Changed
For changes in existing functionality.

### Deprecated
For soon-to-be removed features.

### Removed
For now removed features.

### Fixed
For any bug fixes.

### Security
For security-related changes.

---

## Contributing

When adding to this changelog:

1. **Use the unreleased section** for changes not yet in production
2. **Move to versioned section** when deploying
3. **Follow the format** of existing entries
4. **Group by category** (Added, Changed, Fixed, etc.)
5. **Be specific** about what changed and why
6. **Reference files/components** when relevant

### Example Entry
```markdown
### Added
- **ComponentName** - Brief description of what it does
- Feature explanation with file reference: `src/path/to/file.js`

### Fixed
- Issue description - What was wrong and how it was fixed
- Reference Jira ticket if applicable (CDA-XX)
```

---

## Release Process

1. Update [Unreleased] section as you work
2. Create new version section when releasing
3. Move unreleased changes to new version
4. Update version number in package.json
5. Tag release in Git
6. Deploy to production

---

**Maintained By**: Development Team
**Started**: 2025 (retroactive entries added)
**Last Updated**: November 14, 2025
