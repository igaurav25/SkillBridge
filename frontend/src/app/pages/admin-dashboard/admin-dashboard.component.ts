import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CompanyService } from '../../services/company.service';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../models/user.model';
import { Company } from '../../models/company.model';
import { ReportItem } from '../../models/skill.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private companyService = inject(CompanyService);
  private jobService = inject(JobService);
  private toast = inject(ToastService);
  authService = inject(AuthService);
  private profileService = inject(ProfileService);

  activeTab: 'overview' | 'users' | 'jobs' | 'companies' | 'reports' | 'settings' = 'overview';

  stats: any = {
    totalUsers: 0,
    totalStudents: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReports: 0,
  };

  users: User[] = [];
  jobs: any[] = [];
  companies: Company[] = [];
  reports: ReportItem[] = [];

  isLoading = true;

  // Admin Profile & Security State
  adminId = '';
  adminName = '';
  isUpdatingAdminName = false;

  adminEmail = '';
  isUpdatingAdminEmail = false;

  adminPhone = '';
  isUpdatingAdminPhone = false;

  adminCurrentPassword = '';
  adminNewPassword = '';
  adminConfirmPassword = '';
  isUpdatingAdminPassword = false;

  isUploadingAdminAvatar = false;

  // Selected user for full dossier inspection modal
  selectedUserForDetails: any | null = null;
  showUserDetailsModal = false;

  // Users filter
  userRoleFilter = 'all';
  userSearch = '';

  // Jobs filter
  jobFilter = 'all';

  // Reports filter
  reportStatusFilter = 'all';

  // Report resolution modal
  selectedReport: ReportItem | null = null;
  reportActionStatus = 'resolved';
  reportActionNotes = '';
  showReportModal = false;

  ngOnInit() {
    this.initAdminProfile();
    this.loadAll();
  }

  initAdminProfile() {
    // 1. Fetch freshly from dedicated admin profile endpoint
    this.adminService.getProfile().subscribe({
      next: (res) => {
        if (res.data) {
          this.adminId = res.data._id || '';
          this.adminName = res.data.name || '';
          this.adminEmail = res.data.email || '';
          this.adminPhone = res.data.phone || '';
        }
      },
      error: () => {
        // Fallback to authService user state
        const user = this.authService.currentUser();
        if (user) {
          this.adminId = user._id || '';
          this.adminName = user.name || '';
          this.adminEmail = user.email || '';
          this.adminPhone = (user as any).phone || '';
        }
      }
    });
  }

  get adminAvatar(): string {
    const user = this.authService.currentUser();
    if (user?.avatar) return user.avatar;
    const name = encodeURIComponent(user?.name || this.adminName || 'Admin');
    return `https://ui-avatars.com/api/?name=${name}&background=ef4444&color=fff&bold=true`;
  }

  saveAdminName() {
    if (!this.adminName.trim()) {
      this.toast.warning('Please enter a valid administrator name.');
      return;
    }
    this.isUpdatingAdminName = true;
    this.adminService.updateProfile({ name: this.adminName.trim() }).subscribe({
      next: (res) => {
        this.isUpdatingAdminName = false;
        if (res.data) {
          const current = this.authService.currentUser();
          if (current) {
            this.authService.setCurrentUser({
              ...current,
              name: res.data.name,
            });
          }
        }
        this.toast.success('Admin name updated successfully!');
      },
      error: (err) => {
        this.isUpdatingAdminName = false;
        this.toast.error(err.error?.message || 'Failed to update admin name.');
      }
    });
  }

  saveAdminEmail() {
    if (!this.adminEmail.trim()) {
      this.toast.warning('Please enter a valid email address.');
      return;
    }
    this.isUpdatingAdminEmail = true;
    this.adminService.updateProfile({ email: this.adminEmail.trim().toLowerCase() }).subscribe({
      next: (res) => {
        this.isUpdatingAdminEmail = false;
        if (res.data) {
          const current = this.authService.currentUser();
          if (current) {
            this.authService.setCurrentUser({
              ...current,
              email: res.data.email,
            });
          }
        }
        this.toast.success('Admin Gmail/Email address updated successfully! You can use this to login.');
      },
      error: (err) => {
        this.isUpdatingAdminEmail = false;
        this.toast.error(err.error?.message || 'Failed to update email.');
      }
    });
  }

  saveAdminPhone() {
    this.isUpdatingAdminPhone = true;
    this.adminService.updateProfile({ phone: this.adminPhone.trim() }).subscribe({
      next: (res) => {
        this.isUpdatingAdminPhone = false;
        if (res.data) {
          const current = this.authService.currentUser();
          if (current) {
            this.authService.setCurrentUser({
              ...current,
              phone: res.data.phone,
            });
          }
        }
        this.toast.success('Admin mobile phone number updated successfully!');
      },
      error: (err) => {
        this.isUpdatingAdminPhone = false;
        this.toast.error(err.error?.message || 'Failed to update phone number.');
      }
    });
  }

  saveFullAdminProfile() {
    if (!this.adminName.trim()) {
      this.toast.warning('Please enter a valid administrator name.');
      return;
    }
    if (!this.adminEmail.trim()) {
      this.toast.warning('Please enter a valid email address.');
      return;
    }
    this.isUpdatingAdminName = true;
    this.adminService.updateProfile({
      name: this.adminName.trim(),
      email: this.adminEmail.trim().toLowerCase(),
      phone: this.adminPhone.trim(),
    }).subscribe({
      next: (res) => {
        this.isUpdatingAdminName = false;
        if (res.data) {
          const current = this.authService.currentUser();
          if (current) {
            this.authService.setCurrentUser({
              ...current,
              name: res.data.name,
              email: res.data.email,
              phone: res.data.phone,
            });
          }
        }
        this.toast.success('Admin Profile (Name, Gmail ID, Phone Number) updated successfully!');
      },
      error: (err) => {
        this.isUpdatingAdminName = false;
        this.toast.error(err.error?.message || 'Failed to update profile.');
      }
    });
  }

  saveAdminPassword() {
    if (!this.adminCurrentPassword || !this.adminNewPassword) {
      this.toast.warning('Please enter your current and new password.');
      return;
    }
    if (this.adminNewPassword.length < 6) {
      this.toast.warning('New password must be at least 6 characters long.');
      return;
    }
    if (this.adminNewPassword !== this.adminConfirmPassword) {
      this.toast.warning('New password and confirmation do not match.');
      return;
    }
    this.isUpdatingAdminPassword = true;
    this.adminService.updatePassword({
      currentPassword: this.adminCurrentPassword,
      newPassword: this.adminNewPassword
    }).subscribe({
      next: () => {
        this.isUpdatingAdminPassword = false;
        this.adminCurrentPassword = '';
        this.adminNewPassword = '';
        this.adminConfirmPassword = '';
        this.toast.success('Admin password updated successfully! Please keep it secure.');
      },
      error: (err) => {
        this.isUpdatingAdminPassword = false;
        this.toast.error(err.error?.message || 'Failed to update password.');
      }
    });
  }

  openUserDetails(user: any) {
    this.selectedUserForDetails = user;
    this.showUserDetailsModal = true;
  }

  closeUserDetails() {
    this.selectedUserForDetails = null;
    this.showUserDetailsModal = false;
  }

  onAdminAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toast.warning('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toast.warning('Avatar file must be under 5MB.');
      return;
    }

    this.isUploadingAdminAvatar = true;
    const formData = new FormData();
    formData.append('avatar', file);

    this.profileService.uploadAvatar(formData).subscribe({
      next: (res: any) => {
        this.isUploadingAdminAvatar = false;
        if (res.data?.avatar) {
          this.authService.setAvatar(res.data.avatar);
        }
        this.toast.success('Admin profile picture updated!');
      },
      error: () => {
        this.isUploadingAdminAvatar = false;
        this.toast.error('Failed to upload avatar.');
      }
    });
  }

  loadAll() {
    this.isLoading = true;
    this.fetchStats();
    this.fetchUsers();
    this.fetchJobs();
    this.fetchCompanies();
    this.fetchReports();
  }

  fetchStats() {
    this.adminService.getStats().subscribe({
      next: (res) => {
        if (res.data) {
          this.stats = res.data;
        }
      }
    });
  }

  fetchUsers() {
    this.adminService.getUsers({
      role: this.userRoleFilter !== 'all' ? this.userRoleFilter : undefined,
      search: this.userSearch || undefined
    }).subscribe({
      next: (res) => {
        this.users = res.data || [];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  fetchJobs() {
    this.adminService.getAllJobs({
      status: this.jobFilter !== 'all' ? this.jobFilter : undefined
    }).subscribe({
      next: (res) => {
        this.jobs = res.data || [];
      }
    });
  }

  fetchCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (res) => {
        this.companies = res.data || [];
      }
    });
  }

  fetchReports() {
    this.adminService.getReports(this.reportStatusFilter !== 'all' ? this.reportStatusFilter : undefined).subscribe({
      next: (res) => {
        this.reports = res.data || [];
      }
    });
  }

  // User Actions
  toggleUserStatus(user: User) {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    this.adminService.updateUserStatus(user._id, nextStatus).subscribe({
      next: () => {
        this.toast.success(`User marked as ${nextStatus}!`);
        user.status = nextStatus;
      },
      error: () => this.toast.error('Failed to update user status.')
    });
  }

  deleteUser(userId: string) {
    if (confirm('Permanently delete this user and associated profile? This action is irreversible.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.toast.success('User account removed.');
          this.fetchUsers();
          this.fetchStats();
        },
        error: () => this.toast.error('Failed to delete user.')
      });
    }
  }

  // Job Actions
  deleteJob(jobId: string) {
    if (confirm('Delete this job posting immediately for moderation reasons?')) {
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.toast.success('Job listing removed.');
          this.fetchJobs();
          this.fetchStats();
        },
        error: () => this.toast.error('Failed to remove job.')
      });
    }
  }

  // Company Actions
  toggleCompanyVerification(company: Company) {
    this.adminService.toggleCompanyVerification(company._id).subscribe({
      next: (res) => {
        company.isVerified = !company.isVerified;
        this.toast.success(`Company ${company.isVerified ? 'verified' : 'unverified'}!`);
      },
      error: () => this.toast.error('Could not update company verification.')
    });
  }

  // Report Actions
  openReportModal(report: ReportItem) {
    this.selectedReport = report;
    this.reportActionStatus = 'resolved';
    this.reportActionNotes = '';
    this.showReportModal = true;
  }

  submitReportAction() {
    if (!this.selectedReport) return;

    this.adminService.updateReportStatus(this.selectedReport._id, this.reportActionStatus, this.reportActionNotes).subscribe({
      next: () => {
        this.toast.success(`Report resolved with status: ${this.reportActionStatus}!`);
        this.showReportModal = false;
        this.fetchReports();
        this.fetchStats();
      },
      error: () => this.toast.error('Failed to update report.')
    });
  }
}
