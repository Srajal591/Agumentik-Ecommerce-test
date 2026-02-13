require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

async function clearTestImages() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear the test image URL from pants category
    const result = await Category.updateMany(
      { image: { $regex: /test-image/ } },
      { $set: { image: '' } }
    );

    console.log(`✅ Cleared ${result.modifiedCount} test image URLs\n`);

    // Show all categories
    const categories = await Category.find({ isDeleted: false });
    console.log('📋 Current categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} - Image: ${cat.image || 'NO IMAGE'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

clearTestImages();
