const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    category: {
      type: String,
      default: 'General',
      enum: ['Frontend', 'Backend', 'Full Stack', 'AI', 'Internship', 'General', 'High Priority'],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

savedJobSchema.index({ user: 1, job: 1 }, { unique: true });
savedJobSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('SavedJob', savedJobSchema);
