require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const InterviewQuestion = require('../models/InterviewQuestion');
const SkillCategory = require('../models/SkillCategory');
const { getSeedData } = require('./seedData');

const seedAll = async () => {
  try {
    console.log('--- Starting SkillBridge Seed Process ---');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      SavedJob.deleteMany({}),
      Resume.deleteMany({}),
      Notification.deleteMany({}),
      InterviewQuestion.deleteMany({}),
      SkillCategory.deleteMany({}),
    ]);
    console.log(' Cleared existing database records.');

    const seedData = await getSeedData();

    // 1. Insert Users
    const createdUsers = await User.insertMany(seedData.users);
    console.log(` Inserted ${createdUsers.length} users.`);

    const studentUser = createdUsers.find((u) => u.email === 'student@skillbridge.com');
    const priyaUser = createdUsers.find((u) => u.email === 'priya@skillbridge.com');
    const recruiterUser = createdUsers.find((u) => u.email === 'recruiter@skillbridge.com');
    const recruiter2User = createdUsers.find((u) => u.email === 'recruiter2@skillbridge.com');

    // 2. Insert Companies
    const companiesToInsert = seedData.companies.map((c, idx) => ({
      ...c,
      createdBy: idx % 2 === 0 ? recruiterUser._id : recruiter2User._id,
    }));
    const createdCompanies = await Company.insertMany(companiesToInsert);
    console.log(` Inserted ${createdCompanies.length} companies.`);

    const nexusCompany = createdCompanies.find((c) => c.name === 'Nexus AI Labs');
    const cloudScaleCompany = createdCompanies.find((c) => c.name === 'CloudScale Systems');
    const finflowCompany = createdCompanies.find((c) => c.name === 'FinFlow Technologies');
    const pixelCraftCompany = createdCompanies.find((c) => c.name === 'PixelCraft Studios');

    // 3. Create Student Profile for Gaurav
    const studentProfile = new Profile({
      user: studentUser._id,
      headline: 'Full Stack Engineer | Angular & Node.js Enthusiast',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA (Open to Remote)',
      about: 'Passionate software engineer with a track record of developing scalable web applications. Proficient in TypeScript, Angular, Node.js, and MongoDB. Enthusiastic about clean architecture, performance optimization, and AI-assisted engineering tools.',
      preferredRole: 'Full Stack Developer',
      preferredLocation: 'Remote / Hybrid',
      expectedSalary: '$95,000 - $125,000 / year',
      workTypePreference: 'remote',
      github: 'https://github.com/gaurav-sharma-dev',
      linkedin: 'https://linkedin.com/in/gaurav-sharma-dev',
      portfolio: 'https://gauravdev.example.com',
      education: [
        {
          college: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startYear: 2021,
          graduationYear: 2025,
          cgpa: '3.85 / 4.0',
          isCompleted: false,
        },
      ],
      skills: [
        { name: 'JavaScript', category: 'Language', level: 'Advanced', yearsOfExperience: 3 },
        { name: 'TypeScript', category: 'Language', level: 'Advanced', yearsOfExperience: 2 },
        { name: 'Angular', category: 'Framework', level: 'Advanced', yearsOfExperience: 2 },
        { name: 'Node.js', category: 'Framework', level: 'Intermediate', yearsOfExperience: 2 },
        { name: 'Express.js', category: 'Framework', level: 'Intermediate', yearsOfExperience: 2 },
        { name: 'MongoDB', category: 'Database', level: 'Intermediate', yearsOfExperience: 2 },
        { name: 'Git', category: 'Tool', level: 'Advanced', yearsOfExperience: 3 },
        { name: 'REST API', category: 'Framework', level: 'Advanced', yearsOfExperience: 2 },
        { name: 'HTML5', category: 'Language', level: 'Expert', yearsOfExperience: 4 },
        { name: 'CSS3', category: 'Language', level: 'Advanced', yearsOfExperience: 4 },
      ],
      projects: [
        {
          title: 'SkillBridge Platform',
          description: 'AI-powered career and job matchmaking engine with resume ATS scoring and mock interview simulators.',
          role: 'Lead Architect',
          liveUrl: 'https://skillbridge-demo.example.com',
          githubUrl: 'https://github.com/gaurav-sharma-dev/skillbridge',
          technologies: ['Angular 19', 'Node.js', 'Express.js', 'MongoDB', 'AI Assistant'],
          highlights: ['Built reactive state management with Angular Signals', 'Integrated Smart AI Engine for ATS parsing'],
        },
        {
          title: 'PulseAnalytics Real-Time Dashboard',
          description: 'High-throughput analytics dashboard visualizing API metrics and active user sessions.',
          role: 'Full Stack Developer',
          liveUrl: 'https://pulse-analytics.example.com',
          githubUrl: 'https://github.com/gaurav-sharma-dev/pulse',
          technologies: ['TypeScript', 'Express', 'Redis', 'Chart.js'],
          highlights: ['Optimized rendering latency by 45%', 'Implemented JWT authentication and RBAC'],
        },
      ],
      certifications: [
        {
          name: 'Meta Certified Frontend Developer',
          issuer: 'Meta / Coursera',
          issueDate: '2024-06-15',
          credentialUrl: 'https://coursera.org/verify/meta-frontend-gaurav',
        },
      ],
      experience: [
        {
          title: 'Software Engineer Intern',
          company: 'CloudScale Systems',
          location: 'Remote',
          startDate: 'Jun 2024',
          endDate: 'Aug 2024',
          isCurrent: false,
          description: 'Collaborated on developing microservice telemetry pipelines in Node.js and improved web client responsiveness.',
        },
      ],
      achievements: [
        {
          title: '1st Place Winner - HackTech 2024',
          description: 'Created an accessible educational AI agent for STEM students within 36 hours.',
          date: '2024-03-10',
        },
      ],
      resumeScore: 84,
      atsBreakdown: {
        skillsScore: 88,
        projectsScore: 85,
        experienceScore: 78,
        keywordsScore: 84,
      },
      suggestedImprovements: [
        'Add production Docker containerization experience to projects',
        'Incorporate CI/CD pipeline badges into GitHub repositories',
      ],
    });
    studentProfile.calculateCompletion();
    await studentProfile.save();
    console.log(' Created student profile for Gaurav Sharma.');

    // 4. Create Resume for Gaurav
    const studentResume = await Resume.create({
      user: studentUser._id,
      title: 'Full Stack Developer Resume (Primary)',
      templateId: 'modern',
      isPrimary: true,
      personalDetails: {
        fullName: 'Gaurav Sharma',
        email: 'student@skillbridge.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        github: 'https://github.com/gaurav-sharma-dev',
        linkedin: 'https://linkedin.com/in/gaurav-sharma-dev',
        portfolio: 'https://gauravdev.example.com',
      },
      summary: 'Results-driven Full Stack Engineer with strong expertise in TypeScript, Angular, and Node.js. Proven ability to design reactive user interfaces and resilient backend REST APIs.',
      education: [
        {
          college: 'UC Berkeley',
          degree: 'B.S. in Computer Science',
          fieldOfStudy: 'Computer Science',
          startYear: 2021,
          graduationYear: 2025,
          cgpa: '3.85',
        },
      ],
      skills: [
        { name: 'JavaScript', category: 'Languages' },
        { name: 'TypeScript', category: 'Languages' },
        { name: 'Angular', category: 'Frameworks' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'Express.js', category: 'Backend' },
        { name: 'MongoDB', category: 'Databases' },
        { name: 'Git', category: 'Tools' },
        { name: 'REST APIs', category: 'Architecture' },
      ],
      experience: [
        {
          title: 'Software Engineer Intern',
          company: 'CloudScale Systems',
          location: 'Remote',
          startDate: 'Jun 2024',
          endDate: 'Aug 2024',
          description: 'Engineered REST API endpoints handling 20,000+ daily payload events with 99.9% uptime.',
        },
      ],
      projects: [
        {
          title: 'SkillBridge Platform',
          description: 'AI-assisted career matching platform with real-time application tracking and ATS analysis.',
          technologies: ['Angular', 'Node.js', 'MongoDB', 'AI Engine'],
          liveUrl: 'https://skillbridge.example.com',
          githubUrl: 'https://github.com/gaurav-sharma-dev/skillbridge',
        },
      ],
      aiAnalysis: {
        profileStrength: 84,
        skillsScore: 88,
        projectsScore: 85,
        experienceScore: 78,
        keywordsScore: 84,
        summary: 'Exceptional full-stack resume with clear technical depth in Angular and Node.js.',
        detectedSkills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'MongoDB', 'REST API', 'Git'],
        missingSkills: ['Docker', 'AWS', 'Kubernetes'],
        strengths: ['Clear project impact', 'Clean section formatting', 'Strong modern tech stack'],
        weakSections: ['Could highlight cloud infrastructure more prominently'],
        atsSuggestions: ['Include Docker and Cloud deployment keywords in project bullet points'],
        suggestedImprovements: ['Quantify database scaling achievements in internships'],
        suggestedJobRoles: ['Full Stack Developer', 'Frontend Engineer', 'Junior Backend Developer'],
        suggestedProjects: ['Containerized Microservice Deployment with Docker Compose'],
        suggestedTechnologies: ['Docker', 'AWS', 'Redis'],
        analyzedAt: new Date(),
      },
    });

    // 5. Insert Realistic Jobs & Internships
    const jobs = [
      {
        title: 'Full Stack Engineer (Angular + Node.js)',
        company: nexusCompany._id,
        recruiter: recruiterUser._id,
        companyName: nexusCompany.name,
        companyLogo: nexusCompany.logo,
        description: 'Nexus AI Labs is seeking a passionate Full Stack Engineer to build responsive AI workflow canvases and scalable backend microservices. You will work closely with machine learning researchers to deliver delightful enterprise product experiences.',
        requirements: [
          'Proficiency with TypeScript and modern frontend frameworks (Angular preferred)',
          'Experience building RESTful APIs using Node.js and Express',
          'Familiarity with MongoDB or PostgreSQL schema design and indexing',
          'Strong understanding of Git, asynchronous programming, and web security',
        ],
        responsibilities: [
          'Architect and ship clean, accessible web components using Angular Signals',
          'Build and maintain robust backend API endpoints with comprehensive validation',
          'Collaborate with product designers to implement pixel-perfect user journeys',
          'Participate in code reviews and advocate for engineering best practices',
        ],
        requiredSkills: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB'],
        preferredSkills: ['Docker', 'RxJS', 'Redis', 'CI/CD'],
        salary: { min: 110000, max: 145000, currency: 'USD', period: 'yearly', isDisclosed: true },
        location: 'San Francisco, CA (or Remote)',
        workType: 'remote',
        experienceLevel: 'entry',
        jobType: 'full-time',
        status: 'active',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applicantsCount: 14,
        isFeatured: true,
      },
      {
        title: 'Frontend UI/UX Developer',
        company: pixelCraftCompany._id,
        recruiter: recruiter2User._id,
        companyName: pixelCraftCompany.name,
        companyLogo: pixelCraftCompany.logo,
        description: 'Join our award-winning design studio to craft next-generation SaaS product interfaces. We value micro-animations, accessible semantic HTML, high performance, and sleek dark/light design systems.',
        requirements: [
          'Demonstrated expertise in CSS3, animations, Flexbox, and Grid',
          'Strong fluency in Angular or React with TypeScript',
          'Passion for typography, layout spacing, and responsive mobile adaptation',
        ],
        responsibilities: [
          'Translate Figma design tokens into reusable UI component libraries',
          'Ensure web accessibility (WCAG 2.1 AA compliance) across all pages',
          'Optimize Largest Contentful Paint (LCP) and client-side rendering speed',
        ],
        requiredSkills: ['Angular', 'TypeScript', 'CSS3', 'HTML5'],
        preferredSkills: ['Figma', 'RxJS', 'TailwindCSS', 'Web Performance'],
        salary: { min: 90000, max: 120000, currency: 'USD', period: 'yearly', isDisclosed: true },
        location: 'Austin, TX (Hybrid)',
        workType: 'hybrid',
        experienceLevel: 'entry',
        jobType: 'full-time',
        status: 'active',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        applicantsCount: 9,
        isFeatured: true,
      },
      {
        title: 'Backend Systems & API Intern',
        company: cloudScaleCompany._id,
        recruiter: recruiter2User._id,
        companyName: cloudScaleCompany.name,
        companyLogo: cloudScaleCompany.logo,
        description: 'Looking for a curious student or new grad intern to collaborate on high-performance distributed systems. You will learn cloud infrastructure, database scaling, and containerized deployment.',
        requirements: [
          'Solid understanding of data structures, algorithms, and OOP principles',
          'Hands-on experience building projects in Node.js, Python, or Go',
          'Enthusiasm for backend architectures, REST APIs, and database fundamentals',
        ],
        responsibilities: [
          'Develop backend utility services and automated integration test suites',
          'Profile query execution plans in MongoDB / PostgreSQL',
          'Assist in writing developer documentation and API schema specifications',
        ],
        requiredSkills: ['Node.js', 'MongoDB', 'JavaScript', 'REST API'],
        preferredSkills: ['Docker', 'Linux', 'Git', 'DSA'],
        salary: { min: 45, max: 55, currency: 'USD', period: 'hourly', isDisclosed: true },
        location: 'Seattle, WA (Remote Friendly)',
        workType: 'remote',
        experienceLevel: 'internship',
        jobType: 'internship',
        status: 'active',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        applicantsCount: 28,
        isFeatured: false,
      },
      {
        title: 'FinTech Software Engineer (Core Platform)',
        company: finflowCompany._id,
        recruiter: recruiterUser._id,
        companyName: finflowCompany.name,
        companyLogo: finflowCompany.logo,
        description: 'FinFlow is expanding its transaction processing engineering squad. Help us build high-availability microservices capable of processing thousands of secure payments every second.',
        requirements: [
          'Experience building mission-critical Node.js services with strong error handling',
          'Thorough knowledge of relational and NoSQL databases, indexes, and transactions',
          'Understanding of encryption, JWT, OAuth, and API security practices',
        ],
        responsibilities: [
          'Implement idempotent transaction APIs and event-driven webhooks',
          'Ensure 99.99% system availability with automated telemetry and alerting',
          'Coordinate security audits and penetration test remediations',
        ],
        requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST API'],
        preferredSkills: ['Redis', 'Docker', 'AWS', 'Security'],
        salary: { min: 125000, max: 160000, currency: 'USD', period: 'yearly', isDisclosed: true },
        location: 'New York, NY (On-site)',
        workType: 'onsite',
        experienceLevel: 'mid',
        jobType: 'full-time',
        status: 'active',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applicantsCount: 19,
        isFeatured: true,
      },
      {
        title: 'AI/ML Engineering Intern (Generative Models)',
        company: nexusCompany._id,
        recruiter: recruiterUser._id,
        companyName: nexusCompany.name,
        companyLogo: nexusCompany.logo,
        description: 'Exciting internship working alongside our frontier AI research scientists. Build evaluation harnesses, test prompt pipelines, and connect LLM APIs to production applications.',
        requirements: [
          'Background in Computer Science, Data Science, or related quantitative field',
          'Experience with Python, JavaScript, and interacting with modern AI APIs',
          'Basic understanding of embeddings, vector databases, and prompt architecture',
        ],
        responsibilities: [
          'Design automated benchmark suites for LLM output evaluation',
          'Integrate generative AI APIs with frontend demonstration dashboards',
          'Experiment with agentic tool calling and structured output schemas',
        ],
        requiredSkills: ['Python', 'JavaScript', 'REST API'],
        preferredSkills: ['Machine Learning', 'Docker', 'Git'],
        salary: { min: 48, max: 60, currency: 'USD', period: 'hourly', isDisclosed: true },
        location: 'San Francisco, CA (Remote)',
        workType: 'remote',
        experienceLevel: 'internship',
        jobType: 'internship',
        status: 'active',
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        applicantsCount: 35,
        isFeatured: true,
      },
    ];

    const createdJobs = await Job.insertMany(jobs);
    console.log(` Inserted ${createdJobs.length} realistic jobs and internships.`);

    const jobFullStack = createdJobs[0];
    const jobFrontend = createdJobs[1];
    const jobBackendIntern = createdJobs[2];

    // 6. Create Applications for Gaurav
    const applications = [
      {
        job: jobFullStack._id,
        candidate: studentUser._id,
        recruiter: recruiterUser._id,
        resume: studentResume._id,
        coverLetter: 'Dear Nexus AI Hiring Team, I am eager to apply for the Full Stack Engineer role. My experience building reactive interfaces with Angular 19 and scalable Node.js services aligns directly with your mission.',
        status: 'Interview',
        matchScore: 92,
        matchDetails: {
          matchedSkills: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB'],
          missingSkills: ['Docker', 'AWS'],
          recommendation: 'Exceptional skill alignment. Candidate passed initial technical screening.',
        },
        timeline: [
          { status: 'Applied', note: 'Application submitted through SkillBridge platform', changedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
          { status: 'Under Review', note: 'Resume reviewed by technical hiring team', changedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000) },
          { status: 'Shortlisted', note: 'Selected for round 1 technical interview', changedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000) },
          { status: 'Interview', note: 'Interview scheduled via Google Meet', changedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000) },
        ],
        recruiterNotes: 'Impressive GitHub portfolio and solid Angular Signal knowledge.',
        interviewDetails: {
          scheduledDate: new Date(Date.now() + 2 * 24 * 3600 * 1000),
          mode: 'Google Meet',
          link: 'https://meet.google.com/sb-tech-nexus',
          notes: 'Prepare to discuss system design, Angular state management, and Node.js concurrency.',
        },
      },
      {
        job: jobFrontend._id,
        candidate: studentUser._id,
        recruiter: recruiter2User._id,
        resume: studentResume._id,
        coverLetter: 'Dear PixelCraft Studios team, I love your commitment to design aesthetics and modern CSS architectures. I would love to bring my Angular and responsive design capabilities to your squad.',
        status: 'Under Review',
        matchScore: 86,
        matchDetails: {
          matchedSkills: ['Angular', 'TypeScript', 'CSS3', 'HTML5'],
          missingSkills: ['Figma'],
          recommendation: 'Strong frontend foundations.',
        },
        timeline: [
          { status: 'Applied', note: 'Application submitted', changedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000) },
          { status: 'Under Review', note: 'Recruiter reviewing portfolio links', changedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000) },
        ],
      },
      {
        job: jobBackendIntern._id,
        candidate: studentUser._id,
        recruiter: recruiter2User._id,
        resume: studentResume._id,
        coverLetter: 'Hello CloudScale Systems, having interned with you previously, I am excited to apply for your new backend systems initiative.',
        status: 'Shortlisted',
        matchScore: 88,
        timeline: [
          { status: 'Applied', note: 'Application submitted', changedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000) },
          { status: 'Under Review', note: 'Reviewed by engineering manager', changedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000) },
          { status: 'Shortlisted', note: 'Shortlisted for technical challenge', changedAt: new Date() },
        ],
      },
    ];

    await Application.insertMany(applications);
    console.log(' Inserted realistic job applications with timeline history.');

    // 7. Insert Saved Jobs
    await SavedJob.insertMany([
      {
        user: studentUser._id,
        job: jobFullStack._id,
        category: 'Full Stack',
        notes: 'Priority #1 choice. Review Angular signals and AI integration before interview.',
      },
      {
        user: studentUser._id,
        job: jobFrontend._id,
        category: 'Frontend',
        notes: 'Great culture and modern design aesthetic.',
      },
    ]);
    console.log(' Inserted bookmarked saved jobs.');

    // 8. Insert Notifications
    await Notification.insertMany([
      {
        recipient: studentUser._id,
        type: 'interview',
        title: 'Interview Scheduled: Full Stack Engineer',
        message: 'Nexus AI Labs scheduled your technical interview for Google Meet.',
        link: '/applications',
        read: false,
      },
      {
        recipient: studentUser._id,
        type: 'job_match',
        title: '92% Job Match Detected!',
        message: 'Your profile is a 92% match for the new Full Stack Engineer posting at Nexus AI Labs.',
        link: `/jobs/${jobFullStack._id}`,
        read: false,
      },
      {
        recipient: studentUser._id,
        type: 'application_status',
        title: 'Application Shortlisted',
        message: 'CloudScale Systems shortlisted your application for Backend Systems & API Intern.',
        link: '/applications',
        read: true,
      },
      {
        recipient: recruiterUser._id,
        type: 'system',
        title: 'New Candidate Application',
        message: 'Gaurav Sharma applied for Full Stack Engineer (Angular + Node.js). Match Score: 92%.',
        link: '/recruiter/applications',
        read: false,
      },
    ]);
    console.log(' Inserted platform notifications.');

    // 9. Insert Interview Questions
    await InterviewQuestion.insertMany(seedData.interviewQuestions);
    console.log(` Inserted ${seedData.interviewQuestions.length} interview questions.`);

    // 10. Insert Skill Categories
    await SkillCategory.insertMany(seedData.skillCategories);
    console.log(` Inserted ${seedData.skillCategories.length} skill categories & roadmaps.`);

    console.log('--- SkillBridge Database Seed Complete! ---');
  } catch (err) {
    console.error('Seed process failed:', err);
    throw err;
  }
};

module.exports = { seedAll };

if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('Seed runner completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed runner failed:', err);
      process.exit(1);
    });
}
