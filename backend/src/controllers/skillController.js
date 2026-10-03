const SkillCategory = require('../models/SkillCategory');
const Profile = require('../models/Profile');
const { analyzeSkillGap, roleBenchmarkSkills } = require('../services/aiService');

// @desc    Get all skill categories and career tracks
// @route   GET /api/skills/categories
// @access  Public
const getSkillCategories = async (req, res, next) => {
  try {
    const categories = await SkillCategory.find();
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Get target roles list for selection
// @route   GET /api/skills/roles
// @access  Public
const getTargetRoles = async (req, res, next) => {
  try {
    const roles = Object.keys(roleBenchmarkSkills).map((role) => ({
      title: role,
      skillsCount: roleBenchmarkSkills[role].length,
      skills: roleBenchmarkSkills[role],
    }));
    res.status(200).json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
};

// @desc    Analyze student skill gap against target role
// @route   POST /api/skills/analyze-gap
// @access  Private (Student)
const analyzeMySkillGap = async (req, res, next) => {
  try {
    const { targetRole = 'Full Stack Developer', manualSkills } = req.body;

    let userSkills = manualSkills || [];
    if (!manualSkills || manualSkills.length === 0) {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile && profile.skills) {
        userSkills = profile.skills.map((s) => s.name);
      }
    }

    const gapResult = await analyzeSkillGap(userSkills, targetRole);

    res.status(200).json({
      success: true,
      message: `Skill Gap Analysis completed for ${targetRole}`,
      data: gapResult,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSkillCategories,
  getTargetRoles,
  analyzeMySkillGap,
};
