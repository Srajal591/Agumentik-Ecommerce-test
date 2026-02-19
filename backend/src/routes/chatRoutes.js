const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Super Admin routes (must come first)
router.get('/all', authenticate, authorize('super_admin'), chatController.getAllChats);

// User routes
router.post('/create', authenticate, chatController.createOrGetChat);
router.post('/message', authenticate, upload.single('image'), chatController.sendMessage);
router.put('/:chatId/read', authenticate, chatController.markAsRead);
router.get('/:id', authenticate, chatController.getChatById);

module.exports = router;
