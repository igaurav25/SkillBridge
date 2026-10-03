# 🚀 SkillBridge — AI-Powered Job & Internship Platform

> **Modern Full-Stack Career Ecosystem engineered for Students, Job Seekers, Recruiters, and Administrators.**  
> Built with **Angular 19 (Standalone & Signals)**, **Node.js / Express**, **MongoDB (Mongoose)**, and a **Dual-Engine AI Architecture** (Google Gemini API + Intelligent Heuristic Fallback).

---

## 📋 Table of Contents

1. [🌟 Platform Overview](#-platform-overview)
2. [✨ Key Features & Modules](#-key-features--modules)
   - [👤 Student & Candidate Career Hub](#-student--candidate-career-hub)
   - [📄 Resume Builder & ATS Resume Analyzer](#-resume-builder--ats-resume-analyzer)
   - [🌐 Real-Time Job Marketplace & 350+ Platforms Engine](#-real-time-job-marketplace--350-platforms-engine)
   - [🤖 Dual-Engine AI Intelligence Layer](#-dual-engine-ai-intelligence-layer)
   - [🎙️ AI Mock Interview Prep & Question Bank](#-ai-mock-interview-prep--question-bank)
   - [💼 Recruiter Command Center & Candidate Pipeline](#-recruiter-command-center--candidate-pipeline)
   - [🛡️ Admin Governance & Moderation Console](#-admin-governance--moderation-console)
   - [🔔 Notifications & Safety Reporting System](#-notifications--safety-reporting-system)
   - [🎨 Design System & Theme Engine](#-design-system--theme-engine)
3. [🛠️ Tech Stack & Technologies Used](#-tech-stack--technologies-used)
4. [📐 Step-by-Step Implementation Guide](#-step-by-step-implementation-guide)
   - [Step 1: Architecture & Project Foundation](#step-1-architecture--project-foundation)
   - [Step 2: Authentication, Security & Anti-Abuse](#step-2-authentication-security--anti-abuse)
   - [Step 3: Profiles & Dynamic Completion Engine](#step-3-profiles--dynamic-completion-engine)
   - [Step 4: Resume Builder & ATS Parsing Logic](#step-4-resume-builder--ats-parsing-logic)
   - [Step 5: 350+ Platforms Job Aggregator & Direct Apply](#step-5-350-platforms-job-aggregator--direct-apply)
   - [Step 6: Applications, Saved Jobs & Notifications Pipeline](#step-6-applications-saved-jobs--notifications-pipeline)
   - [Step 7: Dual-Engine AI Integration & Heuristic Fallbacks](#step-7-dual-engine-ai-integration--heuristic-fallbacks)
   - [Step 8: AI Mock Interviews & Real-Time Scoring](#step-8-ai-mock-interviews--real-time-scoring)
   - [Step 9: Recruiter Candidate Pipeline & Talent Search](#step-9-recruiter-candidate-pipeline--talent-search)
   - [Step 10: Admin Executive Governance & Moderation](#step-10-admin-executive-governance--moderation)
   - [Step 11: Design System, Theming & Angular Signals](#step-11-design-system-theming--angular-signals)
5. [🗂️ Project Directory Structure](#-project-directory-structure)
6. [📡 Complete REST API Directory](#-complete-rest-api-directory)
7. [🔑 Pre-Seeded Demo Accounts](#-pre-seeded-demo-accounts)
8. [⚡ Quick Start & Local Setup](#-quick-start--local-setup)
9. [🧪 End-to-End Testing & Verification](#-end-to-end-testing--verification)
10. [🚢 Production Deployment](#-production-deployment)

---

## 🌟 Platform Overview

**SkillBridge** solves the fundamental gap between higher education, skill acquisition, and entry-level career placement. Traditional job boards are cluttered with spam postings, lack skill context, provide zero resume feedback, and redirect applicants through endless third-party app installations.

SkillBridge provides an end-to-end career acceleration platform:
- **For Students/Candidates**: Analyze your resume against ATS bots, identify skill gaps for your dream role, get a customized learning roadmap, practice AI-evaluated technical interviews, and apply directly to verified openings.
- **For Recruiters**: Post positions, review incoming candidates with visual kanban-style stages, view applicant ATS match percentages, and discover top developer talent across tech stacks.
- **For Platform Admins**: Total oversight of platform growth, user suspensions, job moderation, scam report handling, company verification badges, and executive metrics.

---

## ✨ Key Features & Modules

### 👤 Student & Candidate Career Hub
- **Dynamic Profile Engine**: Tracks personal information, professional headline, bio, portfolio links (GitHub, LinkedIn, Portfolio site), education history, verified skills, and project showcases with live URLs.
- **Profile Completion Tracker**: Real-time percentage indicator (0–100%) that motivates candidates to complete their portfolio with visual progress badges.
- **Student Dashboard**: Central cockpit showing quick stats (Applications Submitted, Saved Positions, Mock Interviews Taken, Skill Match Score), recent application tracking, recommended jobs, and quick shortcuts.

### 📄 Resume Builder & ATS Resume Analyzer
- **Multi-Section Resume Builder**: Interactive editor supporting Personal Details, Professional Summary, Work Experience, Projects, Education, and Skills.
- **Real-Time Live Preview & PDF Export**: Instant visual rendering styled for standard ATS parser compatibility with 1-click PDF download.
- **ATS Resume Analyzer**:
  - Upload PDF resumes (parsed server-side via `pdf-parse`) or paste plain text.
  - Overall ATS Compatibility Score (0–100).
  - Multi-category breakdown: Formatting Score, Content Quality, Action Verbs, and Keyword Match.
  - Actionable improvement suggestions to optimize keyword density and bypass ATS filters.

### 🌐 Real-Time Job Marketplace & 350+ Platforms Engine
- **350+ Official Career Platforms Catalog**: Aggregates opportunities from LinkedIn, Naukri, Indeed, Wellfound, Unstop, Internshala, Remotive, Jobicy, Arbeitnow, and 340+ other verified job networks.
- **Educational Stream & Track Filtering**:
  - 🎓 **B.Tech / Engineering**: Software, Cloud, DevOps, AI/ML, Cyber Security, Electronics.
  - 💼 **BBA / Management**: Marketing, HR, Business Development, Operations, Consulting.
  - 📊 **B.Com / Finance**: Banking, Accounting, Auditing, Investment, Financial Analysis.
  - 🏛️ **Government & PSUs**: UPSC, SSC, Railways, Defence, State Public Commissions, NCS.
  - 🚀 **Internships & Freshers**: College drives, entry-level internships, campus placement tracks.
  - 🌍 **Remote & Freelance**: Global remote opportunities, contract work.
- **Direct Apply URL Generator (`directApplyHelper.js`)**:
  - Automatically converts search tags and platform identifiers into direct web application links.
  - **Zero App-Store Hijacking**: Bypasses app-store install prompts or blank homepages, routing the candidate directly to the specific job/role application page.
- **Chronological Sorting**: Enforces strict newest-first sorting (`-createdAt`) so users always see freshly posted opportunities at the top.
- **Saved Jobs / Bookmarks**: Save positions for later review and apply directly from the saved jobs dashboard.

### 🤖 Dual-Engine AI Intelligence Layer
- **Live Google Gemini API Integration**: Powered by `@google/genai` and `@google/generative-ai` (`gemini-1.5-flash` / `gemini-pro`).
- **Resilient Heuristic Fallback Engine**: If the `GEMINI_API_KEY` is omitted or API quotas are exhausted, an intelligent heuristic rule engine automatically takes over without downtime or error responses.
- **AI Career Mentor Assistant**: Multi-turn conversational chatbot that pulls the candidate's actual skills and profile into the prompt context to suggest project ideas, interview prep, and career moves.
- **AI Skill Gap Analyzer**: Select any target role (Frontend, Backend, Full Stack, AI/ML, Cloud/DevOps, Data Science, Cyber Security) to receive:
  - Career Readiness Score (%).
  - Matching skills vs Missing skills.
  - Step-by-step prioritized learning roadmap with curated resources and estimated timeframes.
- **AI Job Matching**: Instant compatibility analysis between candidate profile and any selected job posting, highlighting strengths, missing keywords, and recommended next steps.
- **AI Tailored Cover Letter Generator**: Generates customized, role-specific cover letters tailored to the candidate's exact experience and the company's job requirements.

### 🎙️ AI Mock Interview Prep & Question Bank
- **Curated Technical Question Bank**: High-frequency interview questions across categories: JavaScript, Angular, Node.js, MongoDB, React, Data Structures & Algorithms (DSA), System Design, and HR/Behavioral.
- **Interactive AI Mock Interview Simulator**:
  - Choose domain, difficulty (Beginner, Intermediate, Advanced), and question count.
  - Type in answers under realistic interview simulation.
  - **Real-Time AI Scoring & Feedback**: Evaluates submitted answers on accuracy, technical depth, and communication, returning a score (0–100%), constructive feedback, and the ideal model answer.

### 💼 Recruiter Command Center & Candidate Pipeline
- **Job Requisition Management**: Create, edit, activate, or archive job postings with rich descriptions, required skills, work modes (Remote, Hybrid, On-site), and salary ranges.
- **Visual Candidate Pipeline**: Visual status stepper advancing applicants across 5 lifecycle stages:
  $$\text{Applied} \longrightarrow \text{Under Review} \longrightarrow \text{Shortlisted} \longrightarrow \text{Interview} \longrightarrow \text{Selected / Rejected}$$
- **Talent Discovery Search**: Search candidate profiles across the platform by role, technical skills, and experience level.
- **Applicant Review Suite**: View candidate details, resume, cover letter, and contact info in a unified view.

### 🛡️ Admin Governance & Moderation Console
- **Executive Platform Analytics**: Real-time KPI counters (Total Users, Students, Recruiters, Companies, Active Jobs, Reported Postings, Total Applications, Pending Reports).
- **User Management & Moderation**: Paginated user directory with search/filters. Admin can toggle user account status (`Active` / `Suspended`) or permanently delete accounts.
- **User Dossier Inspection**: Detailed modal to inspect any user's profile, contact details, role, and activity timestamps.
- **Job Moderation**: Audit all posted jobs platform-wide, view flagged/reported jobs, and delete fraudulent or scam postings.
- **Company Verification**: One-click toggle to grant or revoke verified company badges.
- **Scam & Content Reports Handling**: Review user-submitted complaints with target details, reporter info, and reason; mark status as `Pending`, `Resolved`, or `Dismissed`.
- **Admin Profile & Security Suite**: Update admin profile details (Name, Email, Phone, Avatar) and securely change passwords with current-password verification.

### 🔔 Notifications & Safety Reporting System
- **Real-Time Notification Hub**: Immediate notifications for application status updates, interview schedules, and recruiter actions. Unread counter, mark as read, mark all as read, and delete.
- **Scam & Abuse Reporting Modal**: Any candidate can report suspicious jobs or companies directly from the job card with reasons (`Spam`, `Fake Job`, `Asks for Money`, `Misleading`, `Other`) and detailed description.

### 🎨 Design System & Theme Engine
- **Custom Tokenized CSS**: Built completely with vanilla CSS custom properties (variables) — no heavy utility framework locks or bootstrap bulk.
- **Dark & Light Mode Switcher**: Fully functional theme switcher persisted in `localStorage` across page reloads.
- **Modern Glassmorphic Aesthetics**: Obsidian dark theme (`#090d16`), vibrant indigo/cyan accents, subtle glass cards (`backdrop-filter: blur`), glowing borders, and smooth micro-animations.
- **Fully Responsive**: Mobile-friendly navigation drawer, collapsible filters, responsive data tables, and modal dialogs.

---

## 🛠️ Tech Stack & Technologies Used

### Frontend Architecture
| Technology / Package | Version | Purpose in SkillBridge |
| :--- | :--- | :--- |
| **Angular** | `v19.2.0` | Core framework utilizing Standalone Components, Signals, and modern control flow (`@if`, `@for`). |
| **Angular Router** | `v19.2.0` | Client-side routing with functional guards (`authGuard`, `guestGuard`, `recruiterGuard`, `adminGuard`). |
| **Angular Forms** | `v19.2.0` | Reactive & Template-driven forms for profile editing, job posting, and auth. |
| **RxJS** | `~7.8.0` | Reactive streams, HTTP observables, debounced search filters, and event handling. |
| **TypeScript** | `~5.7.2` | Strict end-to-end type safety across models, DTOs, and services. |
| **Vanilla CSS (Design Tokens)** | Custom | Bespoke CSS design system with CSS custom properties for instant light/dark theming. |

### Backend Architecture
| Technology / Package | Version | Purpose in SkillBridge |
| :--- | :--- | :--- |
| **Node.js** | `v18+` (Tested on `v24`) | High-performance asynchronous JavaScript server runtime. |
| **Express.js** | `^4.21.2` | RESTful API routing, controller modularization, and middleware orchestration. |
| **MongoDB & Mongoose** | `^8.9.5` | Document database with strict schemas, indexes, hooks, and relationships. |
| **mongodb-memory-server** | `^10.1.3` | **Zero-config local database fallback** — spins up an in-memory Mongo instance if native MongoDB is not running. |
| **@google/genai** & **@google/generative-ai** | `^0.24.1` | Official Google Gemini SDK for LLM-powered mentor chat, ATS scoring, and mock interviews. |
| **jsonwebtoken (JWT)** | `^9.0.2` | Stateless bearer token authentication with 7-day expiration. |
| **bcryptjs** | `^2.4.3` | Salted password hashing (10 salt rounds) for secure user credential storage. |
| **pdf-parse** | `^1.1.1` | Binary PDF parsing to extract raw text from candidate uploaded resumes. |
| **multer** | `^1.4.5` | Multipart form-data handling for file uploads (resumes and avatars). |
| **helmet** | `^8.0.0` | HTTP response header security (XSS, clickjacking, MIME-sniffing prevention). |
| **express-rate-limit** | `^7.5.0` | Protects authentication and AI endpoints from brute-force and DDoS attacks. |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing configuration between Angular and Express. |
| **dotenv** | `^16.4.7` | Secure environment variable configuration from `.env` files. |
| **morgan** | `^1.10.0` | HTTP request logging for development debugging. |

---

## 📐 Step-by-Step Implementation Guide

### Step 1: Architecture & Project Foundation
1. **Repository Layout**: Segregated the repository into `frontend/` (Angular 19 SPA) and `backend/` (Node/Express REST API).
2. **Server Initialization (`backend/server.js`)**:
   - Implemented an intelligent database connection lifecycle: attempts connecting to `process.env.MONGODB_URI`.
   - If local MongoDB daemon is unavailable, it automatically starts `mongodb-memory-server` in-memory fallback so developers can run the app without installing MongoDB.
   - Automatically invokes `seedDatabase()` on startup to populate realistic demo data if collections are empty.
3. **Express Middleware Pipeline (`backend/src/app.js`)**:
   - Configured `helmet()` for headers security, `cors()` for cross-origin authorization with the Angular frontend, `express.json()` with payload caps, and rate limiters.

### Step 2: Authentication, Security & Anti-Abuse
1. **User Schema (`backend/src/models/User.js`)**:
   - Built with fields: `name`, `email`, `password`, `role` (`student`, `recruiter`, `admin`), `isActive`, `avatar`, and timestamps.
   - Password encrypted before saving using `bcrypt.hash()` hook; custom instance method `matchPassword()` handles verification.
2. **Disposable & Fake Email Blocker (`backend/src/utils/emailValidator.js`)**:
   - Created a strict validator that checks RFC 5322 regex formatting, minimum 2-character TLDs, and cross-references against a blacklist of **80+ disposable email domains** (`tempmail.com`, `mailinator.com`, `10minutemail.com`, etc.).
3. **Role Escalation Lockdown (`backend/src/validators/inputValidators.js`)**:
   - Implemented a validator in `validateRegisterInput` that explicitly rejects any registration request containing `role: 'admin'`. Admin accounts can only be provisioned by super-admins or through internal database seeding.
4. **JWT Auth & Authorization Middleware (`backend/src/middleware/authMiddleware.js`)**:
   - `protect`: Extracts `Bearer <token>` from the `Authorization` header, verifies with `jwt.verify()`, loads the user from database, and verifies active status.
   - `authorize(...roles)`: Restricts endpoint access to specific roles (e.g. `recruiter`, `admin`).
5. **Angular Functional Route Guards (`frontend/src/app/guards/auth.guard.ts`)**:
   - `authGuard`: Verifies active JWT session before allowing access to user dashboards.
   - `guestGuard`: Prevents logged-in users from seeing the `/login` or `/register` pages.
   - `studentGuard` & `recruiterGuard`: Enforces role-specific route partitioning.
   - `adminGuard`: Strictly restricts `/admin/*` routes to accounts with `role === 'admin'`.

### Step 3: Profiles & Dynamic Completion Engine
1. **Profile Schema (`backend/src/models/Profile.js`)**:
   - Associated 1-to-1 with `User`. Stores `headline`, `bio`, `contactNumber`, `location`, `socialLinks`, `skills` array, `education` array, `experience` array, and `projects` array.
2. **Dynamic Completion Algorithm (`backend/src/controllers/profileController.js`)**:
   - Calculates profile score based on weighted milestones:
     $$\text{Base Info (20\%)} + \text{Education (20\%)} + \text{Skills (20\%)} + \text{Experience (20\%)} + \text{Projects (20\%)} = 100\%$$
   - Updates `profileCompletion` field on every profile modification.
3. **Frontend Profile Editor (`frontend/src/app/pages/profile/`)**:
   - Segmented into modular tabs: Overview, Experience, Education, Skills, and Projects with real-time UI validation and instant progress recalculation.

### Step 4: Resume Builder & ATS Parsing Logic
1. **Resume Builder (`frontend/src/app/pages/resume-builder/`)**:
   - Provides a structured template editor that binds directly to the user's profile data.
   - Features real-time formatting conforming to clean ATS standards: single-column layout, standard headers, and bulleted achievements.
   - Implemented client-side PDF generation allowing candidates to download print-ready resumes.
2. **ATS Resume Analyzer (`backend/src/controllers/resumeController.js` & `resumeParserService.js`)**:
   - Handles multi-part file uploads via `multer`.
   - Utilizes `pdf-parse` to extract raw textual tokens from candidate resumes.
   - Feeds the parsed text into the Dual AI Engine to perform keyword density matching, formatting checks, and action-verb frequency auditing, returning a comprehensive score (0–100) and actionable bulleted advice.

### Step 5: 350+ Platforms Job Aggregator & Direct Apply
1. **Platforms Data Matrix (`backend/src/data/platformsData.js`)**:
   - Catalog of 350 verified platforms classified into educational streams: `btech`, `bba`, `bcom`, `government`, `internship`, `remote`, `creative`, `healthcare`, `teaching`, and `law`.
2. **Real-Time Job Aggregator (`backend/src/services/liveJobService.js`)**:
   - Ingests real-time feeds from public remote APIs (Remotive, Jobicy, Arbeitnow) and synthesizes verified opportunities across the 350 platform catalog.
   - Implements in-memory caching with a 6-minute TTL to optimize external API calls and response latencies.
3. **Direct Apply URL Generator (`backend/src/utils/directApplyHelper.js`)**:
   - Resolves role titles and company names into direct career application URLs across 350+ portals.
   - Eliminates app-store redirects, tracking loops, and empty search homepages.
4. **Job Search & Filter Engine (`backend/src/controllers/jobController.js`)**:
   - Merges database job listings with real-time aggregated feeds.
   - Supports search by keyword, location, work type (`remote`, `hybrid`, `onsite`), experience level (`entry`, `mid`, `senior`), stream, and course.
   - Enforces chronological ordering (`-createdAt`) to ensure newest listings appear first.

### Step 6: Applications, Saved Jobs & Notifications Pipeline
1. **Application Lifecycle (`backend/src/models/Application.js`)**:
   - Connects `job`, `candidate`, and `recruiter`.
   - Manages state machine transitions:
     $$\text{Applied} \longrightarrow \text{Under Review} \longrightarrow \text{Shortlisted} \longrightarrow \text{Interview} \longrightarrow \text{Selected / Rejected}$$
   - Prevents duplicate applications from the same user for the same job listing.
2. **Saved Jobs System (`backend/src/controllers/savedJobController.js`)**:
   - Enables candidates to bookmark jobs with 1-click toggle, supporting pagination and quick apply from the bookmarks page.
3. **Reactive Notifications (`backend/src/controllers/notificationController.js`)**:
   - Automatically dispatches notifications whenever a recruiter updates an application's status.
   - Endpoints to fetch unread count, mark individual items as read, mark all read, or delete notifications.

### Step 7: Dual-Engine AI Integration & Heuristic Fallbacks
1. **Gemini AI Service (`backend/src/services/aiService.js`)**:
   - Integrates Google's `@google/genai` and `@google/generative-ai` SDKs.
   - Configures tailored system instructions for each AI module (Career Chat, ATS Analysis, Cover Letter, Skill Gap, Mock Interview).
2. **Heuristic Fallback Engine**:
   - Every AI method is wrapped with intelligent rule-based fallbacks.
   - If the Gemini API key is missing or encounters a 429 quota limit, the heuristic engine calculates keyword overlaps, computes readiness scores, and generates structured roadmaps seamlessly.
3. **Skill Gap Analyzer (`/api/skills/analyze-gap`)**:
   - Compares the candidate's existing verified skill set against predefined industry role profiles.
   - Returns readiness score, missing skills list, and a phased curriculum.

### Step 8: AI Mock Interviews & Real-Time Scoring
1. **Questions Bank (`backend/src/models/InterviewQuestion.js`)**:
   - Categorized repository of technical and behavioral interview questions with difficulty tags and reference answers.
2. **Mock Interview Session (`backend/src/models/MockInterviewSession.js`)**:
   - Tracks session lifecycle: candidate ID, selected category, question count, answers submitted, and AI evaluations.
3. **Real-Time Answer Evaluation (`backend/src/controllers/interviewController.js`)**:
   - Submits candidate's answer and model answer to the AI engine.
   - Returns a structured evaluation containing accuracy score (0–100%), constructive feedback on mistakes, and sample best-practice answers.

### Step 9: Recruiter Candidate Pipeline & Talent Search
1. **Recruiter Dashboard (`frontend/src/app/pages/recruiter-dashboard/`)**:
   - Job Requisition Creator: form with role requirements, salary disclosure, and work modes.
   - Visual Kanban/Stepper: drag or click candidate status to advance them along the hiring pipeline.
2. **Candidate Talent Discovery (`backend/src/controllers/userController.js`)**:
   - Search candidate profiles across the platform filtered by skills, experience, and location.

### Step 10: Admin Executive Governance & Moderation
1. **Admin Statistics Pipeline (`backend/src/controllers/adminController.js`)**:
   - Aggregates platform KPIs in parallel via `Promise.all`: total users, student vs recruiter breakdown, active jobs, reported listings, verified companies, and pending abuse tickets.
2. **User Administration**:
   - Activate/Suspend accounts or delete spam profiles with automatic cascade cleanup.
3. **Company Verification**:
   - Toggle verification badge status with instant UI feedback.
4. **Content & Scam Moderation (`backend/src/controllers/reportController.js`)**:
   - Allows users to report fraudulent jobs/companies.
   - Admins review complaints and transition status (`Pending` $\rightarrow$ `Resolved` / `Dismissed`).
5. **Admin Security Suite**:
   - Enables admins to update personal details and change administrative passwords securely via bcrypt.

### Step 11: Design System, Theming & Angular Signals
1. **Vanilla CSS Design System (`frontend/src/styles.css`)**:
   - Engineered dual-palette CSS custom variables (`[data-theme="dark"]` and `[data-theme="light"]`).
   - Glassmorphic card styling, responsive layout grids, custom scrollbars, and focus states.
2. **Theme Service (`frontend/src/app/services/theme.service.ts`)**:
   - Manages theme toggle state using Angular Signals (`signal<boolean>`), synchronizing state with the `document.documentElement` data attribute and `localStorage`.
3. **HTTP Interceptors**:
   - `auth.interceptor.ts`: Attaches `Authorization: Bearer <token>` to all outbound requests.
   - `error.interceptor.ts`: Catches 401 Unauthorized responses to trigger automatic logout and dispatches global toast notifications for server errors.

---

## 🗂️ Project Directory Structure

```text
SkillBridge/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── aiConfig.js               # Gemini AI client initialization
│   │   │   └── db.js                     # MongoDB connection with in-memory fallback
│   │   ├── controllers/
│   │   │   ├── adminController.js        # KPI stats, user moderation, report review, admin profile
│   │   │   ├── aiController.js           # Career mentor chat, cover letters, job matching
│   │   │   ├── applicationController.js  # Apply, candidate applications, status updates
│   │   │   ├── authController.js         # Register, login, forgot password, token check
│   │   │   ├── companyController.js      # Company profiles and listings
│   │   │   ├── interviewController.js    # Questions bank, mock interview start & answer scoring
│   │   │   ├── jobController.js          # CRUD jobs, search, multi-filter, stream query
│   │   │   ├── notificationController.js # Real-time candidate & recruiter notifications
│   │   │   ├── profileController.js      # Student profile CRUD & completion formula
│   │   │   ├── reportController.js       # User scam/abuse reporting endpoints
│   │   │   ├── resumeController.js       # ATS resume parsing, scoring & feedback
│   │   │   ├── savedJobController.js     # Saved positions bookmarking
│   │   │   ├── skillController.js        # Skill gap analysis & catalog
│   │   │   └── userController.js         # Candidate talent discovery search
│   │   ├── data/
│   │   │   ├── platformsData.js          # Catalog of 350+ career platforms by stream
│   │   │   └── realJobData.js            # Real-world benchmark job data
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js         # JWT verification & Bearer token decoding
│   │   │   ├── errorMiddleware.js        # Global error handler with clean JSON responses
│   │   │   ├── roleMiddleware.js         # Role authorization guard (student, recruiter, admin)
│   │   │   └── uploadMiddleware.js       # Multer multipart file upload handler
│   │   ├── models/
│   │   │   ├── Application.js            # Job application schema with status enum
│   │   │   ├── Company.js                # Company schema with verification badge
│   │   │   ├── Conversation.js           # Multi-turn AI mentor chat history
│   │   │   ├── InterviewQuestion.js      # Curated technical interview question model
│   │   │   ├── Job.js                    # Comprehensive job listing schema
│   │   │   ├── MockInterviewSession.js   # Active mock interview session & evaluations
│   │   │   ├── Notification.js           # In-app notification schema
│   │   │   ├── Profile.js                # Student career portfolio schema
│   │   │   ├── Report.js                 # Content abuse / scam report schema
│   │   │   ├── Resume.js                 # Saved resume schema
│   │   │   ├── SavedJob.js               # User bookmarked jobs schema
│   │   │   ├── SkillCategory.js          # Technical skill classification model
│   │   │   └── User.js                   # User account schema with bcrypt hooks
│   │   ├── routes/
│   │   │   ├── adminRoutes.js            # /api/admin
│   │   │   ├── aiRoutes.js               # /api/ai
│   │   │   ├── applicationRoutes.js      # /api/applications
│   │   │   ├── authRoutes.js             # /api/auth
│   │   │   ├── companyRoutes.js          # /api/companies
│   │   │   ├── interviewRoutes.js        # /api/interviews
│   │   │   ├── jobRoutes.js              # /api/jobs
│   │   │   ├── notificationRoutes.js     # /api/notifications
│   │   │   ├── profileRoutes.js          # /api/profiles
│   │   │   ├── reportRoutes.js           # /api/reports
│   │   │   ├── resumeRoutes.js           # /api/resumes
│   │   │   ├── savedJobRoutes.js         # /api/saved-jobs
│   │   │   ├── skillRoutes.js            # /api/skills
│   │   │   └── userRoutes.js             # /api/users
│   │   ├── services/
│   │   │   ├── aiService.js              # Gemini API client & heuristic fallback engine
│   │   │   ├── liveJobService.js         # 350+ platform aggregator with caching
│   │   │   └── resumeParserService.js    # PDF text extraction service
│   │   ├── utils/
│   │   │   ├── directApplyHelper.js      # Direct web application link builder
│   │   │   ├── emailValidator.js         # Disposable / fake email domain blocker
│   │   │   ├── jwt.js                    # JWT signing & cookie helpers
│   │   │   ├── seedData.js               # Default realistic seed datasets
│   │   │   └── seedRunner.js             # Standalone database seed runner
│   │   ├── validators/
│   │   │   └── inputValidators.js        # Auth, role escalation, and job validation
│   │   ├── app.js                        # Express configuration (CORS, Helmet, Rate-Limit)
│   │   ├── package.json
│   │   └── server.js                     # HTTP listener & DB lifecycle
│   │
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── footer/               # Global footer with navigation links
│   │   │   │   ├── job-card/             # Job card component with direct apply & bookmark
│   │   │   │   ├── navbar/               # Global navigation with theme switcher & mobile drawer
│   │   │   │   ├── report-modal/         # Modal to submit scam/abuse reports
│   │   │   │   └── toast/                # Floating notification toast component
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts         # Functional route guards (auth, guest, student, recruiter, admin)
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts   # Injects JWT Bearer token into HTTP headers
│   │   │   │   └── error.interceptor.ts  # Global HTTP error handler & toast dispatcher
│   │   │   ├── models/                   # TypeScript interfaces (User, Job, Profile, Application, etc.)
│   │   │   ├── pages/
│   │   │   │   ├── admin-dashboard/      # KPI analytics, user moderation, report review
│   │   │   │   ├── applications/         # Student application tracking center
│   │   │   │   ├── auth/                 # Login & Registration pages with 1-click demo logins
│   │   │   │   ├── career-assistant/     # Multi-turn AI mentor chat interface
│   │   │   │   ├── companies/            # Company directory & company details view
│   │   │   │   ├── interview-prep/       # Question bank & AI mock interview simulator
│   │   │   │   ├── jobs/                 # Job search, multi-filters & detailed view
│   │   │   │   ├── landing/              # High-converting landing page with stats & features
│   │   │   │   ├── profile/              # Comprehensive profile editor & completion gauge
│   │   │   │   ├── recruiter-dashboard/  # Post jobs, kanban candidate pipeline, talent search
│   │   │   │   ├── resume-analyzer/      # ATS PDF resume upload, scoring & feedback
│   │   │   │   ├── resume-builder/       # Interactive resume editor & PDF download
│   │   │   │   ├── saved-jobs/           # Bookmarked positions management
│   │   │   │   ├── skill-gap/            # Target role readiness score & learning roadmaps
│   │   │   │   └── student-dashboard/    # Candidate cockpit with stats & recommended jobs
│   │   │   ├── services/                 # Angular Injectable HTTP Services
│   │   │   ├── app.component.ts          # Root component shell
│   │   │   ├── app.config.ts             # Application routing & HTTP client providers
│   │   │   └── app.routes.ts             # Complete client-side route declarations
│   │   ├── styles.css                    # Custom CSS Design System (Dark/Light themes)
│   │   └── index.html
│   ├── angular.json
│   └── package.json
│
├── test_e2e.js                           # Automated end-to-end full-stack smoke test
├── package.json
└── README.md
```

---

## 📡 Complete REST API Directory

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new candidate or recruiter (blocks fake emails & admin escalation) |
| `POST` | `/api/auth/login` | Public | Authenticate user, verify password, and return JWT Bearer token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile and permissions |
| `POST` | `/api/auth/forgot-password`| Public | Generate password reset token |
| `POST` | `/api/auth/reset-password/:token` | Public | Reset password using verified token |

### 2. Student Profiles (`/api/profiles`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profiles/me` | Private (Student) | Get own profile with calculated profile completion percentage |
| `PUT` | `/api/profiles/me` | Private (Student) | Update personal info, headline, bio, location, social links |
| `POST` | `/api/profiles/education` | Private (Student) | Add education record |
| `DELETE` | `/api/profiles/education/:id` | Private (Student) | Remove education record |
| `POST` | `/api/profiles/skills` | Private (Student) | Add verified technical skill with proficiency level |
| `DELETE` | `/api/profiles/skills/:id` | Private (Student) | Remove skill |
| `POST` | `/api/profiles/experience` | Private (Student) | Add work or internship experience |
| `DELETE` | `/api/profiles/experience/:id` | Private (Student) | Delete work experience |
| `POST` | `/api/profiles/projects` | Private (Student) | Add portfolio showcase project with GitHub & live URL |
| `DELETE` | `/api/profiles/projects/:id` | Private (Student) | Delete project |
| `GET` | `/api/profiles/user/:userId` | Private | View public candidate profile |

### 3. Job Marketplace & Aggregator (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Search & filter jobs (keywords, location, workMode, stream, experience) |
| `GET` | `/api/jobs/:id` | Public | Retrieve detailed job listing with company information |
| `POST` | `/api/jobs` | Recruiter/Admin | Create new job requisition |
| `PUT` | `/api/jobs/:id` | Recruiter/Admin | Update job listing |
| `DELETE` | `/api/jobs/:id` | Recruiter/Admin | Remove job listing |
| `GET` | `/api/jobs/recruiter/myjobs`| Recruiter | Get all jobs posted by the logged-in recruiter |

### 4. Candidate Applications & Pipeline (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/apply/:jobId` | Private (Student) | Submit application with resume and cover letter |
| `GET` | `/api/applications/my` | Private (Student) | Get candidate's submitted applications with real-time status |
| `GET` | `/api/applications/job/:jobId` | Recruiter | Get all applicants for a specific position |
| `GET` | `/api/applications/recruiter/all`| Recruiter | Get candidate submissions across all recruiter jobs |
| `PUT` | `/api/applications/:id/status` | Recruiter | Advance candidate along pipeline stages |

### 5. AI Intelligence Layer (`/api/ai` & `/api/skills`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Private | Multi-turn AI career mentor conversation |
| `GET` | `/api/ai/conversations` | Private | Retrieve previous conversation history |
| `POST` | `/api/ai/match-job/:jobId` | Private | AI match analysis between candidate profile and target job |
| `POST` | `/api/ai/generate-cover-letter` | Private | Generate customized role-specific cover letter |
| `POST` | `/api/skills/analyze-gap` | Private | Analyze skill gaps and get custom learning roadmap |

### 6. Technical Interviews & AI Mock Sessions (`/api/interviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/interviews/questions` | Public | Retrieve categorized question bank (JS, Angular, Node, DSA, etc.) |
| `POST` | `/api/interviews/mock/start` | Private | Initialize an AI mock interview session |
| `POST` | `/api/interviews/mock/:sessionId/answer` | Private | Submit answer for real-time AI scoring and evaluation |

### 7. Resume Intelligence (`/api/resumes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/resumes/analyze` | Private | Upload PDF or text resume for ATS scoring and feedback |
| `POST` | `/api/resumes/save` | Private | Save structured resume JSON to candidate account |
| `GET` | `/api/resumes/my` | Private | Retrieve saved resumes |

### 8. Bookmarks & Saved Jobs (`/api/saved-jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/saved-jobs` | Private (Student) | List all bookmarked positions |
| `POST` | `/api/saved-jobs/:jobId` | Private (Student) | Bookmark / save a job |
| `DELETE` | `/api/saved-jobs/:jobId` | Private (Student) | Remove job from saved list |

### 9. Notifications Hub (`/api/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Private | Get user notifications with unread count |
| `PUT` | `/api/notifications/:id/read` | Private | Mark single notification as read |
| `PUT` | `/api/notifications/read-all` | Private | Mark all notifications as read |
| `DELETE` | `/api/notifications/:id` | Private | Delete a notification |

### 10. Scam & Content Reports (`/api/reports`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Private | Submit report against suspicious job, company, or user |
| `GET` | `/api/reports/my` | Private | View status of user-submitted reports |

### 11. Recruiter Talent Discovery (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/candidates` | Recruiter/Admin | Search candidate directory by skill, role, and experience |

### 12. Admin Governance Suite (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin Only | Platform KPI telemetry (users, jobs, apps, reports) |
| `GET` | `/api/admin/users` | Admin Only | Paginated user management directory |
| `PUT` | `/api/admin/users/:id/status` | Admin Only | Toggle user status (`Active` / `Suspended`) |
| `DELETE` | `/api/admin/users/:id` | Admin Only | Permanently delete user account |
| `GET` | `/api/admin/jobs` | Admin Only | Audit all platform job postings |
| `PUT` | `/api/admin/companies/:id/verify` | Admin Only | Toggle company verification badge |
| `GET` | `/api/admin/reports` | Admin Only | Audit and filter scam/abuse complaints |
| `PUT` | `/api/admin/reports/:id/status` | Admin Only | Update report status (`Pending`, `Resolved`, `Dismissed`) |
| `GET` | `/api/admin/profile` | Admin Only | Get admin profile details |
| `PUT` | `/api/admin/profile` | Admin Only | Update admin personal details |
| `PUT` | `/api/admin/password` | Admin Only | Update admin password with current password verification |

---

## 🔑 Pre-Seeded Demo Accounts

The backend automatically creates realistic demo accounts on initial startup:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@skillbridge.com` | `Password123!` | Student Dashboard, ATS Resume Analyzer, Resume Builder, Jobs Marketplace, Applications Tracker, Saved Jobs, AI Career Mentor, AI Mock Interviews. |
| 💼 **Recruiter** | `recruiter@skillbridge.com` | `Password123!` | Recruiter Command Center, Post/Edit Jobs, Visual Candidate Pipeline Stepper, Talent Search, Review Candidate Resumes. |
| 🛡️ **Admin** | `*********` | `********` | Executive Governance Console, KPI Metrics, User Suspension/Deletion, Job Moderation, Company Verification, Scam Reports Review, Admin Profile & Password Management. |

> 💡 *The Sign-In page (`/login`) includes 1-click demo login buttons for each role for instant exploration.*

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18+ (tested and verified on Node v24)
- **npm**: v9+
- *(Optional)* Local MongoDB on `mongodb://127.0.0.1:27017`  
  *(Note: If local MongoDB is not installed, backend automatically falls back to an embedded in-memory MongoDB database zero-config)*

---

### Step 1: Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

- Server starts on `http://localhost:5000`
- REST API Health Check: `http://localhost:5000/api/health`

### Step 2: Start the Angular Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm start
```

- Angular development server compiles and serves on `http://localhost:4200`
- Open `http://localhost:4200` in your web browser.

---

## 🔐 Environment Configuration

Create or modify `backend/.env`:

```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/skillbridge
JWT_SECRET=skillbridge_super_secure_jwt_production_secret_2026_xyz
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:4200

# Dual-Engine AI Configuration (Optional):
# Add your Google Gemini API key to enable live LLM generation:
GEMINI_API_KEY=
# Note: If no key is set, the intelligent heuristic fallback engine
# automatically handles ATS scoring, job matching, mock interviews, and roadmaps.
```

---

## 🧪 End-to-End Testing & Verification

SkillBridge includes an automated end-to-end smoke test script (`test_e2e.js`) validating the entire full-stack integration:

```bash
node test_e2e.js
```

### What `test_e2e.js` Validates:
1. **Frontend Live Check**: Confirms Angular 19 server responds on `http://localhost:4200` (HTTP 200).
2. **Backend Health Check**: Confirms Express server responds on `http://localhost:5000/api/health`.
3. **Student Authentication**: Logs in `student@skillbridge.com` and retrieves JWT token.
4. **Student Profile Verification**: Retrieves profile data and verifies completion percentage.
5. **Job Search & Filters**: Tests job querying with keyword filtering.
6. **AI Career Mentor**: Sends prompt to `/api/ai/chat` and validates AI response structure.
7. **AI Skill Gap Analyzer**: Evaluates target role readiness and extracts missing skills.
8. **AI Cover Letter Generator**: Generates customized cover letter for a selected job.
9. **Technical Question Bank & AI Mock Interview**:
   - Queries interview question bank.
   - Starts a mock interview session.
   - Submits a candidate answer and validates real-time scoring and feedback.
10. **Recruiter Authentication & Candidate Search**: Logs in recruiter and searches student talent pool.
11. **Admin Authentication & Platform KPIs**: Logs in admin and validates platform statistics.

---

## 🚢 Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. **Build Command**: `ng build`
2. **Output Directory**: `dist/frontend/browser`
3. **Environment Configuration**: Set production API URL in `frontend/src/environments/`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend-api.onrender.com/api'
   };
   ```

### Backend (Render / Railway / AWS / DigitalOcean)
1. **Build Command**: `npm install`
2. **Start Command**: `node server.js`
3. **Dashboard Environment Variables**:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/skillbridge`
   - `JWT_SECRET=<your-cryptographically-secure-secret>`
   - `CLIENT_URL=https://your-skillbridge-frontend.vercel.app`
   - `GEMINI_API_KEY=<your-gemini-api-key>`

---

## 🛡️ License & Acknowledgements

Created for students, developers, educators, and recruiters worldwide to accelerate tech careers through verified skill progression and AI career intelligence.
