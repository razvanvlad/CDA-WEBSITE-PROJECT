/**
 * CDA Website - GraphQL Connection Test Suite
 * Tests all GraphQL endpoints for Services, Case Studies, Team Members, and Global Content
 */

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

interface TestResult {
  query: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  timestamp: string;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDuration: number;
}

export class GraphQLTester {
  private baseUrl: string;
  private results: TestSuite[] = [];

  constructor(baseUrl: string = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql') {
    this.baseUrl = baseUrl;
  }

  private async executeQuery(query: string, variables?: Record<string, any>): Promise<GraphQLResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async runTest(
    suiteName: string,
    testName: string,
    query: string,
    variables?: Record<string, any>
  ): Promise<TestResult> {
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
          query: testName,
          success: false,
          error: errorMessage,
          duration,
          timestamp,
        };
      }

      console.log(`✅ ${testName}: Success (${duration}ms)`);
      
      return {
        query: testName,
        success: true,
        data: result.data,
        duration,
        timestamp,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ ${testName}: ${errorMessage}`);
      
      return {
        query: testName,
        success: false,
        error: errorMessage,
        duration,
        timestamp,
      };
    }
  }

  async testServices(): Promise<TestSuite> {
    console.log('\n🔍 Testing Services GraphQL Queries...');
    const suiteName = 'Services';
    const results: TestResult[] = [];

    // Test 1: Get all services with basic fields
    results.push(await this.runTest(
      suiteName,
      'Services - Basic Query',
      `
        query GetServices {
          services {
            nodes {
              id
              title
              slug
              date
              content
            }
          }
        }
      `
    ));

    // Test 2: Get services with ACF fields
    results.push(await this.runTest(
      suiteName,
      'Services - With ACF Fields',
      `
        query GetServicesWithACF {
          services {
            nodes {
              id
              title
              slug
              serviceFields {
                heroSection {
                  subtitle
                  description
                  heroImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  cta {
                    text
                    url
                  }
                }
                keyStatistics {
                  number
                  label
                  percentage
                }
                features {
                  icon {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  title
                  description
                }
              }
            }
          }
        }
      `
    ));

    // Test 3: Get services with taxonomies
    results.push(await this.runTest(
      suiteName,
      'Services - With Taxonomies',
      `
        query GetServicesWithTaxonomies {
          services {
            nodes {
              id
              title
              serviceTypes {
                nodes {
                  name
                  slug
                  description
                }
              }
            }
          }
        }
      `
    ));

    // Test 4: Get single service by slug
    results.push(await this.runTest(
      suiteName,
      'Services - Single Service by Slug',
      `
        query GetServiceBySlug($slug: ID!) {
          service(id: $slug, idType: SLUG) {
            id
            title
            content
            serviceFields {
              heroSection {
                subtitle
                description
              }
              process {
                heading
                steps {
                  title
                  description
                  image {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { slug: 'test-service' }
    ));

    const suite: TestSuite = {
      name: suiteName,
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.success).length,
      failedTests: results.filter(r => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    };

    this.results.push(suite);
    return suite;
  }

  async testCaseStudies(): Promise<TestSuite> {
    console.log('\n🔍 Testing Case Studies GraphQL Queries...');
    const suiteName = 'Case Studies';
    const results: TestResult[] = [];

    // Test 1: Get all case studies with basic fields
    results.push(await this.runTest(
      suiteName,
      'Case Studies - Basic Query',
      `
        query GetCaseStudies {
          caseStudies {
            nodes {
              id
              title
              slug
              date
              content
            }
          }
        }
      `
    ));

    // Test 2: Get case studies with ACF fields
    results.push(await this.runTest(
      suiteName,
      'Case Studies - With ACF Fields',
      `
        query GetCaseStudiesWithACF {
          caseStudies {
            nodes {
              id
              title
              slug
              caseStudyFields {
                projectOverview {
                  clientName
                  clientLogo {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  projectUrl
                  completionDate
                  duration
                }
                keyMetrics {
                  metric
                  value
                  description
                }
                challenge {
                  title
                  description
                }
                solution {
                  title
                  description
                }
                results {
                  title
                  description
                }
                featured
              }
            }
          }
        }
      `
    ));

    // Test 3: Get case studies with taxonomies
    results.push(await this.runTest(
      suiteName,
      'Case Studies - With Taxonomies',
      `
        query GetCaseStudiesWithTaxonomies {
          caseStudies {
            nodes {
              id
              title
              projectTypes {
                nodes {
                  name
                  slug
                  description
                }
              }
            }
          }
        }
      `
    ));

    // Test 4: Get featured case studies only
    results.push(await this.runTest(
      suiteName,
      'Case Studies - Featured Only',
      `
        query GetFeaturedCaseStudies {
          caseStudies(where: {hasMetaQuery: {key: "featured", value: "1"}}) {
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

    const suite: TestSuite = {
      name: suiteName,
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.success).length,
      failedTests: results.filter(r => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    };

    this.results.push(suite);
    return suite;
  }

  async testTeamMembers(): Promise<TestSuite> {
    console.log('\n🔍 Testing Team Members GraphQL Queries...');
    const suiteName = 'Team Members';
    const results: TestResult[] = [];

    // Test 1: Get all team members with basic fields
    results.push(await this.runTest(
      suiteName,
      'Team Members - Basic Query',
      `
        query GetTeamMembers {
          teamMembers {
            nodes {
              id
              title
              slug
              date
            }
          }
        }
      `
    ));

    // Test 2: Get team members with ACF fields
    results.push(await this.runTest(
      suiteName,
      'Team Members - With ACF Fields',
      `
        query GetTeamMembersWithACF {
          teamMembers {
            nodes {
              id
              title
              slug
              teamMemberFields {
                jobTitle
                shortBio
                fullBio
                email
                linkedinUrl
                skills {
                  name
                  level
                }
                featured
                publicProfile
              }
            }
          }
        }
      `
    ));

    // Test 3: Get team members with departments
    results.push(await this.runTest(
      suiteName,
      'Team Members - With Departments',
      `
        query GetTeamMembersWithDepartments {
          teamMembers {
            nodes {
              id
              title
              departments {
                nodes {
                  name
                  slug
                  description
                }
              }
            }
          }
        }
      `
    ));

    // Test 4: Get featured team members only
    results.push(await this.runTest(
      suiteName,
      'Team Members - Featured Only',
      `
        query GetFeaturedTeamMembers {
          teamMembers(where: {hasMetaQuery: {key: "featured", value: "1"}}) {
            nodes {
              id
              title
              teamMemberFields {
                jobTitle
                shortBio
                featured
              }
            }
          }
        }
      `
    ));

    const suite: TestSuite = {
      name: suiteName,
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.success).length,
      failedTests: results.filter(r => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    };

    this.results.push(suite);
    return suite;
  }

  async testGlobalContent(): Promise<TestSuite> {
    console.log('\n🔍 Testing Global Content GraphQL Queries...');
    const suiteName = 'Global Content';
    const results: TestResult[] = [];

    // Test 1: Get all global shared content
    results.push(await this.runTest(
      suiteName,
      'Global Content - All Blocks',
      `
        query GetGlobalContent {
          globalOptions {
            globalSharedContent {
              whyCdaBlock {
                title
                subtitle
                cards {
                  title
                  description
                  image {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
              approachBlock {
                title
                subtitle
                steps {
                  stepNumber
                  title
                  description
                  image {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
              technologiesBlock {
                title
                subtitle
                categories {
                  icon {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  name
                  description
                  url
                }
              }
              showreelBlock {
                title
                subtitle
                videoThumbnail {
                  node {
                    sourceUrl
                    altText
                  }
                }
                videoUrl
                clientLogos {
                  logo {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                  name
                  url
                }
              }
              newsletterBlock {
                title
                subtitle
                description
                submitText
                privacyText
              }
              ctaBlock {
                pretitle
                title
                buttonText
                buttonUrl
                backgroundImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      `
    ));

    // Test 2: Get specific global blocks only
    results.push(await this.runTest(
      suiteName,
      'Global Content - Specific Blocks',
      `
        query GetSpecificGlobalBlocks {
          globalOptions {
            globalSharedContent {
              whyCdaBlock {
                title
                subtitle
              }
              ctaBlock {
                title
                buttonText
                buttonUrl
              }
            }
          }
        }
      `
    ));

    const suite: TestSuite = {
      name: suiteName,
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.success).length,
      failedTests: results.filter(r => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    };

    this.results.push(suite);
    return suite;
  }

  async testTaxonomies(): Promise<TestSuite> {
    console.log('\n🔍 Testing Taxonomies GraphQL Queries...');
    const suiteName = 'Taxonomies';
    const results: TestResult[] = [];

    // Test 1: Get all service types
    results.push(await this.runTest(
      suiteName,
      'Taxonomies - Service Types',
      `
        query GetServiceTypes {
          serviceTypes {
            nodes {
              id
              name
              slug
              description
              count
              services {
                nodes {
                  id
                  title
                }
              }
            }
          }
        }
      `
    ));

    // Test 2: Get all project types
    results.push(await this.runTest(
      suiteName,
      'Taxonomies - Project Types',
      `
        query GetProjectTypes {
          projectTypes {
            nodes {
              id
              name
              slug
              description
              count
              caseStudies {
                nodes {
                  id
                  title
                }
              }
            }
          }
        }
      `
    ));

    // Test 3: Get all departments
    results.push(await this.runTest(
      suiteName,
      'Taxonomies - Departments',
      `
        query GetDepartments {
          departments {
            nodes {
              id
              name
              slug
              description
              count
              teamMembers {
                nodes {
                  id
                  title
                }
              }
            }
          }
        }
      `
    ));

    const suite: TestSuite = {
      name: suiteName,
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.success).length,
      failedTests: results.filter(r => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    };

    this.results.push(suite);
    return suite;
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting CDA Website GraphQL Test Suite...\n');
    const overallStartTime = Date.now();

    // Clear previous results
    this.results = [];

    // Run all test suites
    await this.testServices();
    await this.testCaseStudies(); 
    await this.testTeamMembers();
    await this.testGlobalContent();
    await this.testTaxonomies();

    const overallDuration = Date.now() - overallStartTime;

    // Generate summary
    this.generateSummary(overallDuration);
  }

  private generateSummary(overallDuration: number): void {
    console.log('\n📊 TEST SUMMARY');
    console.log('=====================================');

    const totalTests = this.results.reduce((sum, suite) => sum + suite.totalTests, 0);
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passedTests, 0);
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failedTests, 0);
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.totalDuration, 0);

    console.log(`Overall Results: ${totalPassed}/${totalTests} tests passed`);
    console.log(`Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`);
    console.log(`Total Duration: ${overallDuration}ms`);
    console.log(`Average Test Time: ${Math.round(totalDuration / totalTests)}ms\n`);

    // Suite breakdown
    this.results.forEach(suite => {
      const status = suite.failedTests === 0 ? '✅' : '❌';
      console.log(`${status} ${suite.name}: ${suite.passedTests}/${suite.totalTests} (${Math.round(suite.totalDuration)}ms)`);
      
      if (suite.failedTests > 0) {
        const failedTests = suite.results.filter(r => !r.success);
        failedTests.forEach(test => {
          console.log(`   ❌ ${test.query}: ${test.error}`);
        });
      }
    });

    console.log('\n📝 Detailed results logged to GraphQL test output.');
  }

  getResults(): TestSuite[] {
    return this.results;
  }

  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalSuites: this.results.length,
        totalTests: this.results.reduce((sum, suite) => sum + suite.totalTests, 0),
        totalPassed: this.results.reduce((sum, suite) => sum + suite.passedTests, 0),
        totalFailed: this.results.reduce((sum, suite) => sum + suite.failedTests, 0),
        totalDuration: this.results.reduce((sum, suite) => sum + suite.totalDuration, 0),
      },
      suites: this.results,
    }, null, 2);
  }
}

// Usage example for testing in development
export async function runGraphQLTests(): Promise<void> {
  const tester = new GraphQLTester();
  await tester.runAllTests();
  
  // Export results to console for debugging
  console.log('\n📁 Full Results JSON:');
  console.log(tester.exportResults());
}

// Individual test functions for targeted testing
export async function testServicesOnly(): Promise<TestSuite> {
  const tester = new GraphQLTester();
  return await tester.testServices();
}

export async function testCaseStudiesOnly(): Promise<TestSuite> {
  const tester = new GraphQLTester();
  return await tester.testCaseStudies();
}

export async function testTeamMembersOnly(): Promise<TestSuite> {
  const tester = new GraphQLTester();
  return await tester.testTeamMembers();
}

export async function testGlobalContentOnly(): Promise<TestSuite> {
  const tester = new GraphQLTester();
  return await tester.testGlobalContent();
}

export async function testTaxonomiesOnly(): Promise<TestSuite> {
  const tester = new GraphQLTester();
  return await tester.testTaxonomies();
}