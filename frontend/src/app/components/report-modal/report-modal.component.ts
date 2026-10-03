import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close()">
      <div class="sb-card modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Report Content</h3>
          <button class="btn-close" (click)="close()">×</button>
        </div>

        <p class="text-sm text-secondary mb-4">
          Help us keep SkillBridge trustworthy. If you notice a fraudulent job, scam, or offensive content, let our moderation team know.
        </p>

        <form (ngSubmit)="submitReport()">
          <div class="form-group">
            <label class="form-label">Reason for Report</label>
            <select class="select-control" [(ngModel)]="reason" name="reason" required>
              <option value="Fake Job">Fake Job / Non-existent Position</option>
              <option value="Suspicious Recruiter">Suspicious Recruiter / Phishing</option>
              <option value="Scam">Scam / Asking for money</option>
              <option value="Inappropriate Content">Inappropriate or offensive content</option>
              <option value="Wrong Information">Wrong Information / Misleading Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Detailed Description</label>
            <textarea
              class="form-control"
              [(ngModel)]="description"
              name="description"
              rows="3"
              placeholder="Please explain the issue in detail..."
              required
            ></textarea>
          </div>

          <div class="modal-footer flex items-center justify-end gap-3 mt-6">
            <button type="button" class="btn btn-outline btn-sm" (click)="close()">Cancel</button>
            <button type="submit" class="btn btn-danger btn-sm" [disabled]="isSubmitting || !description">
              {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: var(--bg-overlay);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 1rem;
      }
      .modal-card {
        width: 100%;
        max-width: 500px;
        background: var(--bg-primary);
        border: 1px solid var(--border-card);
        box-shadow: var(--shadow-lg);
        animation: modalScale 0.2s ease;
      }
      @keyframes modalScale {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .btn-close {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
      }
    `,
  ],
})
export class ReportModalComponent {
  @Input({ required: true }) targetType!: 'Job' | 'Company' | 'User';
  @Input({ required: true }) targetId!: string;
  @Input() targetTitle: string = '';
  @Output() closed = new EventEmitter<void>();

  private reportService = inject(ReportService);
  private toast = inject(ToastService);

  reason: string = 'Fake Job';
  description: string = '';
  isSubmitting = false;

  close() {
    this.closed.emit();
  }

  submitReport() {
    if (!this.description.trim()) return;

    this.isSubmitting = true;
    this.reportService
      .createReport({
        targetType: this.targetType,
        targetId: this.targetId,
        targetTitle: this.targetTitle,
        reason: this.reason,
        description: this.description,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.toast.success(res.message || 'Report submitted');
          this.close();
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
  }
}
