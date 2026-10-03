const Job = require('../models/Job');
const Company = require('../models/Company');
const Profile = require('../models/Profile');
const SavedJob = require('../models/SavedJob');
const Application = require('../models/Application');
const { calculateJobMatch } = require('../services/aiService');
const { validateJobInput } = require('../validators/inputValidators');
const {
  searchLivePlatformJobs,
  generateSimulatedLiveJob,
  checkNewJobsSince,
  getPlatformJobById,
  buildDirectApplyUrl,
} = require('../services/liveJobService');
const { PLATFORMS_350, STREAM_CATEGORIES, COURSES_CATALOG, getPlatformsByStream, searchPlatforms } = require('../data/platformsData');
const { REAL_PLATFORM_JOBS } = require('../data/realJobData');
const mongoose = require('mongoose');

// @desc    Get all jobs with search, filtering, and sorting
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      workType,
      jobType,
      experienceLevel,
      skill,
      minSalary,
      sort = 'recent',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'active' };

    // Text search
    if (search && search.trim().length > 0) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { companyName: { $regex: term, $options: 'i' } },
        { requiredSkills: { $elemMatch: { $regex: term, $options: 'i' } } },
        { description: { $regex: term, $options: 'i' } },
      ];
    }

    if (location && location.trim().length > 0) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (workType) {
      const types = workType.split(',');
      query.workType = { $in: types };
    }

    if (jobType) {
      const types = jobType.split(',');
      query.jobType = { $in: types };
    }

    if (experienceLevel) {
      const levels = experienceLevel.split(',');
      query.experienceLevel = { $in: levels };
    }

    if (skill) {
      const skills = skill.split(',').map((s) => s.trim());
      query.requiredSkills = { $in: skills.map((s) => new RegExp(s, 'i')) };
    }

    if (minSalary) {
      query['salary.min'] = { $gte: Number(minSalary) };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'salary') {
      sortOptions = { 'salary.max': -1 };
    } else if (sort === 'popular') {
      sortOptions = { applicantsCount: -1, viewsCount: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('company', 'name logo website industry location isVerified')
      .lean();

    // If candidate logged in, check if saved or applied
    let savedJobIds = new Set();
    let appliedJobIds = new Set();

    if (req.user && req.user.role === 'student') {
      const [saved, applied] = await Promise.all([
        SavedJob.find({ user: req.user.id }).select('job').lean(),
        Application.find({ candidate: req.user.id }).select('job').lean(),
      ]);
      savedJobIds = new Set(saved.map((s) => s.job.toString()));
      appliedJobIds = new Set(applied.map((a) => a.job.toString()));
    }

    const jobsWithUserMeta = jobs.map((j) => ({
      ...j,
      isSaved: savedJobIds.has(j._id.toString()),
      isApplied: appliedJobIds.has(j._id.toString()),
    }));

    res.status(200).json({
      success: true,
      count: jobsWithUserMeta.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: jobsWithUserMeta,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    let job = null;
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (isValidId) {
      job = await Job.findById(req.params.id)
        .populate('company', 'name logo website industry location companySize isVerified description')
        .populate('recruiter', 'name email avatar headline');
    }

    if (!job) {
      // Check in verified authentic jobs, catalog platforms, or live ingested jobs
      const platformJob = getPlatformJobById(req.params.id);
      if (platformJob) {
        return res.status(200).json({
          success: true,
          data: {
            ...platformJob,
            applyUrl: buildDirectApplyUrl(
              platformJob.platform,
              platformJob.title,
              platformJob.companyName,
              platformJob.stream,
              platformJob.applyUrl || platformJob.platformUrl
            ),
            isSaved: false,
            isApplied: false,
          },
        });
      }
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    // Increment views asynchronously
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    let isSaved = false;
    let isApplied = false;
    let matchAnalysis = null;

    if (req.user && req.user.role === 'student') {
      const [saved, application, profile] = await Promise.all([
        SavedJob.findOne({ user: req.user.id, job: job._id }),
        Application.findOne({ candidate: req.user.id, job: job._id }),
        Profile.findOne({ user: req.user.id }),
      ]);

      isSaved = !!saved;
      isApplied = !!application;

      if (profile) {
        matchAnalysis = await calculateJobMatch(profile.skills, job, profile);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...job.toObject(),
        isSaved,
        isApplied,
        matchAnalysis,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create job posting
// @route   POST /api/jobs
// @access  Private (Recruiter / Admin)
const createJob = async (req, res, next) => {
  try {
    const { errors, isValid } = validateJobInput(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, message: Object.values(errors)[0], errors });
    }

    let companyId = req.body.company;
    let companyName = req.body.companyName;
    let companyLogo = req.body.companyLogo || '';

    // If company not provided, find or create one for recruiter
    if (!companyId) {
      let company = await Company.findOne({ createdBy: req.user.id });
      if (!company) {
        company = await Company.create({
          name: req.body.companyName || req.user.companyName || 'My Tech Company',
          logo: req.body.companyLogo || '',
          location: req.body.location || 'Remote',
          createdBy: req.user.id,
        });
      }
      companyId = company._id;
      companyName = company.name;
      companyLogo = company.logo;
    } else {
      const company = await Company.findById(companyId);
      if (company) {
        companyName = company.name;
        companyLogo = company.logo;
      }
    }

    const job = await Job.create({
      ...req.body,
      company: companyId,
      companyName,
      companyLogo,
      recruiter: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting published successfully!',
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter / Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter / Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get jobs created by recruiter
// @route   GET /api/jobs/recruiter/myjobs
// @access  Private (Recruiter / Admin)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get popular job search tags and roles
// @route   GET /api/jobs/popular/tags
// @access  Public
const getPopularSearches = async (req, res, next) => {
  try {
    const popularRoles = [
      'Full Stack Developer',
      'Angular Developer',
      'Frontend Engineer',
      'Node.js Developer',
      'Backend Engineer',
      'AI/ML Intern',
      'Cloud DevOps',
    ];

    const popularSkills = [
      'Angular',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'MongoDB',
      'Express.js',
      'Docker',
      'Python',
      'REST API',
    ];

    res.status(200).json({
      success: true,
      data: {
        popularRoles,
        popularSkills,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get real-time live jobs aggregated across LinkedIn, Indeed, Internshala, Remotive & 350 platforms
// @route   GET /api/jobs/live-platforms
// @access  Public
const getLivePlatformJobs = async (req, res, next) => {
  try {
    const {
      query = '',
      stream = 'all',
      course = 'all',
      platform = 'all',
      location = '',
      minSalary = 0,
      maxSalary = 0,
      jobType = '',
      experienceLevel = '',
      page = 1,
      limit = 12,
    } = req.query;

    const result = await searchLivePlatformJobs({
      query,
      stream,
      course,
      platform,
      location,
      minSalary: Number(minSalary) || 0,
      maxSalary: Number(maxSalary) || 0,
      jobType,
      experienceLevel,
      page: Number(page) || 1,
      limit: Number(limit) || 12,
    });

    res.status(200).json({
      success: true,
      data: result.jobs,
      total: result.total,
      count: result.count,
      page: result.page,
      pages: result.pages,
      hasMore: result.hasMore,
      streamStats: result.streamStats,
      availablePlatforms: result.availablePlatforms,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Real-time multi-platform criteria search (stream, course, platform, role, location, salary)
// @route   POST /api/jobs/criteria-search
// @access  Public
const searchJobsByCriteria = async (req, res, next) => {
  try {
    const {
      role = '',
      query = '',
      stream = 'all',
      course = 'all',
      platform = 'all',
      location = '',
      minSalary = 0,
      maxSalary = 0,
      jobType = '',
      experienceLevel = '',
      page = 1,
      limit = 12,
    } = req.body;

    const searchTerm = role || query || '';

    const result = await searchLivePlatformJobs({
      query: searchTerm,
      stream,
      course,
      platform,
      location,
      minSalary: Number(minSalary) || 0,
      maxSalary: Number(maxSalary) || 0,
      jobType,
      experienceLevel,
      page: Number(page) || 1,
      limit: Number(limit) || 12,
    });

    res.status(200).json({
      success: true,
      message: `Found ${result.total} real-time opportunities matching your criteria.`,
      criteria: {
        role: searchTerm,
        stream,
        course,
        platform,
        location,
        minSalary,
        maxSalary,
      },
      data: result.jobs,
      total: result.total,
      count: result.count,
      page: result.page,
      pages: result.pages,
      hasMore: result.hasMore,
      streamStats: result.streamStats,
      availablePlatforms: result.availablePlatforms,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complete 350 job platforms directory and categories
// @route   GET /api/jobs/platforms
// @access  Public
const getPlatformsDirectory = async (req, res, next) => {
  try {
    const { stream, search } = req.query;
    let platforms = PLATFORMS_350;

    if (stream && stream !== 'all') {
      platforms = getPlatformsByStream(stream);
    }

    if (search && search.trim().length > 0) {
      platforms = searchPlatforms(search);
    }

    const enrichedPlatforms = platforms.map((p) => ({
      ...p,
      directUrl: buildDirectApplyUrl({
        platform: p.name,
        title: `${p.name} Careers`,
        category: p.category,
        stream: p.stream,
        platformUrl: p.url,
      }),
    }));

    res.status(200).json({
      success: true,
      totalPlatforms: PLATFORMS_350.length,
      count: enrichedPlatforms.length,
      categories: STREAM_CATEGORIES,
      data: enrichedPlatforms,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complete courses catalog for the "Select Course" expandable accordion
// @route   GET /api/jobs/courses
// @access  Public
const getCoursesCatalog = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: COURSES_CATALOG.length,
      data: COURSES_CATALOG,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check for newly posted real-time jobs since a timestamp
// @route   GET /api/jobs/live-check
// @access  Public
const checkLiveNewJobs = async (req, res, next) => {
  try {
    const { since, stream = 'all', course = 'all' } = req.query;
    const result = checkNewJobsSince({ since, stream, course });
    res.status(200).json({
      success: true,
      count: result.count,
      data: result.data,
      timestamp: result.timestamp,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Simulate/Ingest an instant live job posting for real-time testing
// @route   POST /api/jobs/simulate-live
// @access  Public
const simulateLiveJob = async (req, res, next) => {
  try {
    const { stream = 'all', course = 'all' } = req.body;
    const newJob = generateSimulatedLiveJob(stream, course);
    res.status(201).json({
      success: true,
      message: `⚡ New real-time job successfully arrived from ${newJob.platform}!`,
      data: newJob,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getPopularSearches,
  getLivePlatformJobs,
  searchJobsByCriteria,
  getPlatformsDirectory,
  getCoursesCatalog,
  checkLiveNewJobs,
  simulateLiveJob,
};
