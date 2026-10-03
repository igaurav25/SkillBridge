const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  getMyCompany,
  createCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCompanies);
router.get('/my', protect, authorize('recruiter', 'admin'), getMyCompany);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('recruiter', 'admin'), createCompany);

module.exports = router;
