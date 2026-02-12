import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const productService = {
  // Get all products
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axios.get(`${API_ENDPOINTS.PRODUCTS}?${queryString}`);
  },

  // Get product by ID
  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  },

  // Create product
  create: async (productData) => {
    return await axios.post(API_ENDPOINTS.PRODUCTS, productData);
  },

  // Update product
  update: async (id, productData) => {
    return await axios.put(API_ENDPOINTS.PRODUCT_BY_ID(id), productData);
  },

  // Update product status
  updateStatus: async (id, status) => {
    return await axios.patch(API_ENDPOINTS.UPDATE_PRODUCT_STATUS(id), { status });
  },

  // Update inventory
  updateInventory: async (id, sizes) => {
    return await axios.patch(API_ENDPOINTS.UPDATE_INVENTORY(id), { sizes });
  },

  // Delete product
  delete: async (id) => {
    return await axios.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
  },
};

export default productService;
