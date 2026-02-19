const Return = require('../models/Return');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateReturnNumber } = require('../utils/generateOrderNumber');

class ReturnService {
  // Create return request
  async createReturn(userId, returnData) {
    const returnNumber = generateReturnNumber();

    // Verify order belongs to user and is delivered
    const order = await Order.findOne({ 
      _id: returnData.order, 
      user: userId,
      orderStatus: 'delivered'
    }).populate('items.product');
    
    if (!order) {
      throw new Error('Order not found or not eligible for return');
    }

    // Check if deliveredAt exists
    if (!order.deliveredAt) {
      throw new Error('Order delivery date not found');
    }

    // Check if return window is valid (e.g., 7 days from delivery)
    const deliveryDate = new Date(order.deliveredAt);
    const currentDate = new Date();
    const daysSinceDelivery = Math.floor((currentDate - deliveryDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceDelivery > 7) {
      throw new Error('Return window has expired. Returns are only accepted within 7 days of delivery.');
    }

    // Validate items belong to the order
    for (const item of returnData.items) {
      const orderItem = order.items.find(
        oi => oi.product._id.toString() === item.product.toString()
      );
      if (!orderItem) {
        throw new Error('Invalid item in return request');
      }
      if (item.quantity > orderItem.quantity) {
        throw new Error('Return quantity exceeds ordered quantity');
      }
    }

    // Calculate refund amount
    let refundAmount = 0;
    const itemsWithDetails = returnData.items.map(item => {
      const orderItem = order.items.find(
        oi => oi.product._id.toString() === item.product.toString()
      );
      refundAmount += orderItem.price * item.quantity;
      return {
        product: item.product,
        name: orderItem.name,
        price: orderItem.price,
        quantity: item.quantity,
        size: orderItem.size,
        color: orderItem.color,
        image: orderItem.image,
        reason: item.reason,
      };
    });

    const returnRequest = await Return.create({
      returnNumber,
      user: userId,
      order: returnData.order,
      items: itemsWithDetails,
      reason: returnData.reason,
      type: returnData.type,
      refundAmount,
      images: returnData.images || [],
      pickupAddress: returnData.pickupAddress || order.shippingAddress,
    });

    // Update order with return information
    await Order.findByIdAndUpdate(returnData.order, {
      $set: {
        returnStatus: 'requested',
        returnId: returnRequest._id,
      }
    });

    return await returnRequest.populate('order user items.product');
  }

  // Get all returns
  async getAllReturns(filters, page, limit, skip) {
    const query = { isDeleted: false };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.userId) {
      query.user = filters.userId;
    }

    const returns = await Return.find(query)
      .populate('user', 'name mobile email')
      .populate('order', 'orderNumber total deliveredAt')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Return.countDocuments(query);

    return {
      returns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get return by ID
  async getReturnById(returnId) {
    const returnRequest = await Return.findOne({ _id: returnId, isDeleted: false })
      .populate('user', 'name mobile email')
      .populate('order')
      .populate('items.product');

    if (!returnRequest) {
      throw new Error('Return request not found');
    }

    return returnRequest;
  }

  // Update return status
  async updateReturnStatus(returnId, status, adminNotes, refundAmount, pickupScheduledAt) {
    const returnRequest = await Return.findById(returnId).populate('order items.product');

    if (!returnRequest) {
      throw new Error('Return request not found');
    }

    const oldStatus = returnRequest.status;
    returnRequest.status = status;
    
    if (adminNotes) {
      returnRequest.adminNotes = adminNotes;
    }
    
    if (refundAmount !== undefined) {
      returnRequest.refundAmount = refundAmount;
    }

    // Handle status-specific updates
    if (status === 'approved' && oldStatus === 'requested') {
      if (pickupScheduledAt) {
        returnRequest.pickupScheduledAt = pickupScheduledAt;
      }
      
      // Update order with return information
      await Order.findByIdAndUpdate(returnRequest.order._id, {
        $set: {
          returnStatus: 'approved',
          returnId: returnRequest._id,
        }
      });
    }

    if (status === 'picked_up' && oldStatus === 'approved') {
      returnRequest.pickedUpAt = new Date();
      
      // Update order return status
      await Order.findByIdAndUpdate(returnRequest.order._id, {
        $set: {
          returnStatus: 'picked_up',
        }
      });
    }

    if (status === 'rejected') {
      returnRequest.rejectedAt = new Date();
      
      // Update order return status
      await Order.findByIdAndUpdate(returnRequest.order._id, {
        $set: {
          returnStatus: 'rejected',
        }
      });
    }

    if (status === 'completed' && oldStatus === 'picked_up') {
      returnRequest.completedAt = new Date();

      // Process refund
      if (returnRequest.type === 'refund' || returnRequest.type === 'return') {
        await Order.findByIdAndUpdate(returnRequest.order._id, {
          paymentStatus: 'refunded',
          returnStatus: 'completed',
        });
      } else {
        await Order.findByIdAndUpdate(returnRequest.order._id, {
          $set: {
            returnStatus: 'completed',
          }
        });
      }

      // Restore inventory for returns
      if (returnRequest.type === 'return' || returnRequest.type === 'replacement') {
        for (const item of returnRequest.items) {
          const product = await Product.findById(item.product._id);
          if (product && item.size) {
            const sizeObj = product.sizes.find((s) => s.size === item.size);
            if (sizeObj) {
              sizeObj.stock += item.quantity;
              await product.save();
            }
          }
        }
      }
    }

    await returnRequest.save();
    return returnRequest;
  }

  // Get user returns
  async getUserReturns(userId, page, limit, skip) {
    const returns = await Return.find({ user: userId, isDeleted: false })
      .populate('order', 'orderNumber total deliveredAt')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Return.countDocuments({ user: userId, isDeleted: false });

    return {
      returns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Check if order is eligible for return
  async checkReturnEligibility(orderId, userId) {
    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId,
      orderStatus: 'delivered'
    }).populate('items.product');

    if (!order) {
      return { eligible: false, reason: 'Order not found or not delivered' };
    }

    // Check if deliveredAt exists
    if (!order.deliveredAt) {
      return { eligible: false, reason: 'Order delivery date not found' };
    }

    // Check if already returned
    const existingReturn = await Return.findOne({ 
      order: orderId, 
      isDeleted: false,
      status: { $nin: ['rejected'] }
    });

    if (existingReturn) {
      return { eligible: false, reason: 'Return request already exists for this order' };
    }

    // Check return window (7 days)
    const deliveryDate = new Date(order.deliveredAt);
    const currentDate = new Date();
    const daysSinceDelivery = Math.floor((currentDate - deliveryDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceDelivery > 7) {
      return { eligible: false, reason: 'Return window has expired (7 days from delivery)' };
    }

    return { 
      eligible: true, 
      daysRemaining: 7 - daysSinceDelivery,
      order 
    };
  }
}

module.exports = new ReturnService();
