# GraphQL Query Testing Methods & Validation Techniques

**Generated:** December 2024  
**Purpose:** Comprehensive guide to testing and validating GraphQL queries for CDA Website  
**Environment:** Local development and production testing procedures  

## 🎯 Testing Overview

This document outlines the exact methods used to analyze the CDA website's GraphQL implementation, identify issues, and validate fixes. These techniques can be used for ongoing maintenance and debugging.

---

## 🔧 Testing Tools & Setup

### Required Tools
- **curl** - Command line HTTP testing
- **Node.js Dev Server** - Frontend application testing  
- **GraphiQL/GraphQL Playground** - Interactive query testing
- **Browser Developer Tools** - Frontend error inspection

### Environment Configuration
```bash
# Development URLs
FRONTEND_URL=http://localhost:3006
GRAPHQL_ENDPOINT=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql
WORDPRESS_ADMIN=http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/wp-admin
```

---

## 🕸️ HTTP Status Testing

### Page Availability Check
**Purpose:** Verify all pages load without HTTP errors  
**Method:** Automated curl requests to test all routes

```bash
# Test single page
curl -s -o /dev/null -w "%{http_code}" http://localhost:3006/

# Test multiple pages in batch
for page in services team case-studies about contact ai b2b booking-systems digital-marketing outsourced-cmo software-development knowledge-hub case-study terms-conditions 404 test-graphql; do 
  echo -n "$page: "
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3006/$page
  echo
done
```

**Expected Results:**
- All pages except `/404` should return `200`
- `/404` should return `404` (expected behavior)
- No `500` errors (indicates server crashes)
- No timeout errors

### Content State Analysis
**Purpose:** Determine if pages show loading states vs actual content

```bash
# Check for loading indicators
curl -s http://localhost:3006/ | grep -o "Loading content from WordPress\|Welcome to.*CDA Website\|Page Not Found\|Global Content Not Found"

# Batch check content state
for page in services team case-studies about contact; do 
  echo -n "$page: "
  curl -s http://localhost:3006/$page | grep -o "Our Services\|Our Team\|Case Studies\|About Us\|Contact Us\|Loading content\|No.*found\|Error Loading" | head -1
done
```

**Indicators:**
- ✅ **Working:** Specific content titles appear
- ⚠️ **Loading State:** "Loading content from WordPress..." appears  
- ❌ **Error:** "Error Loading" or "Not Found" appears

---

## 🔍 GraphQL Query Testing

### Basic Connection Test
**Purpose:** Verify GraphQL endpoint is accessible and responsive

```bash
# Test basic connection
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __typename }"}'
```

**Expected Response:**
```json
{"data":{"__typename":"RootQuery"}}
```

### Schema Introspection
**Purpose:** Check what fields and types are available

```bash
# Get root query fields
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query IntrospectionQuery { __schema { queryType { name fields { name type { name kind } } } } }"}' | head -c 500
```

**Usage:** Compare available fields with what queries are trying to use

### Page Discovery
**Purpose:** Find all WordPress pages and their IDs

```bash
# Discover all pages
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { pages { nodes { id title uri } } }"}'
```

**Critical Finding:** This revealed that homepage ID 289 doesn't exist

### Test Specific Queries
**Purpose:** Validate individual GraphQL queries before using in frontend

```bash
# Test global content (working)
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { globalOptions { globalSharedContent { whyCdaBlock { title } } } }"}'

# Test services list (working)
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { services { nodes { id title } } }"}'

# Test specific page (working)
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { page(id: \"791\", idType: DATABASE_ID) { id title contactContent { headerSection { title } } } }"}'
```

### Error Detection
**Purpose:** Identify specific GraphQL schema violations

```bash
# Test broken query (will show errors)
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { services(where: { serviceTypeIn: [\"test\"] }) { nodes { id } } }"}'
```

**Response with Errors:**
```json
{
  "data": {"services": null},
  "errors": [
    {
      "message": "Field \"serviceTypeIn\" is not defined by type \"RootQueryToServiceConnectionWhereArgs\".",
      "locations": [{"line": 1, "column": 25}]
    }
  ]
}
```

---

## 🖥️ Frontend Error Monitoring

### Development Server Logs
**Purpose:** Monitor GraphQL errors in real-time during development

```bash
# Start dev server with verbose logging
cd cda-frontend && npm run dev
```

**Error Patterns to Watch For:**
```
GraphQL errors: [
  {
    message: 'Field "serviceTypeIn" is not defined by type...',
    locations: [ [Object] ]
  }
]
```

### Browser Console Inspection
**Purpose:** Debug client-side GraphQL issues

**Steps:**
1. Open browser DevTools (F12)
2. Navigate to Console tab
3. Load page showing "Loading..." state
4. Look for GraphQL error messages
5. Check Network tab for failed GraphQL requests

**Common Error Patterns:**
- `GraphQL errors:` followed by schema violations
- Network failures to GraphQL endpoint
- Parsing errors in query strings

### Network Request Analysis
**Purpose:** Inspect actual GraphQL requests and responses

**Steps:**
1. Open DevTools → Network tab
2. Filter by "graphql" or "XHR"
3. Load problematic page
4. Click on GraphQL request
5. Examine Request payload and Response

**Red Flags:**
- Status codes other than 200
- Empty response data
- Error messages in response body
- Malformed query syntax

---

## 📊 Automated Testing Approaches

