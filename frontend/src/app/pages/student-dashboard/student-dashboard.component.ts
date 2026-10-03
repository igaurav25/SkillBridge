import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { ToastService } from '../../services/toast.service';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { Profile } from '../../models/profile.model';
import { Job } from '../../models/job.model';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, JobCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private toast = inject(ToastService);

  profile: Profile | null = null;
  recommendedJobs: Job[] = [];
  livePlatformJobs: Job[] = [];
  recentApplications: Application[] = [];
  savedJobsCount = 0;
  upcomingInterviews: Application[] = [];

  isLoading = true;
  isSearchingLive = false;

  // Real-Time Salary & Criteria Finder model
  criteriaRole = 'Full Stack';
  criteriaLocation = 'Remote';
  criteriaMinSalary: number | null = null;
  criteriaMaxSalary: number | null = null;
  criteriaPlatform = 'all';

  activeTab: 'live_platforms' | 'internal' = 'live_platforms';

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // 1. Fetch Profile
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.data) {
          this.profile = res.data;
          if (this.profile.preferredRole) {
            this.criteriaRole = this.profile.preferredRole;
          }
        }
      },
    });

    // 2. Fetch Live Real-Time Multi-Platform Jobs (LinkedIn, Indeed, Internshala, Remotive)
    this.fetchLiveJobs();

    // 3. Fetch Internal Recommended Jobs
    this.jobService.getJobs({ limit: 4, sort: 'recent' }).subscribe({
      next: (res) => {
        this.recommendedJobs = res.data || [];
      },
    });

    // 4. Fetch Candidate Applications
    this.applicationService.getMyApplications().subscribe({
      next: (res) => {
        this.recentApplications = res.data || [];
        this.upcomingInterviews = this.recentApplications.filter(
          (a) => a.status === 'Interview' && a.interviewDetails?.scheduledDate
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });

    // 5. Fetch Saved jobs count
    this.jobService.getMySavedJobs().subscribe({
      next: (res) => {
        this.savedJobsCount = res.count || 0;
      },
    });
  }

  fetchLiveJobs() {
    this.isSearchingLive = true;
    this.jobService
      .searchJobsByCriteria({
        role: this.criteriaRole,
        location: this.criteriaLocation,
        platform: this.criteriaPlatform,
        minSalary: this.criteriaMinSalary || 0,
        maxSalary: this.criteriaMaxSalary || 0,
      })
      .subscribe({
        next: (res: any) => {
          this.livePlatformJobs = res.data || [];
          this.isSearchingLive = false;
        },
        error: () => {
          this.isSearchingLive = false;
        },
      });
  }

  onCriteriaSubmit() {
    this.fetchLiveJobs();
    this.toast.info(`Searching live jobs matching criteria for ${this.criteriaRole}...`);
  }

  applySalaryPreset(min: number, max: number) {
    this.criteriaMinSalary = min;
    this.criteriaMaxSalary = max;
    this.fetchLiveJobs();
  }

  setTab(tab: 'live_platforms' | 'internal') {
    this.activeTab = tab;
  }

  get hasResumeScanned(): boolean {
    return !!(this.profile?.resumeScore && this.profile.resumeScore > 0);
  }

  get userSkills(): string[] {
    return (this.profile?.skills || []).map((s) => s.name);
  }

  get recommendedMissingSkills(): string[] {
    const common = ['Git', 'Docker', 'REST API', 'Cloud / AWS', 'Testing'];
    const current = new Set(this.userSkills.map((s) => s.toLowerCase()));
    return common.filter((s) => !current.has(s.toLowerCase())).slice(0, 3);
  }
}
