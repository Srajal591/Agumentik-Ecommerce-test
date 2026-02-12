const ticketService = require('../services/ticketService');

// Create ticket
exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tickets
exports.getAllTickets = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const filters = {
      status: req.query.status,
      category: req.query.category,
      userId: req.user.role === 'user' ? req.user._id : req.query.userId,
    };

    const result = await ticketService.getAllTickets(filters, page, limit, skip);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);

    // Check if user has permission to view this ticket
    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// Update ticket status (Admin)
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await ticketService.updateTicketStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// Add message to ticket
exports.addMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const ticket = await ticketService.addMessage(req.params.id, req.user._id, message);

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
