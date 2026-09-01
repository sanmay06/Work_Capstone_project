import { test, expect } from '@playwright/test';
import { FinePage } from '../pages/fine.page.js';
import { LoginPage } from '../pages/login.page.js';
import { SEEDED_ADMIN } from '../utils/test-data.js';

test.describe('Suite 04: Fines Management', () => {

  test('4.1 Unauthenticated navigation to /fines redirects to login', async ({ page }) => {
    await page.goto('/fines');
    await expect(page).toHaveURL(/\/login/);
  });

  test('4.2 Logged-in user can view fines list or empty message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(SEEDED_ADMIN.email, SEEDED_ADMIN.password);
    await expect(page).toHaveURL(/\/items$/);

    const finePage = new FinePage(page);
    await finePage.goto();
    await expect(page).toHaveURL(/\/fines$/);
    await expect(finePage.pageTitle).toBeVisible();

    const isListVisible = await finePage.finesList.isVisible().catch(() => false);
    const isEmptyVisible = await finePage.noFinesMessage.isVisible().catch(() => false);
    expect(isListVisible || isEmptyVisible).toBe(true);
  });

});
