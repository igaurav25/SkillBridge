export interface SalaryInfo {
  min: number;
  max: number;
  currency?: string;
  period?: 'yearly' | 'monthly' | 'hourly' | 'stipend' | string;
  isDisclosed?: boolean;
}

export interface JobMatchAnalysis {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export interface Job {
  _id: string;
  title: string;
  company: any;
  recruiter?: any;
  companyName?: string;
  companyLogo?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  requiredSkills?: string[];
  skillsRequired?: string[];
  preferredSkills?: string[];
  salary?: SalaryInfo | any;
  location: string;
  workType?: 'remote' | 'hybrid' | 'onsite' | string;
  workMode?: 'remote' | 'hybrid' | 'onsite' | 'on-site' | string;
  experienceLevel: 'internship' | 'fresher' | 'entry' | 'mid' | 'senior' | 'lead' | string;
  jobType?: 'full-time' | 'part-time' | 'internship' | 'contract' | string;
  type?: 'job' | 'internship' | 'part-time' | 'full-time' | string;
  status: 'active' | 'closed' | 'draft' | string;
  deadline?: string;
  applicantsCount?: number;
  applicationsCount?: number;
  reportCount?: number;
  viewsCount?: number;
  isFeatured?: boolean;
  isSaved?: boolean;
  isApplied?: boolean;
  platform?: 'LinkedIn' | 'Indeed' | 'Internshala' | 'Remotive' | string;
  platformIcon?: string;
  platformBadge?: string;
  platformUrl?: string;
  stream?: 'btech' | 'bba' | 'bcom' | 'government' | 'internship' | 'remote' | 'creative' | 'healthcare' | 'teaching' | 'law' | string;
  course?: string;
  applyUrl?: string;
  isLiveExternal?: boolean;
  isNewArrival?: boolean;
  postedAt?: string;
  matchAnalysis?: JobMatchAnalysis;
  createdAt?: string;
  updatedAt?: string;
}
