const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema(
  {
    returnNumber: {
      type: String,
      unique: true,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
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
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: String,
        color: String,
        image: String,
        reason: {
          type: String,
          required: true,
        },
      },
    ],
    reason: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['return', 'refund', 'replacement'],
      required: true,
    },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'picked_up', 'completed'],
      default: 'requested',
    },
    refundAmount: Number,
    adminNotes: String,
    images: [String],
    pickupAddress: {
      fullName: String,
      mobile: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
    },
    pickupScheduledAt: Date,
    pickedUpAt: Date,
    completedAt: Date,
    rejectedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Return', returnSchema);
