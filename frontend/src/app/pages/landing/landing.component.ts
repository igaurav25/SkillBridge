import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, JobCardComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  private jobService = inject(JobService);
  private router = inject(Router);
  authService = inject(AuthService);

  featuredJobs: Job[] = [];
  searchTitle = '';
  searchLocation = '';
  isLoading = true;

  popularSearches = ['Angular', 'Node.js', 'Full Stack', 'Remote Internships', 'TypeScript', 'MongoDB'];

  ngOnInit() {
    this.jobService.getJobs({ limit: 4, sort: 'popular' }).subscribe({
      next: (res) => {
        this.featuredJobs = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onSearch() {
    this.router.navigate(['/jobs'], {
      queryParams: {
        search: this.searchTitle || undefined,
        location: this.searchLocation || undefined,
      },
    });
  }

  quickSearch(term: string) {
    this.router.navigate(['/jobs'], { queryParams: { search: term } });
  }
}
