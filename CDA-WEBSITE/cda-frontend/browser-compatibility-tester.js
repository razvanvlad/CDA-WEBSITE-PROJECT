#!/usr/bin/env node

/**
 * CDA Website Browser Compatibility Testing Framework
 * Analyzes code for browser compatibility issues and provides testing structure
 */

const fs = require('fs');
const path = require('path');

class BrowserCompatibilityAnalyzer {
  constructor() {
    this.compatibilityResults = {
      codeAnalysis: {
        css: {},
        javascript: {},
        html: {}
      },
      browserSupport: {
        chrome: { issues: [], score: 0 },
        firefox: { issues: [], score: 0 },
        safari: { issues: [], score: 0 },
        edge: { issues: [], score: 0 }
      },
      testMatrix: {},
      summary: {}
    };
    
    // Known compatibility issues database
    this.compatibilityRules = {
      css: {
        // CSS features that may have browser issues
        'writing-mode': {
          issue: 'writing-mode property support varies',
          browsers: ['safari'],
          severity: 'medium'
        },
        'text-orientation': {
          issue: 'text-orientation not fully supported in older browsers',
          browsers: ['safari', 'edge'],
          severity: 'medium'
        },
        'backdrop-filter': {
          issue: 'backdrop-filter not supported in Firefox < 103',
          browsers: ['firefox'],
          severity: 'high'
        },
        'gap': {
          issue: 'CSS Grid gap property issues in older browsers',
          browsers: ['safari'],
          severity: 'low'
        },
        'aspect-ratio': {
          issue: 'aspect-ratio not supported in older browsers',
          browsers: ['safari', 'firefox'],
          severity: 'medium'
        },
        'scroll-behavior': {
          issue: 'scroll-behavior: smooth not supported in Safari',
          browsers: ['safari'],
          severity: 'low'
        },
        'text-decoration-thickness': {
          issue: 'text-decoration-thickness limited browser support',
          browsers: ['safari', 'firefox'],
          severity: 'medium'
        }
      },
      javascript: {
        'optional-chaining': {
          issue: 'Optional chaining (?.) not supported in older browsers',
          browsers: ['safari', 'edge'],
          severity: 'high'
        },
        'nullish-coalescing': {
          issue: 'Nullish coalescing (??) not supported in older browsers',
          browsers: ['safari', 'edge'],
          severity: 'high'
        },
        'dynamic-imports': {
          issue: 'Dynamic imports may have issues in older browsers',
          browsers: ['safari'],
          severity: 'medium'
        },
        'intersection-observer': {
          issue: 'IntersectionObserver not supported in older browsers',
          browsers: ['safari'],
          severity: 'medium'
        }
      },
      html: {
        'loading-lazy': {
          issue: 'loading="lazy" not supported in Safari < 15.4',
          browsers: ['safari'],
          severity: 'medium'
        },
        'dialog': {
          issue: 'HTML dialog element not widely supported',
          browsers: ['safari', 'firefox'],
          severity: 'high'
        }
      }
    };
  }

