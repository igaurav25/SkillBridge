const mongoose = require('mongoose');

const mockQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, default: 'General' },
  userAnswer: { type: String, default: '' },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  suggestedAnswer: { type: String, default: '' },
  answeredAt: { type: Date },
});

const mockInterviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      default: 'Full Stack Developer',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    questions: [mockQuestionSchema],
    totalScore: {
      type: Number,
      default: 0,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

mockInterviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('MockInterviewSession', mockInterviewSessionSchema);
