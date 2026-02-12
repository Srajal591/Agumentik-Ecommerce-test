const Return = require('../models/Return');
const Order = require('../models/Order');
const { generateReturnNumber } = require('../utils/generateOrderNumber');

class ReturnService {
  // Create return request
  async createReturn(userId, returnData) {
    const returnNumber = generateReturnNumber();

    // Verify order belongs to user
    const order = await Order.findOne({ _id: returnData.order, user: userId });
    if (!order) {
      throw new Error('Order not found');
    }

    const returnRequest = await Return.create({
      ...returnData,
      returnNumber,
      user: userId,
    });

    return await returnRequest.populate('order user');
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
      .populate('order', 'orderNumber total')
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
  async updateReturnStatus(returnId, status, adminNotes, refundAmount) {
    const returnRequest = await Return.findById(returnId);

    if (!returnRequest) {
      throw new Error('Return request not found');
    }

    returnRequest.status = status;
    if (adminNotes) {
      returnRequest.adminNotes = adminNotes;
    }
    if (refundAmount) {
      returnRequest.refundAmount = refundAmount;
    }

    // Update order payment status if refund is completed
    if (status === 'completed' && returnRequest.type === 'refund') {
      await Order.findByIdAndUpdate(returnRequest.order, {
        paymentStatus: 'refunded',
      });
    }

    await returnRequest.save();
    return returnRequest;
  }
}

module.exports = new ReturnService();
