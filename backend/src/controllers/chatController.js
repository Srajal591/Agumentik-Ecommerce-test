const Chat = require('../models/Chat');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// Create or get chat for user
exports.createOrGetChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    let chat = await Chat.findOne({ user: userId, status: 'active' })
      .populate('user', 'name email mobile profileImage')
      .populate('messages.sender', 'name profileImage role');

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        order: orderId || null,
      });
      
      chat = await Chat.findById(chat._id)
        .populate('user', 'name email mobile profileImage')
        .populate('messages.sender', 'name profileImage role');
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, message } = req.body;
    let imageUrl = null;

    // Handle image upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'chat-images');
      imageUrl = result.secure_url;
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    const newMessage = {
      sender: userId,
      senderRole: req.user.role,
      message: message || '',
      image: imageUrl,
    };

    chat.messages.push(newMessage);
    chat.lastMessage = message || (imageUrl ? 'Image' : 'Message');
    chat.lastMessageAt = new Date();
    
    // Increment unread count if sender is user
    if (req.user.role === 'user') {
      chat.unreadCount += 1;
    }

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('user', 'name email mobile profileImage')
      .populate('messages.sender', 'name profileImage role');

    const latestMessage = updatedChat.messages[updatedChat.messages.length - 1];

    // Emit socket events
    const io = req.app.get('io');
    if (io) {
      // Emit to chat room
      io.to(`chat_${chatId}`).emit('new_message', {
        chatId,
        message: latestMessage,
      });

      // Notify super admin
      io.to('super_admin').emit('chat_updated', {
        chatId,
        chat: updatedChat,
      });

      // Notify user
      io.to(`user_${chat.user._id}`).emit('chat_updated', {
        chatId,
        chat: updatedChat,
      });
    }

    res.status(200).json({
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all chats (Super Admin)
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ status: 'active' })
      .populate('user', 'name email mobile profileImage')
      .populate('messages.sender', 'name profileImage role')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single chat
exports.getChatById = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id)
      .populate('user', 'name email mobile profileImage')
      .populate('messages.sender', 'name profileImage role');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Mark messages as read if super admin is viewing
    if (req.user.role === 'super_admin') {
      chat.unreadCount = 0;
      await chat.save();
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    chat.messages.forEach(msg => {
      if (!msg.isRead && msg.senderRole !== req.user.role) {
        msg.isRead = true;
      }
    });

    if (req.user.role === 'super_admin') {
      chat.unreadCount = 0;
    }

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
