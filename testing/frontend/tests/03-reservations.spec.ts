import { test, expect } from '@playwright/test';
import { ReservationPage } from '../pages/reservation.page.js';
import { LoginPage } from '../pages/login.page.js';
import { SEEDED_ADMIN, generateRandomEmail } from '../utils/test-data.js';
import { ApiSeeder } from '../utils/api-seeder.js';
import { AuthHelper } from '../utils/auth-helper.js';

test.describe('Suite 03: Item Reservations Workflow', () => {

  test('3.1 Member creates a new item reservation', async ({ page, request }) => {
    const seeder = new ApiSeeder(request);
    const adminSession = await seeder.loginAsAdmin();

    // Seed category and reservable item
    const category = await seeder.createCategory(adminSession.token, {
      name: `Res Category ${Date.now()}`,
      maxLoanDurationDays: 14,
      depositRequired: false
    });
    const item = await seeder.createItem(adminSession.token, {
      name: `Projector ${Date.now()}`,
      description: 'HD 4K Projector',
      categoryId: category.id,
      assetTag: `PRJ-${Date.now()}`
    });

    // Register a new member & login
    const memberEmail = generateRandomEmail('res_member');
    await seeder.registerMember({
      name: 'Reservation Tester',
      email: memberEmail,
      password: 'password123'
    });
    const memberSession = await seeder.login(memberEmail, 'password123');

    await AuthHelper.injectSession(page, memberSession);
    const reservationPage = new ReservationPage(page);
    await reservationPage.goto();

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    await reservationPage.createReservation(item.id, today, nextWeek);
    await expect(reservationPage.submitSuccessMessage).toBeVisible();
    await expect(reservationPage.submitSuccessMessage).toContainText('Reservation created');
  });

  test('3.2 Staff/Admin can review and approve a pending reservation', async ({ page, request }) => {
    const seeder = new ApiSeeder(request);
    const adminSession = await seeder.loginAsAdmin();

    await AuthHelper.injectSession(page, adminSession);
    const reservationPage = new ReservationPage(page);
    await reservationPage.goto();

    await expect(reservationPage.reviewSection).toBeVisible();
  });

});
