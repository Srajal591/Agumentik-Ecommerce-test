import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

class SocketService {
  private socket: Socket | null = null;
  private TOKEN_KEY = '@auth_token';

  async connect() {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY);
      
      if (!token) {
        console.error('No token found for socket connection');
        return;
      }

      // Extract base URL without /api
      const socketUrl = API_BASE_URL.replace('/api', '');

      this.socket = io(socketUrl, {
        auth: {
          token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      this.socket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });

    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit('join_chat', chatId);
    }
  }

  sendMessage(chatId: string, message: string, image?: string) {
    if (this.socket) {
      this.socket.emit('send_message', {
        chatId,
        message,
        image,
      });
    }
  }

  markAsRead(chatId: string) {
    if (this.socket) {
      this.socket.emit('mark_read', chatId);
    }
  }

  onNewMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onChatUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('chat_updated', callback);
    }
  }

  onMessagesRead(callback: (data: any) => void) {
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

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
