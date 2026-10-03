const Report = require('../models/Report');
const Job = require('../models/Job');

// @desc    Create a content report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, targetTitle, reason, description } = req.body;

    if (!targetType || !targetId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide targetType, targetId, reason, and a clear description.',
      });
    }

    const report = await Report.create({
      reporter: req.user.id,
      targetType,
      targetId,
      targetTitle: targetTitle || '',
      reason,
      description,
      status: 'Pending',
    });

    // If reporting a job, flag it
    if (targetType === 'Job') {
      await Job.findByIdAndUpdate(targetId, {
        isReported: true,
        $inc: { reportedCount: 1 },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our safety team will review it.',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's submitted reports
// @route   GET /api/reports/my
// @access  Private
const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reporter: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReport,
  getMyReports,
};
