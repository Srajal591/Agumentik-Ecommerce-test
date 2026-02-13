require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

async function updateCategoryImage() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the "pants" category
    const category = await Category.findOne({ name: 'pants', isDeleted: false });
    
    if (!category) {
      console.log('❌ Category "pants" not found');
      return;
    }

    console.log('📋 Current category:');
    console.log(`   Name: ${category.name}`);
    console.log(`   Image: ${category.image || 'NO IMAGE'}\n`);

    // Update with a test Cloudinary URL
    const testImageUrl = 'https://res.cloudinary.com/dno4ebvqz/image/upload/v1/categories/test-image';
    
    category.image = testImageUrl;
    await category.save();

    console.log('✅ Category updated with test image URL');
    console.log(`   New Image: ${category.image}\n`);

    console.log('💡 Now check the admin panel to see if the image displays');
    console.log('   (The URL is a test URL, so it might not load, but it should show the URL is saved)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

updateCategoryImage();
