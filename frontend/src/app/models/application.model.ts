export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn'
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'withdrawn'
  | string;

export interface TimelineItem {
  _id?: string;
  status: ApplicationStatus;
  note?: string;
  changedAt: string;
  changedBy?: string;
}

export interface InterviewDetails {
  scheduledDate?: string;
  mode?: 'Google Meet' | 'Zoom' | 'In-Person' | 'Phone' | string;
  link?: string;
  notes?: string;
}

export interface Application {
  _id: string;
  job: any;
  candidate?: any;
  user?: any;
  recruiter?: any;
  resume?: any;
  resumeUrl?: string;
  resumeSnapshot?: any;
  coverLetter?: string;
  status: ApplicationStatus;
  timeline: TimelineItem[];
  recruiterNotes?: string;
  interviewDetails?: InterviewDetails;
  matchScore?: number;
  matchDetails?: {
    matchedSkills: string[];
    missingSkills: string[];
    recommendation: string;
  };
  createdAt: string;
  updatedAt: string;
}
