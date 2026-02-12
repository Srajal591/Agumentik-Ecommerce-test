import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  // Admin login
  login: async (email, password) => {
    const response = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, { email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await axios.get(API_ENDPOINTS.GET_CURRENT_USER);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
