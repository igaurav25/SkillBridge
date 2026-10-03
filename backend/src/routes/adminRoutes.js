const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobsAdmin,
  toggleCompanyVerification,
  getReportsAdmin,
  updateReportStatus,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.put('/password', updateAdminPassword);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobsAdmin);
router.put('/companies/:id/verify', toggleCompanyVerification);
router.get('/reports', getReportsAdmin);
router.put('/reports/:id/status', updateReportStatus);

module.exports = router;
