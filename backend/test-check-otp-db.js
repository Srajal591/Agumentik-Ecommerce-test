require('dotenv').config();
const mongoose = require('mongoose');
const OTP = require('./src/models/OTP');

const checkOTPInDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'vishwakarmasrajal297@gmail.com';

    // Find all OTPs for this email
    const otps = await OTP.find({ email }).sort({ createdAt: -1 });

    console.log(`Found ${otps.length} OTP(s) for ${email}:\n`);

    otps.forEach((otp, index) => {
      console.log(`OTP #${index + 1}:`);
      console.log('  Email:', otp.email);
      console.log('  Hashed OTP:', otp.otp);
      console.log('  Verified:', otp.verified);
      console.log('  Expires At:', otp.expiresAt);
      console.log('  Created At:', otp.createdAt);
      console.log('  Is Expired:', new Date() > otp.expiresAt);
      console.log('');
    });

    // Test with a known OTP
    if (otps.length > 0) {
      const latestOTP = otps[0];
      console.log('Testing OTP comparison with latest OTP...');
      
      // You'll need to enter the OTP you saw in the console
      const testOTP = '612636'; // Replace with the actual OTP from console
      const isValid = await latestOTP.compareOTP(testOTP);
      console.log(`Comparing "${testOTP}" with stored OTP: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkOTPInDB();
