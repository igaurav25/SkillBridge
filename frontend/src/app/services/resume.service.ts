import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Resume } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/resumes';

  getMyResumes(): Observable<ApiResponse<Resume[]>> {
    return this.http.get<ApiResponse<Resume[]>>(this.API_URL);
  }

  getResumeById(id: string): Observable<ApiResponse<Resume>> {
    return this.http.get<ApiResponse<Resume>>(`${this.API_URL}/${id}`);
  }

  createResume(resumeData: Partial<Resume>): Observable<ApiResponse<Resume>> {
    return this.http.post<ApiResponse<Resume>>(this.API_URL, resumeData);
  }

  updateResume(id: string, resumeData: Partial<Resume>): Observable<ApiResponse<Resume>> {
    return this.http.put<ApiResponse<Resume>>(`${this.API_URL}/${id}`, resumeData);
  }

  deleteResume(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${id}`);
  }

  uploadAndAnalyzeResume(formData: FormData): Observable<ApiResponse<Resume>> {
    return this.http.post<ApiResponse<Resume>>(`${this.API_URL}/upload-and-analyze`, formData);
  }

  analyzeExistingResume(id: string, targetRole: string): Observable<ApiResponse<Resume>> {
    return this.http.post<ApiResponse<Resume>>(`${this.API_URL}/${id}/analyze`, { targetRole });
  }
}
