import api from './axios';

export const chatService = {
  // Get all chats (Super Admin)
  getAllChats: async () => {
    const response = await api.get('/chats/all');
    return response;
  },

  // Get chat by ID
  getChatById: async (chatId) => {
    const response = await api.get(`/chats/${chatId}`);
    return response;
  },

  // Send message
  sendMessage: async (chatId, message, image, audio) => {
    const formData = new FormData();
    formData.append('chatId', chatId);
    if (message) formData.append('message', message);
    if (image) formData.append('image', image);
    if (audio) formData.append('audio', audio);

    const response = await api.post('/chats/message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Mark as read
  markAsRead: async (chatId) => {
    const response = await api.put(`/chats/${chatId}/read`);
    return response;
  },
};
