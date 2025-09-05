/**
 * Dynamic Routes Test Script
 * Tests all dynamic routes for Services, Case Studies, and Team Members
 */

// Use built-in fetch (Node.js 18+) or global fetch
const fetch = globalThis.fetch || require('node-fetch');

class DynamicRouteTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async testRoute(url, description) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      console.log(`🧪 Testing: ${description}`);
      console.log(`   URL: ${url}`);
      
      const response = await fetch(url);
      const duration = Date.now() - startTime;

      if (response.status === 404) {
        console.log(`❌ ${description}: 404 Not Found (${duration}ms)`);
        return {
          url,
          description,
          success: false,
          status: 404,
          error: '404 Not Found',
          duration,
          timestamp,
        };
      }

      if (!response.ok) {
        console.log(`❌ ${description}: HTTP ${response.status} (${duration}ms)`);
        return {
          url,
          description,
          success: false,
          status: response.status,
          error: `HTTP ${response.status}: ${response.statusText}`,
          duration,
          timestamp,
        };
      }

      console.log(`✅ ${description}: Success (${duration}ms)`);
      
      return {
        url,
        description,
        success: true,
        status: response.status,
        duration,
        timestamp,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error.message;
      console.log(`❌ ${description}: ${errorMessage} (${duration}ms)`);
      
      return {
        url,
        description,
        success: false,
        status: null,
        error: errorMessage,
        duration,
        timestamp,
      };
    }
  }

  async testArchivePages() {
    console.log('\n🔍 Testing Archive Pages...');
    const results = [];

    // Test Services archive
    results.push(await this.testRoute(
      `${this.baseUrl}/services`,
      'Services Archive Page'
    ));

    // Test Case Studies archive
    results.push(await this.testRoute(
      `${this.baseUrl}/case-studies`,
      'Case Studies Archive Page'
    ));

    // Test Team archive
    results.push(await this.testRoute(
      `${this.baseUrl}/team`,
      'Team Archive Page'
    ));

    return results;
  }

  async testDynamicRoutes() {
    console.log('\n🔍 Testing Dynamic Routes...');
    const results = [];

    // Test valid dynamic routes (these should exist based on our test data)
    const testRoutes = [
      // Services - test some common slugs
      { path: '/services/test-service-1', description: 'Service Detail - Test Service 1' },
      { path: '/services/ecommerce-development', description: 'Service Detail - eCommerce Development' },
      { path: '/services/digital-marketing', description: 'Service Detail - Digital Marketing' },
      
      // Case Studies - test some common slugs
      { path: '/case-studies/test-case-study-1', description: 'Case Study Detail - Test Case Study 1' },
      { path: '/case-studies/ecommerce-success', description: 'Case Study Detail - eCommerce Success' },
      
      // Team Members - test some common slugs
      { path: '/team/john-doe', description: 'Team Member - John Doe' },
      { path: '/team/jane-smith', description: 'Team Member - Jane Smith' },
    ];

    for (const route of testRoutes) {
      results.push(await this.testRoute(
        `${this.baseUrl}${route.path}`,
        route.description
      ));
    }

    return results;
  }

  async testInvalidRoutes() {
    console.log('\n🔍 Testing Invalid Routes (should return 404)...');
    const results = [];

    const invalidRoutes = [
      { path: '/services/non-existent-service', description: 'Invalid Service Slug' },
      { path: '/case-studies/non-existent-case-study', description: 'Invalid Case Study Slug' },
      { path: '/team/non-existent-member', description: 'Invalid Team Member Slug' },
      { path: '/services/', description: 'Empty Service Slug' },
      { path: '/case-studies/', description: 'Empty Case Study Slug' },
      { path: '/team/', description: 'Empty Team Member Slug' },
    ];

    for (const route of invalidRoutes) {
      const result = await this.testRoute(
        `${this.baseUrl}${route.path}`,
        route.description
      );
      
      // For invalid routes, we expect 404, so success is actually getting a 404
      if (result.status === 404) {
        result.success = true;
        result.error = null;
        console.log(`✅ ${route.description}: Correctly returned 404`);
      } else if (result.success) {
        result.success = false;
        result.error = 'Expected 404 but got success response';
        console.log(`❌ ${route.description}: Expected 404 but got ${result.status}`);
      }
    }

    return results;
  }

  async test404Page() {
    console.log('\n🔍 Testing 404 Page...');
    const results = [];

    results.push(await this.testRoute(
      `${this.baseUrl}/non-existent-page`,
      'Custom 404 Page'
    ));

    return results;
  }

  async runAllTests() {
    console.log('🚀 Starting Dynamic Routes Test Suite...\n');
    const overallStartTime = Date.now();

    this.results = [];

    // Test Next.js server availability first
    console.log('🔍 Testing Next.js Server Connection...');
    try {
      const response = await fetch(this.baseUrl);
      if (response.ok) {
        console.log('✅ Next.js server is running');
      } else {
        console.log('❌ Next.js server returned error:', response.status);
        console.log('Make sure to run: npm run dev');
        return;
      }
    } catch (error) {
      console.log('❌ Cannot connect to Next.js server:', error.message);
      console.log('Make sure to run: npm run dev');
      return;
    }

    // Run all test suites
    const archiveResults = await this.testArchivePages();
    const dynamicResults = await this.testDynamicRoutes();
    const invalidResults = await this.testInvalidRoutes();
    const notFoundResults = await this.test404Page();

    this.results = [
      ...archiveResults,
      ...dynamicResults,
      ...invalidResults,
      ...notFoundResults,
    ];

    const overallDuration = Date.now() - overallStartTime;
    this.generateSummary(overallDuration);
    
    return this.results;
  }

  generateSummary(overallDuration) {
    console.log('\n📊 TEST SUMMARY');
    console.log('=====================================');

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Overall Results: ${passedTests}/${totalTests} tests passed`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    console.log(`Total Duration: ${overallDuration}ms`);
    console.log(`Average Test Time: ${Math.round(totalDuration / totalTests)}ms\n`);

    // Group by test type
    const archiveTests = this.results.filter(r => r.description.includes('Archive'));
    const detailTests = this.results.filter(r => r.description.includes('Detail') || r.description.includes('Team Member'));
    const invalidTests = this.results.filter(r => r.description.includes('Invalid') || r.description.includes('Empty'));
    const notFoundTests = this.results.filter(r => r.description.includes('404'));

    const groups = [
      { name: 'Archive Pages', tests: archiveTests },
      { name: 'Dynamic Detail Pages', tests: detailTests },
      { name: 'Invalid Routes (should 404)', tests: invalidTests },
      { name: '404 Page', tests: notFoundTests },
    ];

    groups.forEach(group => {
      if (group.tests.length === 0) return;
      
      const passed = group.tests.filter(r => r.success).length;
      const failed = group.tests.filter(r => !r.success).length;
      const duration = group.tests.reduce((sum, r) => sum + r.duration, 0);
      
      const status = failed === 0 ? '✅' : '❌';
      console.log(`${status} ${group.name}: ${passed}/${group.tests.length} (${duration}ms)`);
      
      if (failed > 0) {
        const failedTests = group.tests.filter(r => !r.success);
        failedTests.forEach(test => {
          console.log(`   ❌ ${test.description}: ${test.error || `HTTP ${test.status}`}`);
        });
      }
    });

    // Export results to file
    const fs = require('fs');
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: Math.round((passedTests / totalTests) * 100),
        totalDuration: overallDuration,
        averageTestTime: Math.round(totalDuration / totalTests),
      },
      results: this.results,
      groups: groups.reduce((acc, group) => {
        acc[group.name] = {
          tests: group.tests.length,
          passed: group.tests.filter(r => r.success).length,
          failed: group.tests.filter(r => !r.success).length,
          results: group.tests,
        };
        return acc;
      }, {}),
    };

    const fileName = `dynamic-routes-test-results-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(fileName, JSON.stringify(exportData, null, 2));
    console.log(`\n📁 Results exported to: ${fileName}`);

    // Provide actionable feedback
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (failedTests === 0) {
      console.log('✅ All tests passed! Your dynamic routing is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Consider the following:');
      
      const serverErrors = this.results.filter(r => !r.success && r.status >= 500);
      const clientErrors = this.results.filter(r => !r.success && r.status >= 400 && r.status < 500);
      const networkErrors = this.results.filter(r => !r.success && !r.status);

      if (serverErrors.length > 0) {
        console.log('   🔧 Server errors detected - check your GraphQL queries and data fetching');
      }
      
      if (clientErrors.length > 0) {
        console.log('   📄 Client errors detected - verify your route configurations');
      }
      
      if (networkErrors.length > 0) {
        console.log('   🌐 Network errors detected - ensure Next.js dev server is running');
      }
    }

    console.log('\n🚀 To run Next.js dev server: npm run dev');
    console.log('🔍 To view routes manually: http://localhost:3000/services');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  async function main() {
    try {
      // Check if fetch is available
      if (typeof fetch === 'undefined') {
        console.error('❌ fetch is not available. Use Node.js 18+ or install node-fetch');
        process.exit(1);
      }

      const tester = new DynamicRouteTester();
      await tester.runAllTests();
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    }
  }

  main();
}

module.exports = DynamicRouteTester;