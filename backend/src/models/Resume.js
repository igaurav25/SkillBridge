const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'My Professional Resume',
      required: true,
    },
    templateId: {
      type: String,
      enum: ['modern', 'executive', 'tech', 'minimal'],
      default: 'modern',
    },
    personalDetails: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: {
      type: String,
      default: '',
    },
    education: [
      {
        college: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, default: '' },
        startYear: { type: Number },
        graduationYear: { type: Number, required: true },
        cgpa: { type: String, default: '' },
      },
    ],
    skills: [
      {
        name: { type: String, required: true },
        category: { type: String, default: 'General' },
      },
    ],
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        isCurrent: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        technologies: [{ type: String }],
        liveUrl: { type: String, default: '' },
        githubUrl: { type: String, default: '' },
        highlights: [{ type: String }],
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        issueDate: { type: String, default: '' },
        credentialUrl: { type: String, default: '' },
      },
    ],
    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    fileUrl: {
      type: String,
      default: '',
    },
    rawExtractedText: {
      type: String,
      default: '',
    },
    aiAnalysis: {
      profileStrength: { type: Number, default: 0 },
      skillsScore: { type: Number, default: 0 },
      projectsScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      keywordsScore: { type: Number, default: 0 },
      summary: { type: String, default: '' },
      detectedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      strengths: [{ type: String }],
      weakSections: [{ type: String }],
      atsSuggestions: [{ type: String }],
      suggestedImprovements: [{ type: String }],
      suggestedJobRoles: [{ type: String }],
      suggestedProjects: [{ type: String }],
      suggestedTechnologies: [{ type: String }],
      analyzedAt: { type: Date },
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ user: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
