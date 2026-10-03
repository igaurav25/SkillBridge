import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Check localStorage directly in case page just refreshed
  if (typeof window !== 'undefined' && localStorage.getItem('sb_auth_token')) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn() && (!localStorage.getItem('sb_auth_token'))) {
    return true;
  }

  const role = authService.role() || (localStorage.getItem('sb_user') ? JSON.parse(localStorage.getItem('sb_user')!).role : 'student');
  authService.redirectByRole(role);
  return false;
};

export const studentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isStudent() || authService.isAdmin()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    authService.redirectByRole(authService.role() || 'student');
    return false;
  }

  router.navigate(['/login']);
  return false;
};

export const recruiterGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isRecruiter() || authService.isAdmin()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    authService.redirectByRole(authService.role() || 'student');
    return false;
  }

  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // STRICT CHECK: Only genuine Admin role is permitted into Admin routes
  if (authService.isAdmin()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    // Regular logged in user trying to access admin panel -> redirect to user's own dashboard
    authService.redirectByRole(authService.role() || 'student');
    return false;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url, error: 'admin_required' } });
  return false;
};
