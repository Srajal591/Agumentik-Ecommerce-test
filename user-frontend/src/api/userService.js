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
 * Update user profile
 */
export const updateProfile = async (data) => {
  try {
    const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user addresses
 */
export const getAddresses = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ADDRESSES);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add new address
 */
export const addAddress = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.ADDRESSES, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update address
 */
export const updateAddress = async (id, data) => {
  try {
    const response = await api.put(API_ENDPOINTS.ADDRESS_BY_ID(id), data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete address
 */
export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(API_ENDPOINTS.ADDRESS_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Toggle wishlist item
 */
export const toggleWishlist = async (productId) => {
  try {
    const response = await api.post(API_ENDPOINTS.TOGGLE_WISHLIST, { productId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get wishlist
 */
export const getWishlist = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_WISHLIST);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const userService = {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  getWishlist,
};

export default userService;
