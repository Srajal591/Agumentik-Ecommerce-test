const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');

// Public routes
router.get('/', paginate, productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticate, authorize('admin'), productController.createProduct);
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct);
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  productController.updateProductStatus
);
router.patch(
  '/:id/inventory',
  authenticate,
  authorize('admin'),
  productController.updateInventory
);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;
