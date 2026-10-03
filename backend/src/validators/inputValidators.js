const { validateRealEmail } = require('../utils/emailValidator');

const validateRegisterInput = (data) => {
  const errors = {};
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  // Validate Real Email Address
  const emailCheck = validateRealEmail(data.email);
  if (!emailCheck.isValid) {
    errors.email = emailCheck.reason;
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  // Strictly block public registration as 'admin'
  if (data.role === 'admin') {
    errors.role = 'Admin accounts cannot be self-registered. Please contact the system administrator.';
  } else if (data.role && !['student', 'recruiter'].includes(data.role)) {
    errors.role = 'Invalid role specified. Must be student or recruiter.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateLoginInput = (data) => {
  const errors = {};
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  }
  if (!data.password || data.password.length === 0) {
    errors.password = 'Password is required';
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateJobInput = (data) => {
  const errors = {};
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Job title is required';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'A detailed description is required (at least 10 characters)';
  }
  if (!data.location || data.location.trim().length === 0) {
    errors.location = 'Location or Remote specification is required';
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateJobInput,
};
