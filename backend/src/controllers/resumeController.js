const Resume = require('../models/Resume');
const Profile = require('../models/Profile');
const { extractTextFromBuffer, detectSkillsFromText } = require('../services/resumeParserService');
const { analyzeResume } = require('../services/aiService');

// @desc    Get user's resumes
// @route   GET /api/resumes
// @access  Private (Student)
const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-updatedAt');
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    // Only owner or recruiter can view
    if (resume.user.toString() !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this resume' });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new resume with builder
// @route   POST /api/resumes
// @access  Private (Student)
const createResume = async (req, res, next) => {
  try {
    const { title, templateId, personalDetails, summary, education, experience, skills, projects, certifications, achievements } = req.body;

    const resumeCount = await Resume.countDocuments({ user: req.user.id });

    const resume = await Resume.create({
      user: req.user.id,
      title: title || `Resume ${resumeCount + 1}`,
      templateId: templateId || 'modern',
      personalDetails: personalDetails || {
        fullName: req.user.name,
        email: req.user.email,
      },
      summary: summary || '',
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      projects: projects || [],
      certifications: certifications || [],
      achievements: achievements || [],
      isPrimary: resumeCount === 0,
    });

    res.status(201).json({ success: true, message: 'Resume created successfully', data: resume });
  } catch (err) {
    next(err);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private (Student)
const updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const fields = [
      'title', 'templateId', 'personalDetails', 'summary',
      'education', 'experience', 'skills', 'projects',
      'certifications', 'achievements', 'isPrimary'
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        resume[f] = req.body[f];
      }
    });

    if (req.body.isPrimary) {
      await Resume.updateMany({ user: req.user.id, _id: { $ne: resume._id } }, { isPrimary: false });
    }

    await resume.save();
    res.status(200).json({ success: true, message: 'Resume updated successfully', data: resume });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private (Student)
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await resume.deleteOne();
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload existing resume and run AI analysis
// @route   POST /api/resumes/upload-and-analyze
// @access  Private (Student)
const uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    let extractedText = '';
    let targetRole = req.body.targetRole || 'Full Stack Developer';

    if (req.file) {
      extractedText = await extractTextFromBuffer(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );
    } else if (req.body.resumeText) {
      extractedText = req.body.resumeText;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file (PDF/DOCX/TXT) or paste your resume text.',
      });
    }

    // Call AI analyzer
    const analysis = await analyzeResume(extractedText, targetRole);
    analysis.analyzedAt = new Date();

    const title = req.file
      ? `Uploaded: ${req.file.originalname.replace(/\.[^/.]+$/, '')}`
      : `AI Analyzed Resume (${targetRole})`;

    // Create a new resume record with analysis
    const detectedSkillsObjs = (analysis.detectedSkills || []).map((s) => ({
      name: s,
      category: 'Technical',
    }));

    const newResume = await Resume.create({
      user: req.user.id,
      title,
      personalDetails: {
        fullName: req.user.name,
        email: req.user.email,
      },
      summary: analysis.summary || '',
      skills: detectedSkillsObjs,
      rawExtractedText: extractedText.slice(0, 10000),
      aiAnalysis: analysis,
      isPrimary: true,
    });

    // Mark previous resumes non-primary
    await Resume.updateMany({ user: req.user.id, _id: { $ne: newResume._id } }, { isPrimary: false });

    // Sync to user profile scores
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile.resumeScore = analysis.profileStrength ?? 0;
      profile.atsBreakdown = {
        skillsScore: analysis.skillsScore ?? 0,
        projectsScore: analysis.projectsScore ?? 0,
        experienceScore: analysis.experienceScore ?? 0,
        keywordsScore: analysis.keywordsScore ?? 0,
      };
      profile.suggestedImprovements = analysis.suggestedImprovements || [];

      // Add detected skills to profile if not present
      if (analysis.detectedSkills && analysis.detectedSkills.length > 0) {
        const existingNames = new Set(profile.skills.map((s) => s.name.toLowerCase()));
        for (const s of analysis.detectedSkills) {
          if (!existingNames.has(s.toLowerCase())) {
            profile.skills.push({ name: s, category: 'Other', level: 'Intermediate' });
            existingNames.add(s.toLowerCase());
          }
        }
      }
      profile.calculateCompletion();
      await profile.save();
    }

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully!',
      data: newResume,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Trigger AI analysis on an existing saved resume
// @route   POST /api/resumes/:id/analyze
// @access  Private (Student)
const analyzeExistingResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const targetRole = req.body.targetRole || 'Full Stack Developer';

    // Compile text from resume structured data
    let resumeText = resume.rawExtractedText || '';
    if (!resumeText) {
      const skillsStr = (resume.skills || []).map((s) => s.name || s).join(', ');
      const expStr = (resume.experience || []).map((e) => `${e.title} at ${e.company}: ${e.description}`).join('\n');
      const projStr = (resume.projects || []).map((p) => `${p.title}: ${p.description}`).join('\n');
      resumeText = `${resume.personalDetails?.fullName || ''}\n${resume.summary || ''}\nSkills: ${skillsStr}\nExperience:\n${expStr}\nProjects:\n${projStr}`;
    }

    const analysis = await analyzeResume(resumeText, targetRole);
    analysis.analyzedAt = new Date();

    resume.aiAnalysis = analysis;
    await resume.save();

    // Update profile
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile.resumeScore = analysis.profileStrength ?? 0;
      profile.atsBreakdown = {
        skillsScore: analysis.skillsScore ?? 0,
        projectsScore: analysis.projectsScore ?? 0,
        experienceScore: analysis.experienceScore ?? 0,
        keywordsScore: analysis.keywordsScore ?? 0,
      };
      profile.suggestedImprovements = analysis.suggestedImprovements || [];
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'AI Resume Analysis refreshed!',
      data: resume,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  uploadAndAnalyzeResume,
  analyzeExistingResume,
};
