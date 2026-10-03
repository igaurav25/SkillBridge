import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page flex items-center justify-center py-12">
      <div class="auth-card sb-card sb-card-glow">
        <div class="text-center mb-6">
          <div class="brand-badge mb-2">
            <span class="brand-name font-bold text-2xl">Skill<span class="text-gradient">Bridge</span></span>
          </div>
          <h2 class="text-xl font-bold">Create Your Account</h2>
          <p class="text-xs text-secondary mt-1">Join the next-gen AI career platform</p>
        </div>

        <!-- Role Selector Toggle -->
        <div class="role-selector flex gap-2 p-1 mb-6 sb-card bg-secondary">
          <button
            type="button"
            class="role-btn flex-1 py-2 text-xs font-bold rounded"
            [class.active]="selectedRole === 'student'"
            (click)="setRole('student')"
          >
            👨‍🎓 Student / Developer
          </button>
          <button
            type="button"
            class="role-btn flex-1 py-2 text-xs font-bold rounded"
            [class.active]="selectedRole === 'recruiter'"
            (click)="setRole('recruiter')"
          >
            💼 Recruiter / Employer
          </button>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input
              type="text"
              class="form-control"
              placeholder="e.g. Alex Morgan"
              formControlName="name"
            />
          </div>

          <div class="form-group">
            <div class="flex items-center justify-between">
              <label class="form-label">Genuine Email Address</label>
              <span class="text-xs text-muted">🛡️ Real ID verification</span>
            </div>
            <input
              type="email"
              class="form-control"
              placeholder="e.g. yourname@gmail.com"
              formControlName="email"
              (input)="checkEmailDisposable()"
            />
            <div *ngIf="isDisposableEmail" class="text-xs text-danger mt-1">
              ⚠️ Disposable or temporary emails are blocked. Please use your real personal email (Gmail, Outlook, Yahoo, etc.).
            </div>
            <div *ngIf="!isDisposableEmail && registerForm.get('email')?.valid" class="text-xs text-success mt-1">
              ✓ Valid authentic email address
            </div>
          </div>

          <!-- Dynamic role fields -->
          <div *ngIf="selectedRole === 'student'" class="form-group">
            <label class="form-label">Professional Headline</label>
            <input
              type="text"
              class="form-control"
              placeholder="e.g. Full Stack Developer | Angular & Node.js"
              formControlName="headline"
            />
          </div>

          <div *ngIf="selectedRole === 'recruiter'" class="form-group">
            <label class="form-label">Company Name</label>
            <input
              type="text"
              class="form-control"
              placeholder="e.g. Acme Innovations Inc."
              formControlName="companyName"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              placeholder="At least 6 characters"
              formControlName="password"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg w-full mt-2"
            [disabled]="registerForm.invalid || isLoading"
          >
            {{ isLoading ? 'Creating Account...' : 'Get Started with SkillBridge' }}
          </button>
        </form>

        <div class="text-center mt-6 pt-4 border-top">
          <p class="text-sm text-secondary">
            Already registered?
            <a routerLink="/login" class="font-bold text-gradient">Log In</a>
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
        max-width: 480px;
        padding: 2rem;
      }
      .role-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .role-btn.active {
        background: var(--primary-500);
        color: #ffffff;
      }
      .border-top {
        border-top: 1px solid var(--border-subtle);
      }
    `,
  ],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  selectedRole: 'student' | 'recruiter' = 'student';
  isLoading = false;
  isDisposableEmail = false;

  private blockedDomains = [
    'tempmail.com', 'temp-mail.org', '10minutemail.com', 'mailinator.com',
    'guerrillamail.com', 'sharklasers.com', 'yopmail.com', 'trashmail.com',
    'fakeinbox.com', 'dispostable.com', 'burnermail.io', 'throwawaymail.com',
    'mohmal.com', 'nada.ltd', 'dropmail.me', 'fakeemail.net'
  ];

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    headline: [''],
    companyName: [''],
  });

  setRole(role: 'student' | 'recruiter') {
    this.selectedRole = role;
  }

  checkEmailDisposable() {
    const val = (this.registerForm.get('email')?.value || '').toLowerCase().trim();
    if (val.includes('@')) {
      const domain = val.split('@')[1];
      this.isDisposableEmail = this.blockedDomains.some(d => domain.includes(d));
    } else {
      this.isDisposableEmail = false;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid || this.isDisposableEmail) return;

    this.isLoading = true;
    const payload = {
      ...this.registerForm.value,
      role: this.selectedRole,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
