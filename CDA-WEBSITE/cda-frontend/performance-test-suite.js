#!/usr/bin/env node

/**
 * CDA Website Performance Test Suite
 * Comprehensive performance analysis including load times, bundle analysis, image optimization, and caching
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Performance test configuration
const PERF_TEST_CONFIG = {
  baseUrl: 'http://localhost:3005',
  buildDir: '.next',
  logFile: 'performance-test-results.log',
  routes: [
    '/',
    '/services',
    '/case-studies',
    '/team',
    '/about',
    '/contact'
  ],
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'],
  performanceThresholds: {
    firstLoad: 3000, // 3 seconds
    subsequentLoad: 1000, // 1 second
    imageLoad: 2000, // 2 seconds
    bundleSize: 1000000, // 1MB
  }
};

class CDA_Performance_TestSuite {
  constructor() {
    this.results = {
      pageLoadTimes: {},
      bundleAnalysis: {},
      imageOptimization: {},
      caching: {},
      performance: {},
      summary: {}
    };
    this.logEntries = [];
  }

  log(level, message) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    console.log(logMessage);
    this.logEntries.push(logMessage);
  }

  // HTTP request helper with timing
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.get(url, (res) => {
        let data = '';
        const headers = res.headers;
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const endTime = performance.now();
          const loadTime = Math.round(endTime - startTime);
          
          resolve({
            statusCode: res.statusCode,
            headers,
            data,
            loadTime,
            contentLength: headers['content-length'] || data.length
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  // Test page load times
  async testPageLoadTimes() {
    this.log('INFO', '🚀 Testing page load times...');
    
    for (const route of PERF_TEST_CONFIG.routes) {
      const url = `${PERF_TEST_CONFIG.baseUrl}${route}`;
      
      try {
        // First load (cold)
        const firstLoad = await this.makeRequest(url);
        
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Second load (warm)
        const secondLoad = await this.makeRequest(url);
        
        // Third load (cached)
        const thirdLoad = await this.makeRequest(url);
        
        const routeResults = {
          coldLoad: firstLoad.loadTime,
          warmLoad: secondLoad.loadTime,
          cachedLoad: thirdLoad.loadTime,
          contentLength: firstLoad.contentLength,
          statusCode: firstLoad.statusCode,
          averageLoad: Math.round((firstLoad.loadTime + secondLoad.loadTime + thirdLoad.loadTime) / 3)
        };
        
        this.results.pageLoadTimes[route] = routeResults;
        
        // Performance assessment
        if (routeResults.coldLoad <= PERF_TEST_CONFIG.performanceThresholds.firstLoad) {
          this.log('PASS', `✅ PASS: Page Load Times - ${route} - Cold load: ${routeResults.coldLoad}ms (Good)`);
        } else {
          this.log('WARN', `⚠️ WARN: Page Load Times - ${route} - Cold load: ${routeResults.coldLoad}ms (Slow)`);
        }
        
        if (routeResults.cachedLoad <= PERF_TEST_CONFIG.performanceThresholds.subsequentLoad) {
          this.log('PASS', `✅ PASS: Page Load Times - ${route} - Cached load: ${routeResults.cachedLoad}ms (Fast)`);
        } else {
          this.log('WARN', `⚠️ WARN: Page Load Times - ${route} - Cached load: ${routeResults.cachedLoad}ms (Could be faster)`);
        }
        
        this.log('INFO', `    Details: Cold: ${routeResults.coldLoad}ms, Warm: ${routeResults.warmLoad}ms, Cached: ${routeResults.cachedLoad}ms`);
        this.log('INFO', `    Content size: ${Math.round(routeResults.contentLength / 1024)}KB`);
        
      } catch (error) {
        this.log('FAIL', `❌ FAIL: Page Load Times - ${route} - Error: ${error.message}`);
        this.results.pageLoadTimes[route] = {
          error: error.message,
          statusCode: 'ERROR'
        };
      }
    }
  }

  // Analyze bundle sizes and unused code
  async analyzeBundleSizes() {
    this.log('INFO', '📦 Analyzing bundle sizes and unused code...');
    
    const buildPath = path.join(process.cwd(), PERF_TEST_CONFIG.buildDir);
    
    try {
      if (!fs.existsSync(buildPath)) {
        this.log('WARN', `⚠️ WARN: Build directory not found at ${buildPath}. Run 'npm run build' first.`);
        this.results.bundleAnalysis.error = 'Build directory not found';
        return;
      }

      // Find JS and CSS files in build
      const staticPath = path.join(buildPath, 'static');
      if (fs.existsSync(staticPath)) {
        const bundles = {
          js: [],
          css: [],
          total: 0
        };

        // Recursively find files
        const findFiles = (dir, extension) => {
          const files = [];
          if (fs.existsSync(dir)) {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
              const fullPath = path.join(dir, item.name);
              if (item.isDirectory()) {
                files.push(...findFiles(fullPath, extension));
              } else if (item.name.endsWith(extension)) {
                const stats = fs.statSync(fullPath);
                files.push({
                  name: item.name,
                  path: fullPath,
                  size: stats.size
                });
              }
            }
          }
          return files;
        };

        bundles.js = findFiles(staticPath, '.js');
        bundles.css = findFiles(staticPath, '.css');
        bundles.total = [...bundles.js, ...bundles.css].reduce((sum, file) => sum + file.size, 0);

        this.results.bundleAnalysis = bundles;

        // Check bundle size thresholds
        if (bundles.total <= PERF_TEST_CONFIG.performanceThresholds.bundleSize) {
          this.log('PASS', `✅ PASS: Bundle Size - Total: ${Math.round(bundles.total / 1024)}KB (Acceptable)`);
        } else {
          this.log('WARN', `⚠️ WARN: Bundle Size - Total: ${Math.round(bundles.total / 1024)}KB (Large)`);
        }

        this.log('INFO', `    JS files: ${bundles.js.length} (${Math.round(bundles.js.reduce((sum, f) => sum + f.size, 0) / 1024)}KB)`);
        this.log('INFO', `    CSS files: ${bundles.css.length} (${Math.round(bundles.css.reduce((sum, f) => sum + f.size, 0) / 1024)}KB)`);

        // List largest files
        const allFiles = [...bundles.js, ...bundles.css].sort((a, b) => b.size - a.size).slice(0, 5);
        this.log('INFO', '    Largest files:');
        allFiles.forEach(file => {
          this.log('INFO', `      - ${file.name}: ${Math.round(file.size / 1024)}KB`);
        });

      } else {
        this.log('WARN', `⚠️ WARN: Static directory not found in build`);
        this.results.bundleAnalysis.error = 'Static directory not found';
      }

    } catch (error) {
      this.log('FAIL', `❌ FAIL: Bundle Analysis - Error: ${error.message}`);
      this.results.bundleAnalysis.error = error.message;
    }
  }

  // Test image optimization
  async testImageOptimization() {
    this.log('INFO', '🖼️ Testing image optimization...');
    
    const publicPath = path.join(process.cwd(), 'public');
    
    try {
      if (!fs.existsSync(publicPath)) {
        this.log('WARN', `⚠️ WARN: Public directory not found`);
        this.results.imageOptimization.error = 'Public directory not found';
        return;
      }

      const images = [];
      
      // Find all images recursively
      const findImages = (dir) => {
        if (fs.existsSync(dir)) {
          const items = fs.readdirSync(dir, { withFileTypes: true });
          for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
              findImages(fullPath);
            } else if (PERF_TEST_CONFIG.imageExtensions.some(ext => item.name.toLowerCase().endsWith(ext))) {
              const stats = fs.statSync(fullPath);
              const relativePath = path.relative(publicPath, fullPath);
              images.push({
                name: item.name,
                path: fullPath,
                relativePath: relativePath,
                size: stats.size,
                extension: path.extname(item.name).toLowerCase()
              });
            }
          }
        }
      };

      findImages(publicPath);

      this.results.imageOptimization = {
        totalImages: images.length,
        totalSize: images.reduce((sum, img) => sum + img.size, 0),
        formats: {},
        largeImages: images.filter(img => img.size > 500000), // > 500KB
        recommendations: []
      };

      // Analyze by format
      images.forEach(img => {
        if (!this.results.imageOptimization.formats[img.extension]) {
          this.results.imageOptimization.formats[img.extension] = { count: 0, size: 0 };
        }
        this.results.imageOptimization.formats[img.extension].count++;
        this.results.imageOptimization.formats[img.extension].size += img.size;
      });

      // Test a few image URLs for Next.js optimization
      const testImages = images.slice(0, 3);
      for (const img of testImages) {
        try {
          const imageUrl = `${PERF_TEST_CONFIG.baseUrl}/${img.relativePath.replace(/\\/g, '/')}`;
          const response = await this.makeRequest(imageUrl);
          
          if (response.statusCode === 200) {
            this.log('PASS', `✅ PASS: Image Access - ${img.name} - ${response.loadTime}ms`);
          } else {
            this.log('FAIL', `❌ FAIL: Image Access - ${img.name} - Status: ${response.statusCode}`);
          }
        } catch (error) {
          this.log('FAIL', `❌ FAIL: Image Access - ${img.name} - Error: ${error.message}`);
        }
      }

      // Performance assessment
      this.log('INFO', `    Total images: ${images.length}`);
      this.log('INFO', `    Total size: ${Math.round(this.results.imageOptimization.totalSize / 1024 / 1024 * 100) / 100}MB`);
      
      Object.keys(this.results.imageOptimization.formats).forEach(format => {
        const formatData = this.results.imageOptimization.formats[format];
        this.log('INFO', `    ${format}: ${formatData.count} files (${Math.round(formatData.size / 1024)}KB)`);
      });

      if (this.results.imageOptimization.largeImages.length > 0) {
        this.log('WARN', `⚠️ WARN: Found ${this.results.imageOptimization.largeImages.length} large images (>500KB)`);
        this.results.imageOptimization.recommendations.push('Consider compressing large images');
      }

      // Check for modern formats
      const hasWebP = this.results.imageOptimization.formats['.webp'];
      if (!hasWebP || hasWebP.count === 0) {
        this.log('WARN', `⚠️ WARN: No WebP images found - consider using WebP for better compression`);
        this.results.imageOptimization.recommendations.push('Consider using WebP format for better compression');
      }

    } catch (error) {
      this.log('FAIL', `❌ FAIL: Image Optimization - Error: ${error.message}`);
      this.results.imageOptimization.error = error.message;
    }
  }

  // Test lazy loading
  async testLazyLoading() {
    this.log('INFO', '⚡ Testing lazy loading implementation...');
    
    try {
      // Test a page with likely image content
      const testUrl = `${PERF_TEST_CONFIG.baseUrl}/services`;
      const response = await this.makeRequest(testUrl);
      
      if (response.statusCode !== 200) {
        this.log('FAIL', `❌ FAIL: Lazy Loading Test - Could not access test page`);
        return;
      }

      const html = response.data;
      
      // Check for lazy loading attributes
      const lazyLoadingPatterns = [
        /loading=["']lazy["']/gi,
        /loading={["']lazy["']}/gi,
        /lazy/gi // Generic lazy pattern
      ];

      const imagePatterns = [
        /<img[^>]*>/gi,
        /<Image[^>]*>/gi // Next.js Image component
      ];

      let totalImages = 0;
      let lazyImages = 0;
      let nextJsImages = 0;

      // Count images
      imagePatterns.forEach(pattern => {
        const matches = html.match(pattern) || [];
        matches.forEach(match => {
          totalImages++;
          if (match.includes('Image')) nextJsImages++;
          if (lazyLoadingPatterns.some(lazyPattern => lazyPattern.test(match))) {
            lazyImages++;
          }
        });
      });

      this.results.imageOptimization.lazyLoading = {
        totalImages,
        lazyImages,
        nextJsImages,
        lazyPercentage: totalImages > 0 ? Math.round((lazyImages / totalImages) * 100) : 0,
        nextJsPercentage: totalImages > 0 ? Math.round((nextJsImages / totalImages) * 100) : 0
      };

      if (nextJsImages > 0) {
        this.log('PASS', `✅ PASS: Lazy Loading - Using Next.js Image component (${nextJsImages}/${totalImages} images)`);
      } else if (lazyImages > 0) {
        this.log('PASS', `✅ PASS: Lazy Loading - ${lazyImages}/${totalImages} images have lazy loading`);
      } else if (totalImages > 0) {
        this.log('WARN', `⚠️ WARN: Lazy Loading - No lazy loading detected on ${totalImages} images`);
      } else {
        this.log('INFO', `ℹ️ INFO: Lazy Loading - No images found on test page`);
      }

    } catch (error) {
      this.log('FAIL', `❌ FAIL: Lazy Loading Test - Error: ${error.message}`);
      this.results.imageOptimization.lazyLoadingError = error.message;
    }
  }

  // Test caching headers
  async testCachingHeaders() {
    this.log('INFO', '💾 Testing caching headers...');
    
    const testRoutes = [
      '/',
      '/services',
      '/_next/static/css/app/layout.css' // Static asset example
    ];

    for (const route of testRoutes) {
      try {
        const url = route.startsWith('http') ? route : `${PERF_TEST_CONFIG.baseUrl}${route}`;
        const response = await this.makeRequest(url);
        
        const headers = response.headers;
        const cacheHeaders = {
          cacheControl: headers['cache-control'],
          etag: headers['etag'],
          expires: headers['expires'],
          lastModified: headers['last-modified']
        };

        this.results.caching[route] = {
          statusCode: response.statusCode,
          headers: cacheHeaders,
          hasCaching: !!(cacheHeaders.cacheControl || cacheHeaders.etag || cacheHeaders.expires)
        };

        if (this.results.caching[route].hasCaching) {
          this.log('PASS', `✅ PASS: Caching Headers - ${route} - Has caching headers`);
          if (cacheHeaders.cacheControl) {
            this.log('INFO', `    Cache-Control: ${cacheHeaders.cacheControl}`);
          }
        } else {
          this.log('WARN', `⚠️ WARN: Caching Headers - ${route} - No caching headers found`);
        }

      } catch (error) {
        this.log('FAIL', `❌ FAIL: Caching Headers - ${route} - Error: ${error.message}`);
        this.results.caching[route] = { error: error.message };
      }
    }
  }

  // Generate performance summary
  generateSummary() {
    this.log('INFO', '📊 Generating performance summary...');
    
    const summary = {
      totalTests: 0,
      passedTests: 0,
      warningTests: 0,
      failedTests: 0,
      performanceScore: 0,
      recommendations: []
    };

    // Count test results from logs
    this.logEntries.forEach(entry => {
      if (entry.includes('✅ PASS:')) summary.passedTests++;
      if (entry.includes('⚠️ WARN:')) summary.warningTests++;
      if (entry.includes('❌ FAIL:')) summary.failedTests++;
    });

    summary.totalTests = summary.passedTests + summary.warningTests + summary.failedTests;

    // Calculate performance score (0-100)
    const passWeight = 2;
    const warnWeight = 1;
    const failWeight = 0;
    
    if (summary.totalTests > 0) {
      summary.performanceScore = Math.round(
        ((summary.passedTests * passWeight + summary.warningTests * warnWeight + summary.failedTests * failWeight) 
        / (summary.totalTests * passWeight)) * 100
      );
    }

    // Generate recommendations
    if (this.results.bundleAnalysis.total > PERF_TEST_CONFIG.performanceThresholds.bundleSize) {
      summary.recommendations.push('Consider code splitting and tree shaking to reduce bundle size');
    }

    if (this.results.imageOptimization.largeImages && this.results.imageOptimization.largeImages.length > 0) {
      summary.recommendations.push('Optimize large images (>500KB) for better load times');
    }

    const avgLoadTime = Object.values(this.results.pageLoadTimes)
      .filter(result => result.averageLoad)
      .reduce((sum, result, _, arr) => sum + result.averageLoad / arr.length, 0);

    if (avgLoadTime > PERF_TEST_CONFIG.performanceThresholds.firstLoad) {
      summary.recommendations.push('Improve server response times and optimize critical resources');
    }

    this.results.summary = summary;
    return summary;
  }

  // Save results to file
  saveResults() {
    const reportData = {
      timestamp: new Date().toISOString(),
      config: PERF_TEST_CONFIG,
      results: this.results,
      logs: this.logEntries
    };

    try {
      fs.writeFileSync('performance-test-report.json', JSON.stringify(reportData, null, 2));
      this.log('INFO', '📄 Performance report saved to: performance-test-report.json');
    } catch (error) {
      this.log('FAIL', `❌ Failed to save report: ${error.message}`);
    }
  }

  // Main test runner
  async runAllTests() {
    const startTime = performance.now();
    
    this.log('INFO', '============================================================');
    this.log('INFO', 'CDA WEBSITE PERFORMANCE TEST SUITE');
    this.log('INFO', '============================================================');
    this.log('INFO', '🔍 Starting comprehensive performance analysis...');

    try {
      await this.testPageLoadTimes();
      await this.analyzeBundleSizes();
      await this.testImageOptimization();
      await this.testLazyLoading();
      await this.testCachingHeaders();

      const summary = this.generateSummary();
      const duration = Math.round(performance.now() - startTime);

      this.log('INFO', '============================================================');
      this.log('INFO', 'PERFORMANCE TEST SUITE COMPLETED');
      this.log('INFO', '============================================================');
      this.log('INFO', '📊 SUMMARY:');
      this.log('INFO', `   Total Tests: ${summary.totalTests}`);
      this.log('INFO', `   ✅ Passed: ${summary.passedTests}`);
      this.log('INFO', `   ❌ Failed: ${summary.failedTests}`);
      this.log('INFO', `   ⚠️  Warnings: ${summary.warningTests}`);
      this.log('INFO', `   🎯 Performance Score: ${summary.performanceScore}%`);
      this.log('INFO', `   ⏱️  Duration: ${Math.round(duration/1000)}s`);

      if (summary.recommendations.length > 0) {
        this.log('INFO', '💡 RECOMMENDATIONS:');
        summary.recommendations.forEach(rec => {
          this.log('INFO', `   - ${rec}`);
        });
      }

      this.log('INFO', '============================================================');

      this.saveResults();

    } catch (error) {
      this.log('FAIL', `❌ Performance test suite failed: ${error.message}`);
    }
  }
}

// Run the test suite
if (require.main === module) {
  const testSuite = new CDA_Performance_TestSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = CDA_Performance_TestSuite;