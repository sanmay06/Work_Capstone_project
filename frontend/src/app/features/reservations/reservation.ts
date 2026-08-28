import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api';

export interface Reservation {
  id: string;
  member: { id: string; name: string };
  item: { id: string; name: string };
  startDate: string;
  endDate: string;
  status: string;
}

export interface ReservationRequest {
  memberId: string;
  itemId: string;
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = `${API_BASE_URL}/reservations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  create(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, request);
  }

  cancel(id: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/cancel`, {});
  }

  approve(id: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/approve`, {});
  }

  decline(id: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/decline`, {});
  }

  getByMember(memberId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/member/${memberId}`);
  }
}
