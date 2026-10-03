const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
    },
    requirements: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      period: {
        type: String,
        enum: ['yearly', 'monthly', 'hourly', 'stipend'],
        default: 'yearly',
      },
      isDisclosed: { type: Boolean, default: true },
    },
    location: {
      type: String,
      required: true,
      default: 'Remote',
    },
    workType: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      default: 'remote',
    },
    experienceLevel: {
      type: String,
      enum: ['internship', 'entry', 'mid', 'senior', 'lead'],
      default: 'entry',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      default: 'full-time',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    deadline: {
      type: Date,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
jobSchema.index({ workType: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ 'salary.min': 1 });

module.exports = mongoose.model('Job', jobSchema);
