const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  college: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, default: '' },
  startYear: { type: Number },
  graduationYear: { type: Number, required: true },
  cgpa: { type: String, default: '' },
  isCompleted: { type: Boolean, default: false },
});

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Language', 'Framework', 'Database', 'Cloud', 'Tool', 'Core CS', 'Soft Skill', 'Other'],
    default: 'Other',
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  yearsOfExperience: { type: Number, default: 1 },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  technologies: [{ type: String }],
  highlights: [{ type: String }],
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  credentialId: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: String, required: true },
  endDate: { type: String, default: '' },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
});

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    about: { type: String, default: '' },
    preferredRole: { type: String, default: '' },
    preferredLocation: { type: String, default: '' },
    expectedSalary: { type: String, default: '' },
    workTypePreference: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite', 'any'],
      default: 'remote',
    },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    education: [educationSchema],
    skills: [skillItemSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    experience: [experienceSchema],
    achievements: [achievementSchema],
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    resumeScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    atsBreakdown: {
      skillsScore: { type: Number, default: 0 },
      projectsScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      keywordsScore: { type: Number, default: 0 },
    },
    suggestedImprovements: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Helper to compute profile completion percentage strictly based on real filled data
profileSchema.methods.calculateCompletion = function () {
  let score = 0;
  if (this.about && this.about.trim().length > 10) score += 15;
  if (this.headline && this.headline.trim().length > 2) score += 10;
  if (this.phone || this.location) score += 10;
  if (this.education && this.education.length > 0) score += 15;
  if (this.skills && this.skills.length >= 3) score += 15;
  else if (this.skills && this.skills.length > 0) score += 5;
  if (this.projects && this.projects.length > 0) score += 15;
  if (this.experience && this.experience.length > 0) score += 10;
  if (this.github || this.linkedin || this.portfolio) score += 10;

  this.profileCompletion = Math.min(100, Math.max(0, score));
  return this.profileCompletion;
};

profileSchema.pre('save', function (next) {
  this.calculateCompletion();
  next();
});

profileSchema.index({ 'skills.name': 1 });
profileSchema.index({ preferredRole: 1 });
profileSchema.index({ location: 1 });

module.exports = mongoose.model('Profile', profileSchema);
