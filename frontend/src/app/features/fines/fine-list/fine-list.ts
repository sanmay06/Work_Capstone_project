import { Component, OnInit, signal } from '@angular/core';
import { FineService, Fine } from '../fine';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-fine-list',
  standalone: true,
  imports: [],
  templateUrl: './fine-list.html',
  styleUrl: './fine-list.css'
})
export class FineList implements OnInit {
  fines = signal<Fine[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(private fineService: FineService, public auth: AuthService) {}

  ngOnInit(): void {
    const memberId = localStorage.getItem('userId');
    const obs = memberId
      ? this.fineService.getByMember(memberId)
      : this.fineService.getAll();
    obs.subscribe({
      next: (data) => { this.fines.set(data); this.loading.set(false); },
      error: () => { this.errorMessage.set('Could not load fines.'); this.loading.set(false); }
    });
  }

  pay(id: string): void {
    this.fineService.markPaid(id).subscribe(() => {
      this.fines.update(list => list.map(f => f.id === id ? { ...f, paid: true, status: 'PAID' } : f));
    });
  }

  waive(id: string): void {
    this.fineService.waive(id).subscribe(() => {
      this.fines.update(list => list.map(f => f.id === id ? { ...f, status: 'WAIVED' } : f));
    });
  }
}