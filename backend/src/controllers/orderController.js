const orderService = require('../services/orderService');

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const filters = {
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      userId: req.query.userId,
    };

    const result = await orderService.getAllOrders(filters, page, limit, skip);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get user orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const result = await orderService.getUserOrders(req.user._id, page, limit, skip);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    // Check if user has permission to view this order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, cancellationReason } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status, {
      trackingNumber,
      cancellationReason,
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentId } = req.body;
    const order = await orderService.updatePaymentStatus(req.params.id, paymentStatus, paymentId);

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
