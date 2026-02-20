// Centralized API configuration
// Change this URL to update API endpoint everywhere

// PRODUCTION: Deployed on Render
export const API_BASE_URL = 'https://agumentik-ecommerce-test-1.onrender.com/api';
export const API_URL = API_BASE_URL; 


// API endpoints
export const API_ENDPOINTS = {
  // Auth
  SEND_OTP: '/auth/user/send-otp',
  VERIFY_OTP: '/auth/user/verify-otp',
  GET_CURRENT_USER: '/auth/me',

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,

  // User Profile
  UPDATE_PROFILE: '/users/profile/update',
  ADDRESSES: '/users/addresses',
  ADDRESS_BY_ID: (id) => `/users/addresses/${id}`,
  TOGGLE_WISHLIST: '/users/wishlist/toggle',
  GET_WISHLIST: '/users/wishlist',

  // Orders
  CREATE_ORDER: '/orders',
  MY_ORDERS: '/orders/my-orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  UPDATE_PAYMENT: (id) => `/orders/${id}/payment`,

  // Tickets
  TICKETS: '/tickets',
  TICKET_BY_ID: (id) => `/tickets/${id}`,
  ADD_TICKET_MESSAGE: (id) => `/tickets/${id}/messages`,

  // Returns
  RETURNS: '/returns',
  RETURN_BY_ID: (id) => `/returns/${id}`,
};

export default API_BASE_URL;
