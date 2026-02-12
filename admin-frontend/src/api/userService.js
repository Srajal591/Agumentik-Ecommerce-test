import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const userService = {
  // Get all users
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axios.get(`${API_ENDPOINTS.USERS}?${queryString}`);
  },

  // Get user by ID
  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.USER_BY_ID(id));
  },

  // Update user
  update: async (id, userData) => {
    return await axios.put(API_ENDPOINTS.USER_BY_ID(id), userData);
  },

  // Toggle block user
  toggleBlock: async (id) => {
    return await axios.patch(API_ENDPOINTS.TOGGLE_BLOCK_USER(id));
  },
};

export default userService;
