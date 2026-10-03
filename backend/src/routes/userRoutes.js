const express = require('express');
const router = express.Router();
const {
  searchCandidates,
  getUserById,
  updateBasicUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/candidates', protect, authorize('recruiter', 'admin'), searchCandidates);
router.get('/:id', protect, getUserById);
router.put('/me', protect, updateBasicUser);

module.exports = router;
