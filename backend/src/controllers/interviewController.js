const InterviewQuestion = require('../models/InterviewQuestion');
const MockInterviewSession = require('../models/MockInterviewSession');
const { evaluateMockInterview } = require('../services/aiService');

// @desc    Get interview questions with category & difficulty filters
// @route   GET /api/interviews/questions
// @access  Public
const getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await InterviewQuestion.countDocuments(query);
    const questions = await InterviewQuestion.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      count: questions.length,
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get category counts
// @route   GET /api/interviews/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = [
      'JavaScript',
      'Angular',
      'Node.js',
      'MongoDB',
      'DSA',
      'DBMS',
      'OOP',
      'HR',
      'Aptitude',
    ];

    const counts = await InterviewQuestion.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const result = categories.map((cat) => ({
      name: cat,
      count: countMap[cat] || 0,
    }));

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// @desc    Start an AI Mock Interview Session
// @route   POST /api/interviews/mock/start
// @access  Private (Student)
const startMockSession = async (req, res, next) => {
  try {
    const { category = 'JavaScript', targetRole = 'Full Stack Developer', difficulty = 'Intermediate', questionCount = 3 } = req.body;

    // Pick questions from category or default
    let questions = await InterviewQuestion.aggregate([
      { $match: category === 'All' ? {} : { category } },
      { $sample: { size: Number(questionCount) } },
    ]);

    if (questions.length === 0) {
      questions = [
        {
          question: `Explain how you would architect a scalable web feature for a ${targetRole} role.`,
          category,
        },
        {
          question: `What are the critical performance considerations when dealing with asynchronous operations in ${category}?`,
          category,
        },
      ];
    }

    const session = await MockInterviewSession.create({
      user: req.user.id,
      category,
      targetRole,
      difficulty,
      questions: questions.map((q) => ({
        question: q.question,
        category: q.category || category,
        userAnswer: '',
        score: 0,
        feedback: '',
        suggestedAnswer: '',
      })),
      status: 'in_progress',
    });

    res.status(201).json({
      success: true,
      message: 'AI Mock Interview session started!',
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit answer to a mock interview question
// @route   POST /api/interviews/mock/:sessionId/answer
// @access  Private (Student)
const submitMockAnswer = async (req, res, next) => {
  try {
    const { questionIndex, userAnswer } = req.body;
    const session = await MockInterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const targetQ = session.questions[questionIndex];
    if (!targetQ) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    // Call AI Evaluator
    const evalResult = await evaluateMockInterview(
      targetQ.question,
      userAnswer,
      session.category,
      session.difficulty
    );

    targetQ.userAnswer = userAnswer;
    targetQ.score = evalResult.score;
    targetQ.feedback = evalResult.feedback;
    targetQ.suggestedAnswer = evalResult.suggestedAnswer;
    targetQ.answeredAt = new Date();

    // Check if all answered
    const allAnswered = session.questions.every((q) => q.userAnswer && q.userAnswer.trim().length > 0);
    if (allAnswered) {
      session.status = 'completed';
      session.completedAt = new Date();
      const avgScore = Math.round(
        session.questions.reduce((acc, q) => acc + (q.score || 0), 0) / session.questions.length
      );
      session.totalScore = avgScore;
      session.overallFeedback = `Mock interview complete! Your overall average response score is ${avgScore}%. Focus on expanding your concrete technical examples and discussing edge cases.`;
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer evaluated by AI!',
      data: {
        session,
        evaluation: evalResult,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's past mock interview sessions
// @route   GET /api/interviews/mock/my
// @access  Private (Student)
const getMyMockSessions = async (req, res, next) => {
  try {
    const sessions = await MockInterviewSession.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single mock session by ID
// @route   GET /api/interviews/mock/:sessionId
// @access  Private
const getMockSessionById = async (req, res, next) => {
  try {
    const session = await MockInterviewSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestions,
  getCategories,
  startMockSession,
  submitMockAnswer,
  getMyMockSessions,
  getMockSessionById,
};
