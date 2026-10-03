const express = require('express');
const router = express.Router();
const {
  getMyResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  uploadAndAnalyzeResume,
  analyzeExistingResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getMyResumes);
router.post('/', protect, createResume);
router.get('/:id', protect, getResumeById);
router.put('/:id', protect, updateResume);
router.delete('/:id', protect, deleteResume);

router.post('/upload-and-analyze', protect, upload.single('resume'), uploadAndAnalyzeResume);
router.post('/:id/analyze', protect, analyzeExistingResume);

module.exports = router;
