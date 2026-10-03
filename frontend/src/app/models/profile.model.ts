export interface EducationItem {
  _id?: string;
  college: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  graduationYear: number;
  cgpa?: string;
  isCompleted?: boolean;
}

export interface SkillItem {
  _id?: string;
  name: string;
  category: 'Language' | 'Framework' | 'Database' | 'Cloud' | 'Tool' | 'Core CS' | 'Soft Skill' | 'Other';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
}

export interface ProjectItem {
  _id?: string;
  title: string;
  description: string;
  role?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  highlights?: string[];
}

export interface CertificationItem {
  _id?: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface ExperienceItem {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface AchievementItem {
  _id?: string;
  title: string;
  description?: string;
  date?: string;
}

export interface Profile {
  _id?: string;
  user: any;
  headline?: string;
  phone?: string;
  location?: string;
  about?: string;
  preferredRole?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  workTypePreference?: 'remote' | 'hybrid' | 'onsite' | 'any';
  github?: string;
  linkedin?: string;
  portfolio?: string;
  resumeUrl?: string;
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  experience: ExperienceItem[];
  achievements: AchievementItem[];
  profileCompletion: number;
  resumeScore?: number;
  atsBreakdown?: {
    skillsScore: number;
    projectsScore: number;
    experienceScore: number;
    keywordsScore: number;
  };
  suggestedImprovements?: string[];
  createdAt?: string;
  updatedAt?: string;
}
