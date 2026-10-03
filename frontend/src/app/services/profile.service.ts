import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/profiles';
  private readonly USERS_URL = 'http://localhost:5000/api/users';

  getMyProfile(): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.API_URL}/me`);
  }

  updateProfile(profileData: Partial<Profile>): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(`${this.API_URL}/me`, profileData);
  }

  uploadResume(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/resume`, formData);
  }

  uploadAvatar(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('http://localhost:5000/api/auth/avatar', formData);
  }

  addEducation(edu: any): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(`${this.API_URL}/education`, edu);
  }

  deleteEducation(eduId: string): Observable<ApiResponse<Profile>> {
    return this.http.delete<ApiResponse<Profile>>(`${this.API_URL}/education/${eduId}`);
  }

  addSkill(skill: any): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(`${this.API_URL}/skills`, skill);
  }

  deleteSkill(skillId: string): Observable<ApiResponse<Profile>> {
    return this.http.delete<ApiResponse<Profile>>(`${this.API_URL}/skills/${skillId}`);
  }

  addProject(project: any): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(`${this.API_URL}/projects`, project);
  }

  deleteProject(projectId: string): Observable<ApiResponse<Profile>> {
    return this.http.delete<ApiResponse<Profile>>(`${this.API_URL}/projects/${projectId}`);
  }

  addExperience(exp: any): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(`${this.API_URL}/experience`, exp);
  }

  deleteExperience(expId: string): Observable<ApiResponse<Profile>> {
    return this.http.delete<ApiResponse<Profile>>(`${this.API_URL}/experience/${expId}`);
  }

  addCertification(cert: any): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(`${this.API_URL}/certifications`, cert);
  }

  deleteCertification(certId: string): Observable<ApiResponse<Profile>> {
    return this.http.delete<ApiResponse<Profile>>(`${this.API_URL}/certifications/${certId}`);
  }

  getPublicProfile(userId: string): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.API_URL}/user/${userId}`);
  }

  searchCandidates(filters: { name?: string; skill?: string; role?: string; location?: string } = {}): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.skill) params = params.set('skill', filters.skill);
    if (filters.role) params = params.set('role', filters.role);
    if (filters.location) params = params.set('location', filters.location);
    return this.http.get<ApiResponse<any[]>>(`${this.USERS_URL}/candidates`, { params });
  }
}
