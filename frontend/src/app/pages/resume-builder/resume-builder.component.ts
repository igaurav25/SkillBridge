import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../services/toast.service';
import { Resume } from '../../models/resume.model';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css'],
})
export class ResumeBuilderComponent implements OnInit {
  private resumeService = inject(ResumeService);
  private profileService = inject(ProfileService);
  private toast = inject(ToastService);

  userResumes: Resume[] = [];
  activeResume: Partial<Resume> = {
    title: 'Software Developer Resume',
    templateId: 'modern',
    personalDetails: { fullName: '', email: '', phone: '', location: '', github: '', linkedin: '', portfolio: '' },
    summary: '',
    education: [],
    skills: [],
    experience: [],
    projects: [],
  };

  selectedTemplate: 'modern' | 'executive' | 'tech' | 'minimal' = 'modern';
  skillsInput = '';
  isSaving = false;

  ngOnInit() {
    this.fetchResumes();
  }

  fetchResumes() {
    this.resumeService.getMyResumes().subscribe({
      next: (res) => {
        this.userResumes = res.data || [];
        if (this.userResumes.length > 0) {
          this.loadResume(this.userResumes[0]);
        } else {
          this.populateFromProfile();
        }
      },
    });
  }

  populateFromProfile() {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.data) {
          const p = res.data;
          this.activeResume = {
            title: `${p.preferredRole || 'Developer'} Resume`,
            templateId: 'modern',
            personalDetails: {
              fullName: p.user?.name || '',
              email: p.user?.email || '',
              phone: p.phone || '',
              location: p.location || '',
              github: p.github || '',
              linkedin: p.linkedin || '',
              portfolio: p.portfolio || '',
            },
            summary: p.about || '',
            education: p.education || [],
            skills: (p.skills || []).map((s) => ({ name: s.name, category: s.category })),
            experience: p.experience || [],
            projects: p.projects || [],
          };
          this.skillsInput = (this.activeResume.skills || []).map((s) => s.name).join(', ');
        }
      },
    });
  }

  loadResume(resume: Resume) {
    this.activeResume = JSON.parse(JSON.stringify(resume));
    this.selectedTemplate = resume.templateId || 'modern';
    this.skillsInput = (this.activeResume.skills || []).map((s) => s.name).join(', ');
  }

  saveResume() {
    this.isSaving = true;

    if (this.skillsInput.trim()) {
      this.activeResume.skills = this.skillsInput.split(',').map((s) => ({
        name: s.trim(),
        category: 'General',
      }));
    }

    this.activeResume.templateId = this.selectedTemplate;

    if (this.activeResume._id) {
      this.resumeService.updateResume(this.activeResume._id, this.activeResume).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.toast.success('Resume updated successfully!');
          this.fetchResumes();
        },
        error: () => (this.isSaving = false),
      });
    } else {
      this.resumeService.createResume(this.activeResume).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.toast.success('New resume saved!');
          this.fetchResumes();
        },
        error: () => (this.isSaving = false),
      });
    }
  }

  printResume() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  createNewBlank() {
    this.activeResume = {
      title: `Resume ${this.userResumes.length + 1}`,
      templateId: 'modern',
      personalDetails: { fullName: '', email: '', phone: '', location: '' },
      summary: '',
      education: [],
      skills: [],
      experience: [],
      projects: [],
    };
    this.skillsInput = '';
  }
}
