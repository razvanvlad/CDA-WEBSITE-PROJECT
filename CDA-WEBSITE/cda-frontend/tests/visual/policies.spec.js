// tests/visual/policies.spec.js
const { chromium } = require('playwright');
const { captureElement, compareImages } = require('./utils');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '../../screenshots');

// ✅ Desktop test
async function testPoliciesDesktop() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Use standard desktop size
    await page.goto(`${BASE_URL}/policies`, { waitUntil: 'networkidle' });

    // Capture only the policies section element
    const implPath = path.join(SCREENSHOTS_DIR, 'implementation', 'policies-listing-desktop.png');
    await captureElement(page, '.policies-section', implPath); // 👈 This captures only the section

    const expectedPath = path.join(SCREENSHOTS_DIR, 'xd-designs', 'policies-listing-desktop.png');
    const diffPath = path.join(SCREENSHOTS_DIR, 'diffs', 'policies-listing-desktop.png');
    const mismatches = await compareImages(expectedPath, implPath, diffPath);

    if (mismatches > 0) {
      console.log('❌ Desktop visual test failed - check diffs folder');
      process.exit(1);
    }
  } catch (error) {
    console.error('🚨 Desktop test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// ✅ Mobile test — MUST be defined BEFORE it's called
async function testPoliciesMobile() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/policies`, { waitUntil: 'networkidle' });

    const implPath = path.join(SCREENSHOTS_DIR, 'implementation', 'policies-listing-mobile.png');
    await captureElement(page, '.policies-section', implPath);

    const expectedPath = path.join(SCREENSHOTS_DIR, 'xd-designs', 'policies-listing-mobile.png');
    const diffPath = path.join(SCREENSHOTS_DIR, 'diffs', 'policies-listing-mobile.png');
    const mismatches = await compareImages(expectedPath, implPath, diffPath);

    if (mismatches > 0) {
      console.log('❌ Mobile visual test failed - check diffs folder');
      process.exit(1);
    }
  } catch (error) {
    console.error('🚨 Mobile test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// ✅ Run both tests (mobile function is now defined above)
(async () => {
  console.log('🚀 Starting Policies Visual Tests...');
  await testPoliciesDesktop();
  await testPoliciesMobile(); // ✅ Now defined
  console.log('✅ All Policies Visual Tests Passed!');
})();