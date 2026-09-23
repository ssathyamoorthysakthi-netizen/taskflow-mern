const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/profile', protect, asyncHandler(getProfile));
router.put('/profile', protect, asyncHandler(updateProfile));

module.exports = router;