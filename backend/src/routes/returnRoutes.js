const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { authenticate, authorize } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');

// Admin routes (both admin and super_admin) - Must come BEFORE user routes
router.get('/', authenticate, authorize('admin', 'super_admin'), paginate, returnController.getAllReturns);
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin'), returnController.updateReturnStatus);

// User routes
router.post('/', authenticate, returnController.createReturn);
router.get('/my-returns', authenticate, paginate, returnController.getUserReturns);
router.get('/check-eligibility/:orderId', authenticate, returnController.checkReturnEligibility);
router.get('/:id', authenticate, returnController.getReturnById);

module.exports = router;
