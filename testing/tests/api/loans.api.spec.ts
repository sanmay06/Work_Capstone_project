import { expect, test } from '@playwright/test';
import {
  authHeaders,
  createCategoryAndItemAsAdmin,
  createMemberAndToken,
  getAdminToken,
  uniqueSuffix,
} from './helpers/api-test-helpers';

test.describe('Loans API', () => {
  test('admin checkout and return flow updates loan and item state', async ({ request }) => {
    const adminToken = await getAdminToken();
    const { member } = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const checkoutResponse = await request.post('/api/loans/checkout', {
      headers: authHeaders(adminToken),
      data: {
        memberId: member.id,
        itemId: item.id,
        loanDurationDays: 10,
      },
    });

    expect(checkoutResponse.status()).toBe(200);
    const loan = await checkoutResponse.json();
    expect(loan.status).toBe('ACTIVE');

    const returnResponse = await request.put(`/api/loans/${loan.id}/return`, {
      headers: authHeaders(adminToken),
      data: {
        conditionAtReturn: 'GOOD',
      },
    });

    expect(returnResponse.status()).toBe(200);
    const returnedLoan = await returnResponse.json();
    expect(returnedLoan.status).toBe('RETURNED');

    const itemResponse = await request.get(`/api/items/${item.id}`);
    expect(itemResponse.status()).toBe(200);
    const updatedItem = await itemResponse.json();
    expect(updatedItem.status).toBe('AVAILABLE');
  });

  test('member cannot checkout items', async ({ request }) => {
    const adminToken = await getAdminToken();
    const { member, token: memberToken } = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const response = await request.post('/api/loans/checkout', {
      headers: authHeaders(memberToken),
      data: {
        memberId: member.id,
        itemId: item.id,
        loanDurationDays: 7,
      },
    });

    expect(response.status()).toBe(403);
  });
});
