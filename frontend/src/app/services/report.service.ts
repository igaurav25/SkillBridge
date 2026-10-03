import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ReportItem } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/reports';

  createReport(reportData: {
    targetType: 'Job' | 'Company' | 'User';
    targetId: string;
    targetTitle?: string;
    reason: string;
    description: string;
  }): Observable<ApiResponse<ReportItem>> {
    return this.http.post<ApiResponse<ReportItem>>(this.API_URL, reportData);
  }

  getMyReports(): Observable<ApiResponse<ReportItem[]>> {
    return this.http.get<ApiResponse<ReportItem[]>>(`${this.API_URL}/my`);
  }
}
