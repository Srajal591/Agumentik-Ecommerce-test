import axios from '../api/axios';
import { API_ENDPOINTS } from '../config/api';

export interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: 'order' | 'product' | 'payment' | 'return' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: Array<{
    sender: {
      _id: string;
      name: string;
      role: string;
    };
    message: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category: string;
  priority?: string;
  order?: string;
}

export const ticketService = {
  // Create new ticket
  createTicket: async (data: CreateTicketData) => {
    const response = await axios.post(API_ENDPOINTS.TICKETS, data);
    return response;
  },

  // Get user's tickets
  getUserTickets: async () => {
    const response = await axios.get(API_ENDPOINTS.TICKETS);
    return response;
  },

  // Get ticket by ID
  getTicketById: async (id: string) => {
    const response = await axios.get(API_ENDPOINTS.TICKET_BY_ID(id));
    return response;
  },

  // Add message to ticket
  addMessage: async (id: string, message: string) => {
    const response = await axios.post(API_ENDPOINTS.ADD_TICKET_MESSAGE(id), { message });
    return response;
  },
};
