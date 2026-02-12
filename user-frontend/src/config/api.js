// Centralized API configuration
// Change this URL to update API endpoint everywhere

// IMPORTANT: Update this based on your platform:
// - Android Emulator: http://10.0.2.2:5000/api (sometimes doesn't work)
// - iOS Simulator: http://localhost:5000/api
// - Physical Device: http://YOUR_COMPUTER_IP:5000/api

// Using your computer's actual IP address (works for both emulator and physical device)
export const API_BASE_URL = 'http://192.168.31.48:5000/api';

// For Android emulator, use: http://10.0.2.2:5000/api
// For iOS simulator, use: http://localhost:5000/api
// For physical device, use your computer's IP: http://192.168.x.x:5000/api

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
