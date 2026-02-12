import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  // Register user
  register: async (name, email, mobile) => {
    const response = await axios.post('/auth/user/register', { name, email, mobile });
    // Don't save token - user should login with OTP after registration
    return response;
  },

  // Send OTP (Mobile)
  sendOTP: async (mobile) => {
    return await axios.post(API_ENDPOINTS.SEND_OTP, { mobile });
  },

  // Verify OTP (Mobile)
  verifyOTP: async (mobile, otp) => {
    const response = await axios.post(API_ENDPOINTS.VERIFY_OTP, { mobile, otp });
    if (response.success && response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Send Email OTP
  sendEmailOTP: async (email) => {
    return await axios.post('/auth/user/send-email-otp', { email });
  },

  // Verify Email OTP
  verifyEmailOTP: async (email, otp) => {
    const response = await axios.post('/auth/user/verify-email-otp', { email, otp });
    if (response.success && response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await axios.get(API_ENDPOINTS.GET_CURRENT_USER);
  },

  // Logout
  logout: async () => {
    try {
      // Only call backend logout if user has a token
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await axios.post('/auth/logout');
      }
    } catch (error) {
      // Ignore logout API errors - just log them
      console.log('Logout API error (non-critical):', error.message);
    } finally {
      // Always clear local storage regardless of API call result
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },

  // Get stored user
  getStoredUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
