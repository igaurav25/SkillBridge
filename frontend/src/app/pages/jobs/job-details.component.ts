import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { ResumeService } from '../../services/resume.service';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ReportModalComponent } from '../../components/report-modal/report-modal.component';
import { Job } from '../../models/job.model';
import { Resume } from '../../models/resume.model';
import { getDirectApplyUrl } from '../../utils/direct-apply.util';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReportModalComponent],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
})
export class JobDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private resumeService = inject(ResumeService);
  private aiService = inject(AiService);
  private toast = inject(ToastService);
  authService = inject(AuthService);

  job: Job | null = null;
  isLoading = true;
  userResumes: Resume[] = [];

  // Apply Modal state
  isApplyModalOpen = false;
  selectedResumeId = '';
  coverLetterText = '';
  isGeneratingCoverLetter = false;
  isSubmittingApplication = false;

  // Report Modal state
  isReportModalOpen = false;

  get directApplyUrl(): string {
    return getDirectApplyUrl(this.job);
  }

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.fetchJob(jobId);
    }
    if (this.authService.isStudent()) {
      this.resumeService.getMyResumes().subscribe({
        next: (res) => {
          this.userResumes = res.data || [];
          const primary = this.userResumes.find((r) => r.isPrimary);
          if (primary) {
            this.selectedResumeId = primary._id;
          } else if (this.userResumes.length > 0) {
            this.selectedResumeId = this.userResumes[0]._id;
          }
        },
      });
    }
  }

  fetchJob(id: string) {
    this.isLoading = true;
    this.jobService.getJobById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.job = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onToggleSave() {
    if (!this.job) return;
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.jobService.toggleSaveJob(this.job._id).subscribe({
      next: (res) => {
        if (this.job) {
          this.job.isSaved = !this.job.isSaved;
          this.toast.success(res.message || 'Bookmark updated');
        }
      },
    });
  }

  openApplyModal() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isApplyModalOpen = true;
  }

  closeApplyModal() {
    this.isApplyModalOpen = false;
  }

  generateAiCoverLetter() {
    if (!this.job) return;
    this.isGeneratingCoverLetter = true;
    this.aiService.generateCoverLetter(this.job._id).subscribe({
      next: (res) => {
        this.isGeneratingCoverLetter = false;
        if (res.data?.coverLetter) {
          this.coverLetterText = res.data.coverLetter;
          this.toast.success('AI Cover Letter generated based on your profile!');
        }
      },
      error: () => {
        this.isGeneratingCoverLetter = false;
      },
    });
  }

  submitApplication() {
    if (!this.job) return;
    this.isSubmittingApplication = true;

    this.applicationService
      .applyForJob(this.job._id, {
        resumeId: this.selectedResumeId || undefined,
        coverLetter: this.coverLetterText,
      })
      .subscribe({
        next: (res) => {
          this.isSubmittingApplication = false;
          this.isApplyModalOpen = false;
          if (this.job) {
            this.job.isApplied = true;
            this.job.applicantsCount = (this.job.applicantsCount || 0) + 1;
          }
          this.toast.success('Your application was submitted successfully!');
        },
        error: () => {
          this.isSubmittingApplication = false;
        },
      });
  }

  shareJob() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this.toast.success('Job link copied to clipboard!');
    }
  }

  openReportModal() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isReportModalOpen = true;
  }
}
