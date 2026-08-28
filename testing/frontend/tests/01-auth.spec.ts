import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { RegisterPage } from '../pages/register.page.js';
import { generateRandomEmail, SEEDED_ADMIN } from '../utils/test-data.js';
import { AuthHelper } from '../utils/auth-helper.js';

test.describe('Suite 01: Authentication & User Onboarding', () => {

  test('1.1 Register a new member with valid details', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    const newEmail = generateRandomEmail('member');
    await registerPage.register({
      name: 'Alice Springs',
      email: newEmail,
      phone: '+15559998888',
      address: '777 Ocean Drive',
      password: 'password123'
    });

    await expect(registerPage.successMessage).toBeVisible();
    await expect(registerPage.successMessage).toContainText('Account created');
  });

  test('1.2 Client-side registration validation errors', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // Invalid phone number
    await registerPage.phoneInput.fill('invalid-phone-abc');
    await registerPage.phoneInput.blur();
    await expect(registerPage.fieldErrorMessages).toContainText('Phone must be 7-15 digits');

    // Short password
    await registerPage.passwordInput.fill('123');
    await registerPage.passwordInput.blur();
    await expect(registerPage.fieldErrorMessages).toContainText('Password must be at least 6 characters.');

    // Confirm submit button is disabled when form is invalid
    await expect(registerPage.submitButton).toBeDisabled();
  });

  test('1.3 Login with invalid credentials displays error banner', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('nonexistent.user@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email or password');
  });

  test('1.4 Login with seeded Admin user displays elevated navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(SEEDED_ADMIN.email, SEEDED_ADMIN.password);
    await expect(page).toHaveURL(/\/items/);
    await expect(loginPage.checkoutLink).toBeVisible();
    await expect(loginPage.manageCatalogLink).toBeVisible();
    await expect(loginPage.userRoleLabel).toContainText('ADMIN');
  });

  test('1.5 Session persistence and logout action', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(SEEDED_ADMIN.email, SEEDED_ADMIN.password);
    await expect(loginPage.logoutButton).toBeVisible();

    await loginPage.logout();
    await expect(loginPage.loginLink).toBeVisible();

    const storedToken = await AuthHelper.getStoredToken(page);
    expect(storedToken).toBeNull();
  });

});
