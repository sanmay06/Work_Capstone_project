import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class FinePage extends BasePage {
  readonly pageTitle: Locator;
  readonly finesList: Locator;
  readonly fineItems: Locator;
  readonly noFinesMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h2:has-text("My Fines")');
    this.finesList = page.locator('ul.list');
    this.fineItems = page.locator('ul.list > li');
    this.noFinesMessage = page.locator('p:has-text("No fines on your account.")');
    this.errorMessage = page.locator('.error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/fines');
  }

  getFineItemByReason(reason: string): Locator {
    return this.fineItems.filter({ hasText: reason });
  }

  async payFine(reason: string): Promise<void> {
    const item = this.getFineItemByReason(reason);
    await item.locator('button:has-text("Mark Paid")').click();
  }

  async waiveFine(reason: string): Promise<void> {
    const item = this.getFineItemByReason(reason);
    await item.locator('button:has-text("Waive")').click();
  }
}
