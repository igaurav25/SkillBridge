export interface NotificationItem {
  _id: string;
  recipient: string;
  sender?: any;
  type: 'application_status' | 'job_match' | 'interview' | 'recruiter_message' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  metadata?: {
    jobId?: string;
    applicationId?: string;
  };
  createdAt: string;
}

export interface InterviewQuestionItem {
  _id: string;
  category: string;
  topic: string;
  question: string;
  answer: string;
  explanation?: string;
  codeSnippet?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export interface MockQuestion {
  question: string;
  category?: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
  suggestedAnswer?: string;
  answeredAt?: string;
}

export interface MockInterviewSession {
  _id: string;
  user: string;
  category: string;
  targetRole: string;
  difficulty: string;
  questions: MockQuestion[];
  totalScore: number;
  overallFeedback: string;
  status: 'in_progress' | 'completed';
  completedAt?: string;
  createdAt: string;
}
