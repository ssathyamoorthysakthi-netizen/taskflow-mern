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
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/stats', protect, asyncHandler(getTaskStats));
router
  .route('/')
  .post(protect, asyncHandler(createTask))
  .get(protect, asyncHandler(getTasks));
router
  .route('/:id')
  .get(protect, asyncHandler(getTaskById))
  .put(protect, asyncHandler(updateTask))
  .delete(protect, asyncHandler(deleteTask));

module.exports = router;