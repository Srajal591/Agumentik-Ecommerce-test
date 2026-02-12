import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get all categories
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const categoryService = {
  getCategories,
  getCategoryById,
};

export default categoryService;
