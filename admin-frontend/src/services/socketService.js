import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No token found for socket connection');
        return;
      }

      // Extract base URL without /api
      const socketUrl = API_BASE_URL.replace('/api', '');
      console.log('🔌 Attempting to connect to socket:', socketUrl);
      console.log('🔑 Using token:', token.substring(0, 20) + '...');

      this.socket = io(socketUrl, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully!');
        console.log('Socket ID:', this.socket.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected. Reason:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
        console.error('Error details:', error);
      });

      this.socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });

    } catch (error) {
      console.error('❌ Failed to connect socket:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(chatId) {
    if (this.socket) {
      this.socket.emit('join_chat', chatId);
    }
  }

  sendMessage(chatId, message, image) {
    if (this.socket) {
      this.socket.emit('send_message', {
        chatId,
        message,
        image,
      });
    }
  }

  markAsRead(chatId) {
    if (this.socket) {
      this.socket.emit('mark_read', chatId);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onChatUpdated(callback) {
    if (this.socket) {
      this.socket.on('chat_updated', callback);
    }
  }

  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on('messages_read', callback);
    }
  }

  offNewMessage() {
    if (this.socket) {
      this.socket.off('new_message');
    }
  }

  offChatUpdated() {
    if (this.socket) {
      this.socket.off('chat_updated');
    }
  }

  offMessagesRead() {
    if (this.socket) {
      this.socket.off('messages_read');
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
