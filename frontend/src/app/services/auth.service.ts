import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);

  private readonly API_URL = 'http://localhost:5000/api/auth';

  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());
  role = computed(() => this.currentUser()?.role || null);
  isStudent = computed(() => this.currentUser()?.role === 'student');
  isRecruiter = computed(() => this.currentUser()?.role === 'recruiter');
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.loadInitialSession();
  }

  private loadInitialSession() {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('sb_auth_token');
      const savedUser = localStorage.getItem('sb_user');

      if (savedToken && savedUser) {
        try {
          this.token.set(savedToken);
          this.currentUser.set(JSON.parse(savedUser));
          this.fetchMe().subscribe();
        } catch (e) {
          this.clearSession();
        }
      }
    }
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((res) => {
        if (res.token && res.user) {
          this.setSession(res.token, res.user);
          this.toast.success(res.message || 'Account created successfully!');
          this.redirectByRole(res.user.role);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((res) => {
        if (res.token && res.user) {
          this.setSession(res.token, res.user);
          this.toast.success(res.message || 'Welcome back!');
          this.redirectByRole(res.user.role);
        }
      })
    );
  }

  fetchMe(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_URL}/me`).pipe(
      tap((res) => {
        if (res.data?.user) {
          this.currentUser.set(res.data.user);
          localStorage.setItem('sb_user', JSON.stringify(res.data.user));
        }
      }),
      catchError(() => of({ success: false }))
    );
  }

  logout() {
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      next: () => {},
      error: () => {},
    });
    this.clearSession();
    this.toast.info('You have been logged out.');
    this.router.navigate(['/login']);
  }

  updatePassword(passwords: { currentPassword: string; newPassword: string }): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/updatepassword`, passwords).pipe(
      tap((res) => {
        this.toast.success(res.message || 'Password changed successfully!');
      })
    );
  }

  updateDetails(details: { name?: string; email?: string; avatar?: string; headline?: string }): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/updatedetails`, details).pipe(
      tap((res) => {
        if (res.data?.user) {
          this.currentUser.set(res.data.user);
          localStorage.setItem('sb_user', JSON.stringify(res.data.user));
          this.toast.success(res.message || 'Account details updated successfully!');
        }
      })
    );
  }

  setAvatar(avatarUrl: string) {
    const user = this.currentUser();
    if (user) {
      const updated = { ...user, avatar: avatarUrl };
      this.currentUser.set(updated);
      localStorage.setItem('sb_user', JSON.stringify(updated));
    }
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/forgotpassword`, { email });
  }

  resetPassword(token: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/resetpassword/${token}`, { password }).pipe(
      tap((res) => {
        if (res.token && res.user) {
          this.setSession(res.token, res.user);
          this.toast.success('Password reset successfully!');
          this.redirectByRole(res.user.role);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_user', JSON.stringify(user));
    }
  }

  private setSession(token: string, user: User) {
    this.token.set(token);
    this.currentUser.set(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_auth_token', token);
      localStorage.setItem('sb_user', JSON.stringify(user));
    }
  }

  private clearSession() {
    this.token.set(null);
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb_auth_token');
      localStorage.removeItem('sb_user');
    }
  }

  redirectByRole(role: string) {
    if (role === 'recruiter') {
      this.router.navigate(['/recruiter/dashboard']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/student/dashboard']);
    }
  }
}
