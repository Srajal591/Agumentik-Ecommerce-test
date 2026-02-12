require('dotenv').config();
const mongoose = require('mongoose');
const OTP = require('./src/models/OTP');

const clearOldOTPs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'vishwakarmasrajal297@gmail.com';

    // Delete all OTPs for this email
    const result = await OTP.deleteMany({ email });
    console.log(`🗑️  Deleted ${result.deletedCount} old OTP(s) for ${email}`);

    await mongoose.connection.close();
    console.log('\n✅ Done! Now try sending a new OTP from the app.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

clearOldOTPs();
