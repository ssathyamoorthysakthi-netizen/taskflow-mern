const mongoose = require('mongoose');
const Task = require('../models/Task');
const validators = require('../utils/validate');

const buildFilterQuery = (req) => {
  const { search, status, priority, category, dueDate } = req.query;
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

  return query;
};

const buildSort = (sort) => {
  switch (sort) {
    case 'oldest':
      return { createdAt: 1 };
    case 'due-date':
      return { dueDate: 1 };
    case 'due-date-desc':
      return { dueDate: -1 };
    case 'priority':
      return { priority: 1 };
    default:
      return { createdAt: -1 };
  }
};

const PRIORITY_WEIGHT = { low: 1, medium: 2, high: 3 };

/**
 * @desc   Create a task
 * @route  POST /api/tasks
 * @access Private
 */
const createTask = async (req, res) => {
  const { title, description = '', category, priority, status, dueDate, userId } = req.body;

  if (!validators.isTitle(title)) {
    return res.status(400).json({ message: 'Task title is required' });
  }
  if (priority !== undefined && !validators.isPriority(priority)) {
    return res.status(400).json({ message: 'Invalid priority value' });
  }
  if (status !== undefined && !validators.isStatus(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  if (category !== undefined && !validators.isCategory(category)) {
    return res.status(400).json({ message: 'Invalid category value' });
  }
  if (dueDate !== undefined && !validators.isDate(dueDate)) {
    return res.status(400).json({ message: 'Invalid due date' });
  }

  let assignTo = req.user._id;
  if (req.user.role === 'admin' && userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id for assignment' });
    }
    assignTo = userId;
  }

  const task = await Task.create({
    title,
    description,
    category,
    priority,
    status,
    dueDate: dueDate || null,
    userId: assignTo,
    assignedBy: req.user.role === 'admin' ? req.user._id : undefined,
  });

  const populated = await Task.findById(task._id).populate('userId', 'name email profileImage');

  res.status(201).json(populated);
};

/**
 * @desc   Get all tasks for the logged-in user (with filters/pagination)
 * @route  GET /api/tasks
 * @access Private
 */
const getTasks = async (req, res) => {
  const { sort, page = 1, limit = 10 } = req.query;

  const query = buildFilterQuery(req);
  query.userId = req.user._id;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const sortOptions = buildSort(sort);
  if (sort === 'priority') {
    sortOptions.priority = 1;
  }

  const total = await Task.countDocuments(query);
  let tasks = await Task.find(query)
    .sort(sortOptions)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .populate('userId', 'name email profileImage');

  if (sort === 'priority') {
    tasks = tasks.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
  }

  res.json({
    tasks,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
};

/**
 * @desc   Get a single task by id
 * @route  GET /api/tasks/:id
 * @access Private
 */
const getTaskById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const task = await Task.findById(id).populate('userId', 'name email profileImage').populate('assignedBy', 'name email');

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'admin' && task.userId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to access this task' });
  }

  res.json(task);
};

/**
 * @desc   Update a task
 * @route  PUT /api/tasks/:id
 * @access Private
 */
const updateTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'admin' && task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to modify this task' });
  }

  const { title, description, category, priority, status, dueDate, userId } = req.body;

  if (title !== undefined) {
    if (!validators.isTitle(title)) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    task.title = title;
  }
  if (description !== undefined) task.description = description;
  if (category !== undefined) {
    if (!validators.isCategory(category)) {
      return res.status(400).json({ message: 'Invalid category value' });
    }
    task.category = category;
  }
  if (priority !== undefined) {
    if (!validators.isPriority(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }
    task.priority = priority;
  }
  if (status !== undefined) {
    if (!validators.isStatus(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    task.status = status;
  }
  if (dueDate !== undefined) {
    if (!validators.isDate(dueDate)) {
      return res.status(400).json({ message: 'Invalid due date' });
    }
    task.dueDate = dueDate || null;
  }
  if (req.user.role === 'admin' && userId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    task.userId = userId;
  }

  const updated = await task.save();
  const populated = await Task.findById(updated._id).populate('userId', 'name email profileImage');

  res.json(populated);
};

/**
 * @desc   Delete a task
 * @route  DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'admin' && task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this task' });
  }

  await task.deleteOne();
  res.json({ message: 'Task removed successfully' });
};

/**
 * @desc   Get task statistics for the dashboard
 * @route  GET /api/tasks/stats
 * @access Private
 */
const getTaskStats = async (req, res) => {
  const userId = req.user._id;

  const [total, todo, inProgress, completed, overdue] = await Promise.all([
    Task.countDocuments({ userId }),
    Task.countDocuments({ userId, status: 'todo' }),
    Task.countDocuments({ userId, status: 'in-progress' }),
    Task.countDocuments({ userId, status: 'completed' }),
    Task.countDocuments({ userId, status: { $ne: 'completed' }, dueDate: { $lt: new Date() } }),
  ]);

  const highPriority = await Task.countDocuments({ userId, priority: 'high' });

  res.json({ total, todo, inProgress, completed, overdue, highPriority });
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};