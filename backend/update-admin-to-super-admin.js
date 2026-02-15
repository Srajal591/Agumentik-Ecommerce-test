require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function updateAdminToSuperAdmin() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the existing admin
    const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!admin) {
      console.log('❌ Admin not found with email:', process.env.ADMIN_EMAIL);
      return;
    }

    console.log('📋 Current admin:');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('\n');

    // Update to super_admin
    admin.role = 'super_admin';
    await admin.save();

    console.log('✅ Admin updated to Super Admin!');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

updateAdminToSuperAdmin();
