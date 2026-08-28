import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category';
import { API_BASE_URL } from '../../core/api';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${API_BASE_URL}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  create(name: string, maxLoanDurationDays: number, depositRequired: boolean): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, { name, maxLoanDurationDays, depositRequired });
  }
}
