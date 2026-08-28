import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ReservationPage extends BasePage {
  readonly pageTitle: Locator;
  readonly itemSelect: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly submitReservationButton: Locator;
  readonly submitSuccessMessage: Locator;
  readonly submitErrorMessage: Locator;
  readonly memberReservationsList: Locator;
  readonly memberReservationItems: Locator;
  readonly noReservationsMessage: Locator;

  // Staff/Admin Review Locators
  readonly reviewSection: Locator;
  readonly reviewReservationsList: Locator;
  readonly refreshReviewButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h2:has-text("My Reservations")');
    this.itemSelect = page.locator('select[name="itemId"]');
    this.startDateInput = page.locator('input[name="startDate"]');
    this.endDateInput = page.locator('input[name="endDate"]');
    this.submitReservationButton = page.locator('button:has-text("Reserve Item")');
    this.submitSuccessMessage = page.locator('.success');
    this.submitErrorMessage = page.locator('.error');
    this.memberReservationsList = page.locator('ul.list').first();
    this.memberReservationItems = page.locator('ul.list').first().locator('li');
    this.noReservationsMessage = page.locator('p:has-text("You have no reservations yet.")');

    this.reviewSection = page.locator('section.panel:has-text("Reservation Review")');
    this.reviewReservationsList = this.reviewSection.locator('ul.list');
    this.refreshReviewButton = this.reviewSection.locator('button:has-text("Refresh List")');
  }

  async goto(): Promise<void> {
    await this.page.goto('/reservations');
  }

  async createReservation(itemId: string, startDate: string, endDate: string): Promise<void> {
    await this.itemSelect.selectOption(itemId);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.submitReservationButton.click();
  }

  getMemberReservationCard(itemName: string): Locator {
    return this.memberReservationItems.filter({ hasText: itemName });
  }

  async cancelReservation(itemName: string): Promise<void> {
    const card = this.getMemberReservationCard(itemName);
    await card.locator('button:has-text("Cancel")').click();
  }

  async approveReservation(itemName: string): Promise<void> {
    const item = this.reviewReservationsList.locator('li').filter({ hasText: itemName });
    await item.locator('button:has-text("Approve")').click();
  }

  async declineReservation(itemName: string): Promise<void> {
    const item = this.reviewReservationsList.locator('li').filter({ hasText: itemName });
    await item.locator('button:has-text("Decline")').click();
  }
}
