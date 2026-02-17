import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create separate axios instance for file uploads (without JSON interceptor)
const uploadAxios = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to upload requests
uploadAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle upload responses
uploadAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const uploadService = {
  // Upload single image
  uploadImage: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return await uploadAxios.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload multiple images
  uploadMultipleImages: async (files, folder = 'products') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    return await uploadAxios.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete image
  deleteImage: async (publicId) => {
    return await uploadAxios.delete('/upload', {
      data: { publicId },
    });
  },
};

export default uploadService;