  log(level, message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  // Analyze CSS files for compatibility issues
  async analyzeCSSCompatibility() {
    this.log('INFO', '🎨 Analyzing CSS compatibility...');
    
    const cssFiles = [
      'src/app/globals.css',
      'src/styles/global.css'
    ];

    for (const cssFile of cssFiles) {
      try {
        if (fs.existsSync(cssFile)) {
          const cssContent = fs.readFileSync(cssFile, 'utf8');
          
          // Check for compatibility issues
          Object.keys(this.compatibilityRules.css).forEach(property => {
            if (cssContent.includes(property)) {
              const rule = this.compatibilityRules.css[property];
              rule.browsers.forEach(browser => {
                this.compatibilityResults.browserSupport[browser].issues.push({
                  type: 'css',
                  property: property,
                  file: cssFile,
                  issue: rule.issue,
                  severity: rule.severity,
                  suggestion: this.getSuggestion('css', property)
                });
              });
            }
          });

          // Check for specific CDA CSS features
          this.checkSpecificCSSFeatures(cssContent, cssFile);
        }
      } catch (error) {
        this.log('ERROR', `Failed to analyze ${cssFile}: ${error.message}`);
      }
    }
  }

  checkSpecificCSSFeatures(cssContent, file) {
    // Check for vertical text (writing-mode)
    if (cssContent.includes('writing-mode: vertical-lr')) {
      ['safari', 'firefox'].forEach(browser => {
        this.compatibilityResults.browserSupport[browser].issues.push({
          type: 'css',
          property: 'writing-mode',
          file: file,
          issue: 'Vertical text rendering may be inconsistent',
          severity: 'medium',
          suggestion: 'Test vertical button text appearance'
        });
      });
    }

    // Check for custom underline thickness
    if (cssContent.includes('text-decoration-thickness')) {
      ['safari', 'firefox'].forEach(browser => {
        this.compatibilityResults.browserSupport[browser].issues.push({
          type: 'css',
          property: 'text-decoration-thickness',
          file: file,
          issue: 'Custom underline thickness may not render correctly',
          severity: 'medium',
          suggestion: 'Provide fallback for browsers without support'
        });
      });
    }

    // Check for CSS Grid gap usage
    if (cssContent.includes('gap:') || cssContent.includes('grid-gap:')) {
      ['safari'].forEach(browser => {
        this.compatibilityResults.browserSupport[browser].issues.push({
          type: 'css',
          property: 'gap',
          file: file,
          issue: 'CSS Grid gap property may have spacing issues in older Safari',
          severity: 'low',
          suggestion: 'Test grid layouts in Safari < 14'
        });
      });
    }
  }

  // Analyze JavaScript for compatibility issues
  async analyzeJSCompatibility() {
    this.log('INFO', '⚡ Analyzing JavaScript compatibility...');
    
    const jsFiles = this.findJSFiles('src');
    
    for (const jsFile of jsFiles) {
      try {
        const jsContent = fs.readFileSync(jsFile, 'utf8');
        
        // Check for modern JS features
        this.checkModernJSFeatures(jsContent, jsFile);
        
        // Check for API usage
        this.checkAPIUsage(jsContent, jsFile);
        
      } catch (error) {
        this.log('ERROR', `Failed to analyze ${jsFile}: ${error.message}`);
      }
    }
  }

  checkModernJSFeatures(jsContent, file) {
    // Check for optional chaining
    if (jsContent.includes('?.')) {
      ['safari', 'edge'].forEach(browser => {
        this.compatibilityResults.browserSupport[browser].issues.push({
          type: 'javascript',
          feature: 'optional-chaining',
          file: file,
          issue: 'Optional chaining not supported in older versions',
          severity: 'high',
          suggestion: 'Ensure Babel transpilation or add polyfills'
        });
      });
    }

    // Check for nullish coalescing
    if (jsContent.includes('??')) {
      ['safari', 'edge'].forEach(browser => {
        this.compatibilityResults.browserSupport[browser].issues.push({
          type: 'javascript',
          feature: 'nullish-coalescing',
          file: file,
          issue: 'Nullish coalescing operator not supported in older versions',
          severity: 'high',
          suggestion: 'Use logical OR (||) as fallback'
        });
      });
    }

    // Check for async/await
    if (jsContent.includes('async ') && jsContent.includes('await ')) {
      // Modern feature, generally well supported but note for older browsers
      this.compatibilityResults.browserSupport.safari.issues.push({
        type: 'javascript',
        feature: 'async-await',
        file: file,
        issue: 'Ensure async/await is properly transpiled for older Safari',
        severity: 'low',
        suggestion: 'Verify Babel configuration'
      });
    }
  }

  checkAPIUsage(jsContent, file) {
    // Check for Intersection Observer
    if (jsContent.includes('IntersectionObserver')) {
      ['safari'].forEach(browser => {
        this.compatibilityResults.browserSupport[browser].issues.push({
          type: 'javascript',
          feature: 'intersection-observer',
          file: file,
          issue: 'IntersectionObserver needs polyfill for older Safari',
          severity: 'medium',
          suggestion: 'Add IntersectionObserver polyfill'
        });
      });
    }

    // Check for fetch API
    if (jsContent.includes('fetch(')) {
      this.compatibilityResults.browserSupport.edge.issues.push({
        type: 'javascript',
        feature: 'fetch-api',
        file: file,
        issue: 'Fetch API may need polyfill for older Edge',
        severity: 'low',
        suggestion: 'Consider fetch polyfill for IE/older Edge'
      });
    }
  }

  findJSFiles(directory) {
    const jsFiles = [];
    
    function walkDir(dir) {
      try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            walkDir(filePath);
          } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
            jsFiles.push(filePath);
          }
        });
      } catch (error) {
        // Directory access error, skip
      }
    }
    
    walkDir(directory);
    return jsFiles.slice(0, 20); // Limit to first 20 files for analysis
  }

  getSuggestion(type, feature) {
    const suggestions = {
      css: {
        'writing-mode': 'Test vertical text rendering, consider CSS transforms as fallback',
        'text-decoration-thickness': 'Use border-bottom as fallback for custom underlines',
        'gap': 'Use margins as fallback for grid gaps',
        'backdrop-filter': 'Use solid background colors as fallback'
      },
      javascript: {
        'optional-chaining': 'Use logical operators or checks instead',
        'nullish-coalescing': 'Use logical OR operator as fallback'
      }
    };
    
    return suggestions[type]?.[feature] || 'Review browser support and add fallbacks';
  }

  // Generate browser compatibility matrix
  generateCompatibilityMatrix() {
    this.log('INFO', '📊 Generating compatibility matrix...');
    
    const matrix = {
      chrome: {
        version: '120+',
        support: 'Excellent',
        issues: [],
        score: 95,
        notes: 'Full support for all modern features'
      },
      firefox: {
        version: '115+', 
        support: 'Good',
        issues: [],
        score: 85,
        notes: 'Some CSS decoration features may vary'
      },
      safari: {
        version: '16+',
        support: 'Good with caveats',
        issues: [],
        score: 75,
        notes: 'Potential issues with vertical text and some CSS features'
      },
      edge: {
        version: '120+',
        support: 'Excellent', 
        issues: [],
        score: 90,
        notes: 'Chromium-based Edge has excellent compatibility'
      }
    };

    // Populate issues and adjust scores
    Object.keys(this.compatibilityResults.browserSupport).forEach(browser => {
      const browserData = this.compatibilityResults.browserSupport[browser];
      matrix[browser].issues = browserData.issues;
      
      // Adjust score based on issues
      let scoreDeduction = 0;
      browserData.issues.forEach(issue => {
        switch(issue.severity) {
          case 'high': scoreDeduction += 15; break;
          case 'medium': scoreDeduction += 8; break;
          case 'low': scoreDeduction += 3; break;
        }
      });
      
      matrix[browser].score = Math.max(60, matrix[browser].score - scoreDeduction);
    });

    this.compatibilityResults.testMatrix = matrix;
  }

  // Generate testing checklist
  generateTestingChecklist() {
    return {
      layout: [
        'Header navigation alignment and mobile menu functionality',
        'Vertical "Start A Project" button positioning and text orientation',
        'Service cards grid layout and responsive behavior',
        'Footer layout and link spacing',
        'Typography consistency (font rendering)',
        'Custom button hover states and animations'
      ],
      functionality: [
        'Mobile menu toggle functionality',
        'Booking modal open/close behavior', 
        'Form submissions and validation',
        'Navigation link highlighting and hover effects',
        'Scroll behavior and smooth scrolling',
        'Image loading and lazy loading (if implemented)'
      ],
      styling: [
        'Custom underline thickness and colors',
        'Button hover animations (icon transitions)',
        'Gradient backgrounds and color consistency',
        'Font rendering consistency across browsers',
        'Responsive breakpoint behavior',
        'Shadow and border rendering'
      ],
      javascript: [
        'GraphQL client functionality',
        'React hooks and state management',
        'Event handlers (clicks, scrolls, resizes)',
        'Error handling and fallbacks',
        'Dynamic content loading',
        'Browser console errors'
      ]
    };
  }

  // Create comprehensive test report
  async generateTestReport() {
    this.log('INFO', '📋 Generating comprehensive test report...');
    
    await this.analyzeCSSCompatibility();
    await this.analyzeJSCompatibility();
    this.generateCompatibilityMatrix();
    
    const testingChecklist = this.generateTestingChecklist();
    
    const report = {
      metadata: {
        title: 'CDA Website Browser Compatibility Analysis',
        generatedDate: new Date().toISOString(),
        siteUrl: 'http://localhost:3005',
        testingFramework: 'Static Code Analysis + Manual Testing Guide'
      },
      executiveSummary: {
        overallCompatibility: 'Good',
        primaryConcerns: [
          'Vertical text rendering (Safari/Firefox)',
          'Custom CSS decoration features',
          'Modern JavaScript feature support'
        ],
        recommendedMinimumVersions: {
          chrome: '90+',
          firefox: '90+', 
          safari: '14+',
          edge: '90+'
        }
      },
      browserMatrix: this.compatibilityResults.testMatrix,
      detailedIssues: this.compatibilityResults.browserSupport,
      testingChecklist: testingChecklist,
      manualTestingGuide: {
        setup: [
          '1. Ensure development server is running on localhost:3005',
          '2. Test in each browser with developer tools open',
          '3. Test both desktop and mobile viewports',
          '4. Check browser console for JavaScript errors'
        ],
        criticalTests: [
          'Vertical button text rendering and positioning',
          'Custom underline animations and thickness',
          'Mobile menu functionality across browsers',
          'Form validation and submission',
          'GraphQL data loading and error handling'
        ],
        performanceTests: [
          'Page load times in each browser',
          'JavaScript execution performance',
          'CSS rendering performance',
          'Memory usage during navigation'
        ]
      },
      recommendations: {
        immediate: [
          'Test vertical text button in Safari and Firefox',
          'Verify custom underline rendering across browsers',
          'Check mobile menu functionality in all browsers'
        ],
        improvements: [
          'Add CSS fallbacks for unsupported features',
          'Consider polyfills for older browser support',
          'Implement progressive enhancement patterns'
        ]
      }
    };

    // Save report
    fs.writeFileSync(
      'browser-compatibility-report.json', 
      JSON.stringify(report, null, 2)
    );
    
    this.log('INFO', '📄 Browser compatibility report saved to: browser-compatibility-report.json');
    
    return report;
  }

  // Display summary
  displaySummary() {
    const matrix = this.compatibilityResults.testMatrix;
    
    this.log('INFO', '============================================================');
    this.log('INFO', 'BROWSER COMPATIBILITY ANALYSIS COMPLETE');
    this.log('INFO', '============================================================');
    this.log('INFO', '📊 COMPATIBILITY SCORES:');
    
    Object.entries(matrix).forEach(([browser, data]) => {
      const status = data.score >= 90 ? '✅' : data.score >= 75 ? '⚠️' : '❌';
      this.log('INFO', `   ${status} ${browser.toUpperCase()}: ${data.score}% (${data.support})`);
      
      if (data.issues.length > 0) {
        this.log('INFO', `      Issues: ${data.issues.length} (${data.issues.filter(i => i.severity === 'high').length} high priority)`);
      }
    });
    
    this.log('INFO', '============================================================');
  }
}

// Run the analysis
if (require.main === module) {
  const analyzer = new BrowserCompatibilityAnalyzer();
  analyzer.generateTestReport().then(() => {
    analyzer.displaySummary();
  }).catch(console.error);
}

module.exports = BrowserCompatibilityAnalyzer;