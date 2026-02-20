import axios from './axios';
import { API_ENDPOINTS } from '../config/api';

export const ticketService = {
  // Get all tickets
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(API_ENDPOINTS.TICKETS, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get ticket by ID
  getById: async (id) => {
    try {
      const response = await axios.get(API_ENDPOINTS.TICKET_BY_ID(id));
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update ticket status
  updateStatus: async (id, status) => {
    try {
      const response = await axios.patch(API_ENDPOINTS.UPDATE_TICKET_STATUS(id), { status });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add message to ticket
  addMessage: async (id, message) => {
    try {
      const response = await axios.post(API_ENDPOINTS.ADD_TICKET_MESSAGE(id), { message });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
