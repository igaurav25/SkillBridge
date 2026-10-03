import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="saved-jobs-page py-8">
      <div class="container">
        <div class="mb-6">
          <span class="badge badge-amber text-xs mb-1">BOOKMARKS</span>
          <h1 class="text-2xl font-bold">Saved Jobs & Collections</h1>
          <p class="text-xs text-secondary">Organize and bookmark opportunities by stack or career focus</p>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs-bar sb-card p-3 mb-6 flex items-center gap-2 flex-wrap">
          <button
            *ngFor="let cat of categories"
            class="badge cat-tab-btn"
            [class.active]="selectedCategory === cat"
            (click)="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && savedJobs.length === 0" class="empty-state">
          <div class="empty-state-icon">🔖</div>
          <h3 class="text-lg font-bold mb-2">No saved jobs in this category</h3>
          <p class="text-sm text-secondary mb-4">
            Browse the marketplace and click the bookmark star to save opportunities here.
          </p>
          <a routerLink="/jobs" class="btn btn-primary btn-sm">Explore Open Positions →</a>
        </div>

        <!-- Saved Jobs List -->
        <div *ngIf="savedJobs.length > 0" class="grid grid-2 gap-4">
          <div *ngFor="let item of savedJobs" class="sb-card saved-job-card">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3">
                <img
                  [src]="item.job?.companyLogo || item.job?.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80'"
                  alt="Company"
                  class="company-logo"
                />
                <div>
                  <h3 class="text-base font-bold">{{ item.job?.title }}</h3>
                  <div class="text-xs text-secondary">{{ item.job?.companyName }} • {{ item.job?.location }}</div>
                </div>
              </div>

              <button class="btn-remove" (click)="removeSaved(item.job?._id)" title="Remove bookmark">
                ★
              </button>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-amber text-xs">Folder: {{ item.category }}</span>
              <span class="badge badge-neutral text-xs">{{ item.job?.workType | uppercase }}</span>
              <span class="badge badge-primary text-xs">{{ item.job?.jobType | titlecase }}</span>
            </div>

            <p *ngIf="item.notes" class="text-xs text-secondary bg-secondary p-2 rounded mb-3">
              <strong>My Note:</strong> {{ item.notes }}
            </p>

            <div class="flex items-center justify-between pt-3 border-top">
              <span class="text-xs text-muted">Saved on {{ item.createdAt | date:'mediumDate' }}</span>
              <a [routerLink]="['/jobs', item.job?._id]" class="btn btn-outline btn-sm">
                View & Apply →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .saved-jobs-page {
        min-height: calc(100vh - 160px);
      }
      .cat-tab-btn {
        background: var(--bg-secondary);
        border: 1px solid var(--border-card);
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.4rem 0.85rem;
      }
      .cat-tab-btn.active {
        background: var(--accent-amber);
        color: var(--text-inverse);
        font-weight: bold;
      }
      .company-logo {
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        object-fit: cover;
      }
      .btn-remove {
        background: transparent;
        border: none;
        color: var(--accent-amber);
        font-size: 1.3rem;
        cursor: pointer;
      }
      .btn-remove:hover {
        opacity: 0.7;
      }
      .border-top {
        border-top: 1px solid var(--border-subtle);
      }
    `,
  ],
})
export class SavedJobsComponent implements OnInit {
  private jobService = inject(JobService);
  private toast = inject(ToastService);

  savedJobs: any[] = [];
  isLoading = true;
  selectedCategory = 'All';

  categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'AI', 'Internship', 'High Priority', 'General'];

  ngOnInit() {
    this.fetchSavedJobs();
  }

  fetchSavedJobs() {
    this.isLoading = true;
    const cat = this.selectedCategory === 'All' ? undefined : this.selectedCategory;

    this.jobService.getMySavedJobs(cat).subscribe({
      next: (res) => {
        this.savedJobs = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.fetchSavedJobs();
  }

  removeSaved(jobId: string) {
    this.jobService.toggleSaveJob(jobId).subscribe({
      next: (res) => {
        this.toast.info('Job removed from bookmarks');
        this.fetchSavedJobs();
      },
    });
  }
}
