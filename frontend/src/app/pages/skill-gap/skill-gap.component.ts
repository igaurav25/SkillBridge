import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkillService } from '../../services/skill.service';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../services/toast.service';
import { SkillGapAnalysisResult } from '../../models/skill.model';

@Component({
  selector: 'app-skill-gap',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './skill-gap.component.html',
  styleUrls: ['./skill-gap.component.css'],
})
export class SkillGapComponent implements OnInit {
  private skillService = inject(SkillService);
  private profileService = inject(ProfileService);
  private toast = inject(ToastService);

  targetRoles: { title: string; skillsCount: number; skills: string[] }[] = [];
  selectedRole = 'Full Stack Developer';
  isLoading = true;
  isAnalyzing = false;
  gapAnalysis: SkillGapAnalysisResult | null = null;
  userSkills: string[] = [];

  ngOnInit() {
    this.skillService.getTargetRoles().subscribe({
      next: (res) => {
        this.targetRoles = res.data || [];
        this.runAnalysis();
      },
    });

    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.data?.skills) {
          this.userSkills = res.data.skills.map((s) => s.name);
        }
      },
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.runAnalysis();
  }

  runAnalysis() {
    this.isAnalyzing = true;
    this.skillService.analyzeMySkillGap(this.selectedRole).subscribe({
      next: (res) => {
        if (res.data) {
          this.gapAnalysis = res.data;
        }
        this.isAnalyzing = false;
        this.isLoading = false;
      },
      error: () => {
        this.isAnalyzing = false;
        this.isLoading = false;
      },
    });
  }
}
