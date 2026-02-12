require('dotenv').config();
const mongoose = require('mongoose');
const authService = require('./src/services/authService');
const User = require('./src/models/User');

const testFullOTPFlow = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const testEmail = 'vishwakarmasrajal297@gmail.com';

    // Step 1: Check if user exists
    console.log('Step 1: Checking if user exists...');
    let user = await User.findOne({ email: testEmail, isDeleted: false });
    if (user) {
      console.log('✅ User found:', user.name, user.email);
    } else {
      console.log('❌ User not found - need to register first!');
      await mongoose.connection.close();
      return;
    }

    // Step 2: Send OTP
    console.log('\nStep 2: Sending OTP...');
    const sendResult = await authService.sendEmailOTP(testEmail);
    console.log('✅ OTP sent successfully');
    console.log('OTP Code (for testing):', sendResult.otp);
    console.log('Expires at:', sendResult.expiresAt);

    // Step 3: Verify OTP
    console.log('\nStep 3: Verifying OTP...');
    try {
      const verifyResult = await authService.verifyEmailOTP(testEmail, sendResult.otp);
      console.log('✅ OTP verified successfully!');
      console.log('Token:', verifyResult.token.substring(0, 20) + '...');
      console.log('User:', verifyResult.user);
    } catch (error) {
      console.error('❌ OTP verification failed:', error.message);
    }

    await mongoose.connection.close();
    console.log('\n✅ Test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testFullOTPFlow();
