const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticate, authorize } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');

// User & Admin routes
router.post('/', authenticate, ticketController.createTicket);
router.get('/', authenticate, paginate, ticketController.getAllTickets);
router.get('/:id', authenticate, ticketController.getTicketById);
router.post('/:id/messages', authenticate, ticketController.addMessage);

// Admin routes
router.patch('/:id/status', authenticate, authorize('admin'), ticketController.updateTicketStatus);

module.exports = router;
