const jwt = require('jsonwebtoken');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_dev_prod',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id, user.role);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      headline: user.headline,
      companyName: user.companyName,
    },
  });
};

module.exports = { signToken, sendTokenResponse };
