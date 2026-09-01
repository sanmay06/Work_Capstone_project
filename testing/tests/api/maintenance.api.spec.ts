import { expect, test } from '@playwright/test';
import {
  authHeaders,
  createMemberAndToken,
  createCategoryAndItemAsAdmin,
  getAdminToken,
  uniqueSuffix,
} from './helpers/api-test-helpers';

test.describe('Maintenance API', () => {
  test('member cannot access maintenance list', async ({ request }) => {
    const { token: memberToken } = await createMemberAndToken(request);

    const response = await request.get('/api/maintenance', {
      headers: authHeaders(memberToken),
    });

    expect(response.status()).toBe(403);
  });

  test('member cannot create maintenance log', async ({ request }) => {
    const adminToken = await getAdminToken();
    const { token: memberToken } = await createMemberAndToken(request);
    const suffix = uniqueSuffix();
    const { item } = await createCategoryAndItemAsAdmin(request, adminToken, suffix);

    const response = await request.post('/api/maintenance', {
      headers: authHeaders(memberToken),
      data: {
        itemId: item.id,
        staffId: '77777777-7777-7777-7777-777777777777',
        notes: 'Attempt by member should be forbidden',
      },
    });

    expect(response.status()).toBe(403);
  });
});
