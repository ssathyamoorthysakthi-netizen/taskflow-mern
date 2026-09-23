const express = require('express');
const {
  getUsers,
  updateUser,
  deleteUser,
  getAdminTasks,
  deleteAdminTask,
  getAdminStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.route('/users').get(getUsers);
router.route('/users/:id').put(updateUser).delete(deleteUser);
router.route('/tasks').get(getAdminTasks);
router.route('/tasks/:id').delete(deleteAdminTask);

module.exports = router;