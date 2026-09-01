import { expect, test } from '@playwright/test';
import {
  authHeaders,
  createMemberAndToken,
  getAdminToken,
} from './helpers/api-test-helpers';

test.describe('Fines API', () => {
  test('fine validation rejects zero amount with 400', async ({ request }) => {
    const adminToken = await getAdminToken();
    const createFineResponse = await request.post('/api/fines', {
      headers: authHeaders(adminToken),
      data: {
        loanId: '44444444-4444-4444-4444-444444444444',
        amount: 0,
        reason: 'INVALID_AMOUNT_TEST',
      },
    });

    expect(createFineResponse.status()).toBe(400);
    const body = await createFineResponse.json();
    expect(body.error).toBe('Validation failed');
    expect(body.fields.amount).toContain('greater than 0');
  });

  test('member cannot apply a fine', async ({ request }) => {
    const { token: memberToken } = await createMemberAndToken(request);

    const response = await request.post('/api/fines', {
      headers: authHeaders(memberToken),
      data: {
        loanId: '44444444-4444-4444-4444-444444444444',
        amount: 10,
        reason: 'MEMBER_SHOULD_NOT_APPLY',
      },
    });

    expect(response.status()).toBe(403);
  });

  test('member cannot pay a fine', async ({ request }) => {
    const { token: memberToken } = await createMemberAndToken(request);

    const response = await request.put('/api/fines/55555555-5555-5555-5555-555555555555/pay', {
      headers: authHeaders(memberToken),
    });

    expect(response.status()).toBe(403);
  });
});
