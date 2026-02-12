import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const categoryService = {
  // Get all categories
  getAll: async () => {
    return await axios.get(API_ENDPOINTS.CATEGORIES);
  },

  // Get category by ID
  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
  },

  // Create category
  create: async (categoryData) => {
    return await axios.post(API_ENDPOINTS.CATEGORIES, categoryData);
  },

  // Update category
  update: async (id, categoryData) => {
    return await axios.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
  },

  // Toggle category status
  toggleStatus: async (id) => {
    return await axios.patch(API_ENDPOINTS.TOGGLE_CATEGORY_STATUS(id));
  },

  // Delete category
  delete: async (id) => {
    return await axios.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
  },
};

export default categoryService;
