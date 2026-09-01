import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ManageCatalogPage extends BasePage {
  readonly pageTitle: Locator;
  readonly categoryNameInput: Locator;
  readonly maxLoanDurationInput: Locator;
  readonly depositRequiredCheckbox: Locator;
  readonly createCategoryButton: Locator;
  readonly categoryResultMessage: Locator;
  readonly categoryItems: Locator;

  readonly itemNameInput: Locator;
  readonly itemDescriptionInput: Locator;
  readonly itemCategorySelect: Locator;
  readonly itemAssetTagInput: Locator;
  readonly createItemButton: Locator;
  readonly itemResultMessage: Locator;
  readonly catalogItems: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h2:has-text("Manage Catalog")');

    // Category section
    this.categoryNameInput = page.locator('input[name="categoryName"]');
    this.maxLoanDurationInput = page.locator('input[name="maxLoanDurationDays"]');
    this.depositRequiredCheckbox = page.locator('input[name="depositRequired"]');
    this.createCategoryButton = page.locator('button:has-text("Create Category")');
    this.categoryResultMessage = page.locator('.panel:has-text("New Category") p');
    this.categoryItems = page.locator('.panel:has-text("New Category") ul li');

    // Item section
    this.itemNameInput = page.locator('input[name="itemName"]');
    this.itemDescriptionInput = page.locator('input[name="itemDescription"]');
    this.itemCategorySelect = page.locator('select[name="itemCategoryId"]');
    this.itemAssetTagInput = page.locator('input[name="itemAssetTag"]');
    this.createItemButton = page.locator('button:has-text("Create Item")');
    this.itemResultMessage = page.locator('.panel:has-text("New Item") p');
    this.catalogItems = page.locator('.panel:has-text("New Item") ul li');
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/catalog');
  }

  async createCategory(name: string, maxDurationDays: number = 7, depositRequired: boolean = false): Promise<void> {
    await this.categoryNameInput.fill(name);
    await this.maxLoanDurationInput.fill(maxDurationDays.toString());
    if (depositRequired) {
      await this.depositRequiredCheckbox.check();
    } else {
      await this.depositRequiredCheckbox.uncheck();
    }
    await this.createCategoryButton.click();
  }

  async createItem(name: string, description: string, categoryId: string, assetTag: string): Promise<void> {
    await this.itemNameInput.fill(name);
    await this.itemDescriptionInput.fill(description);
    await this.itemCategorySelect.selectOption(categoryId);
    await this.itemAssetTagInput.fill(assetTag);
    await this.createItemButton.click();
  }
}
