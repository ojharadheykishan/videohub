const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticate, logout);

module.exports = router;
