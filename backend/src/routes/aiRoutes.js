const express = require('express');
const router = express.Router();
const {
  chatWithAssistant,
  getConversations,
  getConversationById,
  deleteConversation,
  generateCoverLetterHandler,
  matchJobHandler,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithAssistant);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);
router.delete('/conversations/:id', protect, deleteConversation);
router.post('/generate-cover-letter', protect, generateCoverLetterHandler);
router.post('/match-job/:jobId', protect, matchJobHandler);

module.exports = router;
