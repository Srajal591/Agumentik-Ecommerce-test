const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');

// All upload routes require authentication and admin/super_admin role
router.use(authenticate);
router.use(authorize('admin', 'super_admin'));

// Upload single image
router.post('/single', upload.single('image'), uploadController.uploadImage);

// Upload multiple images (max 10)
router.post('/multiple', upload.array('images', 10), uploadController.uploadMultipleImages);

// Delete image
router.delete('/', uploadController.deleteImage);

module.exports = router;
