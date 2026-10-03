const User = require('../models/User');
const Profile = require('../models/Profile');

// @desc    Search candidates for recruiters
// @route   GET /api/users/candidates
// @access  Private (Recruiter / Admin)
const searchCandidates = async (req, res, next) => {
  try {
    const { name, skill, role, location, page = 1, limit = 12 } = req.query;

    const query = { role: 'student', status: 'active' };

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const userIds = users.map((u) => u._id);

    // Profile query
    const profileFilter = { user: { $in: userIds } };
    if (skill) {
      profileFilter['skills.name'] = { $regex: skill, $options: 'i' };
    }
    if (role) {
      profileFilter.preferredRole = { $regex: role, $options: 'i' };
    }
    if (location) {
      profileFilter.location = { $regex: location, $options: 'i' };
    }

    const profiles = await Profile.find(profileFilter).lean();
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    // Merge candidates
    const candidates = users
      .filter((u) => profileMap.has(u._id.toString()))
      .map((u) => ({
        ...u,
        profile: profileMap.get(u._id.toString()),
      }));

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = await Profile.findOne({ user: user._id });

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

// @desc    Update basic user details
// @route   PUT /api/users/me
// @access  Private
const updateBasicUser = async (req, res, next) => {
  try {
    const { name, headline, avatar, companyName } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (avatar !== undefined) user.avatar = avatar;
    if (companyName !== undefined) user.companyName = companyName;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account details updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchCandidates,
  getUserById,
  updateBasicUser,
};
