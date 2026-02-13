const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize, optionalAuthenticate } = require('../middleware/auth');

// Public routes with optional authentication (to show inactive categories to admins)
router.get('/', optionalAuthenticate, categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', authenticate, authorize('admin'), categoryController.createCategory);
router.put('/:id', authenticate, authorize('admin'), categoryController.updateCategory);
router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize('admin'),
  categoryController.toggleCategoryStatus
);
router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
