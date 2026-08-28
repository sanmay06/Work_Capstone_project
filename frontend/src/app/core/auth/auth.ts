import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${API_BASE_URL}/auth`;

  currentRole = signal<string | null>(localStorage.getItem('role'));
  currentToken = signal<string | null>(localStorage.getItem('token'));
  currentUserId = signal<string | null>(localStorage.getItem('userId'));
  currentName = signal<string | null>(localStorage.getItem('name'));

  constructor(private http: HttpClient) {}

  private normalizedRole(): string | null {
    const role = this.currentRole();
    if (!role) {
      return null;
    }
    return role.replace('ROLE_', '').toUpperCase();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('name', response.name);
        this.currentToken.set(response.token);
        this.currentRole.set(response.role);
        this.currentUserId.set(response.userId);
        this.currentName.set(response.name);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentToken.set(null);
    this.currentRole.set(null);
    this.currentUserId.set(null);
    this.currentName.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentToken();
  }

  isStaffOrAdmin(): boolean {
    const role = this.normalizedRole();
    return role === 'STAFF' || role === 'ADMIN';
  }

  isAdmin(): boolean {
    return this.normalizedRole() === 'ADMIN';
  }

  isMember(): boolean {
    return this.normalizedRole() === 'MEMBER';
  }

  register(name: string, email: string, phone: string, address: string, password: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/members`, { name, email, phone, address, password });
  }
}