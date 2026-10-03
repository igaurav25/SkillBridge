const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview',
      'Selected',
      'Rejected',
      'Withdrawn',
    ],
    required: true,
  },
  note: { type: String, default: '' },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview',
        'Selected',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
    },
    timeline: [timelineItemSchema],
    recruiterNotes: {
      type: String,
      default: '',
    },
    interviewDetails: {
      scheduledDate: { type: Date },
      mode: { type: String, enum: ['Google Meet', 'Zoom', 'In-Person', 'Phone'], default: 'Google Meet' },
      link: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    matchDetails: {
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      recommendation: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });
applicationSchema.index({ recruiter: 1, status: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
