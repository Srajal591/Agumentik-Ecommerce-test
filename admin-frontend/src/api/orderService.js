import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const orderService = {
  // Get all orders
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axios.get(`${API_ENDPOINTS.ORDERS}?${queryString}`);
  },

  // Get order by ID
  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.ORDER_BY_ID(id));
  },

  // Update order status
  updateStatus: async (id, status, additionalData = {}) => {
    return await axios.patch(API_ENDPOINTS.UPDATE_ORDER_STATUS(id), {
      status,
      ...additionalData,
    });
  },
};

export default orderService;
