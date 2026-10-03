import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { CompanyService } from '../../services/company.service';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Job } from '../../models/job.model';
import { Application } from '../../models/application.model';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements OnInit {
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private companyService = inject(CompanyService);
  private profileService = inject(ProfileService);
  private toast = inject(ToastService);
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);

  activeTab: 'overview' | 'jobs' | 'applications' | 'candidates' | 'company' = 'overview';

  // Stats
  activeJobsCount = 0;
  totalApplicationsCount = 0;
  shortlistedCount = 0;
  interviewCount = 0;
  hiredCount = 0;

  // Data lists
  postedJobs: Job[] = [];
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  candidates: any[] = [];
  myCompany: Company | null = null;
  isLoading = true;

  // Filters
  appStatusFilter = 'all';
  appJobFilter = 'all';

  // Candidate Search
  candidateSkill = '';
  candidateRole = '';
  candidateLocation = '';
  isSearchingCandidates = false;

  // Job Modal
  showJobModal = false;
  isEditingJob = false;
  currentJobId: string | null = null;
  jobForm: FormGroup;

  // Applicant Review Modal
  selectedApplication: Application | null = null;
  showAppModal = false;
  newStatus = '';
  recruiterNotes = '';

  // Company Form
  companyForm: FormGroup;
  isSavingCompany = false;

  constructor() {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      type: ['job', Validators.required],
      workMode: ['remote', Validators.required],
      location: ['Remote', Validators.required],
      experienceLevel: ['entry', Validators.required],
      minSalary: [0, Validators.required],
      maxSalary: [0, Validators.required],
      skillsRequired: ['', Validators.required],
      description: ['', Validators.required],
      responsibilities: [''],
      requirements: [''],
      deadline: [''],
    });

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      industry: ['Technology & AI', Validators.required],
      location: ['', Validators.required],
      companySize: ['11-50 employees', Validators.required],
      website: [''],
      description: [''],
      linkedin: [''],
      twitter: [''],
    });
  }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    this.fetchJobs();
    this.fetchApplications();
    this.fetchCompany();
    this.searchCandidates();
  }

  fetchJobs() {
    this.jobService.getRecruiterJobs().subscribe({
      next: (res) => {
        this.postedJobs = res.data || [];
        this.activeJobsCount = this.postedJobs.filter(j => j.status === 'active').length;
      },
      error: () => this.toast.error('Could not load posted jobs.')
    });
  }

  fetchApplications() {
    this.applicationService.getRecruiterApplications().subscribe({
      next: (res) => {
        this.applications = res.data || [];
        this.applyAppFilters();
        this.computeStats();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  computeStats() {
    this.totalApplicationsCount = this.applications.length;
    this.shortlistedCount = this.applications.filter(a => a.status === 'shortlisted').length;
    this.interviewCount = this.applications.filter(a => a.status === 'interview').length;
    this.hiredCount = this.applications.filter(a => a.status === 'selected').length;
  }

  applyAppFilters() {
    this.filteredApplications = this.applications.filter(app => {
      const matchStatus = this.appStatusFilter === 'all' || app.status === this.appStatusFilter;
      const jobId = typeof app.job === 'object' ? app.job._id : app.job;
      const matchJob = this.appJobFilter === 'all' || jobId === this.appJobFilter;
      return matchStatus && matchJob;
    });
  }

  fetchCompany() {
    this.companyService.getMyCompany().subscribe({
      next: (res) => {
        if (res.data) {
          this.myCompany = res.data;
          this.companyForm.patchValue({
            name: res.data.name,
            industry: res.data.industry,
            location: res.data.location,
            companySize: res.data.companySize,
            website: res.data.website || '',
            description: res.data.description || '',
            linkedin: res.data.socialLinks?.linkedin || '',
            twitter: res.data.socialLinks?.twitter || '',
          });
        }
      }
    });
  }

  saveCompany() {
    if (this.companyForm.invalid) {
      this.toast.error('Please enter required company fields.');
      return;
    }

    this.isSavingCompany = true;
    const formVal = this.companyForm.value;
    const payload = {
      name: formVal.name,
      industry: formVal.industry,
      location: formVal.location,
      companySize: formVal.companySize,
      website: formVal.website,
      description: formVal.description,
      socialLinks: {
        linkedin: formVal.linkedin,
        twitter: formVal.twitter
      }
    };

    this.companyService.createOrUpdateCompany(payload).subscribe({
      next: (res) => {
        this.isSavingCompany = false;
        this.myCompany = res.data || null;
        this.toast.success('Company profile updated successfully!');
      },
      error: () => {
        this.isSavingCompany = false;
        this.toast.error('Failed to update company profile.');
      }
    });
  }

  searchCandidates() {
    this.isSearchingCandidates = true;
    this.profileService.searchCandidates({
      skill: this.candidateSkill || undefined,
      role: this.candidateRole || undefined,
      location: this.candidateLocation || undefined
    }).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.isSearchingCandidates = false;
      },
      error: () => {
        this.isSearchingCandidates = false;
      }
    });
  }

  // Job Modal Actions
  openCreateJobModal() {
    this.isEditingJob = false;
    this.currentJobId = null;
    this.jobForm.reset({
      type: 'job',
      workMode: 'remote',
      location: 'Remote',
      experienceLevel: 'entry',
      minSalary: 60000,
      maxSalary: 95000,
      skillsRequired: '',
      description: '',
      responsibilities: '',
      requirements: '',
    });
    this.showJobModal = true;
  }

  openEditJobModal(job: Job) {
    this.isEditingJob = true;
    this.currentJobId = job._id;
    this.jobForm.patchValue({
      title: job.title,
      type: job.type,
      workMode: job.workMode,
      location: job.location,
      experienceLevel: job.experienceLevel,
      minSalary: job.salary?.min || 0,
      maxSalary: job.salary?.max || 0,
      skillsRequired: job.skillsRequired?.join(', ') || '',
      description: job.description,
      responsibilities: job.responsibilities?.join('\n') || '',
      requirements: job.requirements?.join('\n') || '',
      deadline: job.deadline ? job.deadline.substring(0, 10) : '',
    });
    this.showJobModal = true;
  }

  saveJob() {
    if (this.jobForm.invalid) {
      this.toast.error('Please fill in all required job fields.');
      return;
    }

    const formVal = this.jobForm.value;
    const skills = formVal.skillsRequired
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const responsibilities = formVal.responsibilities
      ? formVal.responsibilities.split('\n').map((r: string) => r.trim()).filter((r: string) => r.length > 0)
      : [];

    const requirements = formVal.requirements
      ? formVal.requirements.split('\n').map((r: string) => r.trim()).filter((r: string) => r.length > 0)
      : [];

    const payload: any = {
      title: formVal.title,
      type: formVal.type,
      workMode: formVal.workMode,
      location: formVal.location,
      experienceLevel: formVal.experienceLevel,
      salary: {
        min: Number(formVal.minSalary),
        max: Number(formVal.maxSalary),
        currency: 'USD',
        period: formVal.type === 'internship' ? 'month' : 'year'
      },
      skillsRequired: skills,
      description: formVal.description,
      responsibilities,
      requirements,
      deadline: formVal.deadline || undefined,
    };

    if (this.isEditingJob && this.currentJobId) {
      this.jobService.updateJob(this.currentJobId, payload).subscribe({
        next: () => {
          this.toast.success('Job listing updated!');
          this.showJobModal = false;
          this.fetchJobs();
        },
        error: () => this.toast.error('Failed to update job.')
      });
    } else {
      this.jobService.createJob(payload).subscribe({
        next: () => {
          this.toast.success('Job listing published!');
          this.showJobModal = false;
          this.fetchJobs();
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to create job.')
      });
    }
  }

  deleteJob(id: string) {
    if (confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.toast.success('Job posting deleted.');
          this.fetchJobs();
        },
        error: () => this.toast.error('Could not delete job.')
      });
    }
  }

  // Application Review
  openApplicantReview(app: Application) {
    this.selectedApplication = app;
    this.newStatus = app.status;
    this.recruiterNotes = app.recruiterNotes || '';
    this.showAppModal = true;
  }

  updateApplicationStatus() {
    if (!this.selectedApplication) return;

    this.applicationService.updateApplicationStatus(this.selectedApplication._id, {
      status: this.newStatus,
      recruiterNotes: this.recruiterNotes
    }).subscribe({
      next: (res) => {
        this.toast.success(`Candidate marked as "${this.newStatus}"!`);
        this.showAppModal = false;
        this.fetchApplications();
      },
      error: () => this.toast.error('Failed to update candidate status.')
    });
  }
}
