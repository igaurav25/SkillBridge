import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/applications';

  applyForJob(
    jobId: string,
    data: { resumeId?: string; resumeUrl?: string; coverLetter?: string }
  ): Observable<ApiResponse<Application>> {
    return this.http.post<ApiResponse<Application>>(`${this.API_URL}/apply/${jobId}`, data);
  }

  getMyApplications(): Observable<ApiResponse<Application[]>> {
    return this.http.get<ApiResponse<Application[]>>(`${this.API_URL}/my`);
  }

  getApplicationById(id: string): Observable<ApiResponse<Application>> {
    return this.http.get<ApiResponse<Application>>(`${this.API_URL}/${id}`);
  }

  withdrawApplication(id: string, reason?: string): Observable<ApiResponse<Application>> {
    return this.http.put<ApiResponse<Application>>(`${this.API_URL}/${id}/withdraw`, { reason });
  }

  getRecruiterApplications(filter: { status?: string; jobId?: string } = {}): Observable<ApiResponse<Application[]>> {
    let params = new HttpParams();
    if (filter.status) params = params.set('status', filter.status);
    if (filter.jobId) params = params.set('jobId', filter.jobId);
    return this.http.get<ApiResponse<Application[]>>(`${this.API_URL}/recruiter/all`, { params });
  }

  updateApplicationStatus(
    id: string,
    data: {
      status: string;
      note?: string;
      recruiterNotes?: string;
      interviewDetails?: any;
    }
  ): Observable<ApiResponse<Application>> {
    return this.http.put<ApiResponse<Application>>(`${this.API_URL}/${id}/status`, data);
  }
}
