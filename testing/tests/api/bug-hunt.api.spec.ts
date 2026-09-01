import { expect, test } from '@playwright/test';
import {
  authHeaders,
  createCategoryAndItemAsAdmin,
  createMemberAndToken,
  getAdminToken,
  uniqueSuffix,
} from './helpers/api-test-helpers';

test.describe('Bug Hunt API Scenarios', () => {
  test('unauthenticated users should not read catalog endpoints', async ({ request }) => {
    const itemsResponse = await request.get('/api/items');
    const categoriesResponse = await request.get('/api/categories');

    expect([401, 403]).toContain(itemsResponse.status());
    expect([401, 403]).toContain(categoriesResponse.status());
  });

  test('member should not create reservation for another member', async ({ request }) => {
    const adminToken = await getAdminToken();
    const requester = await createMemberAndToken(request);
    const otherMember = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const response = await request.post('/api/reservations', {
      headers: authHeaders(requester.token),
      data: {
        memberId: otherMember.member.id,
        itemId: item.id,
        startDate: '2033-02-01',
        endDate: '2033-02-05',
      },
    });

    // Expected behavior: requester should only be allowed to reserve for self.
    expect(response.status()).toBe(403);
  });

  test('member should not view another member reservations', async ({ request }) => {
    const adminToken = await getAdminToken();
    const requester = await createMemberAndToken(request);
    const otherMember = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const reservationCreate = await request.post('/api/reservations', {
      headers: authHeaders(otherMember.token),
      data: {
        memberId: otherMember.member.id,
        itemId: item.id,
        startDate: '2034-02-01',
        endDate: '2034-02-04',
      },
    });
    expect(reservationCreate.status()).toBe(200);

    const response = await request.get(`/api/reservations/member/${otherMember.member.id}`, {
      headers: authHeaders(requester.token),
    });

    expect(response.status()).toBe(403);
  });

  test('member should not view another member loans', async ({ request }) => {
    const adminToken = await getAdminToken();
    const requester = await createMemberAndToken(request);
    const otherMember = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const checkout = await request.post('/api/loans/checkout', {
      headers: authHeaders(adminToken),
      data: {
        memberId: otherMember.member.id,
        itemId: item.id,
        loanDurationDays: 7,
      },
    });
    expect(checkout.status()).toBe(200);

    const response = await request.get(`/api/loans/member/${otherMember.member.id}`, {
      headers: authHeaders(requester.token),
    });

    expect(response.status()).toBe(403);
  });

  test('loan should not be returnable twice', async ({ request }) => {
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

    const firstReturn = await request.put(`/api/loans/${loan.id}/return`, {
      headers: authHeaders(adminToken),
      data: {
        conditionAtReturn: 'GOOD',
      },
    });
    expect(firstReturn.status()).toBe(200);

    const secondReturn = await request.put(`/api/loans/${loan.id}/return`, {
      headers: authHeaders(adminToken),
      data: {
        conditionAtReturn: 'GOOD',
      },
    });

    // Expected behavior: second return should be rejected as invalid state.
    expect(secondReturn.status()).toBe(409);
  });

  test('paying an existing fine should not error with 500', async ({ request }) => {
    const adminToken = await getAdminToken();

    const response = await request.put('/api/fines/55555555-5555-5555-5555-555555555555/pay', {
      headers: authHeaders(adminToken),
    });

    // Expected behavior: either success or domain/client error, but never 500.
    expect(response.status()).not.toBe(500);
  });

  test('invalid content type should be rejected with 400/415, not 500', async ({ request }) => {
    const response = await request.post('/api/members', {
      headers: {
        'Content-Type': 'text/plain',
      },
      data: 'name=plain-text-body',
    });

    expect([400, 415]).toContain(response.status());
  });
});
