const crypto = require('crypto');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { sendTokenResponse } = require('../utils/jwt');
const { validateRegisterInput, validateLoginInput } = require('../validators/inputValidators');
const { validateRealEmail } = require('../utils/emailValidator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, message: Object.values(errors)[0], errors });
    }

    const { name, email, password, role, headline, companyName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Ensure only student or recruiter can be registered publicly
    const safeRole = role === 'recruiter' ? 'recruiter' : 'student';

    // Create user
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password,
      role: safeRole,
      headline: headline || '',
      companyName: companyName || '',
    });

    // If student, create empty profile for the student to fill with genuine details
    if (user.role === 'student') {
      await Profile.create({
        user: user._id,
        headline: headline || '',
        about: '',
        preferredRole: '',
        profileCompletion: 0,
        resumeScore: 0,
      });
    }

    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to SkillBridge.');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, message: Object.values(errors)[0], errors });
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful! Welcome back.');
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    if (user.role === 'student') {
      profile = await Profile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully!');
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password (generates reset token)
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't leak if email exists
      return res.status(200).json({
        success: true,
        message: 'If that email address is registered, a password reset token has been generated.',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset link generated successfully.',
      resetToken, // Provided for easy development and demonstration
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   POST /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful! You are now logged in.');
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc    Update user account details (name, avatar, headline)
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateUserDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.name && req.body.name.trim()) {
      fieldsToUpdate.name = req.body.name.trim();
    }
    if (req.body.email && req.body.email.trim()) {
      const cleanEmail = req.body.email.trim().toLowerCase();
      const emailCheck = validateRealEmail(cleanEmail);
      if (!emailCheck.isValid) {
        return res.status(400).json({ success: false, message: emailCheck.reason });
      }

      const existingUser = await User.findOne({ email: cleanEmail, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'This email address is already in use by another account.',
        });
      }
      fieldsToUpdate.email = cleanEmail;
    }
    if (req.body.avatar !== undefined) {
      fieldsToUpdate.avatar = req.body.avatar;
    }
    if (req.body.headline !== undefined) {
      fieldsToUpdate.headline = req.body.headline;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Account details updated successfully!',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload user avatar picture
// @route   POST /api/auth/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file (PNG/JPG/WEBP).' });
    }
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: base64Image }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully!',
      data: { user, avatar: base64Image },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword,
  updateUserDetails,
  uploadAvatar,
  forgotPassword,
  resetPassword,
  logout,
};
