const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const validators = require('../utils/validate');

const buildUserQuery = (req) => {
  const { search, role } = req.query;
  const query = {};
  if (search && search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } },
    ];
  }
  if (role && validators.isRole(role)) query.role = role;
  return query;
};

/**
 * @desc   Get all users (admin)
 * @route  GET /api/admin/users
 * @access Private/Admin
 */
const getUsers = async (req, res) => {
  const { search, role, page = 1, limit = 10 } = req.query;

  const query = buildUserQuery(req);
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const usersWithTaskCount = await Promise.all(
    users.map(async (u) => {
      const taskCount = await Task.countDocuments({ userId: u._id });
      return { ...u.toObject(), taskCount };
    })
  );

  res.json({
    users: usersWithTaskCount,
    pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1 },
  });
};

/**
 * @desc   Create a new user (admin)
 * @route  POST /api/admin/users
 * @access Private/Admin
 */
const createUser = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

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

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'user',
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    message: 'User created successfully',
  });
};

/**
 * @desc   Update a user (name, role)
 * @route  PUT /api/admin/users/:id
 * @access Private/Admin
 */
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, role } = req.body;

  if (name !== undefined) {
    if (!validators.isName(name)) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    user.name = name;
  }
  if (role !== undefined) {
    if (!validators.isRole(role)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    user.role = role;
  }

  const updated = await user.save();
  const updatedPlain = updated.toObject();
  delete updatedPlain.password;

  res.json(updatedPlain);
};

/**
 * @desc   Delete a user (admin)
 * @route  DELETE /api/admin/users/:id
 * @access Private/Admin
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  if (id === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await Task.deleteMany({ userId: user._id });
  await user.deleteOne();

  res.json({ message: 'User and their tasks removed successfully' });
};

/**
 * @desc   Get all tasks across all users (admin) with filters
 * @route  GET /api/admin/tasks
 * @access Private/Admin
 */
const getAdminTasks = async (req, res) => {
  const { search, status, priority, category, dueDate, userId, sort, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search && search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }
  if (status && validators.isStatus(status)) query.status = status;
  if (priority && validators.isPriority(priority)) query.priority = priority;
  if (category && validators.isCategory(category)) query.category = category;
  if (dueDate) {
    const d = new Date(dueDate);
    if (!isNaN(d)) {
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      query.dueDate = { $gte: start, $lte: end };
    }
  }
  if (userId && mongoose.Types.ObjectId.isValid(userId)) query.userId = userId;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  let sortOptions = { createdAt: -1 };
  if (sort === 'oldest') sortOptions = { createdAt: 1 };
  if (sort === 'due-date') sortOptions = { dueDate: 1 };
  if (sort === 'priority') sortOptions = { priority: 1 };

  const total = await Task.countDocuments(query);
  let tasks = await Task.find(query)
    .sort(sortOptions)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .populate('userId', 'name email profileImage');

  if (sort === 'priority') {
    const weight = { low: 1, medium: 2, high: 3 };
    tasks = tasks.sort((a, b) => weight[a.priority] - weight[b.priority]);
  }

  res.json({
    tasks,
    pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1 },
  });
};

/**
 * @desc   Delete any task (admin)
 * @route  DELETE /api/admin/tasks/:id
 * @access Private/Admin
 */
const deleteAdminTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await task.deleteOne();
  res.json({ message: 'Task removed successfully' });
};

/**
 * @desc   Get admin dashboard statistics
 * @route  GET /api/admin/stats
 * @access Private/Admin
 */
const getAdminStats = async (req, res) => {
  const [totalUsers, totalTasks, completedTasks, inProgressTasks, pendingTasks, overdueTasks] = await Promise.all([
    User.countDocuments({}),
    Task.countDocuments({}),
    Task.countDocuments({ status: 'completed' }),
    Task.countDocuments({ status: 'in-progress' }),
    Task.countDocuments({ status: 'todo' }),
    Task.countDocuments({ status: { $ne: 'completed' }, dueDate: { $lt: new Date() } }),
  ]);

  const byPriority = await Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
  const byCategory = await Task.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);

  const recentTasks = await Task.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('userId', 'name email');

  res.json({
    totalUsers,
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    overdueTasks,
    byPriority,
    byCategory,
    recentTasks,
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminTasks,
  deleteAdminTask,
  getAdminStats,
};