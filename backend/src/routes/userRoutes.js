const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');

// Admin routes (both admin and super_admin)
router.get('/', authenticate, authorize('admin', 'super_admin'), paginate, userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin', 'super_admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin', 'super_admin'), userController.updateProfile);
router.patch('/:id/toggle-block', authenticate, authorize('admin', 'super_admin'), userController.toggleBlockUser);

// User routes
router.put('/profile/update', authenticate, userController.updateProfile);

// Address management
router.post('/addresses', authenticate, userController.addAddress);
router.put('/addresses/:addressId', authenticate, userController.updateAddress);
router.delete('/addresses/:addressId', authenticate, userController.deleteAddress);

// Wishlist
router.post('/wishlist/toggle', authenticate, userController.toggleWishlist);
router.get('/wishlist', authenticate, userController.getWishlist);

module.exports = router;
