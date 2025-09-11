#!/usr/bin/env node

/**
 * CDA Website SEO Test Suite
 * Comprehensive SEO validation including meta tags, Open Graph, structured data, and dynamic content
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const { performance } = require('perf_hooks');

// Test configuration
const SEO_TEST_CONFIG = {
  baseUrl: 'http://localhost:3005',
  graphqlEndpoint: 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql',
  logFile: 'seo-test-results.log',
  routes: {
    static: [
      '/',
      '/services',
      '/case-studies', 
      '/team',
      '/about',
      '/contact'
    ],
    dynamic: {
      services: [
        // Will be populated by GraphQL query
      ],
      caseStudies: [
        // Will be populated by GraphQL query
      ],
      teamMembers: [
        // Will be populated by GraphQL query
      ]
    }
  },
  seoRequirements: {
    metaTags: {
      required: ['title', 'description'],
      recommended: ['keywords', 'author', 'viewport', 'charset']
    },
    openGraph: {
      required: ['og:title', 'og:description', 'og:type'],
      recommended: ['og:image', 'og:url', 'og:site_name']
    },
    twitter: {
      recommended: ['twitter:card', 'twitter:title', 'twitter:description']
    },
    structuredData: {
      types: ['Organization', 'WebSite', 'Person', 'Service', 'Article']
    }
  }
};

class SEOLogger {
  constructor(logFile) {
    this.logFile = logFile;
    this.results = {
      startTime: new Date().toISOString(),
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
      seoScore: { total: 0, maxScore: 0 }
    };
    
    // Clear previous log
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
    
    this.log('============================================================');
    this.log('CDA WEBSITE SEO TEST SUITE');
    this.log('============================================================');
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logEntry);
    fs.appendFileSync(this.logFile, logEntry + '\\n');
  }

  addTest(testName, status, details = {}) {
    const test = { name: testName, status, timestamp: new Date().toISOString(), ...details };
    this.results.tests.push(test);
    this.results.summary.total++;
    
    const icons = { PASS: '✅', FAIL: '❌', WARN: '⚠️' };
    const icon = icons[status] || '❓';
    
    if (status === 'PASS') {
      this.results.summary.passed++;
      this.results.seoScore.total += details.score || 1;
    } else if (status === 'FAIL') {
      this.results.summary.failed++;
    } else if (status === 'WARN') {
      this.results.summary.warnings++;
      this.results.seoScore.total += (details.score || 1) * 0.5;
    }
    
    this.results.seoScore.maxScore += details.maxScore || 1;
    
    this.log(`${icon} ${status}: ${testName}${details.error ? ' - ' + details.error : ''}${details.warning ? ' - ' + details.warning : ''}`, status);
    
    if (details.details) {
      this.log(`    Details: ${details.details}`);
    }
    if (details.found && Array.isArray(details.found)) {
      details.found.forEach(item => this.log(`    ✓ ${item}`));
    }
    if (details.missing && Array.isArray(details.missing)) {
      details.missing.forEach(item => this.log(`    ✗ Missing: ${item}`));
    }
  }

  generateReport() {
    this.results.endTime = new Date().toISOString();
    this.results.duration = new Date(this.results.endTime) - new Date(this.results.startTime);
    this.results.seoScore.percentage = Math.round((this.results.seoScore.total / this.results.seoScore.maxScore) * 100);
    
    const reportPath = 'seo-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    this.log('============================================================');
    this.log('SEO TEST SUITE COMPLETED');
    this.log('============================================================');
    this.log(`📊 SUMMARY:`);
    this.log(`   Total Tests: ${this.results.summary.total}`);
    this.log(`   ✅ Passed: ${this.results.summary.passed}`);
    this.log(`   ❌ Failed: ${this.results.summary.failed}`);
    this.log(`   ⚠️  Warnings: ${this.results.summary.warnings}`);
    this.log(`   🎯 SEO Score: ${this.results.seoScore.percentage}% (${this.results.seoScore.total}/${this.results.seoScore.maxScore})`);
    this.log(`   ⏱️  Duration: ${Math.round(this.results.duration / 1000)}s`);
    this.log(`📄 Report saved to: ${reportPath}`);
    this.log('============================================================');
    
    return this.results.summary.failed === 0;
  }
}

function makeHttpRequest(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const parsedUrl = new url.URL(urlString);
    const isHttps = parsedUrl.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'CDA-SEO-Test-Suite/1.0 (SEO Validation Bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: options.timeout || 15000
    };

    const req = httpModule.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          data: data,
          responseTime: Math.round(endTime - startTime),
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (err) => {
      reject({
        error: err.message,
        code: err.code,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        code: 'TIMEOUT',
        success: false
      });
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

function parseHTML(html) {
  const metaTags = {};
  const openGraphTags = {};
  const twitterTags = {};
  const structuredData = [];
  
  // Extract meta tags
  const metaRegex = /<meta\\s+([^>]*?)>/gi;
  let metaMatch;
  
  while ((metaMatch = metaRegex.exec(html)) !== null) {
    const metaAttrs = metaMatch[1];
    const nameMatch = metaAttrs.match(/name=["']([^"']+)["']/i);
    const propertyMatch = metaAttrs.match(/property=["']([^"']+)["']/i);
    const contentMatch = metaAttrs.match(/content=["']([^"']+)["']/i);
    const charsetMatch = metaAttrs.match(/charset=["']?([^"'\\s]+)["']?/i);
    
    if (contentMatch) {
      if (nameMatch) {
        metaTags[nameMatch[1]] = contentMatch[1];
      } else if (propertyMatch) {
        const prop = propertyMatch[1];
        if (prop.startsWith('og:')) {
          openGraphTags[prop] = contentMatch[1];
        } else if (prop.startsWith('twitter:')) {
          twitterTags[prop] = contentMatch[1];
        }
      }
    }
    
    if (charsetMatch) {
      metaTags['charset'] = charsetMatch[1];
    }
  }
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    metaTags.title = titleMatch[1].trim();
  }
  
  // Extract structured data
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonMatch;
  
  while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(jsonMatch[1].trim());
      structuredData.push(jsonData);
    } catch (e) {
      // Invalid JSON-LD, skip
    }
  }
  
  return {
    metaTags,
    openGraphTags,
    twitterTags,
    structuredData,
    title: metaTags.title
  };
}

async function fetchDynamicRoutes() {
  const queries = {
    services: `query GetServiceSlugs { services(first: 5) { nodes { slug } } }`,
    caseStudies: `query GetCaseStudySlugs { caseStudies(first: 5) { nodes { slug } } }`,
    teamMembers: `query GetTeamMemberSlugs { teamMembers(first: 5) { nodes { slug } } }`
  };
  
  const dynamicRoutes = {};
  
  for (const [type, query] of Object.entries(queries)) {
    try {
      const response = await makeHttpRequest(SEO_TEST_CONFIG.graphqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        timeout: 15000
      });
      
      if (response.success) {
        const result = JSON.parse(response.data);
        if (result.data) {
          const dataKey = Object.keys(result.data)[0];
          const nodes = result.data[dataKey]?.nodes || [];
          dynamicRoutes[type] = nodes.map(node => `/${type.replace('Members', '').toLowerCase()}/${node.slug}`);
        }
      }
    } catch (error) {
      console.log(`Warning: Could not fetch ${type} slugs for dynamic SEO testing`);
      dynamicRoutes[type] = [];
    }
  }
  
  return dynamicRoutes;
}

class CDA_SEO_TestSuite {
  constructor() {
    this.logger = new SEOLogger(SEO_TEST_CONFIG.logFile);
  }

  async run() {
    this.logger.log('🔍 Starting comprehensive SEO validation...');
    
    try {
      // Fetch dynamic routes
      const dynamicRoutes = await fetchDynamicRoutes();
      
      // Test static pages
      await this.testStaticPages();
      
      // Test dynamic pages
      await this.testDynamicPages(dynamicRoutes);
      
      // Test global SEO elements
      await this.testGlobalSEO();
      
    } catch (error) {
      this.logger.log(`❌ SEO test suite failed: ${error.message}`, 'ERROR');
    }
    
    return this.logger.generateReport();
  }

  async testStaticPages() {
    this.logger.log('🔍 Testing static pages SEO...');
    
    for (const route of SEO_TEST_CONFIG.routes.static) {
      await this.testPageSEO(route, `Static Page: ${route}`);
    }
  }

  async testDynamicPages(dynamicRoutes) {
    this.logger.log('🔍 Testing dynamic pages SEO...');
    
    for (const [type, routes] of Object.entries(dynamicRoutes)) {
      for (const route of routes.slice(0, 2)) { // Test first 2 of each type
        await this.testPageSEO(route, `Dynamic Page: ${route}`);
      }
    }
  }

  async testPageSEO(route, testName) {
    try {
      const url = SEO_TEST_CONFIG.baseUrl + route;
      const response = await makeHttpRequest(url);
      
      if (!response.success) {
        this.logger.addTest(`${testName} - Accessibility`, 'FAIL', {
          error: `Page not accessible (${response.statusCode})`,
          maxScore: 5
        });
        return;
      }
      
      const parsed = parseHTML(response.data);
      
      // Test basic meta tags
      await this.testBasicMetaTags(testName, parsed);
      
      // Test Open Graph tags
      await this.testOpenGraphTags(testName, parsed);
      
      // Test Twitter tags
      await this.testTwitterTags(testName, parsed);
      
      // Test structured data
      await this.testStructuredData(testName, parsed);
      
      // Test SEO best practices
      await this.testSEOBestPractices(testName, parsed, response.data);
      
    } catch (error) {
      this.logger.addTest(`${testName} - SEO Test`, 'FAIL', {
        error: 'Failed to test page SEO',
        details: error.error || error.message,
        maxScore: 5
      });
    }
  }

  async testBasicMetaTags(testName, parsed) {
    const { metaTags } = parsed;
    const required = SEO_TEST_CONFIG.seoRequirements.metaTags.required;
    const recommended = SEO_TEST_CONFIG.seoRequirements.metaTags.recommended;
    
    const found = [];
    const missing = [];
    
    // Check required meta tags
    for (const tag of required) {
      if (metaTags[tag] && metaTags[tag].trim()) {
        found.push(`${tag}: "${metaTags[tag]}"`);
      } else {
        missing.push(tag);
      }
    }
    
    // Check recommended meta tags
    for (const tag of recommended) {
      if (metaTags[tag] && metaTags[tag].trim()) {
        found.push(`${tag}: "${metaTags[tag]}"`);
      }
    }
    
    const score = Math.max(0, required.length - missing.length);
    const status = missing.length === 0 ? 'PASS' : (missing.length < required.length ? 'WARN' : 'FAIL');
    
    this.logger.addTest(`${testName} - Meta Tags`, status, {
      details: `Found ${found.length} tags, ${missing.length} required missing`,
      found: found.slice(0, 5), // Show first 5
      missing,
      score,
      maxScore: required.length,
      warning: status === 'WARN' ? 'Some required meta tags missing' : undefined,
      error: status === 'FAIL' ? 'Critical meta tags missing' : undefined
    });
    
    // Test title length
    if (metaTags.title) {
      const titleLength = metaTags.title.length;
      if (titleLength >= 30 && titleLength <= 60) {
        this.logger.addTest(`${testName} - Title Length`, 'PASS', {
          details: `Title length: ${titleLength} characters (optimal)`,
          score: 1,
          maxScore: 1
        });
      } else if (titleLength > 0) {
        this.logger.addTest(`${testName} - Title Length`, 'WARN', {
          warning: `Title length: ${titleLength} characters (recommended: 30-60)`,
          score: 0.5,
          maxScore: 1
        });
      } else {
        this.logger.addTest(`${testName} - Title Length`, 'FAIL', {
          error: 'Title is empty',
          maxScore: 1
        });
      }
    }
    
    // Test description length
    if (metaTags.description) {
      const descLength = metaTags.description.length;
      if (descLength >= 120 && descLength <= 160) {
        this.logger.addTest(`${testName} - Description Length`, 'PASS', {
          details: `Description length: ${descLength} characters (optimal)`,
          score: 1,
          maxScore: 1
        });
      } else if (descLength > 0) {
        this.logger.addTest(`${testName} - Description Length`, 'WARN', {
          warning: `Description length: ${descLength} characters (recommended: 120-160)`,
          score: 0.5,
          maxScore: 1
        });
      }
    }
  }

  async testOpenGraphTags(testName, parsed) {
    const { openGraphTags } = parsed;
    const required = SEO_TEST_CONFIG.seoRequirements.openGraph.required;
    const recommended = SEO_TEST_CONFIG.seoRequirements.openGraph.recommended;
    
    const found = [];
    const missing = [];
    
    // Check required OG tags
    for (const tag of required) {
      if (openGraphTags[tag] && openGraphTags[tag].trim()) {
        found.push(`${tag}: "${openGraphTags[tag]}"`);
      } else {
        missing.push(tag);
      }
    }
    
    // Check recommended OG tags
    for (const tag of recommended) {
      if (openGraphTags[tag] && openGraphTags[tag].trim()) {
        found.push(`${tag}: "${openGraphTags[tag]}"`);
      }
    }
    
    const score = Math.max(0, required.length - missing.length) + (found.length - required.length + missing.length) * 0.5;
    const status = missing.length === 0 ? 'PASS' : (found.length > 0 ? 'WARN' : 'FAIL');
    
    this.logger.addTest(`${testName} - Open Graph Tags`, status, {
      details: `Found ${found.length} OG tags, ${missing.length} required missing`,
      found: found.slice(0, 4),
      missing,
      score,
      maxScore: required.length + recommended.length * 0.5,
      warning: status === 'WARN' ? 'Some Open Graph tags missing' : undefined,
      error: status === 'FAIL' ? 'No Open Graph tags found' : undefined
    });
  }

  async testTwitterTags(testName, parsed) {
    const { twitterTags } = parsed;
    const recommended = SEO_TEST_CONFIG.seoRequirements.twitter.recommended;
    
    const found = [];
    
    for (const tag of recommended) {
      if (twitterTags[tag] && twitterTags[tag].trim()) {
        found.push(`${tag}: "${twitterTags[tag]}"`);
      }
    }
    
    const score = found.length * 0.5; // Twitter tags are nice to have
    const status = found.length >= 2 ? 'PASS' : (found.length > 0 ? 'WARN' : 'WARN');
    
    this.logger.addTest(`${testName} - Twitter Tags`, status, {
      details: `Found ${found.length} Twitter tags`,
      found,
      score,
      maxScore: recommended.length * 0.5,
      warning: found.length === 0 ? 'No Twitter tags found (recommended for social sharing)' : undefined
    });
  }

  async testStructuredData(testName, parsed) {
    const { structuredData } = parsed;
    
    if (structuredData.length > 0) {
      const types = structuredData.map(data => data['@type'] || 'Unknown').filter(Boolean);
      
      this.logger.addTest(`${testName} - Structured Data`, 'PASS', {
        details: `Found ${structuredData.length} structured data objects`,
        found: types.map(type => `Schema type: ${type}`),
        score: Math.min(2, structuredData.length),
        maxScore: 2
      });
    } else {
      this.logger.addTest(`${testName} - Structured Data`, 'WARN', {
        warning: 'No structured data found (recommended for rich snippets)',
        maxScore: 2
      });
    }
  }

  async testSEOBestPractices(testName, parsed, html) {
    const { metaTags } = parsed;
    
    // Test canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (canonicalMatch) {
      this.logger.addTest(`${testName} - Canonical URL`, 'PASS', {
        details: `Canonical URL: ${canonicalMatch[1]}`,
        score: 1,
        maxScore: 1
      });
    } else {
      this.logger.addTest(`${testName} - Canonical URL`, 'WARN', {
        warning: 'No canonical URL found',
        maxScore: 1
      });
    }
    
    // Test robots meta tag
    if (metaTags.robots) {
      const robotsDirectives = metaTags.robots.toLowerCase();
      const hasNoIndex = robotsDirectives.includes('noindex');
      
      this.logger.addTest(`${testName} - Robots Meta`, hasNoIndex ? 'WARN' : 'PASS', {
        details: `Robots: ${metaTags.robots}`,
        warning: hasNoIndex ? 'Page set to noindex' : undefined,
        score: hasNoIndex ? 0.5 : 1,
        maxScore: 1
      });
    } else {
      this.logger.addTest(`${testName} - Robots Meta`, 'PASS', {
        details: 'No robots meta tag (defaults to index,follow)',
        score: 1,
        maxScore: 1
      });
    }
    
    // Test viewport meta tag
    if (metaTags.viewport) {
      this.logger.addTest(`${testName} - Mobile Viewport`, 'PASS', {
        details: `Viewport: ${metaTags.viewport}`,
        score: 1,
        maxScore: 1
      });
    } else {
      this.logger.addTest(`${testName} - Mobile Viewport`, 'FAIL', {
        error: 'No viewport meta tag found (required for mobile SEO)',
        maxScore: 1
      });
    }
    
    // Test heading structure
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    if (h1Count === 1) {
      this.logger.addTest(`${testName} - H1 Structure`, 'PASS', {
        details: 'Exactly one H1 tag found',
        score: 1,
        maxScore: 1
      });
    } else if (h1Count === 0) {
      this.logger.addTest(`${testName} - H1 Structure`, 'FAIL', {
        error: 'No H1 tag found',
        maxScore: 1
      });
    } else {
      this.logger.addTest(`${testName} - H1 Structure`, 'WARN', {
        warning: `${h1Count} H1 tags found (should be exactly 1)`,
        score: 0.5,
        maxScore: 1
      });
    }
  }

  async testGlobalSEO() {
    this.logger.log('🔍 Testing global SEO elements...');
    
    try {
      // Test sitemap
      const sitemapUrl = SEO_TEST_CONFIG.baseUrl + '/sitemap.xml';
      const sitemapResponse = await makeHttpRequest(sitemapUrl);
      
      if (sitemapResponse.success) {
        this.logger.addTest('Global SEO - Sitemap', 'PASS', {
          details: 'XML sitemap found and accessible',
          score: 2,
          maxScore: 2
        });
      } else {
        this.logger.addTest('Global SEO - Sitemap', 'WARN', {
          warning: 'XML sitemap not found at /sitemap.xml',
          maxScore: 2
        });
      }
    } catch (error) {
      this.logger.addTest('Global SEO - Sitemap', 'WARN', {
        warning: 'Could not test sitemap accessibility',
        maxScore: 2
      });
    }
    
    try {
      // Test robots.txt
      const robotsUrl = SEO_TEST_CONFIG.baseUrl + '/robots.txt';
      const robotsResponse = await makeHttpRequest(robotsUrl);
      
      if (robotsResponse.success) {
        this.logger.addTest('Global SEO - Robots.txt', 'PASS', {
          details: 'robots.txt found and accessible',
          score: 1,
          maxScore: 1
        });
      } else {
        this.logger.addTest('Global SEO - Robots.txt', 'WARN', {
          warning: 'robots.txt not found',
          maxScore: 1
        });
      }
    } catch (error) {
      this.logger.addTest('Global SEO - Robots.txt', 'WARN', {
        warning: 'Could not test robots.txt accessibility',
        maxScore: 1
      });
    }
  }
}

// Run the SEO test suite
if (require.main === module) {
  console.log('🔍 CDA Website SEO Test Suite');
  console.log('📅', new Date().toLocaleString());
  console.log('');
  
  const seoTestSuite = new CDA_SEO_TestSuite();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n\\n⚠️  SEO test suite interrupted by user');
    seoTestSuite.logger.generateReport();
    process.exit(1);
  });
  
  seoTestSuite.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ SEO test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = CDA_SEO_TestSuite;