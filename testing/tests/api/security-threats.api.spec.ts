import { expect, test } from '@playwright/test';
import { authHeaders, getAdminToken, uniqueSuffix } from './helpers/api-test-helpers';

test.describe('Security Threat Scenarios', () => {
  test('SQL injection attempt on login is rejected', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: "admin@example.com' OR '1'='1",
        password: "anything' OR '1'='1",
      },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(String(body.error)).toContain('Invalid email or password');
  });

  test('SQL injection-like search input does not crash endpoint', async ({ request }) => {
    const response = await request.get("/api/items/search?name=' OR 1=1 --");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('mass-assignment fields are ignored on member registration', async ({ request }) => {
    const suffix = uniqueSuffix();
    const response = await request.post('/api/members', {
      data: {
        name: `Security User ${suffix}`,
        email: `security.user.${suffix}@example.com`,
        phone: '+12345678901',
        address: 'Security Street',
        password: 'memberpass123',
        status: 'SUSPENDED',
        role: 'ADMIN',
        joinDate: '2099-01-01',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ACTIVE');
  });

  test('oversized registration payload is handled with validation error', async ({ request }) => {
    const suffix = uniqueSuffix();
    const hugeName = 'A'.repeat(20000);
    const hugeAddress = 'B'.repeat(20000);
    const hugePassword = 'C'.repeat(5000);

    const response = await request.post('/api/members', {
      data: {
        name: hugeName,
        email: `huge.payload.${suffix}@example.com`,
        phone: '+12345678901',
        address: hugeAddress,
        password: hugePassword,
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation failed');
  });

  test('very long query string does not produce 500', async ({ request }) => {
    const longQuery = 'X'.repeat(12000);
    const response = await request.get(`/api/items/search?name=${longQuery}`);

    expect(response.status()).not.toBe(500);
  });

  test('invalid content type on member registration is rejected safely', async ({ request }) => {
    const response = await request.post('/api/members', {
      headers: {
        'Content-Type': 'text/plain',
      },
      data: 'name=plain-text-body',
    });

    expect([400, 415]).toContain(response.status());
  });

  test('SQL injection-like token cannot access admin endpoint', async ({ request }) => {
    const adminToken = await getAdminToken();

    const validCheck = await request.get('/api/staff', {
      headers: authHeaders(adminToken),
    });
    expect(validCheck.status()).toBe(200);

    const injectedTokenAttempt = await request.get('/api/staff', {
      headers: {
        Authorization: "Bearer ' OR '1'='1",
      },
    });

    expect(injectedTokenAttempt.status()).toBe(403);
  });
});
