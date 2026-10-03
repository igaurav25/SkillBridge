import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface ChatResponse {
  conversationId: string;
  reply: string;
  conversation: any;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/ai';

  chat(message: string, conversationId?: string, category = 'career_guidance'): Observable<ApiResponse<ChatResponse>> {
    return this.http.post<ApiResponse<ChatResponse>>(`${this.API_URL}/chat`, {
      message,
      conversationId,
      category,
    });
  }

  getConversations(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/conversations`);
  }

  getConversationById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/conversations/${id}`);
  }

  deleteConversation(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/conversations/${id}`);
  }

  generateCoverLetter(jobId: string, customInstructions?: string): Observable<ApiResponse<{ coverLetter: string; jobTitle: string; companyName: string }>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/generate-cover-letter`, {
      jobId,
      customInstructions,
    });
  }

  matchJob(jobId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/match-job/${jobId}`, {});
  }
}
