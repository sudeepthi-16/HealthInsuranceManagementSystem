import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = `${environment.apiBaseUrl}/auth`;

  // AUTH STATE SIGNAL
  private tokenSignal = signal<string | null>(
    localStorage.getItem('token')
  );

  // DERIVED STATE
  // isLoggedIn = computed(() => !!this.tokenSignal());
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }
  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'Admin';
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // LOGIN
  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      data
    );
  }

  // REGISTER
  register(data: RegisterRequest) {
    return this.http.post(
      `${this.baseUrl}/register`,
      data,
      { responseType: 'text' }
    );
  }

  // SET TOKEN (CRITICAL)
  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSignal.set(token); // IMMEDIATE REACTIVITY
  }

  // LOGOUT
  logout() {
    localStorage.removeItem('token');
    this.tokenSignal.set(null);
    this.router.navigate(['/login']);
  }

  // JWT DECODING 
  getDecodedToken(): any | null {
    const token = this.tokenSignal();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return (
      decoded?.role ||
      decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      null
    );
  }

  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || decoded?.nameid || null;
  }

  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email || null;
  }
}
