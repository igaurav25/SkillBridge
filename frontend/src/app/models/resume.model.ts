export interface AIAnalysisResult {
  profileStrength: number;
  skillsScore: number;
  projectsScore: number;
  experienceScore: number;
  keywordsScore: number;
  summary: string;
  detectedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weakSections: string[];
  atsSuggestions: string[];
  suggestedImprovements: string[];
  suggestedJobRoles: string[];
  suggestedProjects: string[];
  suggestedTechnologies: string[];
  analyzedAt?: string;
}

export interface Resume {
  _id: string;
  user: string;
  title: string;
  templateId: 'modern' | 'executive' | 'tech' | 'minimal';
  personalDetails: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  education: any[];
  experience: any[];
  skills: { name: string; category?: string }[];
  projects: any[];
  certifications?: any[];
  achievements?: any[];
  rawExtractedText?: string;
  aiAnalysis?: AIAnalysisResult;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
