import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fine {
  id: string;
  memberId: string;
  amount: number;
  reason: string;
  paid: boolean;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class FineService {
  private apiUrl = 'http://localhost:8080/api/fines';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Fine[]> {
    return this.http.get<Fine[]>(this.apiUrl);
  }

  getByMember(memberId: string): Observable<Fine[]> {
    return this.http.get<Fine[]>(`${this.apiUrl}/member/${memberId}`);
  }

  markPaid(id: string): Observable<Fine> {
    return this.http.put<Fine>(`${this.apiUrl}/${id}/pay`, {});
  }

  waive(id: string): Observable<Fine> {
    return this.http.put<Fine>(`${this.apiUrl}/${id}/waive`, {});
  }
}
