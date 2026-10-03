import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewService } from '../../services/interview.service';
import { ToastService } from '../../services/toast.service';
import { InterviewQuestionItem, MockInterviewSession } from '../../models/notification.model';

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-prep.component.html',
  styleUrls: ['./interview-prep.component.css'],
})
export class InterviewPrepComponent implements OnInit {
  private interviewService = inject(InterviewService);
  private toast = inject(ToastService);

  activeView: 'bank' | 'mock' = 'bank';

  // Bank filters
  categories = [
    'All',
    'JavaScript',
    'Angular',
    'Node.js',
    'MongoDB',
    'DSA',
    'DBMS',
    'OOP',
    'HR',
    'Aptitude',
  ];
  selectedCategory = 'All';
  selectedDifficulty = 'All';
  searchTerm = '';
  questions: InterviewQuestionItem[] = [];
  openQuestionId: string | null = null;
  isLoading = true;

  // Mock Session state
  mockCategory = 'JavaScript';
  mockRole = 'Full Stack Developer';
  mockDifficulty = 'Intermediate';
  activeMockSession: MockInterviewSession | null = null;
  currentQIndex = 0;
  userAnswerText = '';
  isEvaluatingAnswer = false;
  latestEvaluation: any = null;
  pastSessions: MockInterviewSession[] = [];

  ngOnInit() {
    this.fetchQuestions();
    this.fetchPastMockSessions();
  }

  fetchQuestions() {
    this.isLoading = true;
    this.interviewService
      .getQuestions({
        category: this.selectedCategory !== 'All' ? this.selectedCategory : undefined,
        difficulty: this.selectedDifficulty !== 'All' ? this.selectedDifficulty : undefined,
        search: this.searchTerm || undefined,
      })
      .subscribe({
        next: (res) => {
          this.questions = res.data || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  toggleAnswer(id: string) {
    this.openQuestionId = this.openQuestionId === id ? null : id;
  }

  // AI Mock Interview
  startMockInterview() {
    this.interviewService
      .startMockSession({
        category: this.mockCategory,
        targetRole: this.mockRole,
        difficulty: this.mockDifficulty,
        questionCount: 3,
      })
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.activeMockSession = res.data;
            this.currentQIndex = 0;
            this.userAnswerText = '';
            this.latestEvaluation = null;
            this.toast.success('AI Mock Interview started!');
          }
        },
      });
  }

  submitMockAnswer() {
    if (!this.activeMockSession || !this.userAnswerText.trim()) return;

    this.isEvaluatingAnswer = true;
    this.interviewService
      .submitMockAnswer(this.activeMockSession._id, {
        questionIndex: this.currentQIndex,
        userAnswer: this.userAnswerText,
      })
      .subscribe({
        next: (res) => {
          this.isEvaluatingAnswer = false;
          if (res.data) {
            this.activeMockSession = res.data.session;
            this.latestEvaluation = res.data.evaluation;
            this.toast.success(`Answer scored: ${res.data.evaluation.score}%!`);
          }
        },
        error: () => {
          this.isEvaluatingAnswer = false;
        },
      });
  }

  nextQuestion() {
    if (!this.activeMockSession) return;
    this.currentQIndex++;
    this.userAnswerText = '';
    this.latestEvaluation = null;
  }

  fetchPastMockSessions() {
    this.interviewService.getMyMockSessions().subscribe({
      next: (res) => {
        this.pastSessions = res.data || [];
      },
    });
  }
}
