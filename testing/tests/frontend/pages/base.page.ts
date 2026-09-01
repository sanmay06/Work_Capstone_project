import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly brandTitle: Locator;
  readonly catalogLink: Locator;
  readonly reservationsLink: Locator;
  readonly finesLink: Locator;
  readonly checkoutLink: Locator;
  readonly manageCatalogLink: Locator;
  readonly loginLink: Locator;
  readonly userRoleLabel: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('nav.navbar');
    this.brandTitle = page.locator('.brand');
    this.catalogLink = page.locator('a[href="/items"]');
    this.reservationsLink = page.locator('a[href="/reservations"]');
    this.finesLink = page.locator('a[href="/fines"]');
    this.checkoutLink = page.locator('a[href="/staff/checkout"]');
    this.manageCatalogLink = page.locator('a[href="/admin/catalog"]');
    this.loginLink = page.locator('a[href="/login"]');
    this.userRoleLabel = page.locator('.role');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async navigateToCatalog(): Promise<void> {
    await this.catalogLink.click();
  }

  async navigateToReservations(): Promise<void> {
    await this.reservationsLink.click();
  }

  async navigateToFines(): Promise<void> {
    await this.finesLink.click();
  }

  async navigateToCheckout(): Promise<void> {
    await this.checkoutLink.click();
  }

  async navigateToManageCatalog(): Promise<void> {
    await this.manageCatalogLink.click();
  }
}
