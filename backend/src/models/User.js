const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        label: String,
        fullName: String,
        mobile: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
