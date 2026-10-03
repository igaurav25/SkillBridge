const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'JavaScript',
        'Angular',
        'Node.js',
        'MongoDB',
        'DSA',
        'DBMS',
        'OOP',
        'HR',
        'Aptitude',
      ],
    },
    topic: {
      type: String,
      default: 'General',
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

interviewQuestionSchema.index({ category: 1, difficulty: 1 });
interviewQuestionSchema.index({ question: 'text', answer: 'text' });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
