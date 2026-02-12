import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const orderService = {
  // Create order
  create: async (orderData) => {
    return await axios.post(API_ENDPOINTS.CREATE_ORDER, orderData);
  },

  // Get my orders
  getMyOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axios.get(`${API_ENDPOINTS.MY_ORDERS}?${queryString}`);
  },

  // Get order by ID
  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.ORDER_BY_ID(id));
  },

  // Update payment status
  updatePayment: async (id, paymentStatus, paymentId) => {
    return await axios.patch(API_ENDPOINTS.UPDATE_PAYMENT(id), {
      paymentStatus,
      paymentId,
    });
  },
};

export default orderService;
