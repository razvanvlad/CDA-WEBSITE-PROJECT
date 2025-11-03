// tests/visual/utils.js
const fs = require('fs-extra');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

// Take screenshot of a specific element (not full page)
async function captureElement(page, selector, outputPath) {
  await page.waitForSelector(selector, { timeout: 5000 });

  // Get element bounding box
  const element = await page.$(selector);
  const clip = await element.boundingBox();

  if (!clip) throw new Error(`Element ${selector} not found`);

  // Take screenshot of just that element
  await page.screenshot({
    path: outputPath,
    clip,
    fullPage: false
  });

  console.log(`✅ Captured: ${outputPath}`);
}

// Compare two images and generate diff
async function compareImages(expectedPath, actualPath, diffPath) {
  const expected = PNG.sync.read(fs.readFileSync(expectedPath));
  const actual = PNG.sync.read(fs.readFileSync(actualPath));

  // Create diff image
  const { width, height } = expected;
  const diff = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 } // 0.1 = very strict, 0.2 = more tolerant
  );

  // Save diff only if there are mismatches
  if (mismatchedPixels > 0) {
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    console.log(`⚠️  ${mismatchedPixels} pixels differ. Diff saved: ${diffPath}`);
  } else {
    console.log('✅ Perfect match!');
  }

  return mismatchedPixels;
}

module.exports = { captureElement, compareImages };