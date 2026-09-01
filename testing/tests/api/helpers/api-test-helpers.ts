import { APIRequestContext, expect, request as playwrightRequest } from '@playwright/test';

export const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
export const adminPassword = process.env.ADMIN_PASSWORD || 'adminpass123';
export const apiBaseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:8080';

export function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

export function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function login(baseURL: string, email: string, password: string): Promise<any> {
  const apiContext = await playwrightRequest.newContext({ baseURL });
  const response = await apiContext.post('/api/auth/login', {
    data: { email, password },
  });

  expect(response.ok(), `Login failed for ${email}`).toBeTruthy();
  const body = await response.json();
  await apiContext.dispose();
  return body;
}

export async function getAdminToken(baseURL: string = apiBaseUrl): Promise<string> {
  const loginBody = await login(baseURL, adminEmail, adminPassword);
  return loginBody.token as string;
}

export async function createMemberAndToken(requestContext: APIRequestContext) {
  const suffix = uniqueSuffix();
  const email = `pw.member.${suffix}@example.com`;
  const password = 'memberpass123';

  const registerResponse = await requestContext.post('/api/members', {
    data: {
      name: `Playwright Member ${suffix}`,
      email,
      phone: '+12345678901',
      address: 'Playwright Street 1',
      password,
    },
  });

  expect(registerResponse.status()).toBe(200);
  const member = await registerResponse.json();
  const loginBody = await login(apiBaseUrl, email, password);

  return {
    member,
    token: loginBody.token as string,
    email,
    password,
  };
}

export async function createCategoryAndItemAsAdmin(
  requestContext: APIRequestContext,
  token: string,
  suffix: string
) {
  const createCategoryResponse = await requestContext.post('/api/categories', {
    headers: authHeaders(token),
    data: {
      name: `Playwright Category ${suffix}`,
      maxLoanDurationDays: 7,
      depositRequired: false,
    },
  });

  expect(createCategoryResponse.status()).toBe(200);
  const category = await createCategoryResponse.json();

  const createItemResponse = await requestContext.post('/api/items', {
    headers: authHeaders(token),
    data: {
      name: `Playwright Item ${suffix}`,
      description: 'Created by API test',
      categoryId: category.id,
      assetTag: `PW-ASSET-${suffix}`,
    },
  });

  expect(createItemResponse.status()).toBe(200);
  const item = await createItemResponse.json();

  return { category, item };
}
