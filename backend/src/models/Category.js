const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Create a compound unique index for name where isDeleted is false
// This allows same name to exist if one is deleted
categorySchema.index(
  { name: 1, isDeleted: 1 },
  { 
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
);

module.exports = mongoose.model('Category', categorySchema);
