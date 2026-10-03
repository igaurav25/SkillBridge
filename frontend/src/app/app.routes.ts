import { Routes } from '@angular/router';
import { authGuard, guestGuard, studentGuard, recruiterGuard, adminGuard } from './guards/auth.guard';

// Public Pages
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { JobListComponent } from './pages/jobs/job-list.component';
import { JobDetailsComponent } from './pages/jobs/job-details.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CompanyDetailsComponent } from './pages/companies/company-details.component';

// Student & User Pages
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResumeBuilderComponent } from './pages/resume-builder/resume-builder.component';
import { ResumeAnalyzerComponent } from './pages/resume-analyzer/resume-analyzer.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { SavedJobsComponent } from './pages/saved-jobs/saved-jobs.component';
import { SkillGapComponent } from './pages/skill-gap/skill-gap.component';
import { CareerAssistantComponent } from './pages/career-assistant/career-assistant.component';
import { InterviewPrepComponent } from './pages/interview-prep/interview-prep.component';

// Recruiter & Admin Pages
import { RecruiterDashboardComponent } from './pages/recruiter-dashboard/recruiter-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  // Public
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailsComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/:id', component: CompanyDetailsComponent },

  // Student & Candidate Protected
  { path: 'dashboard', component: StudentDashboardComponent, canActivate: [authGuard] },
  { path: 'student/dashboard', component: StudentDashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'resume-builder', component: ResumeBuilderComponent, canActivate: [authGuard] },
  { path: 'resume-analyzer', component: ResumeAnalyzerComponent, canActivate: [authGuard] },
  { path: 'applications', component: ApplicationsComponent, canActivate: [authGuard] },
  { path: 'saved-jobs', component: SavedJobsComponent, canActivate: [authGuard] },
  { path: 'skill-gap', component: SkillGapComponent, canActivate: [authGuard] },
  { path: 'career-assistant', component: CareerAssistantComponent, canActivate: [authGuard] },
  { path: 'interview-prep', component: InterviewPrepComponent, canActivate: [authGuard] },

  // Recruiter Protected
  { path: 'recruiter', component: RecruiterDashboardComponent, canActivate: [authGuard, recruiterGuard] },
  { path: 'recruiter/dashboard', component: RecruiterDashboardComponent, canActivate: [authGuard, recruiterGuard] },
  { path: 'recruiter/post-job', component: RecruiterDashboardComponent, canActivate: [authGuard, recruiterGuard] },
  { path: 'recruiter/applications', component: RecruiterDashboardComponent, canActivate: [authGuard, recruiterGuard] },
  { path: 'recruiter/candidates', component: RecruiterDashboardComponent, canActivate: [authGuard, recruiterGuard] },

  // Admin Protected (Strictly restricted to Admin role only)
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/users', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/jobs', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/reports', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },

  // Catch-all
  { path: '**', redirectTo: '' }
];
