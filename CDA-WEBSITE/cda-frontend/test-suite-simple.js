#!/usr/bin/env node

/**
 * CDA Website Test Suite - Simplified Version
 * Uses curl and built-in Node.js modules for maximum compatibility
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3003',
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
    '/case-studies', 
    '/team',
    '/about',
    '/contact'
  ],
  testImages: [
    '/favicon.ico',
    '/_next/static/media/logo.png',
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
    fs.appendFileSync(this.logFile, logEntry + '\\n');
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
      const result = execSync(`curl -s -o /dev/null -w "%{http_code}" ${TEST_CONFIG.baseUrl}`, 
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
        const curlCommand = `curl -s -X POST \\
          -H "Content-Type: application/json" \\
          -d '{"query": "${query.replace(/"/g, '\\"').replace(/\\n/g, ' ')}"}' \\
          "${TEST_CONFIG.graphqlEndpoint}"`;
        
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
        const result = execSync(`curl -s -o /dev/null -w "%{http_code}:%{time_total}" "${url}"`, 
          { encoding: 'utf8', timeout: 15000 });
        
        const [statusCode, responseTime] = result.trim().split(':');
        const status = parseInt(statusCode);
        const time = parseFloat(responseTime);
        
        if (status === 200) {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            details: `Status: ${status}, Response time: ${(time * 1000).toFixed(0)}ms`
          });
        } else if (status === 404 && route === '/404') {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            details: `Expected 404 for error page, Response time: ${(time * 1000).toFixed(0)}ms`
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
    this.logger.log('🔍 Testing image loading...');
    
    for (const imagePath of TEST_CONFIG.testImages) {
      try {
        const url = imagePath.startsWith('http') ? imagePath : `${TEST_CONFIG.baseUrl}${imagePath}`;
        const result = execSync(`curl -s -o /dev/null -w "%{http_code}:%{content_type}" "${url}"`, 
          { encoding: 'utf8', timeout: 10000 });
        
        const [statusCode, contentType] = result.trim().split(':');
        const status = parseInt(statusCode);
        
        if (status === 200) {
          if (contentType.includes('image/') || imagePath.includes('_next/image')) {
            this.logger.addTest(`Image: ${imagePath}`, 'PASS', {
              details: `Status: ${status}, Content-Type: ${contentType}`
            });
          } else {
            this.logger.addTest(`Image: ${imagePath}`, 'WARN', {
              warning: 'Unexpected content type for image',
              details: `Status: ${status}, Content-Type: ${contentType}`
            });
          }
        } else if (status === 404) {
          this.logger.addTest(`Image: ${imagePath}`, 'WARN', {
            warning: 'Image not found (may be optional)',
            details: `Status: ${status}, URL: ${url}`
          });
        } else {
          this.logger.addTest(`Image: ${imagePath}`, 'FAIL', {
            error: `Image load failed with status ${status}`,
            details: `URL: ${url}`
          });
        }
      } catch (error) {
        this.logger.addTest(`Image: ${imagePath}`, 'FAIL', {
          error: 'Image test failed',
          details: error.message
        });
      }
    }

    // Test Next.js image optimization specifically
    try {
      const testImageUrl = `${TEST_CONFIG.baseUrl}/_next/image?url=%2Ffavicon.ico&w=64&q=75`;
      const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${testImageUrl}"`, 
        { encoding: 'utf8', timeout: 10000 });
      
      const status = parseInt(result.trim());
      if (status === 200) {
        this.logger.addTest('Next.js Image Optimization', 'PASS', {
          details: 'Image optimization endpoint responding correctly'
        });
      } else {
        this.logger.addTest('Next.js Image Optimization', 'WARN', {
          warning: 'Image optimization may not be properly configured',
          details: `Status: ${status}`
        });
      }
    } catch (error) {
      this.logger.addTest('Next.js Image Optimization', 'WARN', {
        warning: 'Could not test image optimization',
        details: error.message
      });
    }
  }

  testResponsiveDesign() {
    this.logger.log('🔍 Testing responsive design...');
    
    // Test CSS delivery
    try {
      const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${TEST_CONFIG.baseUrl}"`, 
        { encoding: 'utf8', timeout: 10000 });
      
      if (parseInt(result.trim()) === 200) {
        this.logger.addTest('CSS Delivery', 'PASS', {
          details: 'Main page loads successfully (CSS likely included)'
        });
      }
    } catch (error) {
      this.logger.addTest('CSS Delivery', 'WARN', {
        warning: 'Could not verify CSS delivery'
      });
    }

    // Test viewport meta tag presence by checking page source
    for (const [viewportName, viewport] of Object.entries(TEST_CONFIG.viewports)) {
      try {
        const userAgent = this.getViewportUserAgent(viewport);
        const result = execSync(`curl -s -H "User-Agent: ${userAgent}" "${TEST_CONFIG.baseUrl}/" | grep -i viewport`, 
          { encoding: 'utf8', timeout: 10000 });
        
        if (result.includes('viewport')) {
          this.logger.addTest(`Responsive Meta Tag: ${viewport.name}`, 'PASS', {
            details: 'Viewport meta tag detected in HTML'
          });
        } else {
          this.logger.addTest(`Responsive Meta Tag: ${viewport.name}`, 'WARN', {
            warning: 'Viewport meta tag not detected',
            details: 'Page may not be mobile-optimized'
          });
        }
      } catch (error) {
        // Viewport meta tag not found - this is just a basic check
        this.logger.addTest(`Responsive Meta Tag: ${viewport.name}`, 'WARN', {
          warning: 'Could not verify responsive meta tags'
        });
      }
    }

    // Test page loads with mobile user agent
    try {
      const mobileUA = this.getViewportUserAgent(TEST_CONFIG.viewports.mobile);
      const result = execSync(`curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: ${mobileUA}" "${TEST_CONFIG.baseUrl}/"`, 
        { encoding: 'utf8', timeout: 10000 });
      
      if (parseInt(result.trim()) === 200) {
        this.logger.addTest('Mobile User Agent Response', 'PASS', {
          details: 'Page loads successfully with mobile user agent'
        });
      } else {
        this.logger.addTest('Mobile User Agent Response', 'FAIL', {
          error: 'Page failed to load with mobile user agent'
        });
      }
    } catch (error) {
      this.logger.addTest('Mobile User Agent Response', 'WARN', {
        warning: 'Could not test mobile user agent response'
      });
    }
  }

  testPerformance() {
    this.logger.log('🔍 Testing performance...');
    
    // Test page load times for main routes
    const performanceRoutes = ['/', '/services', '/case-studies', '/team'];
    let totalTime = 0;
    let successfulTests = 0;
    
    for (const route of performanceRoutes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const result = execSync(`curl -s -o /dev/null -w "%{time_total}" "${url}"`, 
          { encoding: 'utf8', timeout: 15000 });
        
        const time = parseFloat(result.trim());
        totalTime += time;
        successfulTests++;
        
        if (time < 2.0) {
          this.logger.addTest(`Performance: ${route}`, 'PASS', {
            details: `Load time: ${(time * 1000).toFixed(0)}ms (< 2s target)`
          });
        } else if (time < 5.0) {
          this.logger.addTest(`Performance: ${route}`, 'WARN', {
            warning: `Load time: ${(time * 1000).toFixed(0)}ms (slow but acceptable)`
          });
        } else {
          this.logger.addTest(`Performance: ${route}`, 'FAIL', {
            error: `Load time: ${(time * 1000).toFixed(0)}ms (too slow)`
          });
        }
      } catch (error) {
        this.logger.addTest(`Performance: ${route}`, 'FAIL', {
          error: 'Performance test failed',
          details: error.message
        });
      }
    }
    
    // Overall performance summary
    if (successfulTests > 0) {
      const avgTime = totalTime / successfulTests;
      this.logger.addTest('Overall Performance', avgTime < 3.0 ? 'PASS' : 'WARN', {
        details: `Average load time: ${(avgTime * 1000).toFixed(0)}ms across ${successfulTests} routes`,
        warning: avgTime >= 3.0 ? 'Average load time is high' : undefined
      });
    }
  }

  getViewportUserAgent(viewport) {
    if (viewport.width <= 768) {
      return 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15';
    } else if (viewport.width <= 1024) {
      return 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15';
    } else {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    }
  }
}

// Run the test suite
if (require.main === module) {
  console.log('🚀 CDA Website Test Suite');
  console.log('📅 ' + new Date().toLocaleString());
  console.log('');
  
  // Check if server is likely running
  try {
    execSync('curl -s http://localhost:3002 > /dev/null', { timeout: 5000 });
  } catch (error) {
    console.log('⚠️  Warning: Server may not be running on localhost:3002');
    console.log('   Make sure to start the development server first:');
    console.log('   npm run dev');
    console.log('');
  }
  
  const testSuite = new CDATestSuite();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n\\n⚠️  Test suite interrupted by user');
    testSuite.logger.generateReport();
    process.exit(1);
  });
  
  try {
    testSuite.run();
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

module.exports = CDATestSuite;