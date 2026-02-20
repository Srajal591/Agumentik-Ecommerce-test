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

export const addressService = {
  // Get all addresses
  async getAddresses() {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/addresses`, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
    }
  },

  // Add new address
  async addAddress(addressData: any) {
    try {
      const config = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/addresses`, addressData, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add address');
    }
  },

  // Update address
  async updateAddress(addressId: string, addressData: any) {
    try {
      const config = await getAuthHeaders();
      const response = await axios.put(`${API_URL}/addresses/${addressId}`, addressData, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update address');
    }
  },

  // Delete address
  async deleteAddress(addressId: string) {
    try {
      const config = await getAuthHeaders();
      const response = await axios.delete(`${API_URL}/addresses/${addressId}`, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete address');
    }
  },

  // Set default address
  async setDefaultAddress(addressId: string) {
    try {
      const config = await getAuthHeaders();
      const response = await axios.patch(`${API_URL}/addresses/${addressId}/default`, {}, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to set default address');
    }
  },
};
