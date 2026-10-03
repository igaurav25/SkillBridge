import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Profile, EducationItem, SkillItem, ProjectItem, ExperienceItem, CertificationItem } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private toast = inject(ToastService);
  authService = inject(AuthService);

  profile: Profile | null = null;
  isLoading = true;
  isSaving = false;

  // Edit Name & Avatar State
  editName = '';
  isUpdatingName = false;
  isUploadingAvatar = false;

  // Edit Email State
  editEmail = '';
  isUpdatingEmail = false;

  // Password Change State
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isChangingPassword = false;

  // Resume Upload State
  selectedResumeFile: File | null = null;
  resumeFileName = '';
  isUploadingResume = false;

  // Modals for adding items
  showAddEduModal = false;
  newEdu: Partial<EducationItem> = { graduationYear: 2025 };

  showAddSkillModal = false;
  newSkill: Partial<SkillItem> = { category: 'Language', level: 'Intermediate', yearsOfExperience: 1 };

  showAddProjectModal = false;
  newProject: Partial<ProjectItem> = { technologies: [] };
  projectTechInput = '';

  showAddExpModal = false;
  newExp: Partial<ExperienceItem> = { isCurrent: false };

  showAddCertModal = false;
  newCert: Partial<CertificationItem> = {};

  activeTab: 'general' | 'resume' | 'security' | 'skills' | 'projects' | 'education' | 'experience' = 'general';

  ngOnInit() {
    this.editName = this.authService.currentUser()?.name || '';
    this.editEmail = this.authService.currentUser()?.email || '';
    this.fetchProfile();
  }

  fetchProfile() {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.data) {
          this.profile = res.data;
          if (this.profile.user?.name) {
            this.editName = this.profile.user.name;
          }
          if (this.profile.user?.email) {
            this.editEmail = this.profile.user.email;
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get userAvatar(): string {
    const user = this.authService.currentUser();
    if (user?.avatar) return user.avatar;
    const name = encodeURIComponent(user?.name || this.editName || 'User');
    return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&bold=true`;
  }

  // 1. Name Change Functionality
  saveName() {
    if (!this.editName.trim()) {
      this.toast.warning('Please enter a valid full name.');
      return;
    }

    this.isUpdatingName = true;
    this.authService.updateDetails({ name: this.editName.trim() }).subscribe({
      next: () => {
        this.isUpdatingName = false;
        if (this.profile && this.profile.user) {
          this.profile.user.name = this.editName.trim();
        }
        this.toast.success('Your name has been updated successfully!');
      },
      error: () => {
        this.isUpdatingName = false;
      },
    });
  }

  // 1.1 Email Change Functionality
  saveEmail() {
    if (!this.editEmail.trim()) {
      this.toast.warning('Please enter a valid email address.');
      return;
    }

    this.isUpdatingEmail = true;
    this.authService.updateDetails({ email: this.editEmail.trim().toLowerCase() }).subscribe({
      next: () => {
        this.isUpdatingEmail = false;
        if (this.profile && this.profile.user) {
          this.profile.user.email = this.editEmail.trim().toLowerCase();
        }
        this.toast.success('Your email address has been updated successfully!');
      },
      error: () => {
        this.isUpdatingEmail = false;
      },
    });
  }

  // 2. Profile Picture (Avatar) Upload
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toast.warning('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toast.warning('Profile picture must be under 5MB.');
      return;
    }

    this.isUploadingAvatar = true;
    const formData = new FormData();
    formData.append('avatar', file);

    this.profileService.uploadAvatar(formData).subscribe({
      next: (res: any) => {
        this.isUploadingAvatar = false;
        if (res.data?.avatar) {
          this.authService.setAvatar(res.data.avatar);
          if (this.profile && this.profile.user) {
            this.profile.user.avatar = res.data.avatar;
          }
        }
        this.toast.success('Profile picture updated successfully!');
      },
      error: () => {
        this.isUploadingAvatar = false;
        this.toast.error('Failed to upload profile picture.');
      },
    });
  }

  resetAvatarToInitials() {
    this.authService.updateDetails({ avatar: '' }).subscribe({
      next: () => {
        this.authService.setAvatar('');
        if (this.profile && this.profile.user) {
          this.profile.user.avatar = '';
        }
        this.toast.info('Profile picture reset to default initials avatar.');
      },
    });
  }

  // 3. Password Change Functionality
  changePassword() {
    if (!this.currentPassword || !this.newPassword) {
      this.toast.warning('Please enter both your current password and new password.');
      return;
    }

    if (this.newPassword.length < 6) {
      this.toast.warning('New password must be at least 6 characters long.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toast.warning('New password and confirm password do not match.');
      return;
    }

    this.isChangingPassword = true;
    this.authService
      .updatePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.isChangingPassword = false;
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.toast.success('Password changed successfully!');
        },
        error: () => {
          this.isChangingPassword = false;
        },
      });
  }

  // 4. Resume Upload & ATS Scan Functionality
  onResumeFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedResumeFile = file;
      this.resumeFileName = file.name;
    }
  }

  uploadResume() {
    if (!this.selectedResumeFile) {
      this.toast.warning('Please select a resume file (PDF, DOCX, TXT) to upload.');
      return;
    }

    this.isUploadingResume = true;
    const formData = new FormData();
    formData.append('resume', this.selectedResumeFile);

    this.profileService.uploadResume(formData).subscribe({
      next: (res: any) => {
        this.isUploadingResume = false;
        if (res.data?.profile) {
          this.profile = res.data.profile;
        }
        this.selectedResumeFile = null;
        this.toast.success('Resume uploaded and ATS analyzed successfully!');
      },
      error: () => {
        this.isUploadingResume = false;
        this.toast.error('Resume upload failed. Please try again.');
      },
    });
  }

  // 5. General Profile Save
  saveGeneralProfile() {
    if (!this.profile) return;
    this.isSaving = true;

    // Also include name if edited
    const payload = {
      ...this.profile,
      name: this.editName,
    };

    this.profileService.updateProfile(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.data) {
          this.profile = res.data;
        }
        this.toast.success('Profile updated successfully!');
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }

  // Skills
  addSkill() {
    if (!this.newSkill.name?.trim()) return;
    this.profileService.addSkill(this.newSkill).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.showAddSkillModal = false;
        this.newSkill = { category: 'Language', level: 'Intermediate', yearsOfExperience: 1 };
        this.toast.success('Skill added');
      },
    });
  }

  deleteSkill(id?: string) {
    if (!id) return;
    this.profileService.deleteSkill(id).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.toast.info('Skill removed');
      },
    });
  }

  // Education
  addEducation() {
    if (!this.newEdu.college?.trim() || !this.newEdu.degree?.trim()) return;
    this.profileService.addEducation(this.newEdu).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.showAddEduModal = false;
        this.newEdu = { graduationYear: 2025 };
        this.toast.success('Education record added');
      },
    });
  }

  deleteEducation(id?: string) {
    if (!id) return;
    this.profileService.deleteEducation(id).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.toast.info('Education record deleted');
      },
    });
  }

  // Projects
  addProject() {
    if (!this.newProject.title?.trim() || !this.newProject.description?.trim()) return;
    if (this.projectTechInput.trim()) {
      this.newProject.technologies = this.projectTechInput.split(',').map((t) => t.trim());
    }

    this.profileService.addProject(this.newProject).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.showAddProjectModal = false;
        this.newProject = {};
        this.projectTechInput = '';
        this.toast.success('Project added');
      },
    });
  }

  deleteProject(id?: string) {
    if (!id) return;
    this.profileService.deleteProject(id).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.toast.info('Project deleted');
      },
    });
  }

  // Experience
  addExperience() {
    if (!this.newExp.title?.trim() || !this.newExp.company?.trim()) return;
    this.profileService.addExperience(this.newExp).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.showAddExpModal = false;
        this.newExp = { isCurrent: false };
        this.toast.success('Experience record added');
      },
    });
  }

  deleteExperience(id?: string) {
    if (!id) return;
    this.profileService.deleteExperience(id).subscribe({
      next: (res) => {
        if (res.data) this.profile = res.data;
        this.toast.info('Experience deleted');
      },
    });
  }
}
