#!/usr/bin/env node

/**
 * CDA Website Test Suite - Pure Node.js Version
 * Cross-platform testing using built-in Node.js modules
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const { performance } = require('perf_hooks');

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
  routes: ['/', '/services', '/case-studies', '/team', '/about', '/contact'],
  testImages: ['/favicon.ico']
};

// GraphQL queries to test
const GRAPHQL_QUERIES = {
  services: 'query TestServices { services(first: 5) { nodes { id title slug } pageInfo { hasNextPage } } }',
  caseStudies: 'query TestCaseStudies { caseStudies(first: 5) { nodes { id title slug } } }',
  teamMembers: 'query TestTeamMembers { teamMembers(first: 5) { nodes { id title slug } } }',
  serviceTypes: 'query TestServiceTypes { serviceTypes { nodes { id name slug } } }',
  projectTypes: 'query TestProjectTypes { projectTypes { nodes { id name slug } } }',
  departments: 'query TestDepartments { departments { nodes { id name slug } } }'
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
    
    this.log('============================================================');
    this.log('CDA WEBSITE TEST SUITE - Node.js Edition');
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
    
    if (status === 'PASS') this.results.summary.passed++;
    else if (status === 'FAIL') this.results.summary.failed++;
    else if (status === 'WARN') this.results.summary.warnings++;
    this.log(`${icon} ${status}: ${testName}${details.error ? ' - ' + details.error : ''}${details.warning ? ' - ' + details.warning : ''}`, status);
    
    if (details.details) {
      this.log(`    Details: ${details.details}`);
    }
  }

  generateReport() {
    this.results.endTime = new Date().toISOString();
    this.results.duration = new Date(this.results.endTime) - new Date(this.results.startTime);
    
    const reportPath = 'test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    this.log('============================================================');
    this.log('TEST SUITE COMPLETED');
    this.log('============================================================');
    this.log(`📊 SUMMARY:`);
    this.log(`   Total Tests: ${this.results.summary.total}`);
    this.log(`   ✅ Passed: ${this.results.summary.passed}`);
    this.log(`   ❌ Failed: ${this.results.summary.failed}`);
    this.log(`   ⚠️  Warnings: ${this.results.summary.warnings}`);
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
        'User-Agent': 'CDA-Test-Suite/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: options.timeout || 10000
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
      const endTime = performance.now();
      reject({
        error: err.message,
        code: err.code,
        responseTime: Math.round(endTime - startTime),
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

async function testGraphQLQuery(query, endpoint) {
  try {
    const body = JSON.stringify({ query });
    const response = await makeHttpRequest(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      timeout: 15000
    });

    if (response.success) {
      try {
        const result = JSON.parse(response.data);
        
        if (result.errors && result.errors.length > 0) {
          return {
            success: false,
            hasWarnings: true,
            errors: result.errors,
            data: result.data
          };
        } else if (result.data) {
          const hasData = Object.keys(result.data).some(key => {
            const data = result.data[key];
            return data && ((data.nodes && data.nodes.length > 0) || (Array.isArray(data) && data.length > 0));
          });
          
          return {
            success: true,
            hasData,
            data: result.data
          };
        } else {
          return {
            success: false,
            error: 'No data returned'
          };
        }
      } catch (parseError) {
        return {
          success: false,
          error: 'Invalid JSON response'
        };
      }
    } else {
      return {
        success: false,
        error: `HTTP ${response.statusCode}: ${response.statusMessage}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.error || error.message || 'Request failed'
    };
  }
}

class CDATestSuite {
  constructor() {
    this.logger = new TestLogger(TEST_CONFIG.logFile);
  }

  async run() {
    this.logger.log('🚀 Starting comprehensive test suite...');
    
    try {
      await this.testServerAvailability();
      await this.testGraphQLQueries();
      await this.testRoutes();
      await this.testImageLoading();
      await this.testResponsiveDesign();
      await this.testPerformance();
    } catch (error) {
      this.logger.log(`❌ Test suite failed: ${error.message}`, 'ERROR');
    }
    
    return this.logger.generateReport();
  }

  async testServerAvailability() {
    this.logger.log('🔍 Testing server availability...');
    
    try {
      const result = await makeHttpRequest(TEST_CONFIG.baseUrl);
      
      if (result.success) {
        this.logger.addTest('Server Availability', 'PASS', {
          details: `Server responding at ${TEST_CONFIG.baseUrl} (${result.responseTime}ms)`
        });
      } else {
        this.logger.addTest('Server Availability', 'FAIL', {
          error: `Server returned status ${result.statusCode}`,
          details: `URL: ${TEST_CONFIG.baseUrl}`
        });
      }
    } catch (error) {
      this.logger.addTest('Server Availability', 'FAIL', {
        error: 'Server not accessible',
        details: error.error || error.message
      });
    }
  }

  async testGraphQLQueries() {
    this.logger.log('🔍 Testing GraphQL queries...');
    
    for (const [queryName, query] of Object.entries(GRAPHQL_QUERIES)) {
      const result = await testGraphQLQuery(query, TEST_CONFIG.graphqlEndpoint);
      
      if (result.success) {
        if (result.hasData) {
          this.logger.addTest(`GraphQL Query: ${queryName}`, 'PASS', {
            details: 'Query returned data successfully'
          });
        } else {
          this.logger.addTest(`GraphQL Query: ${queryName}`, 'WARN', {
            warning: 'Query succeeded but no data returned'
          });
        }
      } else if (result.hasWarnings) {
        const errorMessages = result.errors.map(e => e.message).join(', ');
        this.logger.addTest(`GraphQL Query: ${queryName}`, 'WARN', {
          warning: 'Query has errors but may return data',
          details: `Errors: ${errorMessages}`
        });
      } else {
        this.logger.addTest(`GraphQL Query: ${queryName}`, 'FAIL', {
          error: result.error
        });
      }
    }
  }

  async testRoutes() {
    this.logger.log('🔍 Testing routes...');
    
    for (const route of TEST_CONFIG.routes) {
      try {
        const url = TEST_CONFIG.baseUrl + route;
        const result = await makeHttpRequest(url);
        
        if (result.success && result.statusCode === 200) {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            details: `Status: ${result.statusCode}, Response time: ${result.responseTime}ms`
          });
        } else if (result.statusCode === 404 && route === '/404') {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            details: 'Expected 404 for error page'
          });
        } else {
          this.logger.addTest(`Route: ${route}`, 'FAIL', {
            error: `Expected 200, got ${result.statusCode}`,
            details: `URL: ${url}, Response time: ${result.responseTime}ms`
          });
        }
      } catch (error) {
        this.logger.addTest(`Route: ${route}`, 'FAIL', {
          error: 'Route test failed',
          details: error.error || error.message
        });
      }
    }
  }

  async testImageLoading() {
    this.logger.log('🔍 Testing image loading...');
    
    for (const imagePath of TEST_CONFIG.testImages) {
      try {
        const url = TEST_CONFIG.baseUrl + imagePath;
        const result = await makeHttpRequest(url);
        
        if (result.success && result.statusCode === 200) {
          const contentType = result.headers['content-type'] || '';
          if (contentType.includes('image/') || imagePath.includes('_next/image')) {
            this.logger.addTest(`Image: ${imagePath}`, 'PASS', {
              details: `Status: ${result.statusCode}, Content-Type: ${contentType}`
            });
          } else {
            this.logger.addTest(`Image: ${imagePath}`, 'WARN', {
              warning: 'Unexpected content type for image',
              details: `Content-Type: ${contentType}`
            });
          }
        } else if (result.statusCode === 404) {
          this.logger.addTest(`Image: ${imagePath}`, 'WARN', {
            warning: 'Image not found (may not exist)',
            details: `Status: ${result.statusCode}`
          });
        } else {
          this.logger.addTest(`Image: ${imagePath}`, 'FAIL', {
            error: `Image load failed with status ${result.statusCode}`,
            details: `URL: ${url}`
          });
        }
      } catch (error) {
        this.logger.addTest(`Image: ${imagePath}`, 'FAIL', {
          error: 'Image test failed',
          details: error.error || error.message
        });
      }
    }

    // Test Next.js image optimization
    try {
      const optimizedImageUrl = `${TEST_CONFIG.baseUrl}/_next/image?url=%2Ffavicon.ico&w=64&q=75`;
      const result = await makeHttpRequest(optimizedImageUrl);
      
      if (result.success && result.statusCode === 200) {
        this.logger.addTest('Next.js Image Optimization', 'PASS', {
          details: 'Image optimization endpoint responding correctly'
        });
      } else {
        this.logger.addTest('Next.js Image Optimization', 'WARN', {
          warning: 'Image optimization may not be properly configured',
          details: `Status: ${result.statusCode}`
        });
      }
    } catch (error) {
      this.logger.addTest('Next.js Image Optimization', 'WARN', {
        warning: 'Could not test image optimization',
        details: error.error || error.message
      });
    }
  }

  async testResponsiveDesign() {
    this.logger.log('🔍 Testing responsive design...');
    
    // Test viewport meta tag
    try {
      const result = await makeHttpRequest(TEST_CONFIG.baseUrl);
      if (result.success && result.data.includes('viewport')) {
        this.logger.addTest('Responsive Meta Tag', 'PASS', {
          details: 'Viewport meta tag detected in HTML'
        });
      } else {
        this.logger.addTest('Responsive Meta Tag', 'WARN', {
          warning: 'Viewport meta tag not found or page failed to load'
        });
      }
    } catch (error) {
      this.logger.addTest('Responsive Meta Tag', 'WARN', {
        warning: 'Could not check meta tags',
        details: error.error || error.message
      });
    }

    // Test mobile user agent
    try {
      const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15';
      const result = await makeHttpRequest(TEST_CONFIG.baseUrl, {
        headers: { 'User-Agent': mobileUA }
      });
      
      if (result.success && result.statusCode === 200) {
        this.logger.addTest('Mobile User Agent Response', 'PASS', {
          details: `Page loads successfully with mobile user agent (${result.responseTime}ms)`
        });
      } else {
        this.logger.addTest('Mobile User Agent Response', 'FAIL', {
          error: 'Failed with mobile user agent'
        });
      }
    } catch (error) {
      this.logger.addTest('Mobile User Agent Response', 'WARN', {
        warning: 'Could not test mobile user agent response'
      });
    }
  }

  async testPerformance() {
    this.logger.log('🔍 Testing performance...');
    
    const performanceRoutes = ['/', '/services', '/case-studies', '/team'];
    let totalTime = 0;
    let successfulTests = 0;

    for (const route of performanceRoutes) {
      try {
        const url = TEST_CONFIG.baseUrl + route;
        const result = await makeHttpRequest(url, { timeout: 15000 });
        
        if (result.success) {
          totalTime += result.responseTime;
          successfulTests++;
          
          if (result.responseTime < 2000) {
            this.logger.addTest(`Performance: ${route}`, 'PASS', {
              details: `Load time: ${result.responseTime}ms (< 2s target)`
            });
          } else if (result.responseTime < 5000) {
            this.logger.addTest(`Performance: ${route}`, 'WARN', {
              warning: `Load time: ${result.responseTime}ms (slow but acceptable)`
            });
          } else {
            this.logger.addTest(`Performance: ${route}`, 'FAIL', {
              error: `Load time: ${result.responseTime}ms (too slow)`
            });
          }
        } else {
          this.logger.addTest(`Performance: ${route}`, 'FAIL', {
            error: 'Performance test failed',
            details: `Status: ${result.statusCode}`
          });
        }
      } catch (error) {
        this.logger.addTest(`Performance: ${route}`, 'FAIL', {
          error: 'Performance test failed',
          details: error.error || error.message
        });
      }
    }

    // Overall performance summary
    if (successfulTests > 0) {
      const avgTime = Math.round(totalTime / successfulTests);
      if (avgTime < 3000) {
        this.logger.addTest('Overall Performance', 'PASS', {
          details: `Average load time: ${avgTime}ms across ${successfulTests} routes`
        });
      } else {
        this.logger.addTest('Overall Performance', 'WARN', {
          warning: 'Average load time is high',
          details: `Average: ${avgTime}ms across ${successfulTests} routes`
        });
      }
    }
  }
}

// Run the test suite
if (require.main === module) {
  console.log('🚀 CDA Website Test Suite - Node.js Edition');
  console.log('📅', new Date().toLocaleString());
  console.log('');
  
  const testSuite = new CDATestSuite();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n\\n⚠️  Test suite interrupted by user');
    testSuite.logger.generateReport();
    process.exit(1);
  });
  
  testSuite.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = CDATestSuite;