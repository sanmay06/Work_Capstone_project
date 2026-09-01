import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CheckoutPage extends BasePage {
  readonly pageTitle: Locator;
  readonly memberSelect: Locator;
  readonly memberInput: Locator;
  readonly itemSelect: Locator;
  readonly loanDurationInput: Locator;
  readonly checkoutButton: Locator;
  readonly checkoutSuccessMessage: Locator;
  readonly checkoutErrorMessage: Locator;

  readonly returnLoanSelect: Locator;
  readonly returnLoanInput: Locator;
  readonly conditionSelect: Locator;
  readonly returnButton: Locator;
  readonly returnSuccessMessage: Locator;
  readonly returnErrorMessage: Locator;

  readonly activeLoansTable: Locator;
  readonly activeLoanRows: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h2:has-text("Staff - Checkout / Return")');
    this.memberSelect = page.locator('select[name="memberId"]');
    this.memberInput = page.locator('input[name="memberId"]');
    this.itemSelect = page.locator('select[name="itemId"]');
    this.loanDurationInput = page.locator('input[name="loanDurationDays"]');
    this.checkoutButton = page.locator('button:has-text("Checkout")');
    this.checkoutSuccessMessage = page.locator('.panel:has-text("Checkout Item") .success');
    this.checkoutErrorMessage = page.locator('.panel:has-text("Checkout Item") .error');

    this.returnLoanSelect = page.locator('select[name="returnLoanId"]');
    this.returnLoanInput = page.locator('input[name="returnLoanId"]');
    this.conditionSelect = page.locator('select[name="conditionAtReturn"]');
    this.returnButton = page.locator('button:has-text("Return Item")');
    this.returnSuccessMessage = page.locator('.panel:has-text("Return Item") .success');
    this.returnErrorMessage = page.locator('.panel:has-text("Return Item") .error');

    this.activeLoansTable = page.locator('table');
    this.activeLoanRows = page.locator('table tbody tr');
  }

  async goto(): Promise<void> {
    await this.page.goto('/staff/checkout');
  }

  async checkoutItem(memberIdOrIndex: string, itemId: string, durationDays: number = 7): Promise<void> {
    if (await this.memberSelect.isVisible()) {
      await this.memberSelect.selectOption(memberIdOrIndex);
    } else {
      await this.memberInput.fill(memberIdOrIndex);
    }
    await this.itemSelect.selectOption(itemId);
    await this.loanDurationInput.fill(durationDays.toString());
    await this.checkoutButton.click();
  }

  async returnItem(loanIdOrOption: string, condition: 'GOOD' | 'FAIR' | 'DAMAGED' = 'GOOD'): Promise<void> {
    if (await this.returnLoanSelect.isVisible()) {
      await this.returnLoanSelect.selectOption(loanIdOrOption);
    } else {
      await this.returnLoanInput.fill(loanIdOrOption);
    }
    await this.conditionSelect.selectOption(condition);
    await this.returnButton.click();
  }
}
