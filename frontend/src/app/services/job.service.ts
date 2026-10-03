import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/jobs';
  private readonly SAVED_API_URL = 'http://localhost:5000/api/saved-jobs';

  getJobs(filters: Record<string, any> = {}): Observable<ApiResponse<Job[]>> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<ApiResponse<Job[]>>(this.API_URL, { params });
  }

  // Real-Time Multi-Platform Live Jobs (LinkedIn, Indeed, Internshala, Remotive)
  getLivePlatformJobs(filters: Record<string, any> = {}): Observable<ApiResponse<Job[]>> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<ApiResponse<Job[]>>(`${this.API_URL}/live-platforms`, { params });
  }

  // Real-Time Criteria Search (Stream, Course, Platform, Salary Min/Max, Role, Location)
  searchJobsByCriteria(criteria: {
    stream?: string;
    course?: string;
    role?: string;
    query?: string;
    location?: string;
    platform?: string;
    minSalary?: number;
    maxSalary?: number;
    jobType?: string;
    experienceLevel?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<Job[]> & { hasMore?: boolean; streamStats?: any; availablePlatforms?: any[] }> {
    return this.http.post<any>(`${this.API_URL}/criteria-search`, criteria);
  }

  // Get Courses Catalog for the "Select Course" expandable dropdown
  getCourses(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/courses`);
  }

  // Real-Time Live Job Polling
  checkLiveNewJobs(since?: string, stream?: string, course?: string): Observable<ApiResponse<Job[]>> {
    let params = new HttpParams();
    if (since) params = params.set('since', since);
    if (stream && stream !== 'all') params = params.set('stream', stream);
    if (course && course !== 'all') params = params.set('course', course);
    return this.http.get<ApiResponse<Job[]>>(`${this.API_URL}/live-check`, { params });
  }

  // Trigger Instant Live Job Ingestion Simulation
  simulateLiveJob(stream?: string, course?: string): Observable<ApiResponse<Job>> {
    return this.http.post<ApiResponse<Job>>(`${this.API_URL}/simulate-live`, { stream, course });
  }

  // 350 Job Platforms Directory
  getPlatforms(stream?: string, search?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (stream && stream !== 'all') params = params.set('stream', stream);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/platforms`, { params });
  }

  getJobById(id: string): Observable<ApiResponse<Job>> {
    return this.http.get<ApiResponse<Job>>(`${this.API_URL}/${id}`);
  }

  createJob(jobData: any): Observable<ApiResponse<Job>> {
    return this.http.post<ApiResponse<Job>>(this.API_URL, jobData);
  }

  updateJob(id: string, jobData: any): Observable<ApiResponse<Job>> {
    return this.http.put<ApiResponse<Job>>(`${this.API_URL}/${id}`, jobData);
  }

  deleteJob(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${id}`);
  }

  getRecruiterJobs(): Observable<ApiResponse<Job[]>> {
    return this.http.get<ApiResponse<Job[]>>(`${this.API_URL}/recruiter/myjobs`);
  }

  getPopularTags(): Observable<ApiResponse<{ popularRoles: string[]; popularSkills: string[] }>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/popular/tags`);
  }

  // Saved / Bookmarks
  getMySavedJobs(category?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    return this.http.get<ApiResponse<any[]>>(this.SAVED_API_URL, { params });
  }

  toggleSaveJob(jobId: string, category = 'General', notes = ''): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.SAVED_API_URL}/${jobId}`, { category, notes });
  }
}
