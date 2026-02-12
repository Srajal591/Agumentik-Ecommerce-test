const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      trim: true,
      sparse: true, // Allow null values
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allow null values
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - auto delete when expired
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash OTP before saving
otpSchema.pre('save', async function () {
  if (!this.isModified('otp')) {
    return;
  }
  
  // In development with console OTP mode, don't hash the OTP
  // This makes it easier to test with console-logged OTPs
  if (process.env.USE_CONSOLE_OTP === 'true' && process.env.NODE_ENV === 'development') {
    console.log('⚠️  Development mode: OTP will NOT be hashed');
    return; // Don't hash in console mode
  }
  
  this.otp = await bcrypt.hash(this.otp, 10);
});

// Compare OTP method
otpSchema.methods.compareOTP = async function (candidateOTP) {
  // In development with console OTP mode, do direct comparison
  if (process.env.USE_CONSOLE_OTP === 'true' && process.env.NODE_ENV === 'development') {
    return this.otp === candidateOTP;
  }
  
  return await bcrypt.compare(candidateOTP, this.otp);
};

module.exports = mongoose.model('OTP', otpSchema);
