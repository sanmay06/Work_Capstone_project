import { expect, test } from '@playwright/test';
import {
  authHeaders,
  createCategoryAndItemAsAdmin,
  createMemberAndToken,
  getAdminToken,
  uniqueSuffix,
} from './helpers/api-test-helpers';

test.describe('Reservations API', () => {
  test('member can create reservation, admin can approve it', async ({ request }) => {
    const adminToken = await getAdminToken();
    const { member, token: memberToken } = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const reservationResponse = await request.post('/api/reservations', {
      headers: authHeaders(memberToken),
      data: {
        memberId: member.id,
        itemId: item.id,
        startDate: '2030-01-10',
        endDate: '2030-01-12',
      },
    });

    expect(reservationResponse.status()).toBe(200);
    const reservation = await reservationResponse.json();
    expect(reservation.status).toBe('PENDING');

    const approveResponse = await request.put(`/api/reservations/${reservation.id}/approve`, {
      headers: authHeaders(adminToken),
    });

    expect(approveResponse.status()).toBe(200);
    const approved = await approveResponse.json();
    expect(approved.status).toBe('APPROVED');
  });

  test('overlapping reservations return 409 conflict', async ({ request }) => {
    const adminToken = await getAdminToken();
    const { member, token: memberToken } = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const firstReservation = await request.post('/api/reservations', {
      headers: authHeaders(memberToken),
      data: {
        memberId: member.id,
        itemId: item.id,
        startDate: '2031-03-01',
        endDate: '2031-03-10',
      },
    });
    expect(firstReservation.status()).toBe(200);

    const overlappingReservation = await request.post('/api/reservations', {
      headers: authHeaders(memberToken),
      data: {
        memberId: member.id,
        itemId: item.id,
        startDate: '2031-03-05',
        endDate: '2031-03-12',
      },
    });

    expect(overlappingReservation.status()).toBe(409);
    const body = await overlappingReservation.json();
    expect(String(body.error)).toContain('overlapping');
  });

  test('member cannot approve reservations', async ({ request }) => {
    const adminToken = await getAdminToken();
    const { member, token: memberToken } = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const reservationResponse = await request.post('/api/reservations', {
      headers: authHeaders(memberToken),
      data: {
        memberId: member.id,
        itemId: item.id,
        startDate: '2032-01-10',
        endDate: '2032-01-12',
      },
    });
    expect(reservationResponse.status()).toBe(200);
    const reservation = await reservationResponse.json();

    const forbiddenApprove = await request.put(`/api/reservations/${reservation.id}/approve`, {
      headers: authHeaders(memberToken),
    });
    expect(forbiddenApprove.status()).toBe(403);
  });
});
