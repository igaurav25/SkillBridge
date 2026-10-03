import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { SkillGapAnalysisResult } from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/skills';

  getSkillCategories(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/categories`);
  }

  getTargetRoles(): Observable<ApiResponse<{ title: string; skillsCount: number; skills: string[] }[]>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/roles`);
  }

  analyzeMySkillGap(targetRole: string, manualSkills?: string[]): Observable<ApiResponse<SkillGapAnalysisResult>> {
    return this.http.post<ApiResponse<SkillGapAnalysisResult>>(`${this.API_URL}/analyze-gap`, {
      targetRole,
      manualSkills,
    });
  }
}
