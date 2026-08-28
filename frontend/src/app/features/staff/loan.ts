import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api';

export interface Loan {
  id: string;
  member: { id: string; name: string };
  item: { id: string; name: string };
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private apiUrl = `${API_BASE_URL}/loans`;

  constructor(private http: HttpClient) {}

  checkout(memberId: string, itemId: string, loanDurationDays: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/checkout`, { memberId, itemId, loanDurationDays });
  }

  returnItem(loanId: string, conditionAtReturn: string): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${loanId}/return`, { conditionAtReturn });
  }

  getOverdue(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/overdue`);
  }

  getActive(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/active`);
  }
}