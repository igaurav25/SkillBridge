const SavedJob = require('../models/SavedJob');

// @desc    Get user's saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Student)
const getMySavedJobs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { user: req.user.id };
    if (category && category !== 'All') query.category = category;

    const savedJobs = await SavedJob.find(query)
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location isVerified' },
      })
      .sort('-createdAt');

    // Aggregate category counts
    const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'AI', 'Internship', 'High Priority', 'General'];
    const counts = await SavedJob.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const catCountMap = { All: savedJobs.length };
    counts.forEach((c) => {
      catCountMap[c._id] = c.count;
    });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      categoryCounts: catCountMap,
      data: savedJobs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle save/bookmark a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Student)
const toggleSaveJob = async (req, res, next) => {
  try {
    const { category = 'General', notes = '' } = req.body;
    const existing = await SavedJob.findOne({
      user: req.user.id,
      job: req.params.jobId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        isSaved: false,
        message: 'Job removed from bookmarks.',
      });
    }

    const saved = await SavedJob.create({
      user: req.user.id,
      job: req.params.jobId,
      category,
      notes,
    });

    res.status(201).json({
      success: true,
      isSaved: true,
      message: 'Job saved to your bookmarks!',
      data: saved,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category or notes for a saved job
// @route   PUT /api/saved-jobs/:id
// @access  Private (Student)
const updateSavedJob = async (req, res, next) => {
  try {
    const { category, notes } = req.body;
    const saved = await SavedJob.findOne({ _id: req.params.id, user: req.user.id });

    if (!saved) return res.status(404).json({ success: false, message: 'Saved job not found' });

    if (category) saved.category = category;
    if (notes !== undefined) saved.notes = notes;
    await saved.save();

    res.status(200).json({ success: true, message: 'Bookmark updated', data: saved });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMySavedJobs,
  toggleSaveJob,
  updateSavedJob,
};
