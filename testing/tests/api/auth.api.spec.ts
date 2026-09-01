import { expect, test } from '@playwright/test';
import { adminEmail, adminPassword } from './helpers/api-test-helpers';

test.describe('Auth API', () => {
  test('auth login returns JWT for admin', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(body.role).toBe('ADMIN');
    expect(body.userId).toBeTruthy();
  });

  test('protected endpoint rejects unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/members');
    expect(response.status()).toBe(403);
  });

  test('login fails with wrong password', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: adminEmail,
        password: 'wrong-password',
      },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(String(body.error)).toContain('Invalid email or password');
  });

  test('protected endpoint rejects malformed token', async ({ request }) => {
    const response = await request.get('/api/members', {
      headers: {
        Authorization: 'Bearer not-a-valid-jwt',
      },
    });

    expect(response.status()).toBe(403);
  });

  test('protected endpoint rejects empty bearer token', async ({ request }) => {
    const response = await request.get('/api/members', {
      headers: {
        Authorization: 'Bearer ',
      },
    });

    expect(response.status()).toBe(403);
  });

  test('protected endpoint rejects token with wrong auth scheme', async ({ request }) => {
    const response = await request.get('/api/members', {
      headers: {
        Authorization: 'Token abc.def.ghi',
      },
    });

    expect(response.status()).toBe(403);
  });

  test('tampered token cannot access protected endpoint', async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    });
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    const validToken = String(loginBody.token);

    const tamperedToken = `${validToken}tampered`;
    const protectedResponse = await request.get('/api/members', {
      headers: {
        Authorization: `Bearer ${tamperedToken}`,
      },
    });

    expect(protectedResponse.status()).toBe(403);
  });
});
