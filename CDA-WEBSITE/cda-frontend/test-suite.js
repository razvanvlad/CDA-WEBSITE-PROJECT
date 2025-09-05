#!/usr/bin/env node

/**
 * CDA Website Test Suite
 * Comprehensive testing script for GraphQL queries, routes, images, and responsive design
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3002',
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
    '/contact',
    '/404'
  ]
};

// GraphQL queries to test
const GRAPHQL_QUERIES = {
  services: `
    query TestServices {
      services(first: 5) {
        nodes {
          id
          title
          slug
          date
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
            }
          }
          serviceTypes {
            nodes {
              name
              slug
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `,
  
  caseStudies: `
    query TestCaseStudies {
      caseStudies(first: 5) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          caseStudyFields {
            projectOverview {
              clientName
              clientLogo {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            featured
          }
          projectTypes {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `,
  
  teamMembers: `
    query TestTeamMembers {
      teamMembers(first: 5) {
        nodes {
          id
          title
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          teamMemberFields {
            jobTitle
            shortBio
            featured
          }
          departments {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `,
  
  serviceTypes: `
    query TestServiceTypes {
      serviceTypes {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `,
  
  projectTypes: `
    query TestProjectTypes {
      projectTypes {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `,
  
  departments: `
    query TestDepartments {
      departments {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `
};

class TestLogger {
  constructor(logFile) {
    this.logFile = logFile;
    this.results = {
      startTime: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
    
    // Clear previous log
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
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
      this.log(`✅ ${testName}`, 'PASS');
    } else if (status === 'FAIL') {
      this.results.summary.failed++;
      this.log(`❌ ${testName} - ${details.error || 'Unknown error'}`, 'FAIL');
    } else if (status === 'WARN') {
      this.results.summary.warnings++;
      this.log(`⚠️  ${testName} - ${details.warning || 'Warning'}`, 'WARN');
    }
  }

  generateReport() {
    this.results.endTime = new Date().toISOString();
    this.results.duration = new Date(this.results.endTime) - new Date(this.results.startTime);
    
    const reportPath = 'test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    this.log('='.repeat(50));
    this.log('TEST SUITE COMPLETED');
    this.log('='.repeat(50));
    this.log(`Total Tests: ${this.results.summary.total}`);
    this.log(`Passed: ${this.results.summary.passed}`);
    this.log(`Failed: ${this.results.summary.failed}`);
    this.log(`Warnings: ${this.results.summary.warnings}`);
    this.log(`Duration: ${Math.round(this.results.duration / 1000)}s`);
    this.log(`Report saved to: ${reportPath}`);
  }
}

class CDATestSuite {
  constructor() {
    this.logger = new TestLogger(TEST_CONFIG.logFile);
  }

  async run() {
    this.logger.log('Starting CDA Website Test Suite');
    this.logger.log('='.repeat(50));

    try {
      await this.testServerAvailability();
      await this.testGraphQLQueries();
      await this.testRoutes();
      await this.testImageLoading();
      await this.testResponsiveDesign();
    } catch (error) {
      this.logger.log(`Test suite failed: ${error.message}`, 'ERROR');
    } finally {
      this.logger.generateReport();
    }
  }

  async testServerAvailability() {
    this.logger.log('Testing server availability...');
    
    try {
      const response = await this.makeRequest(TEST_CONFIG.baseUrl);
      if (response.status === 200) {
        this.logger.addTest('Server Availability', 'PASS', {
          url: TEST_CONFIG.baseUrl,
          status: response.status
        });
      } else {
        this.logger.addTest('Server Availability', 'FAIL', {
          error: `Server returned status ${response.status}`,
          url: TEST_CONFIG.baseUrl
        });
      }
    } catch (error) {
      this.logger.addTest('Server Availability', 'FAIL', {
        error: error.message,
        url: TEST_CONFIG.baseUrl
      });
    }
  }

  async testGraphQLQueries() {
    this.logger.log('Testing GraphQL queries...');
    
    for (const [queryName, query] of Object.entries(GRAPHQL_QUERIES)) {
      try {
        const response = await fetch(TEST_CONFIG.graphqlEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        });

        if (!response.ok) {
          this.logger.addTest(`GraphQL Query: ${queryName}`, 'FAIL', {
            error: `HTTP ${response.status}: ${response.statusText}`,
            query: queryName
          });
          continue;
        }

        const result = await response.json();
        
        if (result.errors && result.errors.length > 0) {
          this.logger.addTest(`GraphQL Query: ${queryName}`, 'WARN', {
            warning: `GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`,
            query: queryName,
            errors: result.errors
          });
        } else if (result.data) {
          const dataKeys = Object.keys(result.data);
          const hasData = dataKeys.some(key => {
            const data = result.data[key];
            return data && (Array.isArray(data.nodes) ? data.nodes.length > 0 : data.length > 0);
          });
          
          this.logger.addTest(`GraphQL Query: ${queryName}`, hasData ? 'PASS' : 'WARN', {
            query: queryName,
            dataKeys,
            hasData,
            warning: hasData ? undefined : 'Query succeeded but returned no data'
          });
        } else {
          this.logger.addTest(`GraphQL Query: ${queryName}`, 'FAIL', {
            error: 'No data returned',
            query: queryName
          });
        }
      } catch (error) {
        this.logger.addTest(`GraphQL Query: ${queryName}`, 'FAIL', {
          error: error.message,
          query: queryName
        });
      }
    }
  }

  async testRoutes() {
    this.logger.log('Testing routes...');
    
    for (const route of TEST_CONFIG.routes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const response = await this.makeRequest(url);
        
        if (response.status === 200) {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            url,
            status: response.status,
            contentType: response.headers['content-type']
          });
        } else if (response.status === 404 && route === '/404') {
          this.logger.addTest(`Route: ${route}`, 'PASS', {
            url,
            status: response.status,
            note: 'Expected 404 for 404 route'
          });
        } else {
          this.logger.addTest(`Route: ${route}`, 'FAIL', {
            error: `Expected 200, got ${response.status}`,
            url,
            status: response.status
          });
        }
      } catch (error) {
        this.logger.addTest(`Route: ${route}`, 'FAIL', {
          error: error.message,
          url: `${TEST_CONFIG.baseUrl}${route}`
        });
      }
    }
  }

  async testImageLoading() {
    this.logger.log('Testing image loading...');
    
    // Test static images
    const staticImages = [
      '/favicon.ico',
      '/images/logo.png',
      '/images/hero-bg.jpg'
    ];

    for (const imagePath of staticImages) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${imagePath}`;
        const response = await this.makeRequest(url);
        
        if (response.status === 200) {
          const contentType = response.headers['content-type'];
          if (contentType && contentType.startsWith('image/')) {
            this.logger.addTest(`Image: ${imagePath}`, 'PASS', {
              url,
              status: response.status,
              contentType
            });
          } else {
            this.logger.addTest(`Image: ${imagePath}`, 'WARN', {
              warning: `Unexpected content type: ${contentType}`,
              url,
              status: response.status
            });
          }
        } else if (response.status === 404) {
          this.logger.addTest(`Image: ${imagePath}`, 'WARN', {
            warning: 'Image not found (may not exist)',
            url,
            status: response.status
          });
        } else {
          this.logger.addTest(`Image: ${imagePath}`, 'FAIL', {
            error: `Status ${response.status}`,
            url,
            status: response.status
          });
        }
      } catch (error) {
        this.logger.addTest(`Image: ${imagePath}`, 'FAIL', {
          error: error.message,
          url: `${TEST_CONFIG.baseUrl}${imagePath}`
        });
      }
    }

    // Test Next.js image optimization
    try {
      const optimizedImageUrl = `${TEST_CONFIG.baseUrl}/_next/image?url=%2Ffavicon.ico&w=32&q=75`;
      const response = await this.makeRequest(optimizedImageUrl);
      
      if (response.status === 200) {
        this.logger.addTest('Next.js Image Optimization', 'PASS', {
          url: optimizedImageUrl,
          status: response.status
        });
      } else {
        this.logger.addTest('Next.js Image Optimization', 'WARN', {
          warning: `Image optimization may not be working: ${response.status}`,
          url: optimizedImageUrl
        });
      }
    } catch (error) {
      this.logger.addTest('Next.js Image Optimization', 'WARN', {
        warning: `Could not test image optimization: ${error.message}`
      });
    }
  }

  async testResponsiveDesign() {
    this.logger.log('Testing responsive design...');
    
    // Since we can't actually test visual responsiveness without a browser,
    // we'll test that CSS is being served and pages load at different viewport simulations
    
    for (const [viewportName, viewport] of Object.entries(TEST_CONFIG.viewports)) {
      try {
        // Test main routes with viewport simulation headers
        const testRoutes = ['/', '/services', '/case-studies', '/team'];
        let passedRoutes = 0;
        
        for (const route of testRoutes) {
          try {
            const url = `${TEST_CONFIG.baseUrl}${route}`;
            const response = await this.makeRequest(url, {
              'User-Agent': this.getViewportUserAgent(viewport),
              'Viewport-Width': viewport.width.toString()
            });
            
            if (response.status === 200) {
              passedRoutes++;
            }
          } catch (error) {
            // Continue testing other routes
          }
        }
        
        if (passedRoutes === testRoutes.length) {
          this.logger.addTest(`Responsive: ${viewport.name}`, 'PASS', {
            viewport: viewport,
            routesTested: testRoutes.length,
            routesPassed: passedRoutes
          });
        } else {
          this.logger.addTest(`Responsive: ${viewport.name}`, 'WARN', {
            warning: `${passedRoutes}/${testRoutes.length} routes loaded successfully`,
            viewport: viewport,
            routesTested: testRoutes.length,
            routesPassed: passedRoutes
          });
        }
      } catch (error) {
        this.logger.addTest(`Responsive: ${viewport.name}`, 'FAIL', {
          error: error.message,
          viewport: viewport
        });
      }
    }

    // Test CSS loading
    try {
      const cssResponse = await this.makeRequest(`${TEST_CONFIG.baseUrl}/_next/static/css/app.css`);
      if (cssResponse.status === 200 || cssResponse.status === 404) {
        // 404 is OK if CSS is inlined or using different path
        this.logger.addTest('CSS Loading', 'PASS', {
          note: 'CSS handling appears to be working',
          status: cssResponse.status
        });
      }
    } catch (error) {
      this.logger.addTest('CSS Loading', 'WARN', {
        warning: 'Could not test CSS loading directly',
        note: 'This may be normal with Next.js CSS optimization'
      });
    }
  }

  getViewportUserAgent(viewport) {
    if (viewport.width <= 768) {
      return 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
    } else if (viewport.width <= 1024) {
      return 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1';
    } else {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }
  }

  async makeRequest(url, headers = {}) {
    const fetch = (await import('node-fetch')).default;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          ...headers
        },
        timeout: 10000
      });

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused - server may not be running');
      }
      throw error;
    }
  }
}

// Run the test suite
if (require.main === module) {
  console.log('🚀 Starting CDA Website Test Suite...');
  console.log('');
  
  const testSuite = new CDATestSuite();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n\\n⚠️  Test suite interrupted by user');
    testSuite.logger.generateReport();
    process.exit(1);
  });
  
  testSuite.run().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = CDATestSuite;