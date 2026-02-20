import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://agumentik-ecommerce-test-1.onrender.com/api/auth';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

// Create axios instance
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Register user (does NOT auto-login)
  register: async (name: string, email: string, mobile: string, password: string) => {
    try {
      const response = await authApi.post('/user/register', {
        name,
        email,
        mobile,
        password,
      });
      
      // Do NOT store token or user data - require explicit login
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login user with password
  login: async (email: string, password: string) => {
    try {
      const response = await authApi.post('/user/login', {
        email,
        password,
      });
      
      if (response.data.success && response.data.data.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.data.data.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await authApi.get('/me');
      
      if (response.data.success) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  // Logout
  logout: async () => {
    try {
      // Try to call logout API, but don't fail if it errors
      await authApi.post('/logout');
    } catch (error) {
      // Ignore API errors - logout should always succeed locally
      console.log('Logout API call failed (this is okay):', error);
    }
    
    // Always clear local storage
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  // Check if user is logged in
  isLoggedIn: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get stored token
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  },

  // Get stored user
  getStoredUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  },

  // Store user data
  storeUser: async (user: any) => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  },
};
