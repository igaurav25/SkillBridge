import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="sb-footer">
      <div class="container">
        <div class="footer-top grid grid-4 gap-8">
          <!-- Col 1: Brand Info -->
          <div class="footer-col">
            <div class="brand-text flex items-center gap-2 mb-3">
              <span class="brand-name font-bold text-xl">Skill<span class="text-gradient">Bridge</span></span>
              <span class="badge badge-primary text-xs">AI Platform</span>
            </div>
            <p class="text-sm text-secondary mb-4">
              AI-powered career acceleration, ATS resume intelligence, and job discovery built for modern engineers and students.
            </p>
            <div class="flex items-center gap-3">
              <span class="badge badge-neutral text-xs">Angular 19</span>
              <span class="badge badge-neutral text-xs">Node.js</span>
              <span class="badge badge-neutral text-xs">Gemini AI</span>
            </div>
          </div>

          <!-- Col 2: For Students -->
          <div class="footer-col">
            <h4 class="footer-heading mb-3">For Students</h4>
            <ul class="footer-links flex flex-col gap-2">
              <li><a routerLink="/jobs">Browse Tech Jobs</a></li>
              <li><a routerLink="/jobs" [queryParams]="{jobType: 'internship'}">Find Internships</a></li>
              <li><a routerLink="/resume-analyzer">AI Resume ATS Analyzer</a></li>
              <li><a routerLink="/resume-builder">Professional Resume Builder</a></li>
              <li><a routerLink="/skill-gap">Skill Gap Roadmap</a></li>
              <li><a routerLink="/career-assistant">AI Career Advisor</a></li>
            </ul>
          </div>

          <!-- Col 3: For Recruiters & Companies -->
          <div class="footer-col">
            <h4 class="footer-heading mb-3">For Recruiters</h4>
            <ul class="footer-links flex flex-col gap-2">
              <li><a routerLink="/recruiter/post-job">Post a Job or Internship</a></li>
              <li><a routerLink="/recruiter/candidates">Search Pre-Screened Talent</a></li>
              <li><a routerLink="/companies">Verified Company Profiles</a></li>
              <li><a routerLink="/recruiter/dashboard">Hiring Analytics</a></li>
            </ul>
          </div>

          <!-- Col 4: Platform & Support -->
          <div class="footer-col">
            <h4 class="footer-heading mb-3">Preparation & Support</h4>
            <ul class="footer-links flex flex-col gap-2">
              <li><a routerLink="/interview-prep">Interview Question Bank</a></li>
              <li><a routerLink="/interview-prep">AI Mock Interview Practice</a></li>
              <li><a routerLink="/admin/dashboard">System Status</a></li>
              <li><span class="text-sm text-muted">support&#64;skillbridge.com</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom flex items-center justify-between mt-8 pt-6">
          <p class="text-xs text-muted">
            &copy; 2026 SkillBridge Inc. All rights reserved. Built with Angular 19, Express, MongoDB & Google Gemini AI.
          </p>
          <div class="flex items-center gap-4 text-xs text-muted">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .sb-footer {
        background-color: var(--bg-primary);
        border-top: 1px solid var(--border-subtle);
        padding: 4rem 0 2rem;
        margin-top: 5rem;
      }
      .footer-heading {
        font-size: 0.95rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-primary);
      }
      .footer-links {
        list-style: none;
        padding: 0;
      }
      .footer-links a {
        font-size: 0.875rem;
        color: var(--text-secondary);
        transition: color 0.15s ease;
      }
      .footer-links a:hover {
        color: var(--primary-400);
      }
      .footer-bottom {
        border-top: 1px solid var(--border-subtle);
      }
    `,
  ],
})
export class FooterComponent {}
