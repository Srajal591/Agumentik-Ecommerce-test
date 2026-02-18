import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = '@auth_token';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
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

// Check return eligibility
export const checkReturnEligibility = async (orderId: string) => {
  const response = await api.get(`/returns/check-eligibility/${orderId}`);
  return response.data;
};

// Create return request
export const createReturn = async (returnData: any) => {
  const response = await api.post('/returns', returnData);
  return response.data;
};

// Get user returns
export const getUserReturns = async (params = {}) => {
  const response = await api.get('/returns/my-returns', { params });
  return response.data;
};

// Get return by ID
export const getReturnById = async (id: string) => {
  const response = await api.get(`/returns/${id}`);
  return response.data;
};

export default {
  checkReturnEligibility,
  createReturn,
  getUserReturns,
  getReturnById,
};
