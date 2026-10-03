import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { InterviewQuestionItem, MockInterviewSession } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/interviews';

  getQuestions(paramsObj: { category?: string; difficulty?: string; search?: string; page?: number } = {}): Observable<ApiResponse<InterviewQuestionItem[]>> {
    let params = new HttpParams();
    Object.keys(paramsObj).forEach((key) => {
      const val = (paramsObj as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });
    return this.http.get<ApiResponse<InterviewQuestionItem[]>>(`${this.API_URL}/questions`, { params });
  }

  getCategories(): Observable<ApiResponse<{ name: string; count: number }[]>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/categories`);
  }

  startMockSession(payload: { category: string; targetRole?: string; difficulty?: string; questionCount?: number }): Observable<ApiResponse<MockInterviewSession>> {
    return this.http.post<ApiResponse<MockInterviewSession>>(`${this.API_URL}/mock/start`, payload);
  }

  submitMockAnswer(sessionId: string, payload: { questionIndex: number; userAnswer: string }): Observable<ApiResponse<{ session: MockInterviewSession; evaluation: any }>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/mock/${sessionId}/answer`, payload);
  }

  getMyMockSessions(): Observable<ApiResponse<MockInterviewSession[]>> {
    return this.http.get<ApiResponse<MockInterviewSession[]>>(`${this.API_URL}/mock/my`);
  }

  getMockSessionById(sessionId: string): Observable<ApiResponse<MockInterviewSession>> {
    return this.http.get<ApiResponse<MockInterviewSession>>(`${this.API_URL}/mock/${sessionId}`);
  }
}
