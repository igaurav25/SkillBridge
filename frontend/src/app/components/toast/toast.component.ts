import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toastService.toasts().length > 0">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast"
        [ngClass]="'toast-' + toast.type"
      >
        <div class="toast-content flex items-center gap-3">
          <span class="toast-icon">
            <span *ngIf="toast.type === 'success'">✓</span>
            <span *ngIf="toast.type === 'error'">✕</span>
            <span *ngIf="toast.type === 'warning'">⚠</span>
            <span *ngIf="toast.type === 'info'">ℹ</span>
          </span>
          <span class="text-sm font-semibold">{{ toast.text }}</span>
        </div>
        <button
          class="btn-close"
          (click)="toastService.remove(toast.id)"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-icon {
        font-weight: 800;
        font-size: 1.1rem;
      }
      .btn-close {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 1.4rem;
        line-height: 1;
        cursor: pointer;
      }
      .btn-close:hover {
        color: var(--text-primary);
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
