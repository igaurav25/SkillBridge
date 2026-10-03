const express = require('express');
const router = express.Router();
const {
  getSkillCategories,
  getTargetRoles,
  analyzeMySkillGap,
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/categories', getSkillCategories);
router.get('/roles', getTargetRoles);
router.post('/analyze-gap', protect, analyzeMySkillGap);

module.exports = router;
