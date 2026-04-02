import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Playwright home page', () => {
  test('should display the correct title', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.expectTitleContains('Playwright');
  });

  test('should navigate to Get Started page', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.clickGetStarted();
    await homePage.expectInstallationHeadingVisible();
  });
});