const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['Job', 'Company', 'User'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetTitle: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      enum: [
        'Fake Job',
        'Suspicious Recruiter',
        'Inappropriate Content',
        'Scam',
        'Wrong Information',
        'Other',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ targetId: 1 });

module.exports = mongoose.model('Report', reportSchema);
