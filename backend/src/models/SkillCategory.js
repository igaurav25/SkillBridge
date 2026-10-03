const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    popularRoles: [{ type: String }],
    targetSkills: [
      {
        name: { type: String, required: true },
        importance: {
          type: String,
          enum: ['Essential', 'Recommended', 'NiceToHave'],
          default: 'Essential',
        },
        description: { type: String, default: '' },
        learningResource: { type: String, default: '' },
      },
    ],
    targetRoles: [
      {
        title: { type: String, required: true },
        level: { type: String, default: 'Entry to Mid' },
        requiredSkills: [{ type: String }],
        recommendedSkills: [{ type: String }],
        roadmap: [
          {
            step: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String, default: '' },
            skills: [{ type: String }],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
