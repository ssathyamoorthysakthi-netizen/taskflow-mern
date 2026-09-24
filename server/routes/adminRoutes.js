const express = require('express');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminTasks,
  deleteAdminTask,
  getAdminStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', asyncHandler(getAdminStats));
router.route('/users').get(asyncHandler(getUsers)).post(asyncHandler(createUser));
router.route('/users/:id').put(asyncHandler(updateUser)).delete(asyncHandler(deleteUser));
router.route('/tasks').get(asyncHandler(getAdminTasks));
router.route('/tasks/:id').delete(asyncHandler(deleteAdminTask));

module.exports = router;