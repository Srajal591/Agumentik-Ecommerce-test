const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');

const initializeSocket = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user || user.isDeleted || user.isBlocked) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.role})`);

    // Join user's personal room
    socket.join(`user_${socket.user._id}`);

    // Super admin joins all chats room
    if (socket.user.role === 'super_admin') {
      socket.join('super_admin');
    }

    // Join specific chat room
    socket.on('join_chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Check if user has access to this chat
        if (socket.user.role !== 'super_admin' && chat.user.toString() !== socket.user._id.toString()) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(`chat_${chatId}`);
        console.log(`User ${socket.user.name} joined chat ${chatId}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { chatId, message, image } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Create new message
        const newMessage = {
          sender: socket.user._id,
          senderRole: socket.user.role,
          message: message || '',
          image: image || null,
          createdAt: new Date(),
        };

        chat.messages.push(newMessage);
        chat.lastMessage = message || (image ? 'Image' : 'Message');
        chat.lastMessageAt = new Date();

        // Increment unread count if sender is user
        if (socket.user.role === 'user') {
          chat.unreadCount += 1;
        }

        await chat.save();

        // Populate sender info
        const populatedChat = await Chat.findById(chatId)
          .populate('user', 'name email mobile profileImage')
          .populate('messages.sender', 'name profileImage role');

        const latestMessage = populatedChat.messages[populatedChat.messages.length - 1];

        // Emit to chat room
        io.to(`chat_${chatId}`).emit('new_message', {
          chatId,
          message: latestMessage,
        });

        // Notify super admin
        io.to('super_admin').emit('chat_updated', {
          chatId,
          chat: populatedChat,
        });

        // Notify user
        io.to(`user_${chat.user}`).emit('chat_updated', {
          chatId,
          chat: populatedChat,
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Mark messages as read
    socket.on('mark_read', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        chat.messages.forEach(msg => {
          if (!msg.isRead && msg.senderRole !== socket.user.role) {
            msg.isRead = true;
          }
        });

        if (socket.user.role === 'super_admin') {
          chat.unreadCount = 0;
        }

        await chat.save();

        // Notify both parties
        io.to(`chat_${chatId}`).emit('messages_read', { chatId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (chatId) => {
      socket.to(`chat_${chatId}`).emit('user_typing', {
        chatId,
        user: socket.user.name,
      });
    });

    socket.on('stop_typing', (chatId) => {
      socket.to(`chat_${chatId}`).emit('user_stop_typing', {
        chatId,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = initializeSocket;
