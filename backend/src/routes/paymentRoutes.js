const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Create Razorpay order
router.post('/create-order', authenticate, paymentController.createRazorpayOrder);

// Verify payment
router.post('/verify', authenticate, paymentController.verifyPayment);

// Get payment details (Admin only)
router.get('/:paymentId', authenticate, paymentController.getPaymentDetails);

// Refund payment (Admin only)
router.post('/refund', authenticate, paymentController.refundPayment);

module.exports = router;
