import api from './axios.js';

export const profileService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response;
  },

  // Get user stats
  getUserStats: async () => {
    const response = await api.get('/profile/stats');
    return response;
  },

  // Update profile
  updateProfile: async (data: { name?: string; email?: string; mobile?: string }) => {
    const response = await api.put('/profile', data);
    return response;
  },

  // Upload profile image
  uploadProfileImage: async (image: any) => {
    const formData = new FormData();
    
    // React Native FormData requires this format
    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.name || 'profile.jpg',
    } as any);

    const response = await api.post('/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};
