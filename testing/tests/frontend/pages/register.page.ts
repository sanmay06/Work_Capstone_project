import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly fieldErrorMessages: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.addressInput = page.locator('input[name="address"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error');
    this.successMessage = page.locator('.success');
    this.fieldErrorMessages = page.locator('.field-error');
    this.loginLink = page.locator('a[href="/login"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone !== undefined) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.address !== undefined) {
      await this.addressInput.fill(data.address);
    }
    await this.passwordInput.fill(data.password);
    await this.submitButton.click();
  }
}
