const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  uploadProfileResume,
  addEducation,
  deleteEducation,
  addSkill,
  deleteSkill,
  addProject,
  deleteProject,
  addExperience,
  deleteExperience,
  addCertification,
  deleteCertification,
  getProfileByUserId,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateProfile);
router.post('/resume', protect, upload.single('resume'), uploadProfileResume);

router.post('/education', protect, addEducation);
router.delete('/education/:eduId', protect, deleteEducation);

router.post('/skills', protect, addSkill);
router.delete('/skills/:skillId', protect, deleteSkill);

router.post('/projects', protect, addProject);
router.delete('/projects/:projectId', protect, deleteProject);

router.post('/experience', protect, addExperience);
router.delete('/experience/:expId', protect, deleteExperience);

router.post('/certifications', protect, addCertification);
router.delete('/certifications/:certId', protect, deleteCertification);

router.get('/user/:userId', getProfileByUserId);

module.exports = router;
