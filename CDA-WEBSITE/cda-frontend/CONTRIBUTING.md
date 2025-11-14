# Contributing to CDA Website

## Metadata
- **Status**: ACTIVE
- **Category**: GUIDE
- **Last Modified**: November 14, 2025
- **Last Verified**: November 14, 2025
- **Related Files**: PROJECT_REQUIREMENTS.md, DOCUMENTATION_INDEX.md, ISSUE_PATTERNS.md
- **Code Dependencies**: All project files

---

## Welcome

Thank you for contributing to the CDA Website project! This guide will help you understand our development workflow, coding standards, and best practices.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Code Standards](#code-standards)
4. [Git Workflow](#git-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Component Development](#component-development)
7. [GraphQL Development](#graphql-development)
8. [Testing Guidelines](#testing-guidelines)
9. [Documentation Standards](#documentation-standards)
10. [Common Patterns](#common-patterns)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.6.7 or higher
- **Git**: Latest version
- **IDE**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - GraphQL

### First Time Setup

1. Clone the repository:
```bash
cd C:\xampp\htdocs\CDA-WEBSITE-PROJECT\CDA-WEBSITE
```

2. Install dependencies:
```bash
cd cda-frontend
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your local WordPress backend URL
```

4. Verify WordPress backend is running:
```bash
# Local WordPress should be accessible at:
# http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
```

5. Start development server:
```bash
npm run dev
```

6. Open browser to [http://localhost:3000](http://localhost:3000)

---

## Development Setup

### Environment Configuration

**Local Development (.env.local):**
```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production (.env.production):**
```env
NEXT_PUBLIC_WORDPRESS_URL=https://cdanewwebsite.wpenginepowered.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://cdanewwebsite.wpenginepowered.com/graphql
NEXT_PUBLIC_SITE_URL=https://cda-frontend-nine.vercel.app
```

### Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server locally
npm run start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

---

## Code Standards

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── services/          # Services pages
│   └── [slug]/            # Dynamic routes
├── components/            # React components
│   ├── GlobalBlocks/      # Reusable global blocks
│   └── UnderlinedTitle.tsx
├── lib/                   # Utility functions
│   ├── apollo-client.ts   # Apollo Client config
│   └── queries.ts         # GraphQL queries
└── styles/
    └── globals.css        # Global styles
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `UnderlinedTitle.tsx`)
- Utilities: `camelCase.ts` (e.g., `apolloClient.ts`)
- Pages: `lowercase/page.tsx` (e.g., `services/page.tsx`)

**Variables:**
- React components: `PascalCase` (e.g., `const ServiceCard = () => {}`)
- Functions: `camelCase` (e.g., `const fetchData = () => {}`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `const API_ENDPOINT = '...'`)

**CSS Classes:**
- Use Tailwind utility classes
- Custom classes: `kebab-case` (e.g., `.service-card`)

### TypeScript Guidelines

**Always use TypeScript for new components:**

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return <button onClick={onClick}>{label}</button>;
};

// ❌ Avoid
const Button = ({ label, onClick, variant }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

**Type GraphQL responses:**

```typescript
interface ServiceFields {
  heroSection: {
    title: string;
    subtitle: string;
    image: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface Service {
  id: string;
  slug: string;
  title: string;
  serviceFields: ServiceFields;
}
```

### Component Structure

**Standard component template:**

```typescript
import React from 'react';

interface ComponentNameProps {
  title: string;
  description?: string;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  description
}) => {
  // Hooks at the top
  const [state, setState] = React.useState(false);

  // Event handlers
  const handleClick = () => {
    setState(!state);
  };

  // Render
  return (
    <div className="container mx-auto">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};

export default ComponentName;
```

---

## Git Workflow

### Branch Naming

```bash
# Feature branches
feature/cda-XX-short-description
feature/add-newsletter-signup

# Bug fixes
fix/cda-XX-short-description
fix/mobile-padding-issue

# Hotfixes
hotfix/critical-bug-description

# Refactoring
refactor/component-name
```

### Commit Messages

Follow conventional commits format:

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     New feature
fix:      Bug fix
refactor: Code refactoring
docs:     Documentation changes
style:    Formatting, missing semi-colons, etc.
test:     Adding tests
chore:    Maintenance tasks

# Examples
feat(services): Add ServicesSlider component
fix(mobile): Correct padding inconsistency on About page
refactor(team): Extract TeamCard into separate component
docs: Update UNDERLINE_GUIDE with SVG implementation details
```

### Development Workflow

1. **Create a feature branch:**
```bash
git checkout main
git pull origin main
git checkout -b feature/cda-XX-description
```

2. **Make changes and commit:**
```bash
git add .
git commit -m "feat(scope): Description of changes"
```

3. **Keep branch updated:**
```bash
git checkout main
git pull origin main
git checkout feature/cda-XX-description
git merge main
```

4. **Push to remote:**
```bash
git push origin feature/cda-XX-description
```

5. **Create Pull Request on GitHub**

---

## Pull Request Process

### Before Creating PR

- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Test on desktop (1920px, 1440px, 1024px)
- [ ] Test on mobile (390px, 375px)
- [ ] Test in Chrome, Firefox, Safari
- [ ] Update documentation if needed
- [ ] Add/update tests if applicable

### PR Template

```markdown
## Description
Brief description of changes

## Jira Ticket
[CDA-XX](link-to-jira-ticket)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2

## Screenshots
[Add screenshots for UI changes]

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested in multiple browsers
- [ ] No console errors

## Checklist
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Lighthouse scores maintained (90+)
```

### Code Review Process

1. Assign reviewers (minimum 1 required)
2. Address review comments
3. Re-request review after changes
4. Merge only after approval
5. Delete branch after merge

---

## Component Development

### UnderlinedTitle Component

**Standard usage:**

```tsx
import UnderlinedTitle from '@/components/UnderlinedTitle';

// H1 with large underline
<UnderlinedTitle
  as="h1"
  className="text-5xl font-bold"
  underlineColor="#FF60DF"
  size="large"
>
  Page Title
</UnderlinedTitle>

// H2 with medium underline
<UnderlinedTitle
  as="h2"
  className="text-4xl font-bold"
  underlineColor="#3CBEEB"
  size="medium"
>
  Section Title
</UnderlinedTitle>
```

**Size guidelines:**
- `small` (7px stroke): H3 and smaller headings
- `medium` (9px stroke): H2 headings (38px text)
- `large` (11px stroke): H1 headings (50px text)

**Reference:** See [UNDERLINE_GUIDE.md](UNDERLINE_GUIDE.md) and [SIZING_REFERENCE.md](SIZING_REFERENCE.md)

### Responsive Images

**Always use Next.js Image component:**

```tsx
import Image from 'next/image';

// Above the fold (use priority)
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  className="w-full h-auto"
  priority
/>

// Below the fold (lazy load)
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  className="w-full h-auto"
  loading="lazy"
/>
```

### Layout Consistency

**Container pattern:**

```tsx
// Desktop: 1440px max-width, 80px padding
// Mobile: 100% width, 16px padding
<div className="container mx-auto px-4 lg:px-20 max-w-[1440px]">
  {/* Content */}
</div>
```

**Section spacing:**

```tsx
// Consistent vertical spacing between sections
<section className="mb-12 lg:mb-20">
  {/* Section content */}
</section>
```

**CRITICAL:** Always use `px-4` (16px) for mobile padding. See [ISSUE_PATTERNS.md](ISSUE_PATTERNS.md) Pattern 1.

### Button Specifications

```tsx
// Primary button
<button className="bg-brand-orange text-white px-8 py-4 rounded hover:scale-105 transition-transform duration-200 min-w-[160px] flex items-center gap-2">
  Learn More
  <span>→</span>
</button>

// Secondary button
<button className="border-2 border-current px-[30px] py-[14px] rounded hover:bg-brand-blue hover:text-white transition-colors duration-200">
  Contact Us
</button>

// Button group with correct spacing
<div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
  <button>Primary</button>
  <button>Secondary</button>
</div>
```

**CRITICAL:** Button gap must be 32px on desktop, 16px on mobile. See [ISSUE_PATTERNS.md](ISSUE_PATTERNS.md) Pattern 4.

---

## GraphQL Development

### Query Organization

**Location:** `src/lib/queries.ts`

**Standard structure:**

```typescript
import { gql } from '@apollo/client';

export const GET_SERVICE_BY_SLUG = gql`
  query GetServiceBySlug($slug: ID!) {
    service(id: $slug, idType: SLUG) {
      id
      slug
      title
      serviceFields {
        heroSection {
          title
          subtitle
          description
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
```

### Using Queries in Components

```typescript
import { useQuery } from '@apollo/client';
import { GET_SERVICE_BY_SLUG } from '@/lib/queries';

const ServicePage = ({ slug }: { slug: string }) => {
  const { data, loading, error } = useQuery(GET_SERVICE_BY_SLUG, {
    variables: { slug }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const service = data?.service;

  return (
    <div>
      <h1>{service.title}</h1>
      {/* Rest of component */}
    </div>
  );
};
```

### Common Patterns

**Gallery fields (nodes vs node):**

```graphql
# Correct - use 'nodes'
cultureGallerySlider {
  images {
    nodes {
      sourceUrl
      altText
    }
  }
}
```

**Optional fields:**

```graphql
# Always add null checks
service {
  serviceFields {
    heroSection {
      title
      subtitle
      description
    }
    statistics {
      stat1 {
        number
        label
      }
    }
  }
}
```

**Reference:** See [GRAPHQL_API_REFERENCE.md](GRAPHQL_API_REFERENCE.md) for complete documentation.

---

## Testing Guidelines

### Manual Testing Checklist

**Desktop Breakpoints:**
- [ ] 1920px (Wide desktop)
- [ ] 1440px (Standard desktop)
- [ ] 1024px (Laptop)

**Mobile Breakpoints:**
- [ ] 768px (Tablet)
- [ ] 390px (iPhone 14)
- [ ] 375px (iPhone SE)

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on all images
- [ ] Proper heading hierarchy
- [ ] Color contrast meets WCAG AA

**Performance Testing:**
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 90+
- [ ] Lighthouse Best Practices: 90+
- [ ] Lighthouse SEO: 90+
- [ ] Core Web Vitals: All green

### Testing Commands

```bash
# Build and test production bundle
npm run build
npm run start

# Check for console errors
# Open DevTools Console and check for errors/warnings

# Lighthouse audit
# Open DevTools > Lighthouse > Generate Report
```

---

## Documentation Standards

### When to Update Documentation

Update documentation when:
- Adding new components or features
- Changing component APIs or props
- Fixing bugs that affect documented behavior
- Adding new GraphQL queries
- Changing project structure
- Updating design specifications

### Documentation Files

**For new features:**
1. Update [CHANGELOG.md](CHANGELOG.md) under Unreleased section
2. Add entry to [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) if creating new doc
3. Create implementation guide if complex (see [services-slider-component-implementation.md](services-slider-component-implementation.md))

**For bug fixes:**
1. Update [ISSUE_PATTERNS.md](ISSUE_PATTERNS.md) if pattern identified
2. Update [CHANGELOG.md](CHANGELOG.md)

**For component changes:**
1. Update component-specific guides (e.g., [UNDERLINE_GUIDE.md](UNDERLINE_GUIDE.md))
2. Update [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) if specs changed

### Metadata Requirements

All documentation files must include metadata header:

```markdown
## Metadata
- **Status**: ACTIVE | DEPRECATED | DRAFT | NEEDS_UPDATE
- **Category**: IMPLEMENTATION | GUIDE | STATUS | PLANNING
- **Last Modified**: [Date]
- **Last Verified**: [Date]
- **Related Files**: [List]
- **Code Dependencies**: [List]
```

**Reference:** See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for standards.

---

## Common Patterns

### Pattern 1: Creating a New Page

```typescript
// src/app/new-page/page.tsx
import React from 'react';
import client from '@/lib/apollo-client';
import { GET_PAGE_DATA } from '@/lib/queries';

export default async function NewPage() {
  const { data } = await client.query({
    query: GET_PAGE_DATA,
    variables: { slug: 'new-page' }
  });

  return (
    <div className="container mx-auto px-4 lg:px-20 max-w-[1440px]">
      {/* Page content */}
    </div>
  );
}
```

### Pattern 2: Fetching Global Content

```typescript
// Global content blocks are fetched from WordPress options
import { GET_GLOBAL_OPTIONS } from '@/lib/queries';

const { data } = await client.query({
  query: GET_GLOBAL_OPTIONS
});

const globalOptions = data?.acfOptionsGlobalContent?.globalContent;
```

### Pattern 3: Dynamic Routes with Static Generation

```typescript
// Generate static paths
export async function generateStaticParams() {
  const { data } = await client.query({
    query: gql`
      query GetAllServices {
        services {
          nodes {
            slug
          }
        }
      }
    `
  });

  return data.services.nodes.map((service: { slug: string }) => ({
    slug: service.slug
  }));
}

// Page component
export default async function ServicePage({
  params
}: {
  params: { slug: string }
}) {
  // Fetch service data
}
```

### Pattern 4: Handling ACF Repeater Fields

```typescript
// ACF repeater fields come as arrays
{serviceFields.bulletPoints?.map((point, index) => (
  <div key={index}>
    <h3>{point.title}</h3>
    <p>{point.description}</p>
  </div>
))}
```

---

## Troubleshooting

### Common Issues

**Issue: GraphQL query returns null**
- Check field names match ACF field names exactly
- Verify field is exposed to GraphQL in ACF settings
- Check if field is in correct field group
- Use GraphQL IDE to test query

**Issue: Images not loading**
- Verify `NEXT_PUBLIC_WORDPRESS_URL` is correct
- Check image URL in browser directly
- Ensure WordPress media library has the image
- Check Next.js Image component width/height props

**Issue: Build fails with TypeScript errors**
- Run `npx tsc --noEmit` to see all errors
- Check for missing type definitions
- Verify imports are correct
- Add `// @ts-ignore` only as last resort

**Issue: Styling not applying**
- Check Tailwind class names are correct
- Verify custom colors are in `@theme` block
- Check if styles are being overridden
- Inspect element in browser DevTools

**Issue: Mobile padding inconsistent**
- See [ISSUE_PATTERNS.md](ISSUE_PATTERNS.md) Pattern 1
- Use `px-4 lg:px-20` consistently
- Check for hardcoded padding values

**Issue: Section spacing irregular**
- See [ISSUE_PATTERNS.md](ISSUE_PATTERNS.md) Pattern 2
- Use `mb-12 lg:mb-20` for section spacing
- Remove inline styles

---

## Getting Help

### Resources

- **Documentation**: Start with [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **Component Guides**: [UNDERLINE_GUIDE.md](UNDERLINE_GUIDE.md), [SIZING_REFERENCE.md](SIZING_REFERENCE.md)
- **GraphQL Queries**: [GRAPHQL_API_REFERENCE.md](GRAPHQL_API_REFERENCE.md)
- **Bug Patterns**: [ISSUE_PATTERNS.md](ISSUE_PATTERNS.md)
- **Project Specs**: [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md)

### Asking for Help

When asking for help, include:
1. What you're trying to achieve
2. What you've tried
3. Error messages (full stack trace)
4. Relevant code snippets
5. Screenshots if UI-related

---

## Code Review Checklist

### For Reviewers

**Code Quality:**
- [ ] Code follows project standards
- [ ] TypeScript types are defined
- [ ] No console.log statements left in
- [ ] No commented-out code
- [ ] No hard-coded values (use constants)

**Functionality:**
- [ ] Feature works as described
- [ ] No console errors
- [ ] Handles edge cases
- [ ] Error states handled

**UI/UX:**
- [ ] Matches design specifications
- [ ] Responsive on all breakpoints
- [ ] Consistent padding (px-4 lg:px-20)
- [ ] Consistent section spacing (mb-12 lg:mb-20)
- [ ] Buttons have correct spacing (gap-8)
- [ ] Images have alt text

**Performance:**
- [ ] Images optimized (using Next.js Image)
- [ ] No unnecessary re-renders
- [ ] Lazy loading for below-fold content
- [ ] No memory leaks

**Documentation:**
- [ ] Documentation updated if needed
- [ ] Comments for complex logic
- [ ] GraphQL queries documented
- [ ] CHANGELOG.md updated

---

## Version Control Best Practices

### Do's

- ✅ Commit frequently with clear messages
- ✅ Keep commits focused (one feature per commit)
- ✅ Pull latest changes before starting work
- ✅ Test before committing
- ✅ Review your own changes before PR

### Don'ts

- ❌ Commit directly to main
- ❌ Commit node_modules or .env files
- ❌ Force push to shared branches
- ❌ Commit untested code
- ❌ Use vague commit messages ("fix stuff", "updates")

---

## Release Process

### Preparing for Release

1. **Update version in package.json:**
```json
{
  "version": "1.3.0"
}
```

2. **Update CHANGELOG.md:**
```markdown
## [1.3.0] - 2025-11-XX

### Added
- Feature descriptions

### Fixed
- Bug fix descriptions
```

3. **Run full build:**
```bash
npm run build
npm run start
# Test production build thoroughly
```

4. **Create release tag:**
```bash
git tag -a v1.3.0 -m "Release version 1.3.0"
git push origin v1.3.0
```

5. **Deploy to production** (automatic via Vercel)

---

## Additional Notes

### WordPress Development

When making changes to WordPress:
- Always backup database before major changes
- Test ACF field changes locally first
- Verify GraphQL schema updates
- Clear WordPress cache after changes

### Performance Optimization

- Use `priority` prop on above-fold images
- Implement lazy loading for below-fold content
- Minimize JavaScript bundle size
- Use dynamic imports for large components
- Optimize images (WebP format preferred)

### Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Sanitize user inputs
- Validate data from WordPress/GraphQL
- Keep dependencies updated

---

## Quick Reference

### Frequently Used Commands

```bash
# Start development
npm run dev

# Production build
npm run build && npm run start

# Check for errors
npm run lint
npx tsc --noEmit

# Git workflow
git checkout -b feature/cda-XX-description
git add .
git commit -m "feat(scope): Description"
git push origin feature/cda-XX-description
```

### Key File Paths

```
src/components/UnderlinedTitle.tsx    # SVG underline component
src/lib/apollo-client.ts               # Apollo Client config
src/lib/queries.ts                     # GraphQL queries
src/app/globals.css                    # Global styles with @theme
src/app/page.tsx                       # Homepage
PROJECT_REQUIREMENTS.md                # Design specifications
GRAPHQL_API_REFERENCE.md              # GraphQL documentation
```

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Maintained By**: Development Team
**Questions?**: Refer to [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for all documentation
