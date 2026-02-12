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
 * Get all products with filters
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search products
 */
export const searchProducts = async (query) => {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS, {
      params: { search: query },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const productService = {
  getProducts,
  getProductById,
  searchProducts,
};

export default productService;
