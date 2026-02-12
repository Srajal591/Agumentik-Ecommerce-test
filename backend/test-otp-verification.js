require('dotenv').config();
const mongoose = require('mongoose');
const OTP = require('./src/models/OTP');

const testOTPVerification = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create a test OTP
    const testEmail = 'test@example.com';
    const testOTPCode = '123456';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete existing OTPs
    await OTP.deleteMany({ email: testEmail });

    // Create new OTP
    const otpRecord = await OTP.create({
      email: testEmail,
      otp: testOTPCode,
      expiresAt,
    });

    console.log('\n📝 Created OTP Record:');
    console.log('Email:', testEmail);
    console.log('Plain OTP:', testOTPCode);
    console.log('Hashed OTP:', otpRecord.otp);

    // Try to verify with correct OTP
    const isValid = await otpRecord.compareOTP(testOTPCode);
    console.log('\n✅ Verification with correct OTP:', isValid);

    // Try to verify with wrong OTP
    const isInvalid = await otpRecord.compareOTP('999999');
    console.log('❌ Verification with wrong OTP:', isInvalid);

    // Clean up
    await OTP.deleteMany({ email: testEmail });
    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testOTPVerification();
