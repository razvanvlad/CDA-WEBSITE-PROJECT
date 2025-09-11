/**
 * CDA Website - GraphQL Connection Test Script
 * Node.js script for testing GraphQL endpoints from command line
 */

// Use built-in fetch (Node.js 18+) or global fetch
const fetch = globalThis.fetch || require('node-fetch');

class GraphQLTester {
  constructor(baseUrl = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async executeQuery(query, variables = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Network error: ${error.message}`);
    }
  }

  async runTest(suiteName, testName, query, variables = {}) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      console.log(`🧪 Testing: ${testName}`);
      
      const result = await this.executeQuery(query, variables);
      const duration = Date.now() - startTime;

      if (result.errors && result.errors.length > 0) {
        const errorMessage = result.errors.map(err => err.message).join(', ');
        console.error(`❌ ${testName}: ${errorMessage}`);
        
        return {
          suite: suiteName,
          query: testName,
          success: false,
          error: errorMessage,
          duration,
          timestamp,
        };
      }

      console.log(`✅ ${testName}: Success (${duration}ms)`);
      
      return {
        suite: suiteName,
        query: testName,
        success: true,
        data: result.data,
        duration,
        timestamp,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error.message;
      console.error(`❌ ${testName}: ${errorMessage}`);
      
      return {
        suite: suiteName,
        query: testName,
        success: false,
        error: errorMessage,
        duration,
        timestamp,
      };
    }
  }

  async testConnectionAndSchema() {
    console.log('\n🔍 Testing GraphQL Connection and Schema...');
    const results = [];

    // Test basic connection
    results.push(await this.runTest(
      'Connection',
      'Basic GraphQL Connection',
      `
        query TestConnection {
          __schema {
            types {
              name
              kind
            }
          }
        }
      `
    ));

    // Test custom post types exist in schema
    results.push(await this.runTest(
      'Connection',
      'Custom Post Types in Schema',
      `
        query TestCustomPostTypes {
          __type(name: "RootQuery") {
            fields {
              name
              type {
                name
              }
            }
          }
        }
      `
    ));

    return results;
  }

  async testServices() {
    console.log('\n🔍 Testing Services GraphQL Queries...');
    const results = [];

    // Test basic services query
    results.push(await this.runTest(
      'Services',
      'Services - Basic Query',
      `
        query GetServices {
          services {
            nodes {
              id
              title
              slug
            }
          }
        }
      `
    ));

    // Test services with ACF fields
    results.push(await this.runTest(
      'Services',
      'Services - With ACF Fields',
      `
        query GetServicesWithACF {
          services(first: 50) {
            nodes {
              id
              title
              uri
              serviceFields {
                heroSection { subtitle description }
                statistics { number label }
              }
            }
          }
        }
      `
    ));

    // Test service types taxonomy
    results.push(await this.runTest(
      'Services',
      'Services - With Service Types',
      `
        query GetServicesWithTypes {
          services {
            nodes {
              id
              title
              serviceTypes {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        }
      `
    ));

    return results;
  }

  async testCaseStudies() {
    console.log('\n🔍 Testing Case Studies GraphQL Queries...');
    const results = [];

    results.push(await this.runTest(
      'Case Studies',
      'Case Studies - Basic Query',
      `
        query GetCaseStudies {
          caseStudies {
            nodes {
              id
              title
              slug
            }
          }
        }
      `
    ));

    results.push(await this.runTest(
      'Case Studies',
      'Case Studies - With ACF Fields',
      `
        query GetCaseStudiesWithACF {
          caseStudies {
            nodes {
              id
              title
              caseStudyFields {
                projectOverview {
                  clientName
                }
                featured
              }
            }
          }
        }
      `
    ));

    return results;
  }

  async testTeamMembers() {
    console.log('\n🔍 Testing Team Members GraphQL Queries...');
    const results = [];

    results.push(await this.runTest(
      'Team Members',
      'Team Members - Basic Query',
      `
        query GetTeamMembers {
          teamMembers {
            nodes {
              id
              title
              slug
            }
          }
        }
      `
    ));

    results.push(await this.runTest(
      'Team Members',
      'Team Members - With ACF Fields',
      `
        query GetTeamMembersWithACF {
          teamMembers {
            nodes {
              id
              title
              teamMemberFields {
                jobTitle
                shortBio
              }
            }
          }
        }
      `
    ));

    return results;
  }

  async testGlobalContent() {
    console.log('\n🔍 Testing Global Content GraphQL Queries...');
    const results = [];

    results.push(await this.runTest(
      'Global Content',
      'Global Content - All Blocks',
      `
        query GetGlobalContent {
          globalOptions {
            globalContentBlocks {
              whyCda { title }
              approach { title }
              technologiesSlider { title }
              showreel { title }
              newsletterSignup { title }
            }
          }
        }
      `
    ));

    return results;
  }

  async testTaxonomies() {
    console.log('\n🔍 Testing Taxonomies GraphQL Queries...');
    const results = [];

    results.push(await this.runTest(
      'Taxonomies',
      'Service Types Taxonomy',
      `
        query GetServiceTypes {
          serviceTypes {
            nodes {
              id
              name
              slug
              count
            }
          }
        }
      `
    ));

    results.push(await this.runTest(
      'Taxonomies',
      'Departments Taxonomy',
      `
        query GetDepartments {
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
    ));

    return results;
  }

  async runAllTests() {
    console.log('🚀 Starting CDA Website GraphQL Test Suite...\n');
    const overallStartTime = Date.now();

    this.results = [];

    // Run all test suites
    const connectionResults = await this.testConnectionAndSchema();
    const servicesResults = await this.testServices();
    const caseStudiesResults = await this.testCaseStudies();
    const teamMembersResults = await this.testTeamMembers();
    const globalContentResults = await this.testGlobalContent();
    const taxonomiesResults = await this.testTaxonomies();

    this.results = [
      ...connectionResults,
      ...servicesResults,
      ...caseStudiesResults,
      ...teamMembersResults,
      ...globalContentResults,
      ...taxonomiesResults,
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
    const totalTestDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Overall Results: ${passedTests}/${totalTests} tests passed`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    console.log(`Total Duration: ${overallDuration}ms`);
    console.log(`Average Test Time: ${Math.round(totalTestDuration / totalTests)}ms\n`);

    // Group by suite
    const suites = {};
    this.results.forEach(result => {
      if (!suites[result.suite]) {
        suites[result.suite] = [];
      }
      suites[result.suite].push(result);
    });

    // Suite breakdown
    Object.keys(suites).forEach(suiteName => {
      const suiteResults = suites[suiteName];
      const suitePassed = suiteResults.filter(r => r.success).length;
      const suiteFailed = suiteResults.filter(r => !r.success).length;
      const suiteDuration = suiteResults.reduce((sum, r) => sum + r.duration, 0);
      
      const status = suiteFailed === 0 ? '✅' : '❌';
      console.log(`${status} ${suiteName}: ${suitePassed}/${suiteResults.length} (${suiteDuration}ms)`);
      
      if (suiteFailed > 0) {
        const failedTests = suiteResults.filter(r => !r.success);
        failedTests.forEach(test => {
          console.log(`   ❌ ${test.query}: ${test.error}`);
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
        averageTestTime: Math.round(totalTestDuration / totalTests),
      },
      results: this.results,
      suites,
    };

    const fileName = `graphql-test-results-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(fileName, JSON.stringify(exportData, null, 2));
    console.log(`\n📁 Results exported to: ${fileName}`);
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

      const tester = new GraphQLTester();
      await tester.runAllTests();
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    }
  }

  main();
}

module.exports = GraphQLTester;