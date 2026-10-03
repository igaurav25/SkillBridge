const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  updateUserDetails,
  uploadAvatar,
  forgotPassword,
  resetPassword,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.put('/updatedetails', protect, updateUserDetails);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resettoken', resetPassword);
router.post('/logout', protect, logout);

module.exports = router;