### Test Suite Implementation
**Purpose:** Systematic validation of all GraphQL queries

**Example Test Structure:**
```javascript
// Based on existing src/lib/graphql-test.ts
class GraphQLTester {
  async runTest(suiteName, testName, query, variables = {}) {
    const startTime = Date.now();
    try {
      const response = await executeGraphQLQuery(query, variables);
      const duration = Date.now() - startTime;
      
      if (response.errors) {
        return {
          query: testName,
          success: false,
          error: response.errors[0].message,
          duration,
          timestamp: new Date().toISOString()
        };
      }
      
      return {
        query: testName,
        success: true,
        data: response.data,
        duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        query: testName,
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }
}
```

### Batch Query Testing
**Purpose:** Test multiple queries and generate comprehensive reports

```bash
# Run existing test suite
cd cda-frontend
npm run dev
# Then visit: http://localhost:3006/test-graphql
```

**Test Categories:**
- Connection tests
- Page-specific ACF queries  
- Custom post type queries
- Archive/pagination queries
- Global content queries
- Taxonomy queries

---

## 🔍 Debugging Techniques

### Query Validation Process
1. **Syntax Check:** Ensure GraphQL syntax is correct
2. **Schema Validation:** Verify fields exist in schema
3. **Response Inspection:** Check data structure matches expectations
4. **Error Analysis:** Parse error messages for specific issues

### Common Issues & Solutions

#### Issue: "Loading content from WordPress..."
**Diagnosis Steps:**
1. Check browser console for GraphQL errors
2. Test query directly against GraphQL endpoint
3. Verify page/content ID exists in WordPress
4. Check if ACF fields are exposed to GraphQL

**Example Diagnosis:**
```bash
# Test the specific query the page uses
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { page(id: \"289\", idType: DATABASE_ID) { id title } }"}'

# Response: {"data": {"page": null}} indicates page doesn't exist
```

#### Issue: GraphQL Schema Errors
**Diagnosis Steps:**
1. Run query against endpoint to get exact error message
2. Check schema introspection for correct field names
3. Compare with working queries for correct patterns

**Example:**
```bash
# Error: Field "serviceTypeIn" is not defined
# Solution: Remove field or use different approach

# Check what fields ARE available:
curl -s -X POST $GRAPHQL_ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __type(name: \"RootQueryToServiceConnectionWhereArgs\") { fields { name } } }"}'
```

---

## 📋 Testing Checklist

### Pre-Deployment Testing
- [ ] All pages return HTTP 200 (except 404 page)
- [ ] No "Loading content..." states on main pages
- [ ] No GraphQL errors in browser console
- [ ] All GraphQL queries validated against schema
- [ ] Test suite passes with 100% success rate
- [ ] ACF fields accessible for configured pages

### Performance Testing
- [ ] GraphQL queries complete within reasonable time (< 2s)
- [ ] No memory leaks in query execution
- [ ] Pagination works efficiently
- [ ] Large datasets handle properly

### Edge Case Testing
- [ ] Empty query results handled gracefully
- [ ] Invalid parameters return appropriate errors
- [ ] Network failures don't crash application
- [ ] Malformed queries caught and logged

---

## 🎯 Validation Criteria

### Query Success Indicators
- ✅ HTTP 200 response from GraphQL endpoint
- ✅ No errors array in response
- ✅ Data structure matches expected format
- ✅ Required fields present and non-null
- ✅ Response time under 2 seconds

### Frontend Success Indicators  
- ✅ Page loads without showing loading spinner indefinitely
- ✅ Content renders properly with real data
- ✅ No GraphQL errors in browser console
- ✅ Interactive elements work as expected
- ✅ Images and media load correctly

### ACF Integration Success
- ✅ ACF fields return data (not null)
- ✅ Field structure matches WordPress configuration
- ✅ Media fields include sourceUrl and altText
- ✅ Repeater fields return as arrays
- ✅ Conditional fields respect logic

---

## 📖 Reference Commands

### Quick Testing Commands
```bash
# Test all pages status
for p in / /services /team /case-studies /about /contact /ai /b2b; do echo -n "$p: "; curl -s -o /dev/null -w "%{http_code}" http://localhost:3006$p; echo; done

# Test GraphQL connection
curl -s -X POST http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql -H "Content-Type: application/json" -d '{"query":"{__typename}"}' | head -c 100

# Find all WordPress pages
curl -s -X POST http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql -H "Content-Type: application/json" -d '{"query":"query{pages{nodes{id title uri}}}"}'

# Test global content
curl -s -X POST http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql -H "Content-Type: application/json" -d '{"query":"query{globalOptions{globalSharedContent{whyCdaBlock{title}}}}"}'
```

### WordPress Admin Checks
- Navigate to: Custom Fields → Field Groups
- Verify: "Show in GraphQL" is enabled
- Check: GraphQL Field Name is set correctly
- Test: Save and refresh GraphQL schema

---

**Testing Frequency:**
- **During Development:** After each query modification
- **Before Deployment:** Full test suite execution  
- **Post-Deployment:** Smoke tests on production
- **Ongoing:** Weekly automated test runs

**Documentation Updates:**
- Update this document when new testing methods are discovered
- Add new test cases for any new GraphQL queries
- Document any WordPress configuration changes affecting GraphQL

**Last Updated:** December 2024  
**Next Review:** After implementing corrected queries