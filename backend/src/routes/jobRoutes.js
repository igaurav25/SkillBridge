const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getPopularSearches,
  getLivePlatformJobs,
  searchJobsByCriteria,
  getPlatformsDirectory,
  getCoursesCatalog,
  checkLiveNewJobs,
  simulateLiveJob,
} = require('../controllers/jobController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', optionalProtect, getJobs);
router.get('/popular/tags', getPopularSearches);
router.get('/courses', getCoursesCatalog);
router.get('/live-check', checkLiveNewJobs);
router.post('/simulate-live', simulateLiveJob);
router.get('/platforms', getPlatformsDirectory);
router.get('/live-platforms', getLivePlatformJobs);
router.post('/criteria-search', searchJobsByCriteria);
router.get('/recruiter/myjobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/:id', optionalProtect, getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
