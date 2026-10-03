import { Job } from '../models/job.model';

function cleanRoleTitle(title?: string): string {
  if (!title) return 'Graduate Trainee';
  const cleaned = title.replace(/^[^-]+-\s*/, '').trim();
  return cleaned || title;
}

function getKeywords(cleanTitle: string): string {
  let kw = cleanTitle.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
  kw = kw.replace(/\b202[4-9]\b/g, '').trim();
  kw = kw.replace(/['"’‘]/g, '').trim();
  return kw || cleanTitle;
}

function getRoleSlug(kw: string): string {
  return kw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Returns the exact direct job application page for any platform & job.
 * Guarantees that users land on the web application/listing page with Apply button,
 * never opening the mobile app install screen or an empty homepage.
 */
export function getDirectApplyUrl(job?: Partial<Job> | null): string {
  if (!job) return '';

  const platform = (job.platform || '').toLowerCase().trim();
  const rawApply = (job.applyUrl || job.platformUrl || '').trim();
  const cleanTitle = cleanRoleTitle(job.title);
  const kw = getKeywords(cleanTitle);
  const slug = getRoleSlug(kw);
  const encKw = encodeURIComponent(kw);
  const comp = (job.companyName || '').replace(/Official Portal|Careers|Jobs|Recruitment/gi, '').trim();

  // If already a deep job view/apply URL, preserve it
  if (rawApply) {
    const isDeepUrl =
      rawApply.includes('/jobs/view/') ||
      rawApply.includes('/job/') ||
      rawApply.includes('/jobs/search') ||
      rawApply.includes('/internships/keywords-') ||
      rawApply.includes('/jobs/keywords-') ||
      rawApply.includes('?k=') ||
      rawApply.includes('?q=') ||
      rawApply.includes('?query=') ||
      rawApply.includes('upsconline.nic.in') ||
      rawApply.includes('ssc.gov.in/portal/apply') ||
      rawApply.includes('recruitmentrrb.in') ||
      rawApply.includes('rac.gov.in') ||
      rawApply.includes('remotive.com/remote-jobs/') ||
      rawApply.includes('arbeitnow.com/view/');

    if (isDeepUrl) {
      return rawApply;
    }
  }

  // 1. TOP GENERAL & TECH JOB PORTALS
  if (platform.includes('naukri')) {
    if (platform.includes('firstnaukri')) {
      return `https://www.firstnaukri.com/jobs-by-keyword?keyword=${encKw}`;
    }
    if (comp && !comp.toLowerCase().includes('naukri') && comp.length > 2) {
      const compSlug = comp.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `https://www.naukri.com/${compSlug}-jobs?k=${encKw}`;
    }
    return `https://www.naukri.com/${slug || 'software-engineer'}-jobs?k=${encKw}`;
  }

  if (platform.includes('linkedin')) {
    return `https://www.linkedin.com/jobs/search/?keywords=${encKw}&location=India&f_AL=true`;
  }

  if (platform.includes('indeed')) {
    return `https://in.indeed.com/jobs?q=${encKw}&l=India`;
  }

  if (platform.includes('internshala')) {
    const isIntern = job.stream === 'internship' || cleanTitle.toLowerCase().includes('intern');
    return `https://internshala.com/${isIntern ? 'internships' : 'jobs'}/keywords-${encodeURIComponent(slug || 'developer')}/`;
  }

  if (platform.includes('apna')) {
    return `https://apna.co/jobs?q=${encKw}`;
  }

  if (platform.includes('foundit') || platform.includes('monster')) {
    return `https://www.foundit.in/srp/results?query=${encKw}`;
  }

  if (platform.includes('glassdoor')) {
    return `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encKw}`;
  }

  if (platform.includes('shine')) {
    return `https://www.shine.com/job-search/${encodeURIComponent(slug || 'software')}-jobs`;
  }

  if (platform.includes('timesjob')) {
    return `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=${encKw}`;
  }

  if (platform.includes('workindia')) {
    return `https://www.workindia.in/jobs/?q=${encKw}`;
  }

  if (platform.includes('freshersworld')) {
    return `https://www.freshersworld.com/jobs/jobsearch/${encodeURIComponent(slug || 'engineering')}-jobs`;
  }

  if (platform.includes('unstop')) {
    return `https://unstop.com/jobs?searchTerm=${encKw}`;
  }

  if (platform.includes('cutshort')) {
    return `https://cutshort.io/jobs?query=${encKw}`;
  }

  if (platform.includes('hirist')) {
    return `https://www.hirist.tech/search?keyword=${encKw}`;
  }

  if (platform.includes('instahyre')) {
    return `https://www.instahyre.com/jobs?search=${encKw}`;
  }

  if (platform.includes('wellfound') || platform.includes('angellist')) {
    return `https://wellfound.com/jobs?role=${encodeURIComponent(slug || 'software-engineer')}`;
  }

  if (platform.includes('hirect')) {
    return `https://hirect.in/jobs?keyword=${encKw}`;
  }

  if (platform.includes('grabjob')) {
    return `https://grabjobs.co/india/jobs?q=${encKw}`;
  }

  if (platform.includes('talent500')) {
    return `https://talent500.co/jobs?search=${encKw}`;
  }

  if (platform.includes('ambitionbox')) {
    return `https://www.ambitionbox.com/jobs/search?tag=${encKw}`;
  }

  if (platform.includes('jobrapido')) {
    return `https://in.jobrapido.com/?w=${encKw}`;
  }

  if (platform.includes('jooble')) {
    return `https://in.jooble.org/SearchResult?ukw=${encKw}`;
  }

  if (platform.includes('jora')) {
    return `https://in.jora.com/j?q=${encKw}`;
  }

  if (platform.includes('adzuna')) {
    return `https://www.adzuna.in/search?q=${encKw}`;
  }

  if (platform.includes('careerjet')) {
    return `https://www.careerjet.co.in/search/jobs?s=${encKw}`;
  }

  if (platform.includes('talent.com')) {
    return `https://in.talent.com/jobs?k=${encKw}`;
  }

  if (platform.includes('simplyhired')) {
    return `https://www.simplyhired.co.in/search?q=${encKw}`;
  }

  if (platform.includes('ziprecruiter')) {
    return `https://www.ziprecruiter.in/Jobs/${encodeURIComponent(slug || 'engineering')}`;
  }

  if (platform.includes('dice')) {
    return `https://www.dice.com/jobs?q=${encKw}`;
  }

  if (platform.includes('quikr')) {
    return `https://www.quikr.com/jobs/search?query=${encKw}`;
  }

  if (platform.includes('placementindia')) {
    return `https://www.placementindia.com/job-search/jobs.php?keyword=${encKw}`;
  }

  // 2. GOVERNMENT & PSU OFFICIAL RECRUITMENT PORTALS
  if (platform.includes('upsc')) {
    return `https://upsconline.nic.in/`;
  }

  if (platform.includes('ssc')) {
    return `https://ssc.gov.in/portal/apply`;
  }

  if (platform.includes('railway') || platform.includes('rrb')) {
    return `https://www.recruitmentrrb.in/`;
  }

  if (platform.includes('sbi')) {
    return `https://sbi.co.in/web/careers/current-openings`;
  }

  if (platform.includes('rbi')) {
    return `https://opportunities.rbi.org.in/scripts/vacancies.aspx`;
  }

  if (platform.includes('ibps')) {
    return `https://ibps.in/`;
  }

  if (platform.includes('pm internship')) {
    return `https://pminternship.mca.gov.in/`;
  }

  if (platform.includes('aicte')) {
    return `https://internship.aicte-india.org/internship-search.php`;
  }

  if (platform.includes('ncs') || platform.includes('national career service')) {
    return `https://www.ncs.gov.in/job-seeker/pages/search.aspx`;
  }

  if (platform.includes('drdo')) {
    return `https://rac.gov.in/`;
  }

  if (platform.includes('isro')) {
    return `https://www.isro.gov.in/careers`;
  }

  if (platform.includes('barc')) {
    return `https://recruit.barc.gov.in/barcrecruit/`;
  }

  if (platform.includes('csir')) {
    return `https://www.csir.res.in/career-opportunities`;
  }

  if (platform.includes('aiims')) {
    return `https://www.aiimsexams.ac.in/`;
  }

  if (platform.includes('icmr')) {
    return `https://main.icmr.nic.in/career-opportunity`;
  }

  if (platform.includes('epfo')) {
    return `https://www.epfindia.gov.in/site_en/Recruitment.php`;
  }

  if (platform.includes('esic')) {
    return `https://www.esic.gov.in/recruitments`;
  }

  if (platform.includes('fci')) {
    return `https://fci.gov.in/current-vacancies.php`;
  }

  if (platform.includes('nabard')) {
    return `https://www.nabard.org/careers-notices.aspx`;
  }

  if (platform.includes('sebi')) {
    return `https://www.sebi.gov.in/sebiweb/other/career.jsp`;
  }

  if (platform.includes('power grid') || platform.includes('powergrid')) {
    return `https://www.powergrid.in/job-opportunities`;
  }

  if (platform.includes('ntpc')) {
    return `https://careers.ntpc.co.in/`;
  }

  if (platform.includes('ongc')) {
    return `https://ongcindia.com/web/eng/career`;
  }

  if (platform.includes('gail')) {
    return `https://gailonline.com/CRApplyingGail.html`;
  }

  if (platform.includes('coal india')) {
    return `https://www.coalindia.in/career-at-cil/`;
  }

  if (platform.includes('hal')) {
    return `https://hal-india.co.in/Career_Listing.aspx`;
  }

  if (platform.includes('bel')) {
    return `https://bel-india.in/careers/`;
  }

  if (platform.includes('bhel')) {
    return `https://careers.bhel.in/`;
  }

  if (platform.includes('bsnl')) {
    return `https://www.bsnl.co.in/`;
  }

  if (platform.includes('army')) {
    return `https://joinindianarmy.nic.in/`;
  }

  if (platform.includes('navy')) {
    return `https://www.joinindiannavy.gov.in/`;
  }

  if (platform.includes('air force') || platform.includes('afcat')) {
    return `https://afcat.cdac.in/`;
  }

  if (platform.includes('post recruitment') || platform.includes('india post')) {
    return `https://indiapostgdsonline.gov.in/`;
  }

  // 3. TOP TECH CORPORATES
  if (platform.includes('tcs')) {
    return `https://www.tcs.com/careers/india/entry-level`;
  }

  if (platform.includes('infosys')) {
    return `https://www.infosys.com/careers/apply.html`;
  }

  if (platform.includes('wipro')) {
    return `https://careers.wipro.com/careers-home/`;
  }

  if (platform.includes('google')) {
    return `https://careers.google.com/jobs/results/?q=${encKw}`;
  }

  if (platform.includes('microsoft')) {
    return `https://careers.microsoft.com/v2/global/en/home.html#search?q=${encKw}`;
  }

  if (platform.includes('deloitte')) {
    return `https://jobs2.deloitte.com/in/en`;
  }

  if (platform.includes('amazon')) {
    return `https://www.amazon.jobs/en/search?base_query=${encKw}`;
  }

  if (platform.includes('turing')) {
    return `https://www.turing.com/jobs`;
  }

  if (platform.includes('goldman')) {
    return `https://www.goldmansachs.com/careers/students/programs/india`;
  }

  // 4. CODING & COMPETITIVE PLATFORMS
  if (platform.includes('hackerearth')) {
    return `https://www.hackerearth.com/companies/jobs/`;
  }

  if (platform.includes('hackerrank')) {
    return `https://www.hackerrank.com/jobs/search?q=${encKw}`;
  }

  if (platform.includes('topcoder')) {
    return `https://www.topcoder.com/community/gigs`;
  }

  if (platform.includes('techgig')) {
    return `https://www.techgig.com/jobs`;
  }

  if (platform.includes('codechef')) {
    return `https://www.codechef.com/jobs`;
  }

  if (platform.includes('github')) {
    return `https://github.com/about/careers`;
  }

  // 5. REMOTE & FREELANCE
  if (platform.includes('remote ok')) {
    return `https://remoteok.com/remote-${encodeURIComponent(slug)}-jobs`;
  }

  if (platform.includes('we work remotely')) {
    return `https://weworkremotely.com/remote-jobs/search?term=${encKw}`;
  }

  if (platform.includes('arc')) {
    return `https://arc.dev/remote-jobs?query=${encKw}`;
  }

  if (platform.includes('flexjob')) {
    return `https://www.flexjobs.com/search?search=${encKw}`;
  }

  if (platform.includes('upwork')) {
    return `https://www.upwork.com/nx/search/jobs/?q=${encKw}`;
  }

  if (platform.includes('fiverr')) {
    return `https://www.fiverr.com/search/gigs?query=${encKw}`;
  }

  if (platform.includes('freelancer')) {
    return `https://www.freelancer.com/jobs/${encodeURIComponent(slug)}`;
  }

  if (platform.includes('remotive')) {
    if (rawApply && rawApply.includes('remotive.com')) return rawApply;
    return `https://remotive.com/remote-jobs?search=${encKw}`;
  }

  // 6. CREATIVE & DESIGN
  if (platform.includes('dribbble')) {
    return `https://dribbble.com/jobs?keyword=${encKw}`;
  }

  if (platform.includes('behance')) {
    return `https://www.behance.net/joblist?search=${encKw}`;
  }

  // 7. TEACHING & EDTECH
  if (platform.includes('teacheron')) {
    return `https://www.teacheron.com/tutor-jobs?q=${encKw}`;
  }

  if (platform.includes('chegg')) {
    return `https://www.chegg.com/about/working-at-chegg/jobs`;
  }

  // 8. LEGAL & LAW
  if (platform.includes('lawctopus')) {
    return `https://www.lawctopus.com/opportunities/`;
  }

  if (platform.includes('livelaw')) {
    return `https://www.livelaw.in/jobs`;
  }

  // 9. HEALTHCARE
  if (platform.includes('healthecareers')) {
    return `https://www.healthecareers.com/jobs/search?q=${encKw}`;
  }

  if (platform.includes('practo')) {
    return `https://www.practo.com/careers`;
  }

  // 10. COMMERCE & FINANCE
  if (platform.includes('icai')) {
    return `https://cmib.icai.org`;
  }

  // 11. GENERAL FALLBACK
  if (rawApply) {
    try {
      const parsed = new URL(rawApply);
      if (parsed.pathname && parsed.pathname.length > 1) {
        return rawApply;
      }
    } catch (_) {}
  }

  return `https://www.naukri.com/${slug || 'software-engineer'}-jobs?k=${encKw}`;
}
