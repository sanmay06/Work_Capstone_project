import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout.page.js';
import { ApiSeeder } from '../utils/api-seeder.js';
import { AuthHelper } from '../utils/auth-helper.js';

test.describe('Suite 05: Staff Checkout & Returns Workflow', () => {

  test('5.1 Unauthenticated navigation to /staff/checkout redirects to login', async ({ page }) => {
    await page.goto('/staff/checkout');
    await expect(page).toHaveURL(/\/login/);
  });

  test('5.2 Staff can view checkout panels and active loans table', async ({ page, request }) => {
    const seeder = new ApiSeeder(request);
    const adminSession = await seeder.loginAsAdmin();

    await AuthHelper.injectSession(page, adminSession);
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();

    await expect(checkoutPage.pageTitle).toBeVisible();
    await expect(checkoutPage.checkoutButton).toBeVisible();
    await expect(checkoutPage.returnButton).toBeVisible();
  });

});
