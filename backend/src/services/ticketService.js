const Ticket = require('../models/Ticket');
const { generateTicketNumber } = require('../utils/generateOrderNumber');

class TicketService {
  // Create ticket
  async createTicket(userId, ticketData) {
    const ticketNumber = generateTicketNumber();

    const ticket = await Ticket.create({
      ...ticketData,
      ticketNumber,
      user: userId,
    });

    return await ticket.populate('user order');
  }

  // Get all tickets
  async getAllTickets(filters, page, limit, skip) {
    const query = { isDeleted: false };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.userId) {
      query.user = filters.userId;
    }

    const tickets = await Ticket.find(query)
      .populate('user', 'name mobile email')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments(query);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get ticket by ID
  async getTicketById(ticketId) {
    const ticket = await Ticket.findOne({ _id: ticketId, isDeleted: false })
      .populate('user', 'name mobile email')
      .populate('order')
      .populate('messages.sender', 'name role');

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  // Update ticket status
  async updateTicketStatus(ticketId, status) {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.status = status;
    await ticket.save();

    return ticket;
  }

  // Add message to ticket
  async addMessage(ticketId, senderId, message) {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.messages.push({
      sender: senderId,
      message,
    });

    await ticket.save();
    return await ticket.populate('messages.sender', 'name role');
  }
}

module.exports = new TicketService();
