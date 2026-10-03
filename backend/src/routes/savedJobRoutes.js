const express = require('express');
const router = express.Router();
const {
  getMySavedJobs,
  toggleSaveJob,
  updateSavedJob,
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('student'));

router.get('/', getMySavedJobs);
router.post('/:jobId', toggleSaveJob);
router.put('/:id', updateSavedJob);

module.exports = router;
