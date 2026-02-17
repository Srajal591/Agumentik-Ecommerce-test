require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Super_Admin',
      email: process.env.ADMIN_EMAIL || 'admin@fashionstore.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      mobile: '9999999999',
      role: 'super_admin',
    });

    console.log('✅ Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
  