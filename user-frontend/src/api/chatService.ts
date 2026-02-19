import api from './axios.js';

export const chatService = {
  // Create or get existing chat
  createOrGetChat: async (orderId?: string) => {
    const response = await api.post('/chats/create', { orderId });
    return response;
  },

  // Send message
  sendMessage: async (chatId: string, message: string, image?: any, audio?: any) => {
    const formData = new FormData();
    formData.append('chatId', chatId);
    if (message) formData.append('message', message);
    
    if (image) {
      // React Native FormData requires this format
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || 'chat-image.jpg',
      } as any);
    }
    
    if (audio) {
      formData.append('audio', {
        uri: audio.uri,
        type: audio.type || 'audio/mp3',
        name: audio.name || 'audio.mp3',
      } as any);
    }

    const response = await api.post('/chats/message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Get chat by ID
  getChatById: async (chatId: string) => {
    const response = await api.get(`/chats/${chatId}`);
    return response;
  },

  // Mark messages as read
  markAsRead: async (chatId: string) => {
    const response = await api.put(`/chats/${chatId}/read`);
    return response;
  },
};
