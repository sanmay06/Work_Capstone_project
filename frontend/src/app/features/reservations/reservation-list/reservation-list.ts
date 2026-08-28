import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reservation } from '../reservation';
import { ItemService } from '../../catalog/item-list/item.service';
import { Item } from '../../catalog/item-list/item.model';
import { AuthService } from '../../../core/auth/auth';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/api';

interface MemberOption {
  id: string;
  name: string;
  status: string;
}

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reservation-list.html',
  styleUrl: './reservation-list.css'
})
export class ReservationList implements OnInit {
  memberId = localStorage.getItem('userId');

  reservations = signal<Reservation[]>([]);
  items = signal<Item[]>([]);
  loading = signal(true);
  submitMessage = signal<string | null>(null);
  submitError = signal<string | null>(null);
  reviewReservations = signal<Reservation[]>([]);
  reviewLoading = signal(false);
  reviewMessage = signal<string | null>(null);
  reviewError = signal<string | null>(null);
  reviewMembers = signal<MemberOption[]>([]);

  itemId = '';
  startDate = '';
  endDate = '';
  selectedReviewMemberId = '';

  private isItemReservable(item: Item): boolean {
    const availableFlag = (item as any).available;
    const statusValue = (item as any).status;

    if (typeof availableFlag === 'boolean') {
      return availableFlag;
    }

    if (typeof statusValue === 'string') {
      return statusValue.toUpperCase() === 'AVAILABLE';
    }

    return true;
  }

  constructor(
    private reservationService: ReservationService,
    private itemService: ItemService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  get isMember(): boolean {
    return this.authService.isMember();
  }

  get isStaffOrAdmin(): boolean {
    return this.authService.isStaffOrAdmin();
  }

  ngOnInit(): void {
    if (this.isMember && !this.memberId) {
      this.loading.set(false);
      return;
    }

    this.loadItems();

    if (this.isMember) {
      this.loadReservations();
    } else {
      this.loading.set(false);
    }

    if (this.isStaffOrAdmin) {
      this.loadReviewMembers();
      this.loadReviewReservations();
    }
  }

  loadReviewMembers(): void {
    this.http.get<MemberOption[]>(`${API_BASE_URL}/members`).subscribe({
      next: (data) => {
        const activeMembers = data.filter(m => m.status === 'ACTIVE');
        this.reviewMembers.set(activeMembers);

        // Fallback: preselect first active member so staff can load reservations even
        // when the all-reservations endpoint is unavailable for their role.
        if (!this.selectedReviewMemberId && activeMembers.length > 0) {
          this.selectedReviewMemberId = activeMembers[0].id;
        }
      },
      error: () => this.reviewMembers.set([])
    });
  }

  loadItems(): void {
    this.itemService.getAll().subscribe({
      next: (data) => this.items.set(data.filter(item => this.isItemReservable(item))),
      error: () => this.items.set([])
    });
  }

  loadReservations(): void {
    if (!this.memberId) {
      this.loading.set(false);
      return;
    }

    this.reservationService.getByMember(this.memberId).subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadReviewReservations(): void {
    this.reviewLoading.set(true);
    this.reviewError.set(null);
    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.reviewReservations.set(data);
        this.reviewLoading.set(false);
      },
      error: () => {
        this.reviewReservations.set([]);
        this.reviewError.set('Could not load all reservations. Trying member-based fallback...');
        this.reviewLoading.set(false);

        if (this.selectedReviewMemberId) {
          this.loadReviewReservationsByMember();
        }
      }
    });
  }

  loadReviewReservationsByMember(): void {
    if (!this.selectedReviewMemberId) {
      this.loadReviewReservations();
      return;
    }

    this.reviewLoading.set(true);
    this.reviewError.set(null);
    this.reservationService.getByMember(this.selectedReviewMemberId).subscribe({
      next: (data) => {
        this.reviewReservations.set(data);
        this.reviewLoading.set(false);
      },
      error: () => {
        this.reviewReservations.set([]);
        this.reviewError.set('Could not load reservations for selected member.');
        this.reviewLoading.set(false);
      }
    });
  }

  submitReservation(): void {
    if (!this.memberId || !this.itemId || !this.startDate || !this.endDate) {
      this.submitError.set('Please fill item, start date, and end date.');
      return;
    }

    this.submitError.set(null);
    this.submitMessage.set(null);

    this.reservationService.create({
      memberId: this.memberId,
      itemId: this.itemId,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: (reservation) => {
        this.submitMessage.set(`Reservation created: ${reservation.id}`);
        this.itemId = '';
        this.startDate = '';
        this.endDate = '';
        this.loadReservations();
        this.loadItems();
      },
      error: (err: any) => {
        this.submitError.set(err.error?.error || 'Failed to create reservation.');
      }
    });
  }

  cancel(id: string): void {
    this.reservationService.cancel(id).subscribe(() => {
      this.reservations.update(list =>
        list.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r)
      );
      if (this.isStaffOrAdmin) {
        this.reviewReservations.update(list =>
          list.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r)
        );
      }
      this.loadItems();
    });
  }

  approve(id: string): void {
    this.reviewMessage.set(null);
    this.reviewError.set(null);
    this.reservationService.approve(id).subscribe({
      next: () => {
        this.reviewMessage.set('Reservation approved.');
        this.reviewReservations.update(list =>
          list.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r)
        );
      },
      error: (err: any) => {
        this.reviewError.set(err.error?.error || 'Approval failed.');
      }
    });
  }

  decline(id: string): void {
    this.reviewMessage.set(null);
    this.reviewError.set(null);
    this.reservationService.decline(id).subscribe({
      next: () => {
        this.reviewMessage.set('Reservation declined.');
        this.reviewReservations.update(list =>
          list.map(r => r.id === id ? { ...r, status: 'DECLINED' } : r)
        );
      },
      error: (err: any) => {
        this.reviewError.set(err.error?.error || 'Decline failed.');
      }
    });
  }

}