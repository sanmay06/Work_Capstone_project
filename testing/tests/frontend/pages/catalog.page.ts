import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CatalogPage extends BasePage {
  readonly pageTitle: Locator;
  readonly loadingMessage: Locator;
  readonly errorMessage: Locator;
  readonly emptyMessage: Locator;
  readonly itemCards: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h2:has-text("Item Catalog")');
    this.loadingMessage = page.locator('p:has-text("Loading...")');
    this.errorMessage = page.locator('.error');
    this.emptyMessage = page.locator('p:has-text("No items in the catalog yet.")');
    this.itemCards = page.locator('.grid .card');
  }

  async goto(): Promise<void> {
    await this.page.goto('/items');
  }

  getItemCardByName(name: string): Locator {
    return this.itemCards.filter({ hasText: name });
  }
}
