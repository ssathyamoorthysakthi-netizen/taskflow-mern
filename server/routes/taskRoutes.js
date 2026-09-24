const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/stats', protect, asyncHandler(getTaskStats));
router
  .route('/')
  .post(protect, admin, asyncHandler(createTask))
  .get(protect, asyncHandler(getTasks));
router
  .route('/:id')
  .get(protect, asyncHandler(getTaskById))
  .put(protect, admin, asyncHandler(updateTask))
  .delete(protect, admin, asyncHandler(deleteTask));

module.exports = router;