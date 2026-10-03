export interface SkillGapAnalysisResult {
  targetRole: string;
  readinessScore: number;
  existingSkills: string[];
  missingSkills: string[];
  learningOrder: {
    step: number;
    skill: string;
    duration: string;
    reason: string;
  }[];
  suggestedProjects: {
    title: string;
    skills: string[];
    description: string;
  }[];
  suggestedTechnologies: string[];
  actionPlan: string;
}

export interface ReportItem {
  _id: string;
  reporter?: any;
  targetType: 'Job' | 'Company' | 'User' | string;
  targetId: string;
  targetTitle?: string;
  reason: string;
  description?: string;
  details?: string;
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected' | string;
  adminNotes?: string;
  createdAt: string;
}
