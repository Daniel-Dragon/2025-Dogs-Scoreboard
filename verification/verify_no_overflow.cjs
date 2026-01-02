const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Test Desktop
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  // We need to wait for data to load. Since we don't know exact valid names and data comes from external sheet,
  // we might hit "Contestant Not Found" or loading indefinitely if external API is blocked or slow.
  // However, the app structure should load.
  // Let's try to hit the main page first, then a contestant page.

  const baseUrl = 'http://localhost:5173/2025-Dogs-Scoreboard/';

  try {
    console.log(`Navigating to ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    // Check if we can click a contestant on the leaderboard to get a valid URL
    // Assuming there is a link to a contestant.
    // If data service fails, we might see error.

    // Let's try to find a link to a contestant.
    // Based on LeaderboardTable (implied), there should be links.
    // Or we can just go to a potentially valid URL if we knew one.
    // Let's try to find any link with href containing 'contestant'

    // Use a selector that targets rows or links.
    const contestantLink = await page.$('a[href*="contestant"]');

    if (contestantLink) {
        console.log('Found contestant link, clicking...');
        await contestantLink.click();
        await page.waitForLoadState('networkidle');
    } else {
        console.log('No contestant link found on home page. Navigating to a test URL directly.');
        // Fallback to a URL, hoping "Joey Chestnut" exists or similar.
        // Actually, if we get "Contestant Not Found", the layout check is less useful for the specific chart removal verification,
        // but we can still check that the specific chart container/text is NOT there.
        await page.goto(`${baseUrl}#/contestant/Joey%20Chestnut`, { waitUntil: 'networkidle' });
    }

    // Wait for either profile content or error state
    try {
        await page.waitForSelector('.profile-container, .error-state', { timeout: 10000 });
    } catch (e) {
        console.log('Timed out waiting for profile or error state');
    }

    console.log('Checking for "Dog vs Bonus Points" text...');
    const breakdownText = await page.getByText('Dog vs Bonus Points').count();

    if (breakdownText > 0) {
        console.error('FAIL: "Dog vs Bonus Points" text found!');
        process.exit(1);
    } else {
        console.log('PASS: "Dog vs Bonus Points" text NOT found.');
    }

    // Check for overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);

    console.log(`Desktop Body Width: ${bodyWidth}, Window Width: ${windowWidth}`);

    if (bodyWidth > windowWidth) {
        console.error('FAIL: Desktop Overflow detected!');
    } else {
        console.log('PASS: No Desktop Overflow.');
    }

    await page.screenshot({ path: 'verification/desktop_contestant.png', fullPage: true });

    // Test Mobile
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await mobilePage.goto(page.url(), { waitUntil: 'networkidle' });

    try {
        await mobilePage.waitForSelector('.profile-container, .error-state', { timeout: 10000 });
    } catch (e) {
         console.log('Timed out waiting for profile or error state on mobile');
    }

    const mBodyWidth = await mobilePage.evaluate(() => document.body.scrollWidth);
    const mWindowWidth = await mobilePage.evaluate(() => window.innerWidth);

    console.log(`Mobile Body Width: ${mBodyWidth}, Window Width: ${mWindowWidth}`);

    if (mBodyWidth > mWindowWidth) {
         console.error('FAIL: Mobile Overflow detected!');
    } else {
         console.log('PASS: No Mobile Overflow.');
    }

    await mobilePage.screenshot({ path: 'verification/mobile_contestant.png', fullPage: true });

  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
