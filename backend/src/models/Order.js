const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
        size: String,
        color: String,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      mobile: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: String,
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
