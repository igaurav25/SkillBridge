import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page flex items-center justify-center py-12">
      <div class="auth-card sb-card sb-card-glow">
        <div class="text-center mb-6">
          <div class="brand-badge mb-2">
            <span class="brand-name font-bold text-2xl">Skill<span class="text-gradient">Bridge</span></span>
          </div>
          <h2 class="text-xl font-bold">Account Sign In</h2>
          <p class="text-xs text-secondary mt-1">Enter your registered credentials to access your dashboard</p>
        </div>

        <!-- Admin Access Required Alert (when redirected from guarded route) -->
        <div *ngIf="adminAccessRequired" class="p-3 mb-4 rounded bg-danger-subtle border border-danger text-center">
          <div class="text-xs font-bold text-danger">🛡️ RESTRICTED ADMIN CONSOLE</div>
          <div class="text-xs text-secondary mt-1">
            The Admin Panel requires verified administrator credentials. Please sign in as an Administrator.
          </div>
        </div>

        <!-- Role Portal Context Switcher (Zero Autofill, Context Selection Only) -->
        <div class="role-selector-wrap mb-6">
          <label class="text-xs font-bold text-muted mb-2 block text-center uppercase tracking-wider">
            Select Login Portal
          </label>
          <div class="grid grid-3 gap-2">
            <button
              type="button"
              class="portal-btn"
              [class.active]="selectedRole === 'student'"
              (click)="selectRole('student')"
            >
              👨‍🎓 Student
            </button>
            <button
              type="button"
              class="portal-btn"
              [class.active]="selectedRole === 'recruiter'"
              (click)="selectRole('recruiter')"
            >
              💼 Recruiter
            </button>
            <button
              type="button"
              class="portal-btn portal-btn-admin"
              [class.active]="selectedRole === 'admin'"
              (click)="selectRole('admin')"
            >
              🛡️ Admin
            </button>
          </div>

          <!-- Informational Notice based on Selected Role -->
          <div
            class="portal-info-box mt-3 p-2.5 rounded text-xs text-center"
            [ngClass]="{
              'portal-info-student': selectedRole === 'student',
              'portal-info-recruiter': selectedRole === 'recruiter',
              'portal-info-admin': selectedRole === 'admin'
            }"
          >
            <ng-container *ngIf="selectedRole === 'student'">
              <span class="font-bold text-cyan">👨‍🎓 Student Portal:</span> Enter your genuine registered student email and password.
            </ng-container>
            <ng-container *ngIf="selectedRole === 'recruiter'">
              <span class="font-bold text-purple">💼 Recruiter Portal:</span> Enter your authorized company or talent partner email.
            </ng-container>
            <ng-container *ngIf="selectedRole === 'admin'">
              <span class="font-bold text-danger">🛡️ Admin Security Gate:</span> Restricted access. Enter authorized administrator credentials.
            </ng-container>
          </div>
        </div>

        <!-- Login Form with Clean Empty Inputs -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">
              <ng-container *ngIf="selectedRole === 'student'">Student Email Address</ng-container>
              <ng-container *ngIf="selectedRole === 'recruiter'">Work / Company Email</ng-container>
              <ng-container *ngIf="selectedRole === 'admin'">Administrator Email</ng-container>
            </label>
            <input
              type="email"
              class="form-control"
              [placeholder]="emailPlaceholder"
              formControlName="email"
              autocomplete="email"
            />
            <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-xs text-danger mt-1">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <div class="flex items-center justify-between">
              <label class="form-label">
                <ng-container *ngIf="selectedRole === 'admin'">Administrator Security Password</ng-container>
                <ng-container *ngIf="selectedRole !== 'admin'">Password</ng-container>
              </label>
              <span class="text-xs text-primary-400 cursor-pointer" (click)="showForgot = !showForgot">Forgot password?</span>
            </div>
            <input
              type="password"
              class="form-control"
              placeholder="Enter your password"
              formControlName="password"
              autocomplete="current-password"
            />
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-xs text-danger mt-1">
              Password must be at least 6 characters
            </div>
          </div>

          <!-- Forgot Password Toggle Drawer -->
          <div *ngIf="showForgot" class="p-3 mb-4 sb-card bg-tertiary">
            <p class="text-xs text-secondary mb-2">Enter your email above and click below to request a password reset link:</p>
            <button type="button" class="btn btn-outline btn-sm w-full" (click)="sendReset()">Send Reset Link</button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-lg w-full mt-2"
            [class.btn-danger]="selectedRole === 'admin'"
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ isLoading ? 'Verifying Credentials...' : (selectedRole === 'admin' ? '🛡️ Authenticate as Admin' : 'Sign In to SkillBridge') }}
          </button>
        </form>

        <div class="text-center mt-6 pt-4 border-top">
          <p class="text-sm text-secondary">
            Don't have an account?
            <a routerLink="/register" class="font-bold text-gradient">Create Genuine Account</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-page {
        min-height: calc(100vh - 160px);
        padding: 2rem 1rem;
      }
      .auth-card {
        width: 100%;
        max-width: 440px;
        padding: 2rem;
      }
      .portal-btn {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        padding: 0.6rem 0.5rem;
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .portal-btn:hover {
        border-color: var(--border-active);
        color: var(--text-primary);
      }
      .portal-btn.active {
        background: var(--gradient-primary);
        border-color: transparent;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }
      .portal-btn-admin.active {
        background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
      }
      .portal-info-box {
        background: var(--bg-secondary);
        border: 1px solid var(--border-subtle);
        transition: all 0.2s ease;
      }
      .portal-info-student {
        border-color: rgba(6, 182, 212, 0.3);
      }
      .portal-info-recruiter {
        border-color: rgba(168, 85, 247, 0.3);
      }
      .portal-info-admin {
        border-color: rgba(239, 68, 68, 0.4);
        background: rgba(239, 68, 68, 0.05);
      }
      .border-top {
        border-top: 1px solid var(--border-subtle);
      }
      .text-danger {
        color: var(--accent-rose);
      }
      .text-cyan {
        color: var(--accent-cyan);
      }
      .text-purple {
        color: var(--accent-purple);
      }
      .btn-danger {
        background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
        border: none;
        color: white;
      }
      .btn-danger:hover {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  showForgot = false;
  selectedRole: 'student' | 'recruiter' | 'admin' = 'student';
  adminAccessRequired = false;

  // Clean empty inputs - User must type their actual credentials
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['error'] === 'admin_required') {
        this.adminAccessRequired = true;
        this.selectedRole = 'admin';
      }
    });
  }

  selectRole(role: 'student' | 'recruiter' | 'admin') {
    this.selectedRole = role;
    // Clear password when changing roles for security, and DO NOT autofill anything!
    this.loginForm.patchValue({ password: '' });
  }

  get emailPlaceholder(): string {
    if (this.selectedRole === 'student') return 'Enter your student email (e.g. rahul@gmail.com)';
    if (this.selectedRole === 'recruiter') return 'Enter your work email (e.g. hr@company.com)';
    return 'Enter your admin email address';
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!.trim(), password: password! }).subscribe({
      next: (res) => {
        this.isLoading = false;

        // If user attempted to log in under Admin portal with a non-admin account, reject immediately!
        if (this.selectedRole === 'admin' && res.user?.role !== 'admin') {
          this.authService.logout();
          this.toast.error('Access Denied: This account is not an Administrator. Please select the Student portal.');
          return;
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  sendReset() {
    const email = this.loginForm.get('email')?.value;
    if (email) {
      this.authService.forgotPassword(email).subscribe();
    }
  }
}
