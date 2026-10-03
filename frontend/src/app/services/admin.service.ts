import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';
import { ReportItem } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/admin';

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/stats`);
  }

  getUsers(paramsObj: { role?: string; status?: string; search?: string; page?: number } = {}): Observable<ApiResponse<User[]>> {
    let params = new HttpParams();
    Object.keys(paramsObj).forEach((key) => {
      const val = (paramsObj as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });
    return this.http.get<ApiResponse<User[]>>(`${this.API_URL}/users`, { params });
  }

  updateUserStatus(id: string, status: 'active' | 'suspended'): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/users/${id}/status`, { status });
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/users/${id}`);
  }

  getAllJobs(paramsObj: { status?: string; reportedOnly?: boolean; page?: number } = {}): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (paramsObj.status) params = params.set('status', paramsObj.status);
    if (paramsObj.reportedOnly) params = params.set('reportedOnly', 'true');
    if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/jobs`, { params });
  }

  toggleCompanyVerification(companyId: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/companies/${companyId}/verify`, {});
  }

  getReports(status?: string): Observable<ApiResponse<ReportItem[]>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<ReportItem[]>>(`${this.API_URL}/reports`, { params });
  }

  updateReportStatus(id: string, status: string, adminNotes?: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/reports/${id}/status`, { status, adminNotes });
  }

  getProfile(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/profile`);
  }

  updateProfile(data: { name?: string; email?: string; phone?: string }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.API_URL}/profile`, data);
  }

  updatePassword(data: { currentPassword: string; newPassword: string }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.API_URL}/password`, data);
  }
}

