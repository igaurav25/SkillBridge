const mongoose = require('mongoose');

const messageItemSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'New Career Conversation',
    },
    category: {
      type: String,
      enum: ['career_guidance', 'resume_review', 'skill_roadmap', 'interview_prep', 'general'],
      default: 'career_guidance',
    },
    messages: [messageItemSchema],
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
