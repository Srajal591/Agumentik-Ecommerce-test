require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

async function testCategoryImage() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all categories
    console.log('📋 Fetching all categories...');
    const categories = await Category.find({ isDeleted: false });
    
    console.log(`Found ${categories.length} categories:\n`);
    
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`);
      console.log(`   ID: ${cat._id}`);
      console.log(`   Description: ${cat.description || 'No description'}`);
      console.log(`   Image: ${cat.image || 'NO IMAGE'}`);
      console.log(`   Active: ${cat.isActive}`);
      console.log(`   Created: ${cat.createdAt}`);
      console.log('');
    });

    if (categories.length === 0) {
      console.log('💡 No categories found. Create one with an image to test.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

testCategoryImage();
