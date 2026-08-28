import { test, expect } from '@playwright/test';
import { ManageCatalogPage } from '../pages/manage-catalog.page.js';
import { ApiSeeder } from '../utils/api-seeder.js';
import { AuthHelper } from '../utils/auth-helper.js';
import { generateRandomAssetTag } from '../utils/test-data.js';

test.describe('Suite 06: Admin Catalog Management', () => {

  test('6.1 Unauthenticated navigation to /admin/catalog redirects to login', async ({ page }) => {
    await page.goto('/admin/catalog');
    await expect(page).toHaveURL(/\/login/);
  });

  test('6.2 Admin creates a new category via UI form', async ({ page, request }) => {
    const seeder = new ApiSeeder(request);
    const adminSession = await seeder.loginAsAdmin();

    await AuthHelper.injectSession(page, adminSession);
    const managePage = new ManageCatalogPage(page);
    await managePage.goto();

    const categoryName = `Audio Gear ${Date.now()}`;
    await managePage.createCategory(categoryName, 10, true);

    await expect(managePage.categoryResultMessage).toBeVisible();
    await expect(managePage.categoryResultMessage).toContainText('Category created');
    await expect(managePage.categoryItems.filter({ hasText: categoryName })).toBeVisible();
  });

  test('6.3 Admin creates a new item under existing category', async ({ page, request }) => {
    const seeder = new ApiSeeder(request);
    const adminSession = await seeder.loginAsAdmin();

    // Create a category via API first
    const category = await seeder.createCategory(adminSession.token, {
      name: `Cameras ${Date.now()}`,
      maxLoanDurationDays: 7,
      depositRequired: false
    });

    await AuthHelper.injectSession(page, adminSession);
    const managePage = new ManageCatalogPage(page);
    await managePage.goto();

    const itemName = `Sony Mirrorless Camera ${Date.now()}`;
    const assetTag = generateRandomAssetTag('CAM');

    await managePage.createItem(itemName, '4K Professional Camera Body', category.id, assetTag);

    await expect(managePage.itemResultMessage).toBeVisible();
    await expect(managePage.itemResultMessage).toContainText('Item created');
    await expect(managePage.catalogItems.filter({ hasText: itemName })).toBeVisible();
  });

});
