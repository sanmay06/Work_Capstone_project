import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private baseUrl = `${API_BASE_URL}/staff`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(this.baseUrl);
  }
}