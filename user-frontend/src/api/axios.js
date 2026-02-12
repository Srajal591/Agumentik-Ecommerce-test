import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.log('Axios error:', error);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        // Navigation will be handled by the app
      } catch (err) {
        console.error('Error clearing storage:', err);
      }
    }
    
    // Better error handling
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Network error. Please check your connection.';
    
    return Promise.reject({ message: errorMessage, ...error.response?.data });
  }
);

export default axiosInstance;
