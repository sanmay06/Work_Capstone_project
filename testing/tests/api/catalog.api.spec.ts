import { expect, test } from '@playwright/test';
import {
  authHeaders,
  createMemberAndToken,
  createCategoryAndItemAsAdmin,
  getAdminToken,
  uniqueSuffix,
} from './helpers/api-test-helpers';

test.describe('Catalog API', () => {
  test('public endpoints return data', async ({ request }) => {
    const itemsResponse = await request.get('/api/items');
    expect(itemsResponse.status()).toBe(200);
    const items = await itemsResponse.json();
    expect(Array.isArray(items)).toBeTruthy();

    const categoriesResponse = await request.get('/api/categories');
    expect(categoriesResponse.status()).toBe(200);
    const categories = await categoriesResponse.json();
    expect(Array.isArray(categories)).toBeTruthy();
  });

  test('admin can create category and item', async ({ request }) => {
    const token = await getAdminToken();
    const suffix = uniqueSuffix();
    const { category, item } = await createCategoryAndItemAsAdmin(request, token, suffix);

    expect(category.id).toBeTruthy();
    expect(item.id).toBeTruthy();
    expect(item.assetTag).toBe(`PW-ASSET-${suffix}`);
  });

  test('member cannot create categories or items', async ({ request }) => {
    const { token: memberToken } = await createMemberAndToken(request);
    const suffix = uniqueSuffix();

    const categoryResponse = await request.post('/api/categories', {
      headers: authHeaders(memberToken),
      data: {
        name: `Forbidden Category ${suffix}`,
        maxLoanDurationDays: 7,
        depositRequired: false,
      },
    });
    expect(categoryResponse.status()).toBe(403);

    const itemResponse = await request.post('/api/items', {
      headers: authHeaders(memberToken),
      data: {
        name: `Forbidden Item ${suffix}`,
        description: 'Should fail for member',
        categoryId: '22222222-2222-2222-2222-222222222222',
        assetTag: `FORBIDDEN-ASSET-${suffix}`,
      },
    });
    expect(itemResponse.status()).toBe(403);
  });
});
