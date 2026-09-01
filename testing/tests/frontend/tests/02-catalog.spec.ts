import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page.js';
import { LoginPage } from '../pages/login.page.js';
import { SEEDED_ADMIN } from '../utils/test-data.js';

test.describe('Suite 02: Item Catalog Browsing', () => {

  test('2.1 Unauthenticated navigation to /items redirects to login via authGuard', async ({ page }) => {
    await page.goto('/items');
    await expect(page).toHaveURL(/\/login/);
  });

  test('2.2 Logged-in user can view catalog page header and items list', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(SEEDED_ADMIN.email, SEEDED_ADMIN.password);
    await expect(page).toHaveURL(/\/items$/);

    const catalogPage = new CatalogPage(page);
    await expect(catalogPage.pageTitle).toBeVisible();

    const isGridVisible = await catalogPage.itemCards.first().isVisible().catch(() => false);
    const isEmptyVisible = await catalogPage.emptyMessage.isVisible().catch(() => false);
    expect(isGridVisible || isEmptyVisible).toBe(true);
  });

});
