import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/companies';

  getCompanies(filters: { search?: string; industry?: string; location?: string; isVerified?: boolean } = {}): Observable<ApiResponse<Company[]>> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.industry) params = params.set('industry', filters.industry);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.isVerified !== undefined) params = params.set('isVerified', filters.isVerified.toString());
    return this.http.get<ApiResponse<Company[]>>(this.API_URL, { params });
  }

  getCompanyById(id: string): Observable<ApiResponse<Company>> {
    return this.http.get<ApiResponse<Company>>(`${this.API_URL}/${id}`);
  }

  getMyCompany(): Observable<ApiResponse<Company>> {
    return this.http.get<ApiResponse<Company>>(`${this.API_URL}/my`);
  }

  createOrUpdateCompany(companyData: Partial<Company>): Observable<ApiResponse<Company>> {
    return this.http.post<ApiResponse<Company>>(this.API_URL, companyData);
  }
}
