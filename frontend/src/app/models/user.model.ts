export type UserRole = 'student' | 'recruiter' | 'admin';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  loginEmail?: string;
  loginPhone?: string;
  authProvider?: string;
  passwordPreview?: string;
  passwordStatus?: string;
  role: UserRole;
  avatar?: string;
  headline?: string;
  companyName?: string;
  industry?: string;
  website?: string;
  location?: string;
  companySize?: string;
  totalJobsPosted?: number;
  isVerified?: boolean;
  status?: 'active' | 'suspended' | string;
  preferredRole?: string;
  preferredStream?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  targetSkills?: string[];
  education?: string;
  resumeScore?: number;
  applicationsCount?: number;
  savedJobsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}
