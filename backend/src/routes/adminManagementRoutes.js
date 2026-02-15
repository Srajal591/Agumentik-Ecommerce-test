const express = require('express');
const router = express.Router();
const adminManagementController = require('../controllers/adminManagementController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require super_admin authentication
router.use(authenticate, authorize('super_admin'));

// Admin management routes
router.post('/', adminManagementController.createAdmin);
router.get('/', adminManagementController.getAllAdmins);
router.get('/:id', adminManagementController.getAdminById);
router.put('/:id', adminManagementController.updateAdmin);
router.patch('/:id/toggle-block', adminManagementController.toggleAdminBlock);
router.delete('/:id', adminManagementController.deleteAdmin);

module.exports = router;
