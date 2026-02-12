const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');

// User routes
router.post('/', authenticate, orderController.createOrder);
router.get('/my-orders', authenticate, paginate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.patch('/:id/payment', authenticate, orderController.updatePaymentStatus);

// Admin routes
router.get('/', authenticate, authorize('admin'), paginate, orderController.getAllOrders);
router.patch('/:id/status', authenticate, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
