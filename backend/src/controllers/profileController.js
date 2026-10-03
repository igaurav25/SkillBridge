const Profile = require('../models/Profile');
const User = require('../models/User');
const { extractTextFromBuffer } = require('../services/resumeParserService');
const { analyzeResume } = require('../services/aiService');

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private (Student)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email avatar role');

    if (!profile) {
      profile = await Profile.create({
        user: req.user.id,
        headline: req.user.headline || '',
        about: '',
        preferredRole: '',
        profileCompletion: 0,
        resumeScore: 0,
      });
      await profile.populate('user', 'name email avatar role');
    }

    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update whole profile or profile fields
// @route   PUT /api/profiles/me
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = req.body;
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new Profile({ user: req.user.id });
    }

    // Assign allowed fields
    const allowed = [
      'headline', 'phone', 'location', 'about', 'preferredRole',
      'preferredLocation', 'expectedSalary', 'workTypePreference',
      'github', 'linkedin', 'portfolio', 'resumeUrl',
      'education', 'skills', 'projects', 'certifications',
      'experience', 'achievements'
    ];

    allowed.forEach((field) => {
      if (fieldsToUpdate[field] !== undefined) {
        profile[field] = fieldsToUpdate[field];
      }
    });

    // If name or avatar passed, update the User document as well
    if (fieldsToUpdate.name && fieldsToUpdate.name.trim()) {
      await User.findByIdAndUpdate(req.user.id, { name: fieldsToUpdate.name.trim() });
    }
    if (fieldsToUpdate.avatar !== undefined) {
      await User.findByIdAndUpdate(req.user.id, { avatar: fieldsToUpdate.avatar });
    }

    profile.calculateCompletion();
    await profile.save();
    await profile.populate('user', 'name email avatar role');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add education
// @route   POST /api/profiles/education
// @access  Private (Student)
const addEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.education.unshift(req.body);
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Education added successfully', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete education
// @route   DELETE /api/profiles/education/:eduId
// @access  Private (Student)
const deleteEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.education = profile.education.filter(
      (item) => item._id.toString() !== req.params.eduId
    );
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Education deleted', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Add skill
// @route   POST /api/profiles/skills
// @access  Private (Student)
const addSkill = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const exists = profile.skills.some((s) => s.name.toLowerCase() === req.body.name.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'Skill already added in profile' });
    }

    profile.skills.push(req.body);
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Skill added', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete skill
// @route   DELETE /api/profiles/skills/:skillId
// @access  Private (Student)
const deleteSkill = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.skills = profile.skills.filter(
      (item) => item._id.toString() !== req.params.skillId
    );
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Skill removed', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Add project
// @route   POST /api/profiles/projects
// @access  Private (Student)
const addProject = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.projects.unshift(req.body);
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Project added', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/profiles/projects/:projectId
// @access  Private (Student)
const deleteProject = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.projects = profile.projects.filter(
      (item) => item._id.toString() !== req.params.projectId
    );
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Project deleted', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Add experience
// @route   POST /api/profiles/experience
// @access  Private (Student)
const addExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.experience.unshift(req.body);
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Experience record added', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete experience
// @route   DELETE /api/profiles/experience/:expId
// @access  Private (Student)
const deleteExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.experience = profile.experience.filter(
      (item) => item._id.toString() !== req.params.expId
    );
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Experience record deleted', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Add certification
// @route   POST /api/profiles/certifications
// @access  Private (Student)
const addCertification = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.certifications.unshift(req.body);
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Certification added', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete certification
// @route   DELETE /api/profiles/certifications/:certId
// @access  Private (Student)
const deleteCertification = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.certifications = profile.certifications.filter(
      (item) => item._id.toString() !== req.params.certId
    );
    profile.calculateCompletion();
    await profile.save();

    res.status(200).json({ success: true, message: 'Certification removed', data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public profile by user ID
// @route   GET /api/profiles/user/:userId
// @access  Public
const getProfileByUserId = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      'user',
      'name email avatar headline'
    );
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload resume from profile page
// @route   POST /api/profiles/resume
// @access  Private (Student)
const uploadProfileResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a resume file (PDF/DOCX/TXT).' });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    let extractedText = '';
    try {
      extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype, req.file.originalname);
    } catch (e) {
      extractedText = req.file.originalname;
    }

    const targetRole = profile.preferredRole || 'Full Stack Developer';
    const analysis = await analyzeResume(extractedText, targetRole);

    profile.resumeUrl = req.file.originalname;
    profile.resumeScore = analysis.profileStrength ?? 0;
    profile.atsBreakdown = {
      skillsScore: analysis.skillsScore ?? 0,
      projectsScore: analysis.projectsScore ?? 0,
      experienceScore: analysis.experienceScore ?? 0,
      keywordsScore: analysis.keywordsScore ?? 0,
    };
    profile.suggestedImprovements = analysis.suggestedImprovements || [];

    if (analysis.detectedSkills && analysis.detectedSkills.length > 0) {
      const existing = new Set(profile.skills.map((s) => s.name.toLowerCase()));
      for (const s of analysis.detectedSkills) {
        if (!existing.has(s.toLowerCase())) {
          profile.skills.push({ name: s, category: 'Other', level: 'Intermediate' });
        }
      }
    }

    profile.calculateCompletion();
    await profile.save();
    await profile.populate('user', 'name email avatar role');

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully!',
      data: {
        profile,
        fileName: req.file.originalname,
        atsAnalysis: analysis,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  uploadProfileResume,
  addEducation,
  deleteEducation,
  addSkill,
  deleteSkill,
  addProject,
  deleteProject,
  addExperience,
  deleteExperience,
  addCertification,
  deleteCertification,
  getProfileByUserId,
};
