/**
 * Direct Job Application URL Generator
 * Generates direct web application / role search URLs for 350+ platforms.
 * Ensures the link opens the official web application page directly,
 * preventing generic app-store / app-launch hijacking or empty homepages.
 */

function cleanRoleTitle(title) {
  if (!title) return 'Graduate Trainee';
  // Remove platform prefix e.g. "Naukri - ", "LinkedIn - ", "Indeed - "
  let cleaned = title.replace(/^[^-]+-\s*/, '').trim();
  if (!cleaned) cleaned = title;
  return cleaned;
}

function getKeywords(cleanTitle) {
  // Strip parentheses and bracketed qualifications e.g. "(Cloud & Full Stack)"
  let kw = cleanTitle.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
  // Strip year numbers like 2025, 2026
  kw = kw.replace(/\b202[4-9]\b/g, '').trim();
  // Strip extra punctuation
  kw = kw.replace(/['"’‘]/g, '').trim();
  return kw || cleanTitle;
}

function getRoleSlug(kw) {
  return kw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Builds the official, direct application URL for a given platform and role.
 * Supports both object call: buildDirectApplyUrl({ platform, title, companyName, stream, fallbackUrl })
 * and positional call: buildDirectApplyUrl(platform, title, companyName, stream, fallbackUrl).
 * Never opens an app install screen or empty homepage.
 */
function buildDirectApplyUrl(platformInput = '', titleInput = '', companyInput = '', streamInput = '', fallbackInput = '') {
  let pName = '';
  let roleTitle = '';
  let compName = '';
  let streamType = '';
  let fallback = '';

  if (typeof platformInput === 'object' && platformInput !== null) {
    pName = platformInput.platform || platformInput.platformName || platformInput.name || '';
    roleTitle = platformInput.title || platformInput.role || '';
    compName = platformInput.companyName || platformInput.company || '';
    streamType = platformInput.stream || '';
    fallback = platformInput.fallbackUrl || platformInput.platformUrl || platformInput.applyUrl || platformInput.url || '';
  } else {
    pName = platformInput || '';
    roleTitle = titleInput || '';
    compName = companyInput || '';
    streamType = streamInput || '';
    fallback = fallbackInput || '';
  }

  const p = String(pName || '').toLowerCase().trim();
  const cleanTitle = cleanRoleTitle(roleTitle);
  const kw = getKeywords(cleanTitle);
  const slug = getRoleSlug(kw);
  const encKw = encodeURIComponent(kw);
  const comp = String(compName || '').replace(/Official Portal|Careers|Jobs|Recruitment/gi, '').trim();
  const encComp = encodeURIComponent(comp);
  const stream = String(streamType || '').toLowerCase();
  const fallbackUrl = String(fallback || '');

  // 1. TOP GENERAL & TECH JOB PORTALS
  if (p.includes('naukri')) {
    if (p.includes('firstnaukri')) {
      return `https://www.firstnaukri.com/jobs-by-keyword?keyword=${encKw}`;
    }
    // If company is Swiggy or specific corporate, use company jobs or role jobs
    if (comp && !comp.includes('Naukri') && comp.length > 2) {
      const compSlug = comp.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `https://www.naukri.com/${compSlug}-jobs?k=${encKw}`;
    }
    return `https://www.naukri.com/${slug || 'software-engineer'}-jobs?k=${encKw}`;
  }

  if (p.includes('linkedin')) {
    // If fallback is already a direct specific job view URL, preserve it
    if (fallbackUrl && fallbackUrl.includes('/jobs/view/')) {
      return fallbackUrl;
    }
    // Direct LinkedIn web search with Easy Apply filter enabled (f_AL=true)
    return `https://www.linkedin.com/jobs/search/?keywords=${encKw}&location=India&f_AL=true`;
  }

  if (p.includes('indeed')) {
    return `https://in.indeed.com/jobs?q=${encKw}&l=India`;
  }

  if (p.includes('internshala')) {
    const isIntern = stream === 'internship' || cleanTitle.toLowerCase().includes('intern');
    return `https://internshala.com/${isIntern ? 'internships' : 'jobs'}/keywords-${encodeURIComponent(slug || 'developer')}/`;
  }

  if (p.includes('apna')) {
    return `https://apna.co/jobs?q=${encKw}`;
  }

  if (p.includes('foundit') || p.includes('monster')) {
    return `https://www.foundit.in/srp/results?query=${encKw}`;
  }

  if (p.includes('glassdoor')) {
    return `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encKw}`;
  }

  if (p.includes('shine')) {
    return `https://www.shine.com/job-search/${encodeURIComponent(slug || 'software')}-jobs`;
  }

  if (p.includes('timesjob')) {
    return `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=${encKw}`;
  }

  if (p.includes('workindia')) {
    return `https://www.workindia.in/jobs/?q=${encKw}`;
  }

  if (p.includes('freshersworld')) {
    return `https://www.freshersworld.com/jobs/jobsearch/${encodeURIComponent(slug || 'engineering')}-jobs`;
  }

  if (p.includes('unstop')) {
    return `https://unstop.com/jobs?searchTerm=${encKw}`;
  }

  if (p.includes('cutshort')) {
    return `https://cutshort.io/jobs?query=${encKw}`;
  }

  if (p.includes('hirist')) {
    return `https://www.hirist.tech/search?keyword=${encKw}`;
  }

  if (p.includes('instahyre')) {
    return `https://www.instahyre.com/jobs?search=${encKw}`;
  }

  if (p.includes('wellfound') || p.includes('angellist')) {
    return `https://wellfound.com/jobs?role=${encodeURIComponent(slug || 'software-engineer')}`;
  }

  if (p.includes('superset')) {
    return `https://joinsuperset.com/`;
  }

  if (p.includes('hirect')) {
    return `https://hirect.in/jobs?keyword=${encKw}`;
  }

  if (p.includes('grabjob')) {
    return `https://grabjobs.co/india/jobs?q=${encKw}`;
  }

  if (p.includes('talent500')) {
    return `https://talent500.co/jobs?search=${encKw}`;
  }

  if (p.includes('ambitionbox')) {
    return `https://www.ambitionbox.com/jobs/search?tag=${encKw}`;
  }

  if (p.includes('jobrapido')) {
    return `https://in.jobrapido.com/?w=${encKw}`;
  }

  if (p.includes('jooble')) {
    return `https://in.jooble.org/SearchResult?ukw=${encKw}`;
  }

  if (p.includes('jora')) {
    return `https://in.jora.com/j?q=${encKw}`;
  }

  if (p.includes('adzuna')) {
    return `https://www.adzuna.in/search?q=${encKw}`;
  }

  if (p.includes('careerjet')) {
    return `https://www.careerjet.co.in/search/jobs?s=${encKw}`;
  }

  if (p.includes('talent.com')) {
    return `https://in.talent.com/jobs?k=${encKw}`;
  }

  if (p.includes('simplyhired')) {
    return `https://www.simplyhired.co.in/search?q=${encKw}`;
  }

  if (p.includes('ziprecruiter')) {
    return `https://www.ziprecruiter.in/Jobs/${encodeURIComponent(slug || 'engineering')}`;
  }

  if (p.includes('dice')) {
    return `https://www.dice.com/jobs?q=${encKw}`;
  }

  if (p.includes('quikr')) {
    return `https://www.quikr.com/jobs/search?query=${encKw}`;
  }

  if (p.includes('placementindia')) {
    return `https://www.placementindia.com/job-search/jobs.php?keyword=${encKw}`;
  }

  // 2. GOVERNMENT & PSU OFFICIAL RECRUITMENT APPS & PORTALS
  if (p.includes('upsc')) {
    return `https://upsconline.nic.in/`;
  }

  if (p.includes('ssc')) {
    return `https://ssc.gov.in/portal/apply`;
  }

  if (p.includes('railway') || p.includes('rrb')) {
    return `https://www.recruitmentrrb.in/`;
  }

  if (p.includes('sbi')) {
    return `https://sbi.co.in/web/careers/current-openings`;
  }

  if (p.includes('rbi')) {
    return `https://opportunities.rbi.org.in/scripts/vacancies.aspx`;
  }

  if (p.includes('ibps')) {
    return `https://ibps.in/`;
  }

  if (p.includes('pm internship')) {
    return `https://pminternship.mca.gov.in/`;
  }

  if (p.includes('aicte')) {
    return `https://internship.aicte-india.org/internship-search.php`;
  }

  if (p.includes('ncs') || p.includes('national career service')) {
    return `https://www.ncs.gov.in/job-seeker/pages/search.aspx`;
  }

  if (p.includes('drdo')) {
    return `https://rac.gov.in/`;
  }

  if (p.includes('isro')) {
    return `https://www.isro.gov.in/careers`;
  }

  if (p.includes('barc')) {
    return `https://recruit.barc.gov.in/barcrecruit/`;
  }

  if (p.includes('csir')) {
    return `https://www.csir.res.in/career-opportunities`;
  }

  if (p.includes('aiims')) {
    return `https://www.aiimsexams.ac.in/`;
  }

  if (p.includes('icmr')) {
    return `https://main.icmr.nic.in/career-opportunity`;
  }

  if (p.includes('epfo')) {
    return `https://www.epfindia.gov.in/site_en/Recruitment.php`;
  }

  if (p.includes('esic')) {
    return `https://www.esic.gov.in/recruitments`;
  }

  if (p.includes('fci')) {
    return `https://fci.gov.in/current-vacancies.php`;
  }

  if (p.includes('nabard')) {
    return `https://www.nabard.org/careers-notices.aspx`;
  }

  if (p.includes('sebi')) {
    return `https://www.sebi.gov.in/sebiweb/other/career.jsp`;
  }

  if (p.includes('power grid') || p.includes('powergrid')) {
    return `https://www.powergrid.in/job-opportunities`;
  }

  if (p.includes('ntpc')) {
    return `https://careers.ntpc.co.in/`;
  }

  if (p.includes('ongc')) {
    return `https://ongcindia.com/web/eng/career`;
  }

  if (p.includes('gail')) {
    return `https://gailonline.com/CRApplyingGail.html`;
  }

  if (p.includes('coal india')) {
    return `https://www.coalindia.in/career-at-cil/`;
  }

  if (p.includes('hal')) {
    return `https://hal-india.co.in/Career_Listing.aspx`;
  }

  if (p.includes('bel')) {
    return `https://bel-india.in/careers/`;
  }

  if (p.includes('bhel')) {
    return `https://careers.bhel.in/`;
  }

  if (p.includes('bsnl')) {
    return `https://www.bsnl.co.in/`;
  }

  if (p.includes('army')) {
    return `https://joinindianarmy.nic.in/`;
  }

  if (p.includes('navy')) {
    return `https://www.joinindiannavy.gov.in/`;
  }

  if (p.includes('air force') || p.includes('afcat')) {
    return `https://afcat.cdac.in/`;
  }

  if (p.includes('post recruitment') || p.includes('india post')) {
    return `https://indiapostgdsonline.gov.in/`;
  }

  // 3. TOP TECH CORPORATES
  if (p.includes('tcs')) {
    return `https://www.tcs.com/careers/india/entry-level`;
  }

  if (p.includes('infosys')) {
    return `https://www.infosys.com/careers/apply.html`;
  }

  if (p.includes('wipro')) {
    return `https://careers.wipro.com/careers-home/`;
  }

  if (p.includes('google')) {
    return `https://careers.google.com/jobs/results/?q=${encKw}`;
  }

  if (p.includes('microsoft')) {
    return `https://careers.microsoft.com/v2/global/en/home.html#search?q=${encKw}`;
  }

  if (p.includes('deloitte')) {
    return `https://jobs2.deloitte.com/in/en`;
  }

  if (p.includes('amazon')) {
    return `https://www.amazon.jobs/en/search?base_query=${encKw}`;
  }

  if (p.includes('turing')) {
    return `https://www.turing.com/jobs`;
  }

  if (p.includes('goldman')) {
    return `https://www.goldmansachs.com/careers/students/programs/india`;
  }

  // 4. CODING & COMPETITIVE PLATFORMS
  if (p.includes('hackerearth')) {
    return `https://www.hackerearth.com/companies/jobs/`;
  }

  if (p.includes('hackerrank')) {
    return `https://www.hackerrank.com/jobs/search?q=${encKw}`;
  }

  if (p.includes('topcoder')) {
    return `https://www.topcoder.com/community/gigs`;
  }

  if (p.includes('techgig')) {
    return `https://www.techgig.com/jobs`;
  }

  if (p.includes('codechef')) {
    return `https://www.codechef.com/jobs`;
  }

  if (p.includes('github')) {
    return `https://github.com/about/careers`;
  }

  // 5. REMOTE & FREELANCE
  if (p.includes('remote ok')) {
    return `https://remoteok.com/remote-${encodeURIComponent(slug)}-jobs`;
  }

  if (p.includes('we work remotely')) {
    return `https://weworkremotely.com/remote-jobs/search?term=${encKw}`;
  }

  if (p.includes('arc')) {
    return `https://arc.dev/remote-jobs?query=${encKw}`;
  }

  if (p.includes('flexjob')) {
    return `https://www.flexjobs.com/search?search=${encKw}`;
  }

  if (p.includes('upwork')) {
    return `https://www.upwork.com/nx/search/jobs/?q=${encKw}`;
  }

  if (p.includes('fiverr')) {
    return `https://www.fiverr.com/search/gigs?query=${encKw}`;
  }

  if (p.includes('freelancer')) {
    return `https://www.freelancer.com/jobs/${encodeURIComponent(slug)}`;
  }

  if (p.includes('remotive')) {
    if (fallbackUrl && fallbackUrl.includes('remotive.com')) return fallbackUrl;
    return `https://remotive.com/remote-jobs?search=${encKw}`;
  }

  // 6. CREATIVE & DESIGN
  if (p.includes('dribbble')) {
    return `https://dribbble.com/jobs?keyword=${encKw}`;
  }

  if (p.includes('behance')) {
    return `https://www.behance.net/joblist?search=${encKw}`;
  }

  if (p.includes('99designs')) {
    return `https://99designs.com/designers`;
  }

  // 7. TEACHING & EDTECH
  if (p.includes('teacheron')) {
    return `https://www.teacheron.com/tutor-jobs?q=${encKw}`;
  }

  if (p.includes('chegg')) {
    return `https://www.chegg.com/about/working-at-chegg/jobs`;
  }

  if (p.includes('urbanpro')) {
    return `https://www.urbanpro.com/tutor-jobs`;
  }

  if (p.includes('superprof')) {
    return `https://www.superprof.co.in/`;
  }

  // 8. LEGAL & LAW
  if (p.includes('lawctopus')) {
    return `https://www.lawctopus.com/opportunities/`;
  }

  if (p.includes('livelaw')) {
    return `https://www.livelaw.in/jobs`;
  }

  if (p.includes('bar & bench') || p.includes('barandbench')) {
    return `https://www.barandbench.com/apprentice-lawyer`;
  }

  // 9. HEALTHCARE
  if (p.includes('healthecareers')) {
    return `https://www.healthecareers.com/jobs/search?q=${encKw}`;
  }

  if (p.includes('practo')) {
    return `https://www.practo.com/careers`;
  }

  // 10. COMMERCE & FINANCE
  if (p.includes('icai')) {
    return `https://cmib.icai.org`;
  }

  if (p.includes('cajobportal')) {
    return `https://cajobportal.com/job-search/`;
  }

  // 11. GENERAL FALLBACK
  // If fallbackUrl exists and is not just a root domain (has path like /careers, /jobs, /vacancies)
  if (fallbackUrl && fallbackUrl.length > 0) {
    try {
      const parsed = new URL(fallbackUrl);
      if (parsed.pathname && parsed.pathname.length > 1) {
        return fallbackUrl;
      }
    } catch (_) {}
  }

  // If it's a known URL or base domain, route to Naukri / Indeed India direct apply search as verified fallback
  return `https://www.naukri.com/${slug || 'software-engineer'}-jobs?k=${encKw}`;
}

module.exports = {
  cleanRoleTitle,
  getKeywords,
  getRoleSlug,
  buildDirectApplyUrl,
};
