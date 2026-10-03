export interface Company {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry: string;
  location: string;
  companySize: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  isVerified: boolean;
  verifiedAt?: string;
  activeJobs?: any[];
  createdAt: string;
}
