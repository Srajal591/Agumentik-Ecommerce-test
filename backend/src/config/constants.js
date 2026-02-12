module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  // Ticket Status
  TICKET_STATUS: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
  },

  // Product Status
  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    OUT_OF_STOCK: 'out_of_stock',
  },

  // Return/Refund Status
  RETURN_STATUS: {
    REQUESTED: 'requested',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
  },
};
