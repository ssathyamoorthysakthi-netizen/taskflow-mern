const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const validators = require('../utils/validate');

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!validators.isName(name)) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  }
  if (!validators.isEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  if (!validators.isPassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      message: 'Account created successfully. Please login.',
    });
  }

  return res.status(400).json({ message: 'Invalid user data' });
};

/**
 * @desc   Authenticate user
 * @route  POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
};

/**
 * @desc   Get current logged-in user profile
 * @route  GET /api/auth/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

/**
 * @desc   Update user profile (name / profileImage)
 * @route  PUT /api/auth/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  const { name, profileImage } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (name !== undefined) {
    if (!validators.isName(name)) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    user.name = name;
  }
  if (profileImage !== undefined) {
    user.profileImage = profileImage;
  }

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    profileImage: updated.profileImage,
    createdAt: updated.createdAt,
  });
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };