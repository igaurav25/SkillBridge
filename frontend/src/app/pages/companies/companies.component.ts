import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  private companyService = inject(CompanyService);

  companies: Company[] = [];
  isLoading = true;
  searchTerm = '';
  selectedIndustry = '';
  isVerifiedOnly = false;

  industries = [
    'All',
    'Technology & AI',
    'Financial Technology',
    'E-Commerce & Logistics',
    'Healthcare & Biotech',
    'Enterprise SaaS',
    'EdTech'
  ];

  ngOnInit() {
    this.fetchCompanies();
  }

  fetchCompanies() {
    this.isLoading = true;
    this.companyService.getCompanies({
      search: this.searchTerm || undefined,
      industry: this.selectedIndustry && this.selectedIndustry !== 'All' ? this.selectedIndustry : undefined,
      isVerified: this.isVerifiedOnly ? true : undefined
    }).subscribe({
      next: (res) => {
        this.companies = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectIndustry(industry: string) {
    this.selectedIndustry = industry;
    this.fetchCompanies();
  }
}
