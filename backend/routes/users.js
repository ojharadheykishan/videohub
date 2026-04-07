const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboardStats,
  updatePreferences
} = require('../controllers/userController');

/**
 * GET /api/users/profile
 * Get user profile
 */
router.get('/profile', getProfile);

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', updateProfile);

/**
 * GET /api/users/dashboard
 * Get dashboard stats
 */
router.get('/dashboard', getDashboardStats);

/**
 * PUT /api/users/preferences
 * Update user preferences
 */
router.put('/preferences', updatePreferences);

module.exports = router;
