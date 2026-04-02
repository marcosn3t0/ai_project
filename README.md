# Goal

The goal is to use CHAT GPT prompts to refactor Playwright project

## Prompt used

Given you're a Senior QA engineer and you need to improve the architecture of a Playwright project making it modular, scalable with good practices and using page objects as design pattners: 

Here's the code you need to refactor: legacy\tests\example.spec.ts: 

```bash
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

## Chat GPT' suggestion

Here’s a cleaner, scalable way to refactor that Playwright project using **Page Object Model (POM)** and better test architecture.

---

### Problems in the legacy version

The current test file works, but it has a few issues for long-term maintenance:

- navigation URL is repeated
- selectors live inside the test
- test logic and page behavior are mixed together
- hard to scale when more pages/features are added
- poor reusability

A better structure is to separate:

- tests
- page objects
- base/shared page behavior
- test data / config if needed later

---

## Suggested folder structure

```bash
project-root/
├── pages/
│   ├── BasePage.ts
│   └── HomePage.ts
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
└── package.json
´´´

### Refactored solution

pages/BasePage.ts

This class centralizes shared behavior.

´´´bash
import { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
´´´

pages/HomePage.ts

´´´bash
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
´´´

tests/example.spec.ts

´´´bash
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
´´´

Why this is better

1. Better separation of concerns

The test says what is being validated.
The page object knows how to interact with the page.

2. Easier maintenance

If the selector for Get started changes, you update it only in HomePage.ts.

3. More scalable

When the project grows:

each page gets its own class
shared behavior stays in BasePage
