#!/usr/bin/env node

/**
 * CDA Website Design Compliance Checker
 * Analyzes frontend output against design requirements
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const { performance } = require('perf_hooks');

// Design requirements and specifications
const DESIGN_REQUIREMENTS = {
  colors: {
    // Primary brand colors
    primary: {
      blue900: 'rgb(30, 58, 138)', // #1e3a8a
      blue800: 'rgb(30, 64, 175)', // #1e40af  
      blue700: 'rgb(29, 78, 216)', // #1d4ed8
      blue600: 'rgb(37, 99, 235)', // #2563eb
      blue500: 'rgb(59, 130, 246)', // #3b82f6
      blue400: 'rgb(96, 165, 250)', // #60a5fa
      blue200: 'rgb(191, 219, 254)', // #bfdbfe
      blue100: 'rgb(219, 234, 254)', // #dbeafe
      blue50: 'rgb(239, 246, 255)'   // #eff6ff
    },
    // Neutral colors
    neutral: {
      white: 'rgb(255, 255, 255)',    // #ffffff
      gray50: 'rgb(249, 250, 251)',   // #f9fafb
      gray100: 'rgb(243, 244, 246)',  // #f3f4f6
      gray200: 'rgb(229, 231, 235)',  // #e5e7eb
      gray300: 'rgb(209, 213, 219)',  // #d1d5db
      gray400: 'rgb(156, 163, 175)',  // #9ca3af
      gray500: 'rgb(107, 114, 128)',  // #6b7280
      gray600: 'rgb(75, 85, 99)',     // #4b5563
      gray700: 'rgb(55, 65, 81)',     // #374151
      gray800: 'rgb(31, 41, 55)',     // #1f2937
      gray900: 'rgb(17, 24, 39)',     // #111827
      black: 'rgb(0, 0, 0)'           // #000000
    },
    // Status colors
    status: {
      success: 'rgb(34, 197, 94)',    // #22c55e
      warning: 'rgb(245, 158, 11)',   // #f59e0b
      error: 'rgb(239, 68, 68)',      // #ef4444
      info: 'rgb(59, 130, 246)'       // #3b82f6
    }
  },
  typography: {
    // Font families
    fontFamilies: {
      primary: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Geist Mono', 'ui-monospace', 'monospace']
    },
    // Font sizes (in pixels for analysis)
    fontSize: {
      xs: '12px',      // 0.75rem
      sm: '14px',      // 0.875rem
      base: '16px',    // 1rem
      lg: '18px',      // 1.125rem
      xl: '20px',      // 1.25rem
      '2xl': '24px',   // 1.5rem
      '3xl': '30px',   // 1.875rem
      '4xl': '36px',   // 2.25rem
      '5xl': '48px',   // 3rem
      '6xl': '60px',   // 3.75rem
      '7xl': '72px',   // 4.5rem
      '8xl': '96px',   // 6rem
      '9xl': '128px'   // 8rem
    },
    // Font weights
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    // Line heights
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    }
  },
  spacing: {
    // Standard spacing scale (in pixels for analysis)
    scale: {
      '0': '0px',
      '1': '4px',      // 0.25rem
      '2': '8px',      // 0.5rem
      '3': '12px',     // 0.75rem
      '4': '16px',     // 1rem
      '5': '20px',     // 1.25rem
      '6': '24px',     // 1.5rem
      '8': '32px',     // 2rem
      '10': '40px',    // 2.5rem
      '12': '48px',    // 3rem
      '16': '64px',    // 4rem
      '20': '80px',    // 5rem
      '24': '96px',    // 6rem
      '32': '128px',   // 8rem
      '40': '160px',   // 10rem
      '48': '192px',   // 12rem
      '56': '224px',   // 14rem
      '64': '256px'    // 16rem
    }
  },
  components: {
    buttons: {
      primary: {
        backgroundColor: ['rgb(29, 78, 216)', 'rgb(37, 99, 235)'], // blue-700, blue-600
        color: 'rgb(255, 255, 255)',
        borderRadius: '8px', // rounded-lg
        padding: {
          x: ['24px', '32px'], // px-6, px-8
          y: ['12px', '16px']  // py-3, py-4
        }
      },
      secondary: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: ['rgb(209, 213, 219)', 'rgb(156, 163, 175)'], // gray-300, gray-400
        color: ['rgb(55, 65, 81)', 'rgb(31, 41, 55)'] // gray-700, gray-800
      }
    },
    cards: {
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: '8px', // rounded-lg
      boxShadow: ['0 1px 3px 0 rgba(0, 0, 0, 0.1)', '0 4px 6px -1px rgba(0, 0, 0, 0.1)'] // shadow-sm, shadow-md
    }
  },
  layout: {
    maxWidth: {
      container: '1280px', // max-w-7xl
      content: '768px'     // max-w-4xl
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  }
};

const TEST_CONFIG = {
  baseUrl: 'http://localhost:3005',
  routes: [
    '/',
    '/services',
    '/case-studies',
    '/team',
    '/about',
    '/contact'
  ]
};

class DesignComplianceChecker {
  constructor() {
    this.results = {
      typography: {},
      colors: {},
      spacing: {},
      components: {},
      layout: {},
      hoverStates: {},
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

  // HTTP request helper
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data
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

  // Parse CSS values from HTML content
  parseCSSValues(html) {
    const cssData = {
      colors: new Set(),
      fontSizes: new Set(),
      fontWeights: new Set(),
      fontFamilies: new Set(),
      spacing: new Set(),
      borderRadius: new Set()
    };

    // Extract inline styles
    const inlineStyleRegex = /style=["']([^"']*)["']/gi;
    let match;
    while ((match = inlineStyleRegex.exec(html)) !== null) {
      const styleContent = match[1];
      
      // Extract colors (rgb, hex, color names)
      const colorRegex = /(color|background-color|border-color):\s*([^;]+)/gi;
      let colorMatch;
      while ((colorMatch = colorRegex.exec(styleContent)) !== null) {
        cssData.colors.add(colorMatch[2].trim());
      }

      // Extract font sizes
      const fontSizeRegex = /font-size:\s*([^;]+)/gi;
      let fontSizeMatch;
      while ((fontSizeMatch = fontSizeRegex.exec(styleContent)) !== null) {
        cssData.fontSizes.add(fontSizeMatch[1].trim());
      }

      // Extract other properties
      const fontWeightRegex = /font-weight:\s*([^;]+)/gi;
      let fontWeightMatch;
      while ((fontWeightMatch = fontWeightRegex.exec(styleContent)) !== null) {
        cssData.fontWeights.add(fontWeightMatch[1].trim());
      }
    }

    // Extract Tailwind classes
    const classRegex = /class=["']([^"']*)["']/gi;
    while ((match = classRegex.exec(html)) !== null) {
      const classes = match[1].split(/\s+/);
      
      classes.forEach(cls => {
        // Color classes
        if (cls.match(/^(bg-|text-|border-)/)) {
          cssData.colors.add(cls);
        }
        
        // Font size classes
        if (cls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/)) {
          cssData.fontSizes.add(cls);
        }

        // Font weight classes
        if (cls.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/)) {
          cssData.fontWeights.add(cls);
        }

        // Spacing classes
        if (cls.match(/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-/)) {
          cssData.spacing.add(cls);
        }

        // Border radius classes
        if (cls.match(/^rounded/)) {
          cssData.borderRadius.add(cls);
        }
      });
    }

    return cssData;
  }

  // Test typography consistency
  async testTypography() {
    this.log('INFO', '📝 Testing typography consistency...');
    
    const typographyResults = {
      fontConsistency: { passed: 0, failed: 0, issues: [] },
      sizeHierarchy: { passed: 0, failed: 0, issues: [] },
      weightUsage: { passed: 0, failed: 0, issues: [] }
    };

    for (const route of TEST_CONFIG.routes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const response = await this.makeRequest(url);
        
        if (response.statusCode !== 200) {
          this.log('FAIL', `❌ FAIL: Typography Test - ${route} - Status: ${response.statusCode}`);
          continue;
        }

        const html = response.data;
        const cssData = this.parseCSSValues(html);

        // Check font family consistency
        const expectedFonts = DESIGN_REQUIREMENTS.typography.fontFamilies.primary;
        const fontFamilyRegex = /font-family:\s*([^;]+)/gi;
        let fontMatch;
        let foundInconsistentFonts = false;

        while ((fontMatch = fontFamilyRegex.exec(html)) !== null) {
          const fontFamily = fontMatch[1].trim();
          const isConsistent = expectedFonts.some(font => fontFamily.includes(font));
          
          if (!isConsistent) {
            typographyResults.fontConsistency.failed++;
            typographyResults.fontConsistency.issues.push(`${route}: Inconsistent font - ${fontFamily}`);
            foundInconsistentFonts = true;
          }
        }

        if (!foundInconsistentFonts) {
          typographyResults.fontConsistency.passed++;
        }

        // Check heading hierarchy (H1 should be largest, H6 smallest)
        const headingPattern = /<(h[1-6])[^>]*class=["']([^"']*)["'][^>]*>/gi;
        const headingSizes = {};
        let headingMatch;

        while ((headingMatch = headingPattern.exec(html)) !== null) {
          const headingLevel = headingMatch[1];
          const classes = headingMatch[2];
          
          // Extract text size from classes
          const sizeMatch = classes.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/);
          if (sizeMatch) {
            headingSizes[headingLevel] = sizeMatch[1];
          }
        }

        // Verify hierarchy
        const expectedOrder = ['9xl', '8xl', '7xl', '6xl', '5xl', '4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'];
        let hierarchyCorrect = true;

        for (let i = 1; i <= 6; i++) {
          const currentLevel = `h${i}`;
          const nextLevel = `h${i + 1}`;
          
          if (headingSizes[currentLevel] && headingSizes[nextLevel]) {
            const currentIndex = expectedOrder.indexOf(headingSizes[currentLevel]);
            const nextIndex = expectedOrder.indexOf(headingSizes[nextLevel]);
            
            if (currentIndex > nextIndex) {
              hierarchyCorrect = false;
              typographyResults.sizeHierarchy.issues.push(`${route}: ${currentLevel} (${headingSizes[currentLevel]}) should be larger than ${nextLevel} (${headingSizes[nextLevel]})`);
            }
          }
        }

        if (hierarchyCorrect) {
          typographyResults.sizeHierarchy.passed++;
        } else {
          typographyResults.sizeHierarchy.failed++;
        }

        this.log('PASS', `✅ PASS: Typography Test - ${route} - Basic consistency checked`);

      } catch (error) {
        this.log('FAIL', `❌ FAIL: Typography Test - ${route} - Error: ${error.message}`);
        typographyResults.fontConsistency.failed++;
        typographyResults.sizeHierarchy.failed++;
      }
    }

    this.results.typography = typographyResults;
    return typographyResults;
  }

  // Test color scheme accuracy
  async testColorScheme() {
    this.log('INFO', '🎨 Testing color scheme accuracy...');
    
    const colorResults = {
      brandColors: { passed: 0, failed: 0, issues: [] },
      consistency: { passed: 0, failed: 0, issues: [] },
      contrast: { passed: 0, failed: 0, issues: [] }
    };

    for (const route of TEST_CONFIG.routes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const response = await this.makeRequest(url);
        
        if (response.statusCode !== 200) continue;

        const html = response.data;
        const cssData = this.parseCSSValues(html);

        // Check for brand color usage
        const brandColorPatterns = [
          /bg-blue-[0-9]+/g,
          /text-blue-[0-9]+/g,
          /border-blue-[0-9]+/g
        ];

        let brandColorsFound = false;
        brandColorPatterns.forEach(pattern => {
          if (pattern.test(html)) {
            brandColorsFound = true;
          }
        });

        if (brandColorsFound) {
          colorResults.brandColors.passed++;
          this.log('PASS', `✅ PASS: Color Scheme - ${route} - Brand colors detected`);
        } else {
          colorResults.brandColors.failed++;
          colorResults.brandColors.issues.push(`${route}: No brand colors detected`);
          this.log('WARN', `⚠️ WARN: Color Scheme - ${route} - No brand colors detected`);
        }

        // Check for consistent color usage patterns
        const backgroundColors = Array.from(cssData.colors).filter(color => 
          color.includes('bg-') || color.includes('background-color')
        );
        
        if (backgroundColors.length > 0) {
          colorResults.consistency.passed++;
        } else {
          colorResults.consistency.failed++;
        }

      } catch (error) {
        this.log('FAIL', `❌ FAIL: Color Scheme Test - ${route} - Error: ${error.message}`);
        colorResults.brandColors.failed++;
      }
    }

    this.results.colors = colorResults;
    return colorResults;
  }

  // Test spacing and padding uniformity
  async testSpacing() {
    this.log('INFO', '📏 Testing spacing and padding uniformity...');
    
    const spacingResults = {
      consistency: { passed: 0, failed: 0, issues: [] },
      standardScale: { passed: 0, failed: 0, issues: [] }
    };

    for (const route of TEST_CONFIG.routes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const response = await this.makeRequest(url);
        
        if (response.statusCode !== 200) continue;

        const html = response.data;
        const cssData = this.parseCSSValues(html);

        // Check for Tailwind spacing classes
        const spacingClasses = Array.from(cssData.spacing);
        const standardSpacingPattern = /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64)$/;
        
        let standardSpacingUsed = false;
        let nonStandardSpacing = [];

        spacingClasses.forEach(cls => {
          if (standardSpacingPattern.test(cls)) {
            standardSpacingUsed = true;
          } else if (cls.match(/^(p|m)/)) {
            nonStandardSpacing.push(cls);
          }
        });

        if (standardSpacingUsed) {
          spacingResults.standardScale.passed++;
          this.log('PASS', `✅ PASS: Spacing - ${route} - Standard spacing scale used`);
        }

        if (nonStandardSpacing.length > 0) {
          spacingResults.standardScale.issues.push(`${route}: Non-standard spacing classes: ${nonStandardSpacing.join(', ')}`);
          this.log('WARN', `⚠️ WARN: Spacing - ${route} - Non-standard spacing: ${nonStandardSpacing.join(', ')}`);
        }

        spacingResults.consistency.passed++;

      } catch (error) {
        this.log('FAIL', `❌ FAIL: Spacing Test - ${route} - Error: ${error.message}`);
        spacingResults.consistency.failed++;
      }
    }

    this.results.spacing = spacingResults;
    return spacingResults;
  }

  // Test component alignment
  async testComponentAlignment() {
    this.log('INFO', '🧩 Testing component alignment and layout...');
    
    const alignmentResults = {
      layout: { passed: 0, failed: 0, issues: [] },
      responsive: { passed: 0, failed: 0, issues: [] },
      grid: { passed: 0, failed: 0, issues: [] }
    };

    for (const route of TEST_CONFIG.routes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const response = await this.makeRequest(url);
        
        if (response.statusCode !== 200) continue;

        const html = response.data;

        // Check for container usage
        const containerPattern = /(max-w-\w+|container)/g;
        const containerMatches = html.match(containerPattern) || [];
        
        if (containerMatches.length > 0) {
          alignmentResults.layout.passed++;
          this.log('PASS', `✅ PASS: Layout - ${route} - Container classes found`);
        } else {
          alignmentResults.layout.failed++;
          alignmentResults.layout.issues.push(`${route}: No container classes detected`);
        }

        // Check for grid/flexbox usage
        const gridFlexPattern = /(grid|flex|grid-cols|flex-col|flex-row)/g;
        const gridFlexMatches = html.match(gridFlexPattern) || [];
        
        if (gridFlexMatches.length > 0) {
          alignmentResults.grid.passed++;
          this.log('PASS', `✅ PASS: Grid/Flex - ${route} - Layout system used`);
        } else {
          alignmentResults.grid.failed++;
        }

        // Check for responsive classes
        const responsivePattern = /(sm:|md:|lg:|xl:|2xl:)/g;
        const responsiveMatches = html.match(responsivePattern) || [];
        
        if (responsiveMatches.length > 0) {
          alignmentResults.responsive.passed++;
          this.log('PASS', `✅ PASS: Responsive - ${route} - Responsive classes found`);
        } else {
          alignmentResults.responsive.failed++;
          alignmentResults.responsive.issues.push(`${route}: No responsive classes detected`);
        }

      } catch (error) {
        this.log('FAIL', `❌ FAIL: Component Alignment Test - ${route} - Error: ${error.message}`);
        alignmentResults.layout.failed++;
      }
    }

    this.results.components = alignmentResults;
    return alignmentResults;
  }

  // Test hover states
  async testHoverStates() {
    this.log('INFO', '👆 Testing hover states and interactive elements...');
    
    const hoverResults = {
      buttons: { passed: 0, failed: 0, issues: [] },
      links: { passed: 0, failed: 0, issues: [] },
      interactive: { passed: 0, failed: 0, issues: [] }
    };

    for (const route of TEST_CONFIG.routes) {
      try {
        const url = `${TEST_CONFIG.baseUrl}${route}`;
        const response = await this.makeRequest(url);
        
        if (response.statusCode !== 200) continue;

        const html = response.data;

        // Check for hover states on buttons
        const buttonHoverPattern = /hover:(bg-|text-|border-|shadow-)/g;
        const buttonHoverMatches = html.match(buttonHoverPattern) || [];
        
        if (buttonHoverMatches.length > 0) {
          hoverResults.buttons.passed++;
          this.log('PASS', `✅ PASS: Hover States - ${route} - Button hover effects found`);
        } else {
          hoverResults.buttons.failed++;
          hoverResults.buttons.issues.push(`${route}: No button hover states detected`);
        }

        // Check for link hover states
        const linkHoverPattern = /(<a[^>]*class=["'][^"']*hover:[^"']*["']|hover:underline)/g;
        const linkHoverMatches = html.match(linkHoverPattern) || [];
        
        if (linkHoverMatches.length > 0) {
          hoverResults.links.passed++;
          this.log('PASS', `✅ PASS: Hover States - ${route} - Link hover effects found`);
        } else {
          hoverResults.links.failed++;
        }

        // Check for focus states
        const focusPattern = /focus:(ring-|outline-|bg-)/g;
        const focusMatches = html.match(focusPattern) || [];
        
        if (focusMatches.length > 0) {
          hoverResults.interactive.passed++;
          this.log('PASS', `✅ PASS: Interactive States - ${route} - Focus states found`);
        } else {
          hoverResults.interactive.failed++;
        }

      } catch (error) {
        this.log('FAIL', `❌ FAIL: Hover States Test - ${route} - Error: ${error.message}`);
        hoverResults.buttons.failed++;
      }
    }

    this.results.hoverStates = hoverResults;
    return hoverResults;
  }

  // Generate summary and calculate compliance score
  generateSummary() {
    this.log('INFO', '📊 Generating design compliance summary...');
    
    const categories = ['typography', 'colors', 'spacing', 'components', 'hoverStates'];
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    const issues = [];

    categories.forEach(category => {
      const categoryData = this.results[category];
      if (categoryData) {
        Object.keys(categoryData).forEach(subcategory => {
          const subData = categoryData[subcategory];
          if (subData.passed !== undefined) {
            totalTests += subData.passed + subData.failed;
            totalPassed += subData.passed;
            totalFailed += subData.failed;
            
            if (subData.issues && subData.issues.length > 0) {
              issues.push(...subData.issues.map(issue => `${category}.${subcategory}: ${issue}`));
            }
          }
        });
      }
    });

    const complianceScore = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

    const summary = {
      totalTests,
      totalPassed,
      totalFailed,
      complianceScore,
      issues: issues.slice(0, 20), // Limit to top 20 issues
      recommendations: this.generateRecommendations()
    };

    this.results.summary = summary;
    return summary;
  }

  generateRecommendations() {
    const recommendations = [];

    // Typography recommendations
    if (this.results.typography?.fontConsistency?.failed > 0) {
      recommendations.push('Standardize font family usage across all components');
    }

    // Color recommendations  
    if (this.results.colors?.brandColors?.failed > 0) {
      recommendations.push('Implement consistent brand color usage throughout the site');
    }

    // Spacing recommendations
    if (this.results.spacing?.standardScale?.issues?.length > 0) {
      recommendations.push('Use standard Tailwind spacing scale for consistency');
    }

    // Interactive state recommendations
    if (this.results.hoverStates?.buttons?.failed > 0) {
      recommendations.push('Add hover and focus states to all interactive elements');
    }

    return recommendations;
  }

  // Save results to file
  saveResults() {
    const reportData = {
      timestamp: new Date().toISOString(),
      designRequirements: DESIGN_REQUIREMENTS,
      results: this.results,
      logs: this.logEntries
    };

    try {
      fs.writeFileSync('design-compliance-report.json', JSON.stringify(reportData, null, 2));
      this.log('INFO', '📄 Design compliance report saved to: design-compliance-report.json');
    } catch (error) {
      this.log('FAIL', `❌ Failed to save report: ${error.message}`);
    }
  }

  // Main test runner
  async runAllTests() {
    const startTime = performance.now();
    
    this.log('INFO', '============================================================');
    this.log('INFO', 'CDA WEBSITE DESIGN COMPLIANCE CHECKER');
    this.log('INFO', '============================================================');
    this.log('INFO', '🔍 Starting design compliance analysis...');

    try {
      await this.testTypography();
      await this.testColorScheme();
      await this.testSpacing();
      await this.testComponentAlignment();
      await this.testHoverStates();

      const summary = this.generateSummary();
      const duration = Math.round(performance.now() - startTime);

      this.log('INFO', '============================================================');
      this.log('INFO', 'DESIGN COMPLIANCE CHECK COMPLETED');
      this.log('INFO', '============================================================');
      this.log('INFO', '📊 SUMMARY:');
      this.log('INFO', `   Total Tests: ${summary.totalTests}`);
      this.log('INFO', `   ✅ Passed: ${summary.totalPassed}`);
      this.log('INFO', `   ❌ Failed: ${summary.totalFailed}`);
      this.log('INFO', `   🎯 Compliance Score: ${summary.complianceScore}%`);
      this.log('INFO', `   ⏱️  Duration: ${Math.round(duration/1000)}s`);

      if (summary.issues.length > 0) {
        this.log('INFO', '⚠️  TOP ISSUES:');
        summary.issues.slice(0, 10).forEach(issue => {
          this.log('INFO', `   - ${issue}`);
        });
      }

      if (summary.recommendations.length > 0) {
        this.log('INFO', '💡 RECOMMENDATIONS:');
        summary.recommendations.forEach(rec => {
          this.log('INFO', `   - ${rec}`);
        });
      }

      this.log('INFO', '============================================================');

      this.saveResults();

    } catch (error) {
      this.log('FAIL', `❌ Design compliance check failed: ${error.message}`);
    }
  }
}

// Run the checker
if (require.main === module) {
  const checker = new DesignComplianceChecker();
  checker.runAllTests().catch(console.error);
}

module.exports = DesignComplianceChecker;