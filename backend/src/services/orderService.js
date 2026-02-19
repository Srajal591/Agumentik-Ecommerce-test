const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateOrderNumber } = require('../utils/generateOrderNumber');

class OrderService {
  // Create order
  async createOrder(userId, orderData) {
    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Validate and update inventory
    for (const item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (!sizeObj || sizeObj.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name} - Size ${item.size}`);
      }

      // Reduce stock
      sizeObj.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      ...orderData,
      orderNumber,
      user: userId,
    });

    return await order.populate('user items.product');
  }

  // Get all orders with filters
  async getAllOrders(filters, page, limit, skip) {
    const query = { isDeleted: false };

    if (filters.status) {
      query.orderStatus = filters.status;
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    if (filters.userId) {
      query.user = filters.userId;
    }

    const orders = await Order.find(query)
      .populate('user', 'name mobile email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get order by ID
  async getOrderById(orderId) {
    const order = await Order.findOne({ _id: orderId, isDeleted: false })
      .populate('user', 'name mobile email')
      .populate('items.product')
      .populate('returnId'); // Populate return information

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Get user orders
  async getUserOrders(userId, page, limit, skip) {
    const orders = await Order.find({ user: userId, isDeleted: false })
      .populate('items.product', 'name images')
      .populate('returnId', 'status returnNumber') // Populate return info
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: userId, isDeleted: false });

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Update order status
  async updateOrderStatus(orderId, status, additionalData = {}) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.orderStatus = status;

    if (status === 'shipped') {
      order.shippedAt = new Date();
      if (additionalData.trackingNumber) {
        order.trackingNumber = additionalData.trackingNumber;
      }
    }

    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'completed';
    }

    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      if (additionalData.cancellationReason) {
        order.cancellationReason = additionalData.cancellationReason;
      }

      // Restore inventory
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const sizeObj = product.sizes.find((s) => s.size === item.size);
          if (sizeObj) {
            sizeObj.stock += item.quantity;
            await product.save();
          }
        }
      }
    }

    await order.save();
    return order;
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus, paymentId) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.paymentStatus = paymentStatus;
    if (paymentId) {
      order.paymentId = paymentId;
    }

    if (paymentStatus === 'completed') {
      order.orderStatus = 'confirmed';
    }

    await order.save();
    return order;
  }
}

module.exports = new OrderService();
