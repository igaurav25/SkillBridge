import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, RouterModule, JobCardComponent],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);
  private toast = inject(ToastService);

  company: Company | null = null;
  activeJobs: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchCompany(id);
      }
    });
  }

  fetchCompany(id: string) {
    this.isLoading = true;
    this.companyService.getCompanyById(id).subscribe({
      next: (res) => {
        this.company = res.data || null;
        this.activeJobs = res.data?.activeJobs || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load company profile.');
      }
    });
  }
}
