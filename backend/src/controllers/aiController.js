const Conversation = require('../models/Conversation');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const { careerChat, generateCoverLetter, calculateJobMatch } = require('../services/aiService');

// @desc    Chat with AI Career Assistant
// @route   POST /api/ai/chat
// @access  Private (Student)
const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, conversationId, category = 'career_guidance' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    let conversation = null;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, user: req.user.id });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        user: req.user.id,
        title: message.slice(0, 40) + '...',
        category,
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Fetch user profile for context
    const profile = await Profile.findOne({ user: req.user.id });

    // Call AI service
    const aiResponse = await careerChat(message, conversation.messages, profile);

    // Add assistant response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        conversationId: conversation._id,
        reply: aiResponse,
        conversation,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's chat conversations
// @route   GET /api/ai/conversations
// @access  Private (Student)
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .select('title category updatedAt createdAt')
      .sort('-updatedAt');

    res.status(200).json({ success: true, count: conversations.length, data: conversations });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single conversation history
// @route   GET /api/ai/conversations/:id
// @access  Private (Student)
const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user.id });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.status(200).json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear / delete conversation
// @route   DELETE /api/ai/conversations/:id
// @access  Private (Student)
const deleteConversation = async (req, res, next) => {
  try {
    await Conversation.deleteOne({ _id: req.params.id, user: req.user.id });
    res.status(200).json({ success: true, message: 'Conversation removed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate personalized cover letter
// @route   POST /api/ai/generate-cover-letter
// @access  Private (Student)
const generateCoverLetterHandler = async (req, res, next) => {
  try {
    const { jobId, customInstructions } = req.body;
    const job = await Job.findById(jobId).populate('company', 'name');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Please complete your profile before generating a cover letter' });
    }

    const letter = await generateCoverLetter(profile, job);

    res.status(200).json({
      success: true,
      message: 'Cover letter generated successfully',
      data: {
        coverLetter: letter,
        jobTitle: job.title,
        companyName: job.companyName,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Match user profile with job requirements
// @route   POST /api/ai/match-job/:jobId
// @access  Private (Student)
const matchJobHandler = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(400).json({ success: false, message: 'Profile required' });

    const matchResult = await calculateJobMatch(profile.skills, job, profile);

    res.status(200).json({
      success: true,
      data: matchResult,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  chatWithAssistant,
  getConversations,
  getConversationById,
  deleteConversation,
  generateCoverLetterHandler,
  matchJobHandler,
};
