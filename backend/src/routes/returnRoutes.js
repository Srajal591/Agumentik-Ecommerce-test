const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { authenticate, authorize } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');

// User & Admin routes
router.post('/', authenticate, returnController.createReturn);
router.get('/', authenticate, paginate, returnController.getAllReturns);
router.get('/:id', authenticate, returnController.getReturnById);

// Admin routes (both admin and super_admin)
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin'), returnController.updateReturnStatus);

module.exports = router;
