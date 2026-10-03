const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: 'Information Technology',
    },
    location: {
      type: String,
      default: 'San Francisco, CA',
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'],
      default: '51-200',
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ name: 'text', industry: 'text', location: 'text' });
companySchema.index({ isVerified: 1 });

module.exports = mongoose.model('Company', companySchema);
