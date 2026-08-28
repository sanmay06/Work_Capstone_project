import { Page } from '@playwright/test';
import { FRONTEND_URL } from './test-data.js';

export interface SessionData {
  token: string;
  role: string;
  userId: string;
  name: string;
}

export class AuthHelper {
  static async injectSession(page: Page, session: SessionData): Promise<void> {
    await page.goto(FRONTEND_URL);
    await page.evaluate((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('name', data.name);
    }, session);
    await page.reload();
  }

  static async clearSession(page: Page): Promise<void> {
    await page.goto(FRONTEND_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  }

  static async getStoredToken(page: Page): Promise<string | null> {
    return page.evaluate(() => localStorage.getItem('token'));
  }
}
