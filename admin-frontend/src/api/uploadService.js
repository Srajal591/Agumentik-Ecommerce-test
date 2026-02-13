import axios from './axios';

export const uploadService = {
  // Upload single image
  uploadImage: async (file, folder = 'categories') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return await axios.post('/upload/single', formData, {
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

    return await axios.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete image
  deleteImage: async (publicId) => {
    return await axios.delete('/upload', {
      data: { publicId },
    });
  },
};

export default uploadService;
