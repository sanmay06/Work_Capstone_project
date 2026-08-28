import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest } from './reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

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
