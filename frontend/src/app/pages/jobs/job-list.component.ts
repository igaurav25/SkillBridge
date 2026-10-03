import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { Job } from '../../models/job.model';
import { getDirectApplyUrl } from '../../utils/direct-apply.util';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, JobCardComponent],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
})
export class JobListComponent implements OnInit, OnDestroy {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);

  jobs: Job[] = [];
  isLoading = true;
  isLoadingMore = false;
  total = 0;
  currentPage = 1;
  totalPages = 1;
  hasMore = false;

  // View Mode: 'live_platforms' (Real-Time Aggregation from 350 Portals) vs 'internal' (SkillBridge network)
  activeMode: 'live_platforms' | 'internal' = 'live_platforms';

  // Primary Stream Filter (B.Tech, BBA, B.Com, Government, Internships, etc.)
  selectedStream = 'all';

  // Expandable Course Dropdown ("Select Course" requested by user)
  isCourseDropdownOpen = false;
  selectedCourse = 'all';
  selectedCourseLabel = 'All Courses & Degrees';
  coursesCatalog: any[] = [];

  // Real-Time Live Ingestion Watcher & Notifications
  lastSyncTimestamp = new Date().toISOString();
  livePollingSub: any = null;
  isSimulatingArrival = false;
  newArrivalsCount = 0;
  liveArrivalNotification: { title: string; platform: string; show: boolean } | null = null;

  streamCategories = [
    { id: 'all', label: 'All 350+ Platforms', icon: '🎓', count: 350, badge: 'All Tracks' },
    { id: 'btech', label: 'B.Tech / Engineering / IT', icon: '💻', count: 120, badge: 'Tech Giants & Startups' },
    { id: 'bba', label: 'BBA / MBA / Management', icon: '📊', count: 65, badge: 'Consulting & Sales' },
    { id: 'bcom', label: 'B.Com / Finance / Banking', icon: '📈', count: 50, badge: 'CA, IB & Banks' },
    { id: 'government', label: 'Government / Sarkari / PSU', icon: '🏛️', count: 45, badge: 'UPSC, SSC, RRB & PSUs' },
    { id: 'internship', label: 'Internships & Freshers', icon: '🚀', count: 40, badge: 'PM Scheme & AICTE' },
    { id: 'remote', label: 'Remote & Freelance', icon: '🌐', count: 55, badge: 'Worldwide USD/Remote' },
    { id: 'creative', label: 'Creative & Design', icon: '🎨', count: 25, badge: 'UI/UX & Media' },
    { id: 'healthcare', label: 'Healthcare & Medical', icon: '🩺', count: 20, badge: 'AIIMS, ICMR & Clinical' },
  ];

  // Specific Recognized Platforms within Selected Stream
  selectedPlatform = 'all';
  availablePlatforms: any[] = [];
  streamStats: Record<string, number> = {};

  // Search and Criteria Filters
  searchTerm = '';
  location = '';
  minSalary: number | null = null;
  maxSalary: number | null = null;
  selectedWorkTypes: string[] = [];
  selectedJobTypes: string[] = [];
  selectedExpLevels: string[] = [];
  sortBy = 'recent'; // Strictly newest first

  workTypes = ['remote', 'hybrid', 'onsite'];
  jobTypes = ['full-time', 'part-time', 'internship', 'contract'];
  expLevels = ['internship', 'entry', 'mid', 'senior'];

  // Job Details Interactive Modal State
  selectedJobForDetails: Job | null = null;
  isDetailsModalOpen = false;

  // 350 Platform Catalog Explorer Modal State
  isPlatformsModalOpen = false;
  allPlatformsList: any[] = [];
  filteredPlatformsCatalog: any[] = [];
  platformsSearchQuery = '';
  platformsModalCategory = 'all';

  ngOnInit() {
    this.loadCoursesCatalog();

    this.route.queryParams.subscribe((params) => {
      if (params['stream']) this.selectedStream = params['stream'];
      if (params['course']) {
        this.selectedCourse = params['course'];
        this.updateCourseLabelFromId(this.selectedCourse);
      }
      if (params['search']) this.searchTerm = params['search'];
      if (params['location']) this.location = params['location'];
      if (params['platform']) this.selectedPlatform = params['platform'];
      if (params['mode']) this.activeMode = params['mode'] as any;
      if (params['minSalary']) this.minSalary = Number(params['minSalary']);
      if (params['maxSalary']) this.maxSalary = Number(params['maxSalary']);

      this.fetchJobs(1, false);
    });

    // Preload platforms directory for quick modal access
    this.loadPlatformsDirectory();

    // Start background real-time sync for auto-ingestion of newly posted jobs
    this.startLiveSync();
  }

  ngOnDestroy() {
    if (this.livePollingSub) {
      clearInterval(this.livePollingSub);
      this.livePollingSub = null;
    }
  }

  // Load Structured Courses Catalog
  loadCoursesCatalog() {
    this.jobService.getCourses().subscribe({
      next: (res: any) => {
        if (res.data && res.data.length > 0) {
          this.coursesCatalog = res.data;
          this.updateCourseLabelFromId(this.selectedCourse);
        }
      },
      error: () => {
        // Fallback default catalog if server unreachable
        this.initDefaultCoursesCatalog();
      },
    });
  }

  updateCourseLabelFromId(courseId: string) {
    if (!courseId || courseId === 'all') {
      this.selectedCourseLabel = 'All Courses & Degrees';
      return;
    }
    for (const grp of this.coursesCatalog) {
      const match = grp.courses?.find((c: any) => c.id === courseId);
      if (match) {
        this.selectedCourseLabel = match.label;
        return;
      }
    }
  }

  // Toggle Course Selection Dropdown ("Select Course upr click kre toh niche expend ho")
  toggleCourseDropdown() {
    this.isCourseDropdownOpen = !this.isCourseDropdownOpen;
  }

  // Select a specific course/degree
  selectCourse(course: { id: string; label: string; stream: string }) {
    this.selectedCourse = course.id;
    this.selectedCourseLabel = course.label;
    if (course.stream && course.stream !== 'all') {
      this.selectedStream = course.stream;
    }
    this.selectedPlatform = 'all';
    this.currentPage = 1;
    this.isCourseDropdownOpen = false; // Auto-collapse to reveal jobs
    this.fetchJobs(1, false);
  }

  // Reset to All Courses
  resetCourse() {
    this.selectedCourse = 'all';
    this.selectedCourseLabel = 'All Courses & Degrees';
    this.currentPage = 1;
    this.isCourseDropdownOpen = false;
    this.fetchJobs(1, false);
  }

  // Real-Time Live Job Ingestion Engine: Polling interval
  startLiveSync() {
    if (this.livePollingSub) return;
    this.livePollingSub = setInterval(() => {
      if (this.activeMode !== 'live_platforms') return;

      this.jobService
        .checkLiveNewJobs(this.lastSyncTimestamp, this.selectedStream, this.selectedCourse)
        .subscribe({
          next: (res: any) => {
            if (res.data && res.data.length > 0) {
              const freshArrivals = res.data.filter(
                (fj: any) => !this.jobs.some((ej) => ej._id === fj._id)
              );
              if (freshArrivals.length > 0) {
                // Prepend to top: "upr se show honi chahiye new job or old niche jate rahe"
                this.jobs = [...freshArrivals, ...this.jobs];
                this.total += freshArrivals.length;
                this.newArrivalsCount += freshArrivals.length;
                this.lastSyncTimestamp = res.timestamp || new Date().toISOString();

                // Trigger toast
                this.triggerArrivalNotification(freshArrivals[0].title, freshArrivals[0].platform);
              }
            }
          },
          error: () => {},
        });
    }, 12000);
  }

  // Manual Trigger: User clicks "⚡ Simulate New Job Ingestion" for instant demonstration
  triggerLiveJobSimulation() {
    this.isSimulatingArrival = true;
    this.jobService
      .simulateLiveJob(this.selectedStream, this.selectedCourse)
      .subscribe({
        next: (res: any) => {
          this.isSimulatingArrival = false;
          if (res.data) {
            const incomingJob = res.data;
            // Prepend directly to top
            this.jobs = [incomingJob, ...this.jobs];
            this.total++;
            this.newArrivalsCount++;
            this.lastSyncTimestamp = new Date().toISOString();
            this.triggerArrivalNotification(incomingJob.title, incomingJob.platform);

            // Smoothly scroll to top so user instantly sees the newly arrived job card
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
        error: () => {
          this.isSimulatingArrival = false;
        },
      });
  }

  triggerArrivalNotification(title: string, platform: string) {
    this.liveArrivalNotification = {
      title,
      platform,
      show: true,
    };
    setTimeout(() => {
      if (this.liveArrivalNotification) {
        this.liveArrivalNotification.show = false;
      }
    }, 6000);
  }

  // Infinite Scroll Trigger on Window Scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isLoading || this.isLoadingMore || !this.hasMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // Trigger next page when within 300px from page bottom
    if (scrollPosition >= documentHeight - 300) {
      this.loadMoreOlderJobs();
    }
  }

  // Stream Selection Tab Change
  selectStream(streamId: string) {
    this.selectedStream = streamId;
    this.selectedPlatform = 'all';
    this.currentPage = 1;
    this.fetchJobs(1, false);
  }

  // Platform Sub-Chip Change
  setPlatform(platform: string) {
    this.selectedPlatform = platform;
    this.currentPage = 1;
    this.fetchJobs(1, false);
  }

  // Toggle internal vs live platforms mode
  setMode(mode: 'live_platforms' | 'internal') {
    this.activeMode = mode;
    this.currentPage = 1;
    this.fetchJobs(1, false);
  }

  applySalaryPreset(min: number, max: number) {
    this.minSalary = min;
    this.maxSalary = max;
    this.currentPage = 1;
    this.fetchJobs(1, false);
  }

  initDefaultCoursesCatalog() {
    this.coursesCatalog = [
      {
        group: 'Engineering, Tech & Coding',
        icon: '💻',
        courses: [
          { id: 'all_tech', label: 'All Tech & Engineering', stream: 'btech', badge: '120+ Portals' },
          { id: 'btech_cse', label: 'B.Tech - Computer Science & Engineering', stream: 'btech', badge: 'Top Demand' },
          { id: 'btech_it', label: 'B.Tech - Information Technology (IT)', stream: 'btech', badge: 'High CTC' },
          { id: 'btech_aiml', label: 'B.Tech - AI & Data Science / ML', stream: 'btech', badge: 'Frontier AI' },
          { id: 'btech_ece', label: 'B.Tech - Electronics & Communication (ECE)', stream: 'btech', badge: 'Hardware & IoT' },
          { id: 'btech_mech', label: 'B.Tech - Mechanical Engineering', stream: 'btech', badge: 'Core & CAD' },
          { id: 'btech_civil', label: 'B.Tech - Civil & Infrastructure', stream: 'btech', badge: 'Govt & Infra' },
          { id: 'bca_mca', label: 'BCA / MCA (Computer Applications)', stream: 'btech', badge: 'Software Track' },
          { id: 'poly_diploma', label: 'Polytechnic / Diploma Engineering', stream: 'btech', badge: 'Junior Engineer' },
        ],
      },
      {
        group: 'Commerce, Finance & Accounting',
        icon: '📈',
        courses: [
          { id: 'all_commerce', label: 'All Commerce & Finance', stream: 'bcom', badge: '50+ Portals' },
          { id: 'bcom', label: 'B.Com (General & Honours)', stream: 'bcom', badge: 'Corporate & Bank' },
          { id: 'mcom', label: 'M.Com (Master of Commerce)', stream: 'bcom', badge: 'Senior Finance' },
          { id: 'ca', label: 'Chartered Accountant (CA Inter & Final)', stream: 'bcom', badge: 'ICAI High Pay' },
          { id: 'cfa', label: 'CFA (Chartered Financial Analyst)', stream: 'bcom', badge: 'Wall Street' },
          { id: 'cs_cma', label: 'CS (Company Secretary) / CMA', stream: 'bcom', badge: 'Governance' },
          { id: 'banking_finance', label: 'Banking, Insurance & Securities', stream: 'bcom', badge: 'SBI, IBPS & RBI' },
        ],
      },
      {
        group: 'Management, Business & Sales',
        icon: '📊',
        courses: [
          { id: 'all_mgmt', label: 'All Management & Business', stream: 'bba', badge: '65+ Portals' },
          { id: 'bba', label: 'BBA (Bachelor of Business Administration)', stream: 'bba', badge: 'Business Lead' },
          { id: 'mba', label: 'MBA (Marketing, Finance, Operations, HR)', stream: 'bba', badge: 'Leadership' },
          { id: 'bms', label: 'BMS / BBM (Management Studies)', stream: 'bba', badge: 'Corporate Trainee' },
        ],
      },
      {
        group: 'Government, Civil Services & Public Sector',
        icon: '🏛️',
        courses: [
          { id: 'all_govt', label: 'All Government & Sarkari Portals', stream: 'government', badge: '45+ Portals' },
          { id: 'govt_upsc', label: 'UPSC Civil Services (IAS, IPS, IFS, IRS)', stream: 'government', badge: 'Group A Gazetted' },
          { id: 'govt_ssc', label: 'SSC Exams (CGL, CHSL, CPO, JE)', stream: 'government', badge: 'Central Ministries' },
          { id: 'govt_rrb', label: 'Indian Railways (RRB NTPC, JE, ALP)', stream: 'government', badge: 'Railway Board' },
          { id: 'govt_bank_po', label: 'Public Sector Bank PO & Clerk (SBI / IBPS)', stream: 'government', badge: 'Scale I Officer' },
          { id: 'govt_defence', label: 'Defence Forces (Army, Navy, Air Force)', stream: 'government', badge: 'Armed Forces' },
          { id: 'govt_psu', label: 'PSU Maharatna / Navratna (NTPC, ISRO, DRDO)', stream: 'government', badge: 'PSU Engineer' },
          { id: 'any_grad_govt', label: 'Any Graduate - General Sarkari Naukri', stream: 'government', badge: 'Any Degree' },
        ],
      },
      {
        group: 'Students, Internships & Freshers',
        icon: '🚀',
        courses: [
          { id: 'all_intern', label: 'All Student Internships', stream: 'internship', badge: 'Top Stipends' },
          { id: 'pm_internship', label: 'PM Internship Scheme 2026', stream: 'internship', badge: 'Govt Top 500' },
          { id: 'aicte_internship', label: 'AICTE National Internship Portal', stream: 'internship', badge: 'Technical Intern' },
          { id: 'freshers_drive', label: 'College Campus & Freshers Drives', stream: 'internship', badge: 'Freshers 2025/26' },
        ],
      },
      {
        group: 'Medical, Pharma & Healthcare',
        icon: '🩺',
        courses: [
          { id: 'mbbs_bds', label: 'MBBS / MD / BDS (Medical Doctors)', stream: 'healthcare', badge: 'AIIMS & Hospitals' },
          { id: 'bpharm', label: 'B.Pharm / M.Pharm (Pharmacy)', stream: 'healthcare', badge: 'Drug Research' },
          { id: 'nursing', label: 'B.Sc Nursing & Healthcare Staff', stream: 'healthcare', badge: 'Hospital Staff' },
        ],
      },
      {
        group: 'Design, Media & Creative Arts',
        icon: '🎨',
        courses: [
          { id: 'bdes_uiux', label: 'B.Des / UI/UX & Product Design', stream: 'creative', badge: 'Figma & Product' },
          { id: 'animation_graphics', label: 'Animation, VFX, 3D & Gaming', stream: 'creative', badge: 'Visual Arts' },
        ],
      },
      {
        group: 'Law & Legal Studies',
        icon: '⚖️',
        courses: [
          { id: 'llb_llm', label: 'LLB / BA LLB / LLM (Advocate & Corporate)', stream: 'law', badge: 'Bar & Courts' },
        ],
      },
    ];
  }

  fetchJobs(page = 1, append = false) {
    if (append) {
      this.isLoadingMore = true;
    } else {
      this.isLoading = true;
    }
    this.currentPage = page;

    if (this.activeMode === 'live_platforms') {
      this.jobService
        .searchJobsByCriteria({
          stream: this.selectedStream,
          course: this.selectedCourse,
          platform: this.selectedPlatform,
          role: this.searchTerm,
          location: this.location,
          minSalary: this.minSalary || 0,
          maxSalary: this.maxSalary || 0,
          jobType: this.selectedJobTypes.join(','),
          experienceLevel: this.selectedExpLevels.join(','),
          page,
          limit: 12,
        })
        .subscribe({
          next: (res: any) => {
            const newJobs = res.data || [];
            if (append) {
              this.jobs = [...this.jobs, ...newJobs];
            } else {
              this.jobs = newJobs;
            }

            this.total = res.total || this.jobs.length;
            this.totalPages = res.pages || Math.ceil(this.total / 12) || 1;
            this.hasMore = res.hasMore ?? (this.jobs.length < this.total);

            if (res.availablePlatforms) {
              this.availablePlatforms = res.availablePlatforms;
            }
            if (res.streamStats) {
              this.streamStats = res.streamStats;
            }

            this.isLoading = false;
            this.isLoadingMore = false;
          },
          error: () => {
            this.isLoading = false;
            this.isLoadingMore = false;
          },
        });
    } else {
      const filters: any = {
        search: this.searchTerm || undefined,
        location: this.location || undefined,
        workType: this.selectedWorkTypes.length ? this.selectedWorkTypes.join(',') : undefined,
        jobType: this.selectedJobTypes.length ? this.selectedJobTypes.join(',') : undefined,
        experienceLevel: this.selectedExpLevels.length ? this.selectedExpLevels.join(',') : undefined,
        minSalary: this.minSalary || undefined,
        sort: this.sortBy,
        page: this.currentPage,
        limit: 12,
      };

      this.jobService.getJobs(filters).subscribe({
        next: (res) => {
          const newJobs = res.data || [];
          if (append) {
            this.jobs = [...this.jobs, ...newJobs];
          } else {
            this.jobs = newJobs;
          }
          this.total = res.total || 0;
          this.totalPages = res.pages || 1;
          this.hasMore = this.currentPage < this.totalPages;
          this.isLoading = false;
          this.isLoadingMore = false;
        },
        error: () => {
          this.isLoading = false;
          this.isLoadingMore = false;
        },
      });
    }
  }

  // Load More Older Jobs (Scroll down down down!)
  loadMoreOlderJobs() {
    if (this.isLoadingMore || !this.hasMore) return;
    this.fetchJobs(this.currentPage + 1, true);
  }

  onSearchSubmit() {
    this.currentPage = 1;
    this.fetchJobs(1, false);
  }

  toggleFilter(list: string[], item: string) {
    const idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
    this.currentPage = 1;
    this.fetchJobs(1, false);
  }

  isFilterSelected(list: string[], item: string): boolean {
    return list.includes(item);
  }

  clearFilters() {
    this.selectedStream = 'all';
    this.selectedCourse = 'all';
    this.selectedCourseLabel = 'All Courses & Degrees';
    this.selectedPlatform = 'all';
    this.searchTerm = '';
    this.location = '';
    this.selectedWorkTypes = [];
    this.selectedJobTypes = [];
    this.selectedExpLevels = [];
    this.minSalary = null;
    this.maxSalary = null;
    this.currentPage = 1;
    this.fetchJobs(1, false);
  }

  onSortChange(sort: string) {
    this.sortBy = sort;
    this.fetchJobs(1, false);
  }

  // Interactive Job Details Modal Handlers
  openJobDetails(job: Job) {
    this.selectedJobForDetails = job;
    this.isDetailsModalOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent body background scrolling
  }

  closeJobDetails() {
    this.isDetailsModalOpen = false;
    this.selectedJobForDetails = null;
    document.body.style.overflow = '';
  }

  // Get direct application link that takes candidate straight to application page (not mobile app)
  getJobApplyUrl(job?: Job | null): string {
    return getDirectApplyUrl(job);
  }

  // Direct Apply Action: Opens the authentic platform job application portal in a new tab!
  applyToJob(job: Job) {
    const directUrl = getDirectApplyUrl(job);
    if (directUrl) {
      window.open(directUrl, '_blank', 'noopener,noreferrer');
    } else {
      this.router.navigate(['/jobs', job._id]);
    }
  }

  // 350 Platforms Catalog Explorer Modal
  loadPlatformsDirectory() {
    this.jobService.getPlatforms().subscribe({
      next: (res: any) => {
        this.allPlatformsList = res.data || [];
        this.filterPlatformsCatalog();
      },
    });
  }

  openPlatformsModal() {
    this.isPlatformsModalOpen = true;
    this.platformsModalCategory = this.selectedStream;
    this.filterPlatformsCatalog();
    document.body.style.overflow = 'hidden';
  }

  closePlatformsModal() {
    this.isPlatformsModalOpen = false;
    document.body.style.overflow = '';
  }

  filterPlatformsCatalog() {
    let list = this.allPlatformsList;
    if (this.platformsModalCategory && this.platformsModalCategory !== 'all') {
      list = list.filter((p) => p.stream === this.platformsModalCategory);
    }
    if (this.platformsSearchQuery && this.platformsSearchQuery.trim()) {
      const q = this.platformsSearchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.badge.toLowerCase().includes(q)
      );
    }
    this.filteredPlatformsCatalog = list;
  }

  onPlatformsCategoryChange(catId: string) {
    this.platformsModalCategory = catId;
    this.filterPlatformsCatalog();
  }

  launchPlatform(url: string) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  formatSalary(salary: any): string {
    if (!salary) return 'Competitive Market Pay';
    if (salary.raw) return salary.raw;
    const sym = salary.currency === 'INR' ? '₹' : '$';
    const minStr = salary.min ? Number(salary.min).toLocaleString() : '0';
    const maxStr = salary.max ? Number(salary.max).toLocaleString() : '0';
    const periodStr = salary.period ? ` / ${salary.period}` : '';
    return `${sym}${minStr} - ${sym}${maxStr}${periodStr}`;
  }

  getStreamLabel(stream?: string): string {
    switch (stream?.toLowerCase()) {
      case 'btech': return '💻 B.Tech / Engineering / IT';
      case 'bba': return '📊 BBA / MBA / Management';
      case 'bcom': return '📈 B.Com / Finance / Banking';
      case 'government': return '🏛️ Government / Sarkari / PSU';
      case 'internship': return '🚀 Internships & Freshers';
      case 'remote': return '🌐 Remote & Freelance';
      case 'creative': return '🎨 Creative & Design';
      case 'healthcare': return '🩺 Healthcare & Medical';
      default: return stream?.toUpperCase() || 'GENERAL';
    }
  }
}
