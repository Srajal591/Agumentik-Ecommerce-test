const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5,
  message: 'Too many requests, please try again later',
});

// Admin login
router.post('/admin/login', authLimiter, authController.adminLogin);

// User registration
router.post('/user/register', authLimiter, authController.registerUser);

// User OTP login (Mobile)
router.post('/user/send-otp', authLimiter, authController.sendOTP);
router.post('/user/verify-otp', authLimiter, authController.verifyOTP);

// User OTP login (Email)
router.post('/user/send-email-otp', authLimiter, authController.sendEmailOTP);
router.post('/user/verify-email-otp', authLimiter, authController.verifyEmailOTP);

// Logout
router.post('/logout', authenticate, authController.logout);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
