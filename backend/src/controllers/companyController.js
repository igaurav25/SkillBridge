const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const { search, industry, location, isVerified } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    const companies = await Company.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (err) {
    next(err);
  }
};

// @desc    Get company by ID with its active jobs
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const activeJobs = await Job.find({ company: company._id, status: 'active' }).sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        ...company.toObject(),
        activeJobs,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get company created by recruiter
// @route   GET /api/companies/my
// @access  Private (Recruiter)
const getMyCompany = async (req, res, next) => {
  try {
    let company = await Company.findOne({ createdBy: req.user.id });
    if (!company) {
      company = await Company.create({
        name: req.user.companyName || `${req.user.name}'s Company`,
        createdBy: req.user.id,
      });
    }
    res.status(200).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};

// @desc    Create or update company
// @route   POST /api/companies
// @access  Private (Recruiter / Admin)
const createCompany = async (req, res, next) => {
  try {
    const { name, logo, description, website, industry, location, companySize, socialLinks } = req.body;

    let company = await Company.findOne({ createdBy: req.user.id });
    if (company) {
      // Update
      company.name = name || company.name;
      if (logo !== undefined) company.logo = logo;
      if (description !== undefined) company.description = description;
      if (website !== undefined) company.website = website;
      if (industry !== undefined) company.industry = industry;
      if (location !== undefined) company.location = location;
      if (companySize !== undefined) company.companySize = companySize;
      if (socialLinks !== undefined) company.socialLinks = socialLinks;

      await company.save();
      return res.status(200).json({ success: true, message: 'Company profile updated', data: company });
    }

    company = await Company.create({
      name: name || req.user.companyName || 'New Company',
      logo: logo || '',
      description: description || '',
      website: website || '',
      industry: industry || 'Technology',
      location: location || 'Remote',
      companySize: companySize || '11-50',
      socialLinks: socialLinks || {},
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Company created successfully', data: company });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  getMyCompany,
  createCompany,
};
