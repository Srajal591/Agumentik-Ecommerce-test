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
        },
        quantity: Number,
        reason: String,
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
      enum: ['requested', 'approved', 'rejected', 'completed'],
      default: 'requested',
    },
    refundAmount: Number,
    adminNotes: String,
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
