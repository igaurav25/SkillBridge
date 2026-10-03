import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AIAnalysisResult } from '../../models/resume.model';

@Component({
  selector: 'app-resume-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-analyzer.component.html',
  styleUrls: ['./resume-analyzer.component.css'],
})
export class ResumeAnalyzerComponent {
  private resumeService = inject(ResumeService);
  private profileService = inject(ProfileService);
  authService = inject(AuthService);
  private toast = inject(ToastService);

  targetRole = 'Full Stack Developer';
  resumeText = '';
  selectedFile: File | null = null;
  fileName = '';
  isAnalyzing = false;
  analysis: AIAnalysisResult | null = null;

  availableRoles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'AI/ML Developer',
    'Cloud Engineer',
  ];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  analyzeResume() {
    if (!this.selectedFile && !this.resumeText.trim()) {
      this.toast.warning('Please upload a resume file or paste your resume text.');
      return;
    }

    this.isAnalyzing = true;
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('resume', this.selectedFile);
    }
    if (this.resumeText) {
      formData.append('resumeText', this.resumeText);
    }
    formData.append('targetRole', this.targetRole);

    this.resumeService.uploadAndAnalyzeResume(formData).subscribe({
      next: (res) => {
        this.isAnalyzing = false;
        if (res.data?.aiAnalysis) {
          this.analysis = res.data.aiAnalysis;
          this.toast.success('Resume analyzed successfully by AI!');
        }
      },
      error: () => {
        this.isAnalyzing = false;
      },
    });
  }

  populateFromProfile() {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (!res.data) {
          this.toast.warning('Please fill your genuine details in your Profile first.');
          return;
        }
        const p = res.data;
        const user = this.authService.currentUser();
        const name = user?.name || p.user?.name || 'STUDENT NAME';
        const email = user?.email || p.user?.email || '';
        const contactParts = [email, p.phone, p.location, p.github].filter(Boolean).join(' | ');

        let text = `${name.toUpperCase()}\n${contactParts}\n\n`;

        if (p.about) {
          text += `SUMMARY:\n${p.about}\n\n`;
        }

        if (p.education && p.education.length > 0) {
          text += `EDUCATION:\n`;
          for (const edu of p.education) {
            text += `${edu.college} - ${edu.degree} in ${edu.fieldOfStudy || 'CS'} (${edu.graduationYear})${edu.cgpa ? ' | CGPA: ' + edu.cgpa : ''}\n`;
          }
          text += `\n`;
        }

        if (p.skills && p.skills.length > 0) {
          text += `TECHNICAL SKILLS:\n`;
          text += p.skills.map((s) => s.name).join(', ') + '\n\n';
        }

        if (p.experience && p.experience.length > 0) {
          text += `EXPERIENCE:\n`;
          for (const exp of p.experience) {
            text += `${exp.title} | ${exp.company} (${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate})\n`;
            if (exp.description) text += `${exp.description}\n`;
          }
          text += `\n`;
        }

        if (p.projects && p.projects.length > 0) {
          text += `PROJECTS:\n`;
          for (const proj of p.projects) {
            text += `${proj.title} (${(proj.technologies || []).join(', ')})\n`;
            if (proj.description) text += `${proj.description}\n`;
          }
        }

        if (!text.trim() || text.length < 50) {
          this.toast.info('Your profile has minimal details. Fill your real college, skills and projects in Profile.');
        } else {
          this.toast.success('Imported your genuine profile details!');
        }

        this.resumeText = text.trim();
      },
      error: () => {
        this.toast.error('Could not fetch profile details.');
      },
    });
  }

  loadSampleDemoText() {
    this.populateFromProfile();
  }
}
