import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://agumentik-ecommerce-test-1.onrender.com/api';

// Create axios instance with auth token
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('@auth_token'); // Fixed: Use correct token key
  
  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const orderService = {
  // Create order
  async createOrder(orderData: any) {
    try {
      const config = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/orders`, orderData, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Get user orders
  async getUserOrders(page = 1, limit = 10) {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/orders/my-orders?page=${page}&limit=${limit}`, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Get order by ID
  async getOrderById(orderId: string) {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/orders/${orderId}`, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  },
};
