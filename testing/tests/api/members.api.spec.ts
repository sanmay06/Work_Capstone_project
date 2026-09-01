import { expect, test } from '@playwright/test';
import { authHeaders, createMemberAndToken, uniqueSuffix } from './helpers/api-test-helpers';

test.describe('Members API', () => {
  test('member registration and login flow works', async ({ request }) => {
    const { member, email, password } = await createMemberAndToken(request);
    expect(member.id).toBeTruthy();
    expect(member.email).toBe(email);

    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email,
        password,
      },
    });

    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    expect(loginBody.role).toBe('MEMBER');
    expect(loginBody.token).toBeTruthy();
  });

  test('validation errors return 400 with fields map', async ({ request }) => {
    const response = await request.post('/api/members', {
      data: {
        name: '',
        email: 'not-an-email',
        phone: 'abc',
        address: 'x',
        password: '1',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation failed');
    expect(body.fields).toBeTruthy();
    expect(body.fields.email).toBeTruthy();
  });

  test('validation boundaries accept minimum and maximum valid values', async ({ request }) => {
    const suffix = uniqueSuffix();
    const response = await request.post('/api/members', {
      data: {
        name: 'Ab',
        email: `minmax.${suffix}@example.com`,
        phone: '+1234567',
        address: 'A'.repeat(255),
        password: '123456',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Ab');
    expect(body.email).toBe(`minmax.${suffix}@example.com`);

    const maxLengthResponse = await request.post('/api/members', {
      data: {
        name: 'A'.repeat(100),
        email: `maxlen.${suffix}@example.com`,
        phone: '123456789012345',
        address: 'B'.repeat(255),
        password: 'B'.repeat(100),
      },
    });

    expect(maxLengthResponse.status()).toBe(200);
    const maxBody = await maxLengthResponse.json();
    expect(maxBody.name).toHaveLength(100);
    expect(maxBody.password).toBeUndefined();
  });

  test('validation rejects out-of-range names, phone numbers, and passwords', async ({ request }) => {
    const suffix = uniqueSuffix();
    const invalidCases = [
      {
        name: 'A',
        email: `short-name.${suffix}@example.com`,
        phone: '+123456',
        address: 'Short address',
        password: '123456',
      },
      {
        name: 'B'.repeat(101),
        email: `long-name.${suffix}@example.com`,
        phone: '+1234567890123456',
        address: 'Long address',
        password: '123456',
      },
      {
        name: 'Correct Name',
        email: `bad-phone.${suffix}@example.com`,
        phone: 'abc-def',
        address: 'Bad phone',
        password: '12345',
      },
    ];

    for (const payload of invalidCases) {
      const response = await request.post('/api/members', { data: payload });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Validation failed');
      expect(body.fields).toBeTruthy();
    }
  });

  test('login rejects blank email and password with 400 validation error', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: '',
        password: '',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation failed');
    expect(body.fields).toBeTruthy();
    expect(body.fields.email || body.fields.password).toBeTruthy();
  });

  test('phone with too many digits is rejected by validation', async ({ request }) => {
    const response = await request.post('/api/members', {
      data: {
        name: 'Phone Too Long',
        email: `phone.long.${uniqueSuffix()}@example.com`,
        phone: '+1234567890123456',
        address: 'Test address',
        password: 'memberpass123',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation failed');
    expect(body.fields.phone).toContain('7-15 digits');
  });

  test('member cannot access admin-only staff endpoints', async ({ request }) => {
    const { token } = await createMemberAndToken(request);

    const response = await request.get('/api/staff', {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(403);
  });

  test('duplicate email registration is rejected', async ({ request }) => {
    const suffix = uniqueSuffix();
    const email = `pw.dup.${suffix}@example.com`;
    const payload = {
      name: 'Duplicate Email User',
      email,
      phone: '+12345678901',
      address: 'Playwright Street 2',
      password: 'memberpass123',
    };

    const first = await request.post('/api/members', { data: payload });
    expect(first.status()).toBe(200);

    const second = await request.post('/api/members', { data: payload });
    expect(second.status()).toBe(409);
    const body = await second.json();
    expect(String(body.error)).toContain('Email already registered');
  });

  test('two users can register with the same name and different emails', async ({ request }) => {
    const suffix = uniqueSuffix();
    const sharedName = `Same Name ${suffix}`;

    const first = await request.post('/api/members', {
      data: {
        name: sharedName,
        email: `pw.same1.${suffix}@example.com`,
        phone: '+12345678902',
        address: 'Address 1',
        password: 'memberpass123',
      },
    });
    expect(first.status()).toBe(200);
    const firstBody = await first.json();

    const second = await request.post('/api/members', {
      data: {
        name: sharedName,
        email: `pw.same2.${suffix}@example.com`,
        phone: '+12345678903',
        address: 'Address 2',
        password: 'memberpass123',
      },
    });
    expect(second.status()).toBe(200);
    const secondBody = await second.json();

    expect(firstBody.name).toBe(sharedName);
    expect(secondBody.name).toBe(sharedName);
    expect(firstBody.id).not.toBe(secondBody.id);
    expect(firstBody.email).not.toBe(secondBody.email);
  });
});
