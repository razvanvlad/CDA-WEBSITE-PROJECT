#!/usr/bin/env node

/**
 * CDA Website Test Suite - Simplified Version
 * Uses curl and built-in Node.js modules for maximum compatibility
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  graphqlEndpoint: 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql',
  logFile: 'test-results.log',
  viewports: {
    mobile: { width: 375, height: 667, name: 'Mobile (iPhone SE)' },
    tablet: { width: 768, height: 1024, name: 'Tablet (iPad)' },
    desktop: { width: 1920, height: 1080, name: 'Desktop (1920x1080)' }
  },
  routes: [
    '/',
    '/services',
    '/team',
    '/about',
    '/contact',
    '/roi',
    '/technologies',
    '/terms-conditions',
    '/test-graphql',
    '/test-working',
    '/test-all-pages',
    '/test-schema',
    '/buttons-test',
    '/underline-test',
    '/non-existent-xyz',
    '/404'
  ],
  testImages: [
    '/favicon.ico',
    '/images/cda-logo.png',
    '/_next/image?url=%2Ffavicon.ico&w=32&q=75'
  ]
};

// GraphQL queries to test
const GRAPHQL_QUERIES = {
  services: `query TestServices { services(first: 5) { nodes { id title slug } pageInfo { hasNextPage } } }`,
  caseStudies: `query TestCaseStudies { caseStudies(first: 5) { nodes { id title slug } } }`,
  teamMembers: `query TestTeamMembers { teamMembers(first: 5) { nodes { id title slug } } }`,
  serviceTypes: `query TestServiceTypes { serviceTypes { nodes { id name slug } } }`,
  projectTypes: `query TestProjectTypes { projectTypes { nodes { id name slug } } }`,
  departments: `query TestDepartments { departments { nodes { id name slug } } }`
};

class TestLogger {
  constructor(logFile) {
    this.logFile = logFile;
    this.results = {
      startTime: new Date().toISOString(),
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
    };
    
    // Clear previous log
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
    
    this.log('='.repeat(60));
    this.log('CDA WEBSITE TEST SUITE');
    this.log('='.repeat(60));
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logEntry);
    fs.appendFileSync(this.logFile, logEntry + '\n');
  }

  addTest(testName, status, details = {}) {
    const test = {
      name: testName,
      status,
      timestamp: new Date().toISOString(),
      ...details
    };
    
    this.results.tests.push(test);
    this.results.summary.total++;
    
    if (status === 'PASS') {
      this.results.summary.passed++;
      this.log(`✅ PASS: ${testName}`, 'PASS');
    } else if (status === 'FAIL') {
      this.results.summary.failed++;
      this.log(`❌ FAIL: ${testName} - ${details.error || 'Unknown error'}`, 'FAIL');
    } else if (status === 'WARN') {
      this.results.summary.warnings++;
      this.log(`⚠️  WARN: ${testName} - ${details.warning || 'Warning'}`, 'WARN');
    }
    
    if (details.details) {
      this.log(`    Details: ${details.details}`);
    }
  }

  generateReport() {
    this.results.endTime = new Date().toISOString();
    this.results.duration = new Date(this.results.endTime) - new Date(this.results.startTime);
    
    const reportPath = 'test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    this.log('='.repeat(60));
    this.log('TEST SUITE COMPLETED');
    this.log('='.repeat(60));
    this.log(`📊 SUMMARY:`);
    this.log(`   Total Tests: ${this.results.summary.total}`);
    this.log(`   ✅ Passed: ${this.results.summary.passed}`);
    this.log(`   ❌ Failed: ${this.results.summary.failed}`);
    this.log(`   ⚠️  Warnings: ${this.results.summary.warnings}`);
    this.log(`   ⏱️  Duration: ${Math.round(this.results.duration / 1000)}s`);
    this.log(`📄 Detailed report saved to: ${reportPath}`);
    this.log('='.repeat(60));
  }
}

class CDATestSuite {
  constructor() {
    this.logger = new TestLogger(TEST_CONFIG.logFile);
  }

  run() {
    this.logger.log('🚀 Starting comprehensive test suite...');
    
    try {
      this.testServerAvailability();
      this.testGraphQLQueries();
      this.testRoutes();
      this.testImageLoading();
      this.testResponsiveDesign();
      this.testPerformance();
    } catch (error) {
      this.logger.log(`❌ Test suite failed: ${error.message}`, 'ERROR');
    } finally {
      this.logger.generateReport();
    }
  }

  testServerAvailability() {
    this.logger.log('🔍 Testing server availability...');
    
    try {
      const result = execSync(`curl.exe -s -o NUL -w "%{http_code}" ${TEST_CONFIG.baseUrl}`, 
        { encoding: 'utf8', timeout: 10000 });
      const statusCode = parseInt(result.trim());
      
      if (statusCode === 200) {
        this.logger.addTest('Server Availability', 'PASS', {
          details: `Server responding at ${TEST_CONFIG.baseUrl}`
        });
      } else {
        this.logger.addTest('Server Availability', 'FAIL', {
          error: `Server returned status ${statusCode}`,
          details: `URL: ${TEST_CONFIG.baseUrl}`
        });
      }
    } catch (error) {
      this.logger.addTest('Server Availability', 'FAIL', {
        error: 'Server not accessible',
        details: error.message
      });
    }
  }

  testGraphQLQueries() {
    this.logger.log('🔍 Testing GraphQL queries...');
    
    for (const [queryName, query] of Object.entries(GRAPHQL_QUERIES)) {
      try {
        const payload = JSON.stringify({ query: query.replace(/\n/g, ' ') });
        // Escape double quotes for cmd by replacing with \"
        const escapedPayload = payload.replace(/"/g, '\\"');
        const curlCommand = `curl.exe -s -X POST -H "Content-Type: application/json" -d "${escapedPayload}" "${TEST_CONFIG.graphqlEndpoint}"`;
        
        const result = execSync(curlCommand, { encoding: 'utf8', timeout: 15000 });
        const response = JSON.parse(result);
        
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map(e => e.message).join(', ');
          this.logger.addTest(`GraphQL Query: ${queryName}`, 'WARN', {
            warning: 'Query has errors but may still return data',
            details: `Errors: ${errorMessages}`
          });
        } else if (response.data) {
          const dataKeys = Object.keys(response.data);
          const hasData = dataKeys.some(key => {
            const data = response.data[key];
            return data && (data.nodes ? data.nodes.length > 0 : data.length > 0);
          });
          
          this.logger.addTest(`GraphQL Query: ${queryName}`, hasData ? 'PASS' : 'WARN', {
            details: hasData ? `Retrieved data for: ${dataKeys.join(', ')}` : 'Query succeeded but no data returned',
            warning: hasData ? undefined : 'No data available'
          });
        } else {
          this.logger.addTest(`GraphQL Query: ${queryName}`, 'FAIL', {
            error: 'No data returned',
            details: 'Response: ' + JSON.stringify(response).substring(0, 200) + '...'
          });
        }
      } catch (error) {
        this.logger.addTest(`GraphQL Query: ${queryName}`, 'FAIL', {
          error: 'Query execution failed',
          details: error.message
        });
      }
    }
  }

  testRoutes() {
    this.logger.log('🔍 Testing routes...');
    
    for (const route of TEST_CONFIG.routes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const result = execSync(`curl.exe -s -o NUL -w "%{http_code}:%{time_total}" "${url}"`, 
          { encoding: 'utf8', timeout: 15000 });
        
        const [statusCode, responseTime] = result.trim().split(':');
        const status = parseInt(statusCode);
        const time = parseFloat(responseTime);
        
        if (status === 200) {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            details: `Status: ${status}, Response time: ${(time * 1000).toFixed(0)}ms`
          });
        } else if (status === 404 && (route === '/404' || route === '/non-existent-xyz')) {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            details: `Expected 404 for error route, Response time: ${(time * 1000).toFixed(0)}ms`
          });
        } else {
          this.logger.addTest(`Route: ${route}`, 'FAIL', {
            error: `Expected 200, got ${status}`,
            details: `URL: ${url}, Response time: ${(time * 1000).toFixed(0)}ms`
          });
        }
      } catch (error) {
        this.logger.addTest(`Route: ${route}`, 'FAIL', {
          error: 'Route test failed',
          details: error.message
        });
      }
    }
  }

  testImageLoading() {
    this.logger.log('🖼️ Testing image loading...');
    
    for (const img of TEST_CONFIG.testImages) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${img}`;
        const result = execSync(`curl.exe -s -o NUL -w "%{http_code}:%{size_download}:%{time_total}" "${url}"`, 
          { encoding: 'utf8', timeout: 15000 });
        
        const [statusCode, size, time] = result.trim().split(':');
        const status = parseInt(statusCode);
        const bytes = parseInt(size);
        const ms = (parseFloat(time) * 1000).toFixed(0);
        
        if (status === 200 || status === 304) {
          this.logger.addTest(`Image: ${img}`, 'PASS', {
            details: `Status: ${status}, Size: ${bytes} bytes, Time: ${ms}ms`
          });
        } else {
          this.logger.addTest(`Image: ${img}`, 'WARN', {
            warning: `Unexpected status ${status}`,
            details: `Size: ${bytes} bytes, Time: ${ms}ms`
          });
        }
      } catch (error) {
        this.logger.addTest(`Image: ${img}`, 'FAIL', {
          error: 'Image request failed',
          details: error.message
        });
      }
    }
  }

  testResponsiveDesign() {
    this.logger.log('📱 Testing responsive design (headers only)...');
    
    const responsiveRoutes = ['/', '/services', '/team'];
    
    for (const route of responsiveRoutes) {
      for (const [key, vp] of Object.entries(TEST_CONFIG.viewports)) {
        try {
          const url = `${TEST_CONFIG.baseUrl}${route}`;
          const ua = this.getViewportUserAgent(vp);
          const result = execSync(`curl.exe -s -A "${ua}" -o NUL -w "%{http_code}:%{time_total}" "${url}"`, 
            { encoding: 'utf8', timeout: 15000 });
          
          const [statusCode, responseTime] = result.trim().split(':');
          const status = parseInt(statusCode);
          const time = parseFloat(responseTime);
          
          if (status === 200) {
            this.logger.addTest(`Responsive ${key}: ${route}`, 'PASS', {
              details: `Status: ${status}, Time: ${(time * 1000).toFixed(0)}ms`
            });
          } else {
            this.logger.addTest(`Responsive ${key}: ${route}`, 'FAIL', {
              error: `Expected 200, got ${status}`,
              details: `URL: ${url}`
            });
          }
        } catch (error) {
          this.logger.addTest(`Responsive ${key}: ${route}`, 'FAIL', {
            error: 'Responsive request failed',
            details: error.message
          });
        }
      }
    }
  }

  testPerformance() {
    this.logger.log('⏱️  Testing basic performance (server TTFB via curl)...');
    
    const perfRoutes = ['/', '/services', '/team'];
    
    for (const route of perfRoutes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const result = execSync(`curl.exe -s -o NUL -w "%{time_starttransfer}:%{time_total}" "${url}"`, 
          { encoding: 'utf8', timeout: 15000 });
        
        const [ttfb, total] = result.trim().split(':').map(parseFloat);
        this.logger.addTest(`Performance: ${route}`, 'PASS', {
          details: `TTFB: ${(ttfb * 1000).toFixed(0)}ms, Total: ${(total * 1000).toFixed(0)}ms`
        });
      } catch (error) {
        this.logger.addTest(`Performance: ${route}`, 'FAIL', {
          error: 'Performance request failed',
          details: error.message
        });
      }
    }
  }

  getViewportUserAgent(viewport) {
    // Simple UA strings for different viewports
    if (viewport.name.includes('iPhone')) {
      return 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
    }
    if (viewport.name.includes('iPad')) {
      return 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
    }
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }
}

if (require.main === module) {
  console.log('🚀 CDA Website Test Suite');
  console.log('📅 ' + new Date().toLocaleString());
  console.log('');
  
  try {
    const curlVersion = execSync('curl.exe --version', { encoding: 'utf8', timeout: 5000 });
    console.log(curlVersion.split('\n')[0]);
  } catch (err) {
    console.log('⚠️  curl.exe not found. Please install curl to run this test suite.');
    console.log('');
  }

  const testSuite = new CDATestSuite();

  process.on('SIGINT', () => {
    console.log('\n🛑 Test suite interrupted by user.');
    process.exit(1);
  });

  try {
    testSuite.run();
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

module.exports = CDATestSuite;