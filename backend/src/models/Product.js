const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    sizes: [
      {
        size: String,
        stock: { type: Number, default: 0 },
      },
    ],
    colors: [String],
    brand: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    tags: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for total stock
productSchema.virtual('totalStock').get(function () {
  return this.sizes.reduce((total, size) => total + size.stock, 0);
});

module.exports = mongoose.model('Product', productSchema);
