import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoanService, Loan } from '../loan';
import { ItemService } from '../../catalog/item-list/item.service';
import { Item } from '../../catalog/item-list/item.model';
import { AuthService } from '../../../core/auth/auth';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/api';

interface MemberOption {
  id: string;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  private loanService = inject(LoanService);
  private itemService = inject(ItemService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  memberId = '';
  itemId = '';
  loanDurationDays = 7;
  checkoutResult = signal<string | null>(null);
  checkoutError = signal<string | null>(null);

  returnLoanId = '';
  conditionAtReturn = 'GOOD';
  returnResult = signal<string | null>(null);
  returnError = signal<string | null>(null);

  activeLoans = signal<Loan[]>([]);
  loansLoading = signal(true);
  items = signal<Item[]>([]);
  members = signal<MemberOption[]>([]);

  ngOnInit(): void {
    if (this.authService.currentRole() === 'MEMBER') {
      this.memberId = this.authService.currentUserId() ?? '';
    }

    this.loadMembers();
    this.loadActiveLoans();
    this.itemService.getAll().subscribe({
      next: (data) => this.items.set(data),
      error: () => {}
    });
  }

  loadMembers(): void {
    this.http.get<MemberOption[]>(`${API_BASE_URL}/members`).subscribe({
      next: (data) => this.members.set(data.filter(m => m.status === 'ACTIVE')),
      error: () => this.members.set([])
    });
  }

  loadActiveLoans(): void {
    this.loansLoading.set(true);
    this.loanService.getActive().subscribe({
      next: (loans) => { this.activeLoans.set(loans); this.loansLoading.set(false); },
      error: () => this.loansLoading.set(false)
    });
  }

  submitCheckout(): void {
    this.checkoutError.set(null);
    this.checkoutResult.set(null);
    this.loanService.checkout(this.memberId, this.itemId, this.loanDurationDays).subscribe({
      next: (loan: Loan) => {
        this.checkoutResult.set(`Checked out - Loan ID: ${loan.id}, due ${loan.dueDate}`);
        this.loadActiveLoans();
        this.itemService.getAll().subscribe(data => this.items.set(data));
      },
      error: (err: any) => this.checkoutError.set(err.error?.error || 'Checkout failed.')
    });
  }

  submitReturn(): void {
    this.returnError.set(null);
    this.returnResult.set(null);
    this.loanService.returnItem(this.returnLoanId, this.conditionAtReturn).subscribe({
      next: () => {
        this.returnResult.set('Item returned successfully.');
        this.returnLoanId = '';
        this.loadActiveLoans();
        this.itemService.getAll().subscribe(data => this.items.set(data));
      },
      error: (err: any) => this.returnError.set(err.error?.error || 'Return failed.')
    });
  }
}