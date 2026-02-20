// Centralized API configuration
// Change this URL to update API endpoint everywhere

// PRODUCTION: Deployed on Render
export const API_BASE_URL = 'https://agumentik-ecommerce-test-1.onrender.com/api';

// For local development, use:
// export const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  ADMIN_LOGIN: '/auth/admin/login',
  GET_CURRENT_USER: '/auth/me',

  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  TOGGLE_BLOCK_USER: (id) => `/users/${id}/toggle-block`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  TOGGLE_CATEGORY_STATUS: (id) => `/categories/${id}/toggle-status`,

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  UPDATE_PRODUCT_STATUS: (id) => `/products/${id}/status`,
  UPDATE_INVENTORY: (id) => `/products/${id}/inventory`,

  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  UPDATE_ORDER_STATUS: (id) => `/orders/${id}/status`,

  // Tickets
  TICKETS: '/tickets',
  TICKET_BY_ID: (id) => `/tickets/${id}`,
  UPDATE_TICKET_STATUS: (id) => `/tickets/${id}/status`,
  ADD_TICKET_MESSAGE: (id) => `/tickets/${id}/messages`,

  // Returns
  RETURNS: '/returns',
  RETURN_BY_ID: (id) => `/returns/${id}`,
  UPDATE_RETURN_STATUS: (id) => `/returns/${id}/status`,
};

export default API_BASE_URL;
