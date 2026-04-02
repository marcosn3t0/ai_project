import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly getStartedLink: Locator;
  private readonly installationHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.installationHeading = page.getByRole('heading', { name: 'Installation' });
  }

  async open(): Promise<void> {
    await this.goto('https://playwright.dev/');
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  async expectTitleContains(expectedText: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedText));
  }

  async expectInstallationHeadingVisible(): Promise<void> {
    await expect(this.installationHeading).toBeVisible();
  }
}