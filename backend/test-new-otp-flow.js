require('dotenv').config();
const mongoose = require('mongoose');
const OTP = require('./src/models/OTP');

const testNewOTPFlow = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const testEmail = 'vishwakarmasrajal297@gmail.com';
    const testOTP = '123456';

    // Create a new OTP
    console.log('Creating new OTP...');
    console.log('USE_CONSOLE_OTP:', process.env.USE_CONSOLE_OTP);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    const otpRecord = await OTP.create({
      email: testEmail,
      otp: testOTP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log('\n📝 OTP Record Created:');
    console.log('Email:', otpRecord.email);
    console.log('OTP (stored):', otpRecord.otp);
    console.log('Is it hashed?:', otpRecord.otp !== testOTP ? 'YES (hashed)' : 'NO (plain text)');

    // Test comparison
    console.log('\n🔍 Testing OTP Comparison:');
    const isValid = await otpRecord.compareOTP(testOTP);
    console.log(`Comparing "${testOTP}" with stored OTP: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

    // Clean up
    await OTP.deleteMany({ email: testEmail });

    await mongoose.connection.close();
    
    if (isValid) {
      console.log('\n✅ SUCCESS! The new OTP model is working correctly!');
      console.log('OTPs are stored as plain text in development mode.');
      console.log('Now try logging in from the app with a FRESH OTP!');
    } else {
      console.log('\n❌ FAILED! Something is wrong with the OTP model.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testNewOTPFlow();
